import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Linkedin } from "lucide-react";

import ctfData from "@/data/ctf-data.json";
import ctfTeam from "@/data/ctf-team.json";
import { JoinForm } from "@/components/ui/JoinForm";

const CTFTIME_URL = `https://ctftime.org/team/${ctfTeam.teamId}`;

// Logos live in public/ctf-logos. The sync script writes the event name, so the
// logo is resolved by slug and matched on a prefix — that keeps the existing
// artwork working when CTFtime spells an event slightly differently.
const LOGO_SLUGS = [
  "amateursctf-2025",
  "buckeyectf-2025",
  "crate-ctf-2025",
  "deadface-ctf-2025",
  "enigmaxplore-3",
  "glacierctf-2025",
  "guardians-of-the-ti",
  "haix-la-chapelle-2025",
  "haunted-pumpkin-ctf-25",
  "heroctf-v7",
  "jailctf-2025",
  "mctf-2025-junior-quals",
  "patriotctf-2025",
  "platypwn-2025",
  "pointer-overflow-ctf-2025",
  "pwnsec-ctf-2025",
  "saarctf-2025",
  "sknbctf-2025",
  "sunshinectf-2025",
  "v1t-ctf-2025",
];

const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function logoFor(eventName: string): string | null {
  const slug = slugify(eventName);
  const exact = LOGO_SLUGS.find((s) => s === slug);
  if (exact) return `${exact}.png`;
  const prefix = LOGO_SLUGS.filter((s) => slug.startsWith(s) || s.startsWith(slug)).sort(
    (a, b) => b.length - a.length
  )[0];
  return prefix ? `${prefix}.png` : null;
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
  { name: "Web exploitation", note: "Injection, auth bypass, SSRF" },
  { name: "Binary exploitation", note: "Heap, ROP, format strings" },
  { name: "Reverse engineering", note: "Static and dynamic analysis" },
  { name: "Cryptography", note: "Protocol and implementation flaws" },
  { name: "Forensics", note: "Disk, memory, network captures" },
  { name: "OSINT", note: "Open-source attribution" },
];

export default function Home() {
  const totalPoints = ctfData.reduce((sum, c) => sum + c.points, 0);
  const bestEvent = ctfData.reduce((a, b) => (b.place < a.place ? b : a));
  const topFinishes = ctfData.filter((c) => c.place <= 100).length;
  const currentSeason = ctfTeam.seasons[0];
  const firstSeason = ctfTeam.seasons[ctfTeam.seasons.length - 1];

  // Newest season first, best placement first within a season.
  const events = [...ctfData].sort((a, b) => b.year - a.year || a.place - b.place);

  return (
    <div className="mx-auto max-w-6xl px-6">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-b hairline py-16 md:py-24">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10 dark:ring-white/15">
                <Image src="/team_logo.jpg" alt="" fill className="object-cover" priority />
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                CTF team · University of Calcutta
              </p>
            </div>

            <h1 className="mt-8 text-5xl font-semibold tracking-tight md:text-6xl">
              Utopians
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              We compete in Capture The Flag competitions worldwide. Since{" "}
              {firstSeason?.year ?? 2025} we have played {ctfData.length} events,
              finishing as high as #{bestEvent.place} and placing in the top 100{" "}
              {topFinishes} times.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={CTFTIME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                CTFtime profile
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="#join"
                className="inline-flex items-center gap-2 rounded-md border hairline px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
              >
                Get in touch
              </Link>
            </div>
          </div>

          {/* Season record — the numbers a reader actually checks first. */}
          <dl className="grid w-full shrink-0 grid-cols-2 gap-px overflow-hidden rounded-lg border hairline bg-border md:w-80">
            {[
              { label: "Events played", value: ctfData.length },
              { label: "Best placement", value: `#${bestEvent.place}` },
              { label: "Top-100 finishes", value: topFinishes },
              {
                label: `${currentSeason?.year ?? ""} overall`,
                value: currentSeason?.overallPlace ? `#${currentSeason.overallPlace}` : "—",
              },
            ].map((stat) => (
              <div key={stat.label} className="surface px-5 py-4">
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </dt>
                <dd className="tnum mt-1 text-2xl font-semibold">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Record by season                                                   */}
      {/* ------------------------------------------------------------------ */}
      <section id="record" className="border-b hairline py-16">
        <h2 className="text-2xl font-semibold tracking-tight">Record</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Overall and country ranking per season, as published on CTFtime.
        </p>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b hairline text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Season</th>
                <th className="py-3 pr-4 font-medium">Overall</th>
                <th className="py-3 pr-4 font-medium">Rating points</th>
                <th className="py-3 pr-4 font-medium">India</th>
                <th className="py-3 font-medium">Events</th>
              </tr>
            </thead>
            <tbody>
              {ctfTeam.seasons.map((s) => (
                <tr key={s.year} className="border-b hairline last:border-0">
                  <td className="py-3 pr-4 font-medium">{s.year}</td>
                  <td className="tnum py-3 pr-4">
                    {s.overallPlace ? `#${s.overallPlace}` : "—"}
                  </td>
                  <td className="tnum py-3 pr-4">
                    {s.overallPoints != null ? s.overallPoints.toFixed(3) : "—"}
                  </td>
                  <td className="tnum py-3 pr-4">
                    {s.countryPlace ? `#${s.countryPlace}` : "—"}
                  </td>
                  <td className="tnum py-3">{s.eventCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Disciplines                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section id="disciplines" className="border-b hairline py-16">
        <h2 className="text-2xl font-semibold tracking-tight">What we work on</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          The categories we compete in, and the kind of problem each one covers.
        </p>

        <dl className="mt-8 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {DISCIPLINES.map((d) => (
            <div key={d.name} className="border-l-2 border-primary/30 pl-4">
              <dt className="font-medium">{d.name}</dt>
              <dd className="mt-0.5 text-sm text-muted-foreground">{d.note}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Team                                                               */}
      {/* ------------------------------------------------------------------ */}
      <section id="team" className="border-b hairline py-16">
        <h2 className="text-2xl font-semibold tracking-tight">Team</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Two members, both listed on the team&apos;s CTFtime profile.
        </p>

        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {MEMBERS.map((m) => (
            <li key={m.handle} className="rounded-lg border hairline p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-medium">{m.name}</h3>
                <span className="font-mono text-xs text-muted-foreground">{m.role}</span>
              </div>
              <p className="mt-1 font-mono text-sm text-muted-foreground">@{m.handle}</p>
              <div className="mt-4 flex flex-wrap gap-2">
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

      {/* ------------------------------------------------------------------ */}
      {/* Results                                                            */}
      {/* ------------------------------------------------------------------ */}
      <section id="results" className="border-b hairline py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Results</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Every event on record, newest season first. Sourced from CTFtime and
              updated automatically.
            </p>
          </div>
          <p className="tnum text-sm text-muted-foreground">
            {ctfData.length} events · {totalPoints.toLocaleString()} points
          </p>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b hairline text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Place</th>
                <th className="py-3 pr-4 font-medium">Event</th>
                <th className="py-3 pr-4 font-medium">Season</th>
                <th className="py-3 pr-4 text-right font-medium">CTF points</th>
                <th className="py-3 text-right font-medium">Rating</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => {
                const logo = logoFor(e.event);
                return (
                  <tr key={`${e.eventId}-${e.year}`} className="border-b hairline last:border-0">
                    <td className="tnum py-3 pr-4 font-medium">
                      {e.place <= 50 ? (
                        <span className="text-primary">#{e.place}</span>
                      ) : (
                        `#${e.place}`
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        {logo && (
                          <span className="relative h-6 w-6 shrink-0 overflow-hidden rounded">
                            <Image
                              src={`/ctf-logos/${logo}`}
                              alt=""
                              fill
                              sizes="24px"
                              className="object-contain"
                            />
                          </span>
                        )}
                        <span className="truncate">{e.event}</span>
                      </div>
                    </td>
                    <td className="tnum py-3 pr-4 text-muted-foreground">{e.year}</td>
                    <td className="tnum py-3 pr-4 text-right">
                      {e.points.toLocaleString()}
                    </td>
                    <td className="tnum py-3 text-right text-muted-foreground">
                      {e.ratingPoints ? e.ratingPoints.toFixed(3) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Join                                                               */}
      {/* ------------------------------------------------------------------ */}
      <section id="join" className="py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Join the team</h2>
            <p className="mt-3 text-muted-foreground">
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
          <div className="rounded-lg border hairline p-6">
            <JoinForm />
          </div>
        </div>
      </section>
    </div>
  );
}
