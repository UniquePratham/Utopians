import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Linkedin } from "lucide-react";

import ctfData from "@/data/ctf-data.json";
import ctfTeam from "@/data/ctf-team.json";
import { JoinForm } from "@/components/ui/JoinForm";

const CTFTIME_URL = `https://ctftime.org/team/${ctfTeam.teamId}`;

// Logos are downloaded per event into public/ctf-logos/<eventId>.png by
// scripts/fetch-ctf-logos.mjs, so every row can show the event's real artwork.
// One older event has no logo on CTFtime; that row falls back to initials.
const LOGO_IDS = new Set([
  2606, 2613, 2714, 2737, 2773, 2838, 2844, 2850, 2851, 2859, 2862, 2863, 2869,
  2878, 2883, 2898, 2901, 2904, 2906, 2912, 2915, 2918, 2920, 2927, 2947, 2951,
  2957, 2962, 2969, 2980, 2981, 2983, 2995, 3003, 3006, 3009, 3012, 3021, 3024,
  3028, 3037, 3041, 3045, 3049, 3056, 3073, 3081, 3093, 3095, 3096, 3102, 3105,
  3109, 3110, 3113, 3127, 3130, 3133, 3136, 3137, 3141, 3150, 3153, 3156, 3166,
  3171, 3177, 3184, 3186, 3191, 3192, 3195, 3202, 3206, 3235, 3247, 3249, 3269,
  3270, 3272, 3276, 3277, 3279, 3280, 3283, 3297, 3299, 3301, 3309, 3320, 3323,
  3331, 3333, 3337, 3346, 3369, 3370, 3377, 3425, 3434, 3435, 3455, 3460, 3464,
]);

function logoFor(eventId: number | null): string | null {
  if (!eventId) return null;
  return LOGO_IDS.has(eventId) ? `${eventId}.png` : null;
}

const MEMBERS = [
  {
    name: "Shaswata Saha",
    handle: "subhro1530",
    role: "Founder",
    linkedin: "https://www.linkedin.com/in/shaswata-saha-74b209251/",
    site: "https://ssaha.vercel.app/",
  },
  {
    name: "Pratham Agarwal",
    handle: "UniquePratham",
    role: "Co-founder",
    linkedin: "https://www.linkedin.com/in/uniquepratham/",
    site: "https://uniquepratham-portfolio.web.app/",
  },
];

const DISCIPLINES = [
  { name: "Web exploitation", note: "Injection, auth bypass, SSRF, deserialisation" },
  { name: "Binary exploitation", note: "Heap, ROP, format strings, sandbox escapes" },
  { name: "Reverse engineering", note: "Static and dynamic analysis, custom VMs" },
  { name: "Cryptography", note: "Protocol and implementation flaws" },
  { name: "Forensics", note: "Disk, memory and network captures" },
  { name: "OSINT", note: "Open-source attribution and geolocation" },
];

// Rank bands drive one hue ramp, so a reader can scan the table by colour.
function rankClass(place: number): string {
  if (place <= 50) return "rank-top";
  if (place <= 200) return "rank-mid";
  return "rank-low";
}

export default function Home() {
  const totalPoints = ctfData.reduce((sum, c) => sum + c.points, 0);
  const bestEvent = ctfData.reduce((a, b) => (b.place < a.place ? b : a));
  const topFinishes = ctfData.filter((c) => c.place <= 100).length;
  const currentSeason = ctfTeam.seasons[0];
  const firstSeason = ctfTeam.seasons[ctfTeam.seasons.length - 1];

  const events = [...ctfData].sort((a, b) => b.year - a.year || a.place - b.place);

  // The three best placements, shown as a podium in the hero.
  const podium = [...ctfData].sort((a, b) => a.place - b.place).slice(0, 3);

  return (
    <div>
      {/* ================================================================== */}
      {/* Hero                                                               */}
      {/* ================================================================== */}
      <section className="relative overflow-hidden border-b hairline">
        <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden />

        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-16 md:pb-24 md:pt-24">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="animate-rise">
              <div className="flex items-center gap-3">
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10 dark:ring-white/15">
                  <Image src="/team_logo.jpg" alt="" fill className="object-cover" priority />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  CTF team · University of Calcutta
                </span>
              </div>

              <h1 className="mt-7 text-5xl font-semibold tracking-tight md:text-7xl">
                Utopians
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                We compete in Capture The Flag competitions worldwide. Since{" "}
                {firstSeason?.year ?? 2025} we have played{" "}
                <strong className="font-semibold text-foreground">{ctfData.length} events</strong>,
                finished as high as{" "}
                <strong className="font-semibold text-foreground">#{bestEvent.place}</strong>, and
                placed in the top 100{" "}
                <strong className="font-semibold text-foreground">{topFinishes} times</strong>.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href={CTFTIME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110"
                >
                  CTFtime profile
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="#results"
                  className="inline-flex items-center gap-2 rounded-lg border hairline px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  All results
                </Link>
                <Link
                  href="#join"
                  className="inline-flex items-center gap-2 px-2 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Get in touch
                </Link>
              </div>
            </div>

            {/* Podium — the three best finishes, with their real logos. */}
            <div className="animate-fade">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Best finishes
              </p>
              <ul className="space-y-2.5">
                {podium.map((e, i) => {
                  const logo = logoFor(e.eventId);
                  return (
                    <li
                      key={`${e.eventId}-${e.year}`}
                      className="card flex items-center gap-4 p-3.5"
                    >
                      <span className="tnum w-6 shrink-0 text-center font-mono text-xs text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="logo-tile h-12 w-12 shrink-0">
                        {logo ? (
                          <Image
                            src={`/ctf-logos/${logo}`}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center font-mono text-[10px] text-muted-foreground">
                            {e.event.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{e.event}</span>
                        <span className="tnum block text-xs text-muted-foreground">
                          {e.year} · {e.points.toLocaleString()} pts
                        </span>
                      </span>
                      <span className="tnum shrink-0 text-lg font-semibold text-primary">
                        #{e.place}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Stat strip */}
          <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-xl border hairline bg-border md:grid-cols-4">
            {[
              { label: "Events played", value: ctfData.length.toLocaleString() },
              { label: "Best placement", value: `#${bestEvent.place}` },
              { label: "Top-100 finishes", value: topFinishes },
              { label: "Total CTF points", value: totalPoints.toLocaleString() },
            ].map((s) => (
              <div key={s.label} className="surface px-5 py-5">
                <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </dt>
                <dd className="tnum mt-1.5 text-2xl font-semibold md:text-3xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ================================================================== */}
      {/* Record                                                             */}
      {/* ================================================================== */}
      <section id="record" className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Record</h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              Overall and country ranking per season, as published on CTFtime. The
              rating is a weighted score across every event played that year.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Currently{" "}
              <strong className="font-semibold text-foreground">
                #{currentSeason?.overallPlace ?? "—"} overall
              </strong>{" "}
              and{" "}
              <strong className="font-semibold text-foreground">
                #{currentSeason?.countryPlace ?? "—"} in India
              </strong>{" "}
              for {currentSeason?.year}.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border hairline">
            <table className="w-full text-left text-sm">
              <thead className="surface-muted">
                <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Season</th>
                  <th className="px-4 py-3 font-medium">Overall</th>
                  <th className="px-4 py-3 font-medium">Rating</th>
                  <th className="px-4 py-3 font-medium">India</th>
                  <th className="px-4 py-3 text-right font-medium">Events</th>
                </tr>
              </thead>
              <tbody>
                {ctfTeam.seasons.map((s) => (
                  <tr key={s.year} className="border-t hairline">
                    <td className="px-4 py-3.5 font-medium">{s.year}</td>
                    <td className="tnum px-4 py-3.5">
                      {s.overallPlace ? `#${s.overallPlace}` : "—"}
                    </td>
                    <td className="tnum px-4 py-3.5 text-muted-foreground">
                      {s.overallPoints != null ? s.overallPoints.toFixed(3) : "—"}
                    </td>
                    <td className="tnum px-4 py-3.5">
                      {s.countryPlace ? `#${s.countryPlace}` : "—"}
                    </td>
                    <td className="tnum px-4 py-3.5 text-right">{s.eventCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* Disciplines                                                        */}
      {/* ================================================================== */}
      <section id="disciplines" className="border-y hairline surface-muted">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            What we work on
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            The categories we compete in, and the kind of problem each one covers.
          </p>

          <dl className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DISCIPLINES.map((d, i) => (
              <div key={d.name} className="card p-5">
                <span className="tnum font-mono text-[11px] text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <dt className="mt-2 font-medium">{d.name}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {d.note}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ================================================================== */}
      {/* Team                                                               */}
      {/* ================================================================== */}
      <section id="team" className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Team</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Two members, both listed on the team&apos;s CTFtime profile.
        </p>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {MEMBERS.map((m) => (
            <li key={m.handle} className="card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium">{m.name}</h3>
                  <p className="mt-0.5 font-mono text-sm text-muted-foreground">
                    @{m.handle}
                  </p>
                </div>
                <span className="rounded-full border hairline px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {m.role}
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href={m.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border hairline px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary"
                >
                  <Linkedin className="h-3.5 w-3.5" />
                  LinkedIn
                </Link>
                <Link
                  href={m.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border hairline px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Portfolio
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ================================================================== */}
      {/* Results                                                            */}
      {/* ================================================================== */}
      <section id="results" className="border-t hairline">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Results</h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Every event on record, newest season first. Sourced from CTFtime and
                updated automatically.
              </p>
            </div>
            <p className="tnum font-mono text-xs text-muted-foreground">
              {ctfData.length} events · {totalPoints.toLocaleString()} points
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-xl border hairline">
            <div className="max-h-[42rem] overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="surface-muted sticky top-0 z-10 backdrop-blur">
                  <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Place</th>
                    <th className="px-4 py-3 font-medium">Event</th>
                    <th className="px-4 py-3 font-medium">Season</th>
                    <th className="px-4 py-3 text-right font-medium">CTF points</th>
                    <th className="px-4 py-3 text-right font-medium">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((e) => {
                    const logo = logoFor(e.eventId);
                    return (
                      <tr
                        key={`${e.eventId}-${e.year}`}
                        className="border-t hairline transition-colors hover:bg-secondary"
                      >
                        <td className={`tnum px-4 py-2.5 ${rankClass(e.place)}`}>
                          #{e.place}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-3">
                            <span className="logo-tile h-8 w-8 shrink-0">
                              {logo ? (
                                <Image
                                  src={`/ctf-logos/${logo}`}
                                  alt=""
                                  fill
                                  sizes="32px"
                                  className="object-cover"
                                />
                              ) : (
                                <span className="flex h-full w-full items-center justify-center font-mono text-[9px] text-muted-foreground">
                                  {e.event.slice(0, 2).toUpperCase()}
                                </span>
                              )}
                            </span>
                            <span className="truncate">{e.event}</span>
                          </div>
                        </td>
                        <td className="tnum px-4 py-2.5 text-muted-foreground">{e.year}</td>
                        <td className="tnum px-4 py-2.5 text-right">
                          {e.points.toLocaleString()}
                        </td>
                        <td className="tnum px-4 py-2.5 text-right text-muted-foreground">
                          {e.ratingPoints ? e.ratingPoints.toFixed(3) : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* Join                                                               */}
      {/* ================================================================== */}
      <section id="join" className="border-t hairline surface-muted">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Join the team
              </h2>
              <p className="mt-3 max-w-md text-muted-foreground">
                We recruit from the University of Calcutta and take on members who can
                show work — a writeup, a solved challenge, a project. Tell us what you
                have done and what you want to work on.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                You can also reach us through the{" "}
                <Link
                  href={CTFTIME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline underline-offset-4"
                >
                  CTFtime team page
                </Link>
                .
              </p>
            </div>
            <div className="card p-6">
              <JoinForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
