import Link from "next/link";
import type { Metadata } from "next";
import { getStandings, EARLIEST_RESULTS_YEAR, CURRENT_SEASON } from "@/lib/data";
import SectionHeading from "@/components/SectionHeading";
import Panel from "@/components/Panel";
import PositionBadge from "@/components/PositionBadge";

export const metadata: Metadata = {
  title: "Results & Standings",
  description:
    "Live drivers' and teams' standings for the current BTCC season, plus round-by-round results back to 2004.",
};

const YEARS = Array.from(
  { length: CURRENT_SEASON - EARLIEST_RESULTS_YEAR + 1 },
  (_, i) => CURRENT_SEASON - i
);

export default async function ResultsIndexPage() {
  const standings = await getStandings();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <SectionHeading
        eyebrow={`Round ${standings.round} - ${standings.venue}`}
        title={`${CURRENT_SEASON} Standings`}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel className="p-0">
          <p className="border-b border-border px-5 py-3 text-xs font-bold uppercase tracking-widest text-muted">
            Drivers
          </p>
          <ul className="divide-y divide-border">
            {standings.standings.map((entry) => (
              <li key={entry.pos} className="flex items-center gap-3 px-5 py-2.5">
                <PositionBadge pos={entry.pos} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {entry.driver}
                  </p>
                  <p className="truncate text-xs text-muted">{entry.team}</p>
                </div>
                <span className="w-14 shrink-0 text-right text-xs text-muted">
                  {entry.wins}W
                </span>
                <span className="w-12 shrink-0 text-right font-display text-base font-bold text-btcc-yellow">
                  {entry.points}
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel className="p-0">
          <p className="border-b border-border px-5 py-3 text-xs font-bold uppercase tracking-widest text-muted">
            Teams
          </p>
          <ul className="divide-y divide-border">
            {standings.teams.map((entry) => (
              <li key={entry.pos} className="flex items-center gap-3 px-5 py-2.5">
                <PositionBadge pos={entry.pos} />
                <span className="flex-1 truncate text-sm font-semibold text-foreground">
                  {entry.team}
                </span>
                <span className="font-display text-base font-bold text-btcc-yellow">
                  {entry.points}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-14">
        <SectionHeading eyebrow="2004 - 2026" title="Season Archive" />
        <p className="mb-5 max-w-2xl text-sm text-muted">
          Round-by-round session results for every BTCC season back to 2004.
        </p>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
          {YEARS.map((year) => (
            <Link
              key={year}
              href={`/results/${year}`}
              className="rounded-lg border border-border bg-surface py-2.5 text-center text-sm font-semibold text-foreground transition-colors hover:border-btcc-yellow hover:text-btcc-yellow"
            >
              {year}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
