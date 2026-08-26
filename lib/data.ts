import driversRaw from "@/data/drivers.json";
import standingsRaw from "@/data/standings.json";
import calendarRaw from "@/data/calendar.json";
import resultsRaw from "@/data/results.json";
import results2025Raw from "@/data/results2025.json";
import type { Driver, StandingEntry, TeamStanding, Round, ResultsData, ResultsRound } from "@/types";

export function getDrivers(): Driver[] {
  return driversRaw.drivers as Driver[];
}

export function getDriver(slug: string): Driver | undefined {
  return getDrivers().find(
    (d) => d.name.toLowerCase().replace(/\s+/g, "-") === slug
  );
}

export function driverSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export function getStandings(): StandingEntry[] {
  return standingsRaw.standings as StandingEntry[];
}

export function getTeamStandings(): TeamStanding[] {
  return standingsRaw.teams as TeamStanding[];
}

export function getCalendar(): Round[] {
  return calendarRaw.rounds as Round[];
}

export function getResults() {
  return resultsRaw;
}

// Current-season round-by-round results (data/results.json - a snapshot
// copied from the app repo's data/results2026.json, same "copy, don't
// live-sync" pattern already used for results2025.json). Powers
// /results/[round] - the page a shared "Round N results" link opens to.
export function getRoundResults(round: number): ResultsRound | undefined {
  return (resultsRaw as unknown as ResultsData).rounds.find((r) => r.round === round);
}

export function getAllRoundResults(): ResultsRound[] {
  return (resultsRaw as unknown as ResultsData).rounds;
}

// Abbreviates session labels for tab display - matches
// RoundResultsScreen.js's shortLabel() in the app exactly.
export function shortSessionLabel(label: string): string {
  if (label === "Free Practice") return "FP";
  if (label === "Qualifying") return "QUAL";
  if (label === "Qualifying Race") return "Q RACE";
  const m = label.match(/^Race (\d)$/);
  if (m) return `R${m[1]}`;
  return label;
}

export function getResults2025() {
  return results2025Raw;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const sDay = s.toLocaleDateString("en-GB", { day: "numeric" });
  const eDay = e.toLocaleDateString("en-GB", { day: "numeric" });
  const month = s.toLocaleDateString("en-GB", { month: "long" });
  const year = s.getFullYear();
  return `${sDay}–${eDay} ${month} ${year}`;
}
