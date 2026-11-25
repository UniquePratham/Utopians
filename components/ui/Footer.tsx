import Link from 'next/link';
import ctfTeam from '@/data/ctf-team.json';

const CTFTIME_URL = `https://ctftime.org/team/${ctfTeam.teamId}`;

export function Footer() {
  return (
    <footer className="border-t hairline">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} Utopians · University of Calcutta
        </p>
        <div className="flex items-center gap-6">
          <Link
            href={CTFTIME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            CTFtime
          </Link>
          <Link href="#join" className="transition-colors hover:text-foreground">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
