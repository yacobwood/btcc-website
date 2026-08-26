import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getRoundResults, shortSessionLabel } from "@/lib/data";
import RoundResultsView from "@/components/round-results/RoundResultsView";

// [race] is 1-indexed in the URL (results/7/2 = the 2nd session tab), to
// match exactly how RoundResultsScreen.js's onShareRound builds the link in
// the app (activeRace + 1) - see AppNavigator.js's getStateFromPath, which
// converts it back to a 0-indexed openRace param for the app's own use.
export async function generateMetadata({ params }: { params: Promise<{ round: string; race: string }> }): Promise<Metadata> {
  const { round, race } = await params;
  const r = getRoundResults(parseInt(round, 10));
  if (!r) return { title: "Round Not Found | BTCC" };
  const session = r.races[parseInt(race, 10) - 1];
  const label = session ? shortSessionLabel(session.label) : `Round ${r.round}`;
  return {
    title: `${r.venue} - ${label} Results | BTCC`,
    description: `${session?.label ?? "Session"} results for Round ${r.round} at ${r.venue}, ${r.date}.`,
  };
}

export default async function RoundResultsRacePage({ params }: { params: Promise<{ round: string; race: string }> }) {
  const { round, race } = await params;
  const roundData = getRoundResults(parseInt(round, 10));
  if (!roundData) notFound();

  const raceIndex = parseInt(race, 10) - 1;
  return <RoundResultsView round={roundData} initialRaceIndex={raceIndex} />;
}
