import Link from 'next/link';
import ctfTeam from '@/data/ctf-team.json';

const CTFTIME_URL = `https://ctftime.org/team/${ctfTeam.teamId}`;

export function Footer() {
  return (
    <footer className="border-t hairline">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-tight">Utopians</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Capture The Flag team · University of Calcutta
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link
              href={CTFTIME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              CTFtime
            </Link>
            <Link href="#results" className="transition-colors hover:text-foreground">
              Results
            </Link>
            <Link href="#join" className="transition-colors hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>

        <p className="mt-8 border-t hairline pt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Utopians. Results are synced from CTFtime.
        </p>
      </div>
    </footer>
  );
}
