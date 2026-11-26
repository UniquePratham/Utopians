// scripts/fetch-ctf-logos.mjs
//
// Downloads each event's logo from its CTFtime event page into
// public/ctf-logos/<eventId>.png, so every row in the results table has real
// artwork instead of two-letter initials.
//
// Run: node scripts/fetch-ctf-logos.mjs
//
// CTFtime serves the logo as a 150x150 image inside the event header:
//   <img src="/media/cache/f6/6a/f66a....png" width="150" height="150">
// The page is fetched once per event, with a small delay so the site is not
// hammered. Existing files are skipped, so re-running only fills the gaps.

import { readFile, writeFile, mkdir, access } from "node:fs/promises"
import path from "node:path"

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

const OUT_DIR = path.resolve("public/ctf-logos")
const DATA = path.resolve("data/ctf-data.json")
const DELAY_MS = 700

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } })
  if (!res.ok) return null
  return res.text()
}

// The event logo is the only 150x150 image in the header block.
function findLogoUrl(html) {
  const m = html.match(/<img\s+src="(\/media\/cache\/[^"]+)"\s+width="150"\s+height="150"/)
  if (m) return m[1]
  // Fall back to any /media/cache image.
  const any = html.match(/<img\s+src="(\/media\/cache\/[^"]+)"/)
  return any ? any[1] : null
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  const events = JSON.parse(await readFile(DATA, "utf8"))
  const ids = [...new Set(events.map((e) => e.eventId).filter(Boolean))]

  console.log(`${ids.length} events to check`)

  let downloaded = 0
  let skipped = 0
  let missing = 0

  for (const id of ids) {
    const target = path.join(OUT_DIR, `${id}.png`)

    if (await exists(target)) {
      skipped += 1
      continue
    }

    const html = await fetchText(`https://ctftime.org/event/${id}`)
    if (!html) {
      console.log(`  ${id}: page unavailable`)
      missing += 1
      await sleep(DELAY_MS)
      continue
    }

    const logoPath = findLogoUrl(html)
    if (!logoPath) {
      console.log(`  ${id}: no logo on page`)
      missing += 1
      await sleep(DELAY_MS)
      continue
    }

    const imgRes = await fetch(`https://ctftime.org${logoPath}`, {
      headers: { "User-Agent": UA },
    })
    if (!imgRes.ok) {
      console.log(`  ${id}: image ${imgRes.status}`)
      missing += 1
      await sleep(DELAY_MS)
      continue
    }

    const buf = Buffer.from(await imgRes.arrayBuffer())
    if (buf.length < 500) {
      console.log(`  ${id}: image too small (${buf.length}b)`)
      missing += 1
      await sleep(DELAY_MS)
      continue
    }

    await writeFile(target, buf)
    downloaded += 1
    console.log(`  ${id}: ${buf.length}b`)
    await sleep(DELAY_MS)
  }

  console.log(
    `\ndownloaded ${downloaded}, already present ${skipped}, unavailable ${missing}`
  )
}

main().catch((err) => {
  console.error("fetch-ctf-logos failed:", err.message)
  process.exit(1)
})
