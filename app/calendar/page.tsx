import Link from "next/link";
import type { Metadata } from "next";
import { getCalendar, CURRENT_SEASON } from "@/lib/data";
import { slugify } from "@/lib/slug";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Calendar",
  description: `The full ${CURRENT_SEASON} British Touring Car Championship calendar - every round, venue and session time.`,
};

export default async function CalendarPage() {
  const calendar = await getCalendar();
  // Reading the wall clock in a Server Component render is flagged by
  // react-hooks/purity (the render-idempotency check) - genuinely fine here,
  // the "live weekend"/"past round" badges are meant to reflect render time
  // and this page's data already carries its own hourly revalidate window
  // (getCalendar()'s fetch), so staleness is bounded the same way either way.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <SectionHeading eyebrow={`${calendar.season} Season`} title="Calendar" />
      <ol className="space-y-3">
        {calendar.rounds.map((round) => {
          const isPast = new Date(round.endDate).getTime() < now;
          const isLive =
            !isPast && new Date(round.startDate).getTime() <= now;
          return (
            <li
              key={round.round}
              className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface px-5 py-4"
            >
              <div className="flex items-center gap-4">
                <span className="font-display text-2xl font-extrabold text-muted">
                  {String(round.round).padStart(2, "0")}
                </span>
                <div>
                  <Link
                    href={`/circuits/${slugify(round.venue)}`}
                    className="font-display text-lg font-bold text-foreground hover:text-btcc-yellow"
                  >
                    {round.venue}
                  </Link>
                  <p className="text-sm text-muted">
                    {new Date(round.startDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                    })}{" "}
                    -{" "}
                    {new Date(round.endDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isLive && (
                  <span className="rounded-full bg-btcc-yellow px-3 py-1 text-xs font-bold uppercase tracking-wide text-background">
                    Live weekend
                  </span>
                )}
                {isPast && (
                  <Link
                    href={`/results/${CURRENT_SEASON}/${round.round}`}
                    className="text-sm font-bold text-btcc-yellow hover:underline"
                  >
                    Results &rarr;
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
