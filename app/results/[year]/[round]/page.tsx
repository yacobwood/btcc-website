import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getRoundResults,
  getSeasonResults,
  CURRENT_SEASON,
} from "@/lib/data";
import { slugify } from "@/lib/slug";
import SectionHeading from "@/components/SectionHeading";
import Panel from "@/components/Panel";
import SessionTabs from "@/components/SessionTabs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; round: string }>;
}): Promise<Metadata> {
  const { year, round } = await params;
  const result = await getRoundResults(parseInt(year, 10), parseInt(round, 10));
  if (!result) return {};
  return { title: `${year} Round ${result.round} - ${result.venue}` };
}

export default async function RoundResultsPage({
  params,
}: {
  params: Promise<{ year: string; round: string }>;
}) {
  const { year, round } = await params;
  const yearNum = parseInt(year, 10);
  const roundNum = parseInt(round, 10);
  const result = await getRoundResults(yearNum, roundNum);
  if (!result) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href={`/results/${yearNum}`}
        className="text-sm font-semibold text-muted hover:text-foreground"
      >
        &larr; {yearNum} Season
      </Link>
      <div className="mt-3">
        <SectionHeading
          eyebrow={`Round ${result.round} - ${yearNum}`}
          title={result.venue}
          action={
            <Link
              href={`/circuits/${slugify(result.venue)}`}
              className="text-sm font-bold text-btcc-yellow hover:underline"
            >
              Circuit guide &rarr;
            </Link>
          }
        />
      </div>
      <Panel>
        <SessionTabs races={result.races} />
      </Panel>
    </div>
  );
}

export async function generateStaticParams() {
  // Only pre-render the current season at build time - 22 prior seasons
  // would mean generating hundreds of round pages up front for content
  // that's fixed and rarely visited; those still work fine on first
  // request via ISR (dynamicParams defaults to true), just not pre-built.
  const season = await getSeasonResults(CURRENT_SEASON);
  return season.rounds.map((r) => ({
    year: String(CURRENT_SEASON),
    round: String(r.round),
  }));
}

export const dynamicParams = true;
