import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getSeasonResults,
  EARLIEST_RESULTS_YEAR,
  CURRENT_SEASON,
} from "@/lib/data";
import SectionHeading from "@/components/SectionHeading";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year } = await params;
  return { title: `${year} Season Results` };
}

export default async function SeasonResultsPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const yearNum = parseInt(year, 10);
  if (
    !Number.isInteger(yearNum) ||
    yearNum < EARLIEST_RESULTS_YEAR ||
    yearNum > CURRENT_SEASON
  ) {
    notFound();
  }

  const season = await getSeasonResults(yearNum);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <SectionHeading eyebrow="Season Archive" title={`${yearNum} Results`} />
      <ol className="space-y-2">
        {season.rounds.map((round) => (
          <li key={round.round}>
            <Link
              href={`/results/${yearNum}/${round.round}`}
              className="flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-4 transition-colors hover:border-btcc-yellow"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted">
                  Round {round.round}
                </p>
                <p className="font-display text-lg font-bold text-foreground">
                  {round.venue}
                </p>
              </div>
              <span className="text-sm text-muted">
                {round.date &&
                  new Date(round.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

export async function generateStaticParams() {
  const years = Array.from(
    { length: CURRENT_SEASON - EARLIEST_RESULTS_YEAR + 1 },
    (_, i) => CURRENT_SEASON - i
  );
  return years.map((year) => ({ year: String(year) }));
}
