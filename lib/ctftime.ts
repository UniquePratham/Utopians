// lib/ctftime.ts
//
// Reads the team's public CTFtime page and turns it into the shape the site
// renders. CTFtime has no public JSON API for team history, so the team page is
// parsed directly.
//
// The page is plain server-rendered HTML with a stable structure:
//   <div class="tab-pane" id="rating_YYYY">
//     <p>Overall rating place: <b>354</b> with <b>209.000</b> pts in 2026</p>
//     <p>Country place: <b><a href="/stats/IN">38</a></b></p>
//     <table class="table table-striped">
//       <tr><td class="place_ico"></td><td class="place">71</td>
//           <td><a href="/event/3425">Outback Overflow</a></td>
//           <td>2750.0000</td><td>0.000</td></tr>
//
// Everything is defensive: a missing year, a missing table or a changed cell
// count degrades to "no data" rather than throwing, so a CTFtime redesign can
// never take the site down.

export const CTFTIME_TEAM_ID = "408650"
export const CTFTIME_TEAM_URL = `https://ctftime.org/team/${CTFTIME_TEAM_ID}`

export interface CtfEvent {
  event: string
  place: number
  points: number
  ratingPoints: number
  eventId: number | null
  year: number
  logo: string | null
}

export interface CtfSeason {
  year: number
  overallPlace: number | null
  overallPoints: number | null
  countryPlace: number | null
  country: string | null
  events: CtfEvent[]
}

export interface CtfTeam {
  teamId: string
  teamName: string | null
  members: string[]
  seasons: CtfSeason[]
  fetchedAt: string
}

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

function decodeEntities(value: string): string {
  return String(value || "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
}

function stripTags(value: string): string {
  return decodeEntities(value).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
}

function toNumber(value: string | undefined | null): number | null {
  if (value == null) return null
  const cleaned = String(value).replace(/[^0-9.-]/g, "")
  if (!cleaned) return null
  const n = Number.parseFloat(cleaned)
  return Number.isFinite(n) ? n : null
}

// Pull the inner HTML of the first element matching `openTag` up to its matching
// close, so nested tables do not truncate the slice.
function sliceBetween(html: string, startIndex: number, openTag: string, closeTag: string): string {
  const open = html.indexOf(openTag, startIndex)
  if (open === -1) return ""
  const from = open + openTag.length
  const close = html.indexOf(closeTag, from)
  if (close === -1) return ""
  return html.slice(from, close)
}

function parseMembers(html: string): string[] {
  const idx = html.indexOf("Team members")
  if (idx === -1) return []
  const table = sliceBetween(html, idx, '<table class="table table-striped">', "</table>")
  const members: string[] = []
  for (const m of table.matchAll(/<a href="\/user\/\d+">([\s\S]*?)<\/a>/g)) {
    const name = stripTags(m[1])
    if (name) members.push(name)
  }
  return members
}

function parseSeason(html: string, year: number): CtfSeason {
  const season: CtfSeason = {
    year,
    overallPlace: null,
    overallPoints: null,
    countryPlace: null,
    country: null,
    events: [],
  }

  // The tab pane for this year, if present.
  const paneStart = html.indexOf(`id="rating_${year}"`)
  if (paneStart === -1) return season
  const pane = sliceBetween(html, paneStart, ">", '<div class="tab-pane')

  const overall = pane.match(
    /Overall rating place:\s*<b>\s*([\d.]+)\s*<\/b>\s*with\s*<b>\s*([\d.]+)\s*<\/b>/
  )
  if (overall) {
    season.overallPlace = toNumber(overall[1])
    season.overallPoints = toNumber(overall[2])
  }

  const country = pane.match(/Country place:\s*<b>\s*<a href="\/stats\/([A-Z]{2})">\s*([\d.]+)\s*<\/a>/)
  if (country) {
    season.country = country[1]
    season.countryPlace = toNumber(country[2])
  }

  // Event rows. Each row is: place cell, place, event link, ctf points, rating points.
  for (const row of pane.matchAll(/<tr>([\s\S]*?)<\/tr>/g)) {
    const cells = row[1]
    const placeMatch = cells.match(/<td class="place">\s*([\d.]+)\s*<\/td>/)
    if (!placeMatch) continue

    const eventMatch = cells.match(/<a href="\/event\/(\d+)">([\s\S]*?)<\/a>/)
    if (!eventMatch) continue

    // The two numeric cells after the event link are CTF points and rating points.
    const afterEvent = cells.slice(cells.indexOf(eventMatch[0]) + eventMatch[0].length)
    const numbers = [...afterEvent.matchAll(/<td>\s*([\d.]+)/g)].map((m) => toNumber(m[1]))

    season.events.push({
      event: stripTags(eventMatch[2]),
      place: toNumber(placeMatch[1]) ?? 0,
      points: numbers[0] ?? 0,
      ratingPoints: numbers[1] ?? 0,
      eventId: Number(eventMatch[1]),
      year,
      logo: null,
    })
  }

  return season
}

export function parseTeamPage(html: string): CtfTeam {
  const teamNameMatch = html.match(/<title>CTFtime\.org\s*\/\s*([^<]*)<\/title>/)
  const teamName = teamNameMatch ? stripTags(teamNameMatch[1]) : null

  // Every year that has a tab.
  const years = [...html.matchAll(/id="rating_(\d{4})"/g)].map((m) => Number(m[1]))
  const uniqueYears = [...new Set(years)].sort((a, b) => b - a)

  const seasons = uniqueYears.map((y) => parseSeason(html, y)).filter((s) => s.events.length > 0)

  return {
    teamId: CTFTIME_TEAM_ID,
    teamName,
    members: parseMembers(html),
    seasons,
    fetchedAt: new Date().toISOString(),
  }
}

export async function fetchTeam(): Promise<CtfTeam> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 12000)
  try {
    const res = await fetch(CTFTIME_TEAM_URL, {
      headers: { "User-Agent": UA, Accept: "text/html" },
      signal: controller.signal,
      // CTFtime updates after an event ends, so an hour is plenty.
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error(`CTFtime returned ${res.status}`)
    return parseTeamPage(await res.text())
  } finally {
    clearTimeout(timer)
  }
}

// Flatten every season into one list, newest first, which is what the site
// renders. Kept here so the page and the sync script agree on the shape.
export function flattenEvents(team: CtfTeam): CtfEvent[] {
  return team.seasons
    .flatMap((s) => s.events)
    .sort((a, b) => b.year - a.year || a.place - b.place)
}
