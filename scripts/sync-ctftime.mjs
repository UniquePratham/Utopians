// scripts/sync-ctftime.mjs
//
// Pulls the team's CTFtime page and writes data/ctf-data.json, so the site's
// numbers are always the real ones instead of a hand-maintained list.
//
// Run: node scripts/sync-ctftime.mjs
// CI:  .github/workflows/sync-ctftime.yml runs this daily and commits any change.

import { writeFile, readFile } from "node:fs/promises"
import path from "node:path"

const TEAM_ID = "408650"
const TEAM_URL = `https://ctftime.org/team/${TEAM_ID}`
const OUT = path.resolve("data/ctf-data.json")
const META_OUT = path.resolve("data/ctf-team.json")

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

function decodeEntities(v) {
  return String(v || "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(Number(c)))
}

const stripTags = (v) => decodeEntities(v).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()

function toNumber(v) {
  if (v == null) return null
  const c = String(v).replace(/[^0-9.-]/g, "")
  if (!c) return null
  const n = Number.parseFloat(c)
  return Number.isFinite(n) ? n : null
}

function sliceBetween(h, start, open, close) {
  const i = h.indexOf(open, start)
  if (i === -1) return ""
  const from = i + open.length
  const end = h.indexOf(close, from)
  if (end === -1) return ""
  return h.slice(from, end)
}

function parse(html) {
  const nameMatch = html.match(/<title>CTFtime\.org\s*\/\s*([^<]*)<\/title>/)
  const teamName = nameMatch ? stripTags(nameMatch[1]) : null

  const years = [...new Set([...html.matchAll(/id="rating_(\d{4})"/g)].map((m) => Number(m[1])))].sort(
    (a, b) => b - a
  )

  const seasons = []
  for (const year of years) {
    const paneStart = html.indexOf(`id="rating_${year}"`)
    if (paneStart === -1) continue
    const pane = sliceBetween(html, paneStart, ">", '<div class="tab-pane')

    const overall = pane.match(
      /Overall rating place:\s*<b>\s*([\d.]+)\s*<\/b>\s*with\s*<b>\s*([\d.]+)\s*<\/b>/
    )
    const country = pane.match(/Country place:\s*<b>\s*<a href="\/stats\/([A-Z]{2})">\s*([\d.]+)\s*<\/a>/)

    const events = []
    for (const row of pane.matchAll(/<tr>([\s\S]*?)<\/tr>/g)) {
      const cells = row[1]
      const placeMatch = cells.match(/<td class="place">\s*([\d.]+)\s*<\/td>/)
      if (!placeMatch) continue
      const eventMatch = cells.match(/<a href="\/event\/(\d+)">([\s\S]*?)<\/a>/)
      if (!eventMatch) continue

      const after = cells.slice(cells.indexOf(eventMatch[0]) + eventMatch[0].length)
      const nums = [...after.matchAll(/<td>\s*([\d.]+)/g)].map((m) => toNumber(m[1]))

      events.push({
        event: stripTags(eventMatch[2]),
        place: toNumber(placeMatch[1]) ?? 0,
        points: nums[0] ?? 0,
        ratingPoints: nums[1] ?? 0,
        eventId: Number(eventMatch[1]),
        year,
      })
    }

    if (!events.length) continue
    seasons.push({
      year,
      overallPlace: overall ? toNumber(overall[1]) : null,
      overallPoints: overall ? toNumber(overall[2]) : null,
      country: country ? country[1] : null,
      countryPlace: country ? toNumber(country[2]) : null,
      events,
    })
  }

  const members = [
    ...sliceBetween(html, html.indexOf("Team members"), '<table class="table table-striped">', "</table>").matchAll(
      /<a href="\/user\/\d+">([\s\S]*?)<\/a>/g
    ),
  ]
    .map((m) => stripTags(m[1]))
    .filter(Boolean)

  return { teamName, members, seasons }
}

async function main() {
  console.log(`Fetching ${TEAM_URL}`)
  const res = await fetch(TEAM_URL, { headers: { "User-Agent": UA } })
  if (!res.ok) throw new Error(`CTFtime returned ${res.status}`)

  const html = await res.text()
  const { teamName, members, seasons } = parse(html)

  if (!seasons.length) {
    throw new Error("Parsed no seasons — the CTFtime page structure may have changed")
  }

  // The site renders a flat list, newest season first, best placement first
  // within a season.
  const flat = seasons
    .flatMap((s) => s.events)
    .sort((a, b) => b.year - a.year || a.place - b.place)
    .map((e) => ({
      event: e.event,
      place: e.place,
      points: e.points,
      ratingPoints: e.ratingPoints,
      eventId: e.eventId,
      year: e.year,
    }))

  const meta = {
    teamId: TEAM_ID,
    teamName,
    members,
    seasons: seasons.map((s) => ({
      year: s.year,
      overallPlace: s.overallPlace,
      overallPoints: s.overallPoints,
      country: s.country,
      countryPlace: s.countryPlace,
      eventCount: s.events.length,
    })),
    totalEvents: flat.length,
    fetchedAt: new Date().toISOString(),
  }

  // Only write when something actually changed, so the daily CI job does not
  // create an empty commit every day.
  let previous = null
  try {
    previous = JSON.parse(await readFile(OUT, "utf8"))
  } catch {
    /* first run */
  }

  const same =
    previous &&
    previous.length === flat.length &&
    previous.every(
      (p, i) => p.event === flat[i].event && p.place === flat[i].place && p.points === flat[i].points
    )

  if (same) {
    console.log(`No change — ${flat.length} events already up to date`)
  } else {
    await writeFile(OUT, JSON.stringify(flat, null, 2) + "\n")
    console.log(`Wrote ${flat.length} events to ${path.relative(process.cwd(), OUT)}`)
  }

  await writeFile(META_OUT, JSON.stringify(meta, null, 2) + "\n")
  console.log(
    `Team: ${teamName} · members: ${members.join(", ") || "none"} · seasons: ${seasons
      .map((s) => `${s.year} (#${s.overallPlace ?? "?"})`)
      .join(", ")}`
  )
}

main().catch((err) => {
  console.error("sync-ctftime failed:", err.message)
  process.exit(1)
})
