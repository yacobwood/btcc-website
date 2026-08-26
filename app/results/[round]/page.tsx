import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getRoundResults } from "@/lib/data";
import RoundResultsView from "@/components/round-results/RoundResultsView";

export async function generateMetadata({ params }: { params: Promise<{ round: string }> }): Promise<Metadata> {
  const { round } = await params;
  const r = getRoundResults(parseInt(round, 10));
  if (!r) return { title: "Round Not Found | BTCC" };
  return {
    title: `${r.venue} - Round ${r.round} Results | BTCC`,
    description: `Full session results for Round ${r.round} at ${r.venue}, ${r.date}.`,
  };
}

export default async function RoundResultsPage({ params }: { params: Promise<{ round: string }> }) {
  const { round } = await params;
  const roundData = getRoundResults(parseInt(round, 10));
  if (!roundData) notFound();

  return <RoundResultsView round={roundData} initialRaceIndex={0} />;
}
