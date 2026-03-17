import driversRaw from "@/data/drivers.json";
import standingsRaw from "@/data/standings.json";
import calendarRaw from "@/data/calendar.json";
import resultsRaw from "@/data/results.json";
import results2025Raw from "@/data/results2025.json";
import type { Driver, StandingEntry, TeamStanding, Round } from "@/types";

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
