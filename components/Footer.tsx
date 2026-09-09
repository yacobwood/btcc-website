import Link from "next/link";
import { PLAY_STORE_URL } from "@/lib/appLinks";

const FOOTER_LINKS = [
  { href: "/news", label: "News" },
  { href: "/results", label: "Results & Standings" },
  { href: "/calendar", label: "Calendar" },
  { href: "/circuits", label: "Circuits" },
  { href: "/drivers", label: "Drivers" },
  { href: "/teams", label: "Teams" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="font-display text-xl font-extrabold text-foreground">
              BTCC <span className="text-btcc-yellow">HUB</span>
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              Live timing, real-time chat and push notifications for every session
              are built into the free BTCC Hub app on Android - this site covers
              news, results, standings and the full 2004-2026 archive.
            </p>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-btcc-yellow"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-btcc-yellow" aria-hidden>
                <path d="M3 3.8v16.4c0 .5.28.94.7 1.16l9.9-9.36-9.9-9.36A1.3 1.3 0 0 0 3 3.8Zm13.86 8.2 2.9-2.06c.7-.5.7-1.58 0-2.08l-2.9-2.06-3.2 3.1 3.2 3.1Zm-3.98-2.9L4.1 2.36l9.6 9.06 2.18-2.32ZM4.1 21.64l8.78-8.28-2.18-2.32-6.6 10.6Z" />
              </svg>
              Get it on Google Play
            </a>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted">
              Site
            </p>
            <nav className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-xs text-muted">
          BTCC Hub is an independent fan platform and is not an official BTCC
          publication. Results, standings and calendar data are sourced and
          published independently.
        </div>
      </div>
    </footer>
  );
}
