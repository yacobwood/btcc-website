// Types mirror the real JSON shapes in yacobwood/BTCC's data/ directory
// exactly (verified directly against the live files, not guessed) - see
// lib/data.ts for the fetchers that use these.

export interface CalendarSession {
  name: string;
  day: string;
  time: string;
}

export interface LapRecord {
  driver: string;
  time: string;
  speed?: string;
  year: number;
}

export interface CalendarRound {
  round: number;
  tslEventId?: number;
  venue: string;
  startDate: string;
  endDate: string;
  qualifyingRecord?: LapRecord;
  raceRecord?: LapRecord;
  sessions: CalendarSession[];
  fullTimetable?: unknown[];
}

export interface Calendar {
  season: number;
  seasonStartDate: string;
  liveTimingEnabled?: boolean;
  rounds: CalendarRound[];
}

export interface Driver {
  number: number;
  name: string;
  team: string;
  car: string;
  // Not every driver has a photo yet (a newly-confirmed signing, or a
  // reserve who hasn't raced) - confirmed against the real data, not an
  // edge case to assume away. Same for bio - a reserve-only entry can be
  // little more than a name/number placeholder.
  imageUrl?: string;
  nationality: string;
  bio?: string;
  reserveOnly?: boolean;
  // null/absent = currently racing (the common case); false = departed
  // mid-season but has real results this year, so still worth listing.
  currentlyRacing?: boolean | null;
}

export interface TeamSponsor {
  name: string;
  tier: string;
}

export interface Team {
  name: string;
  car: string;
  entries: number;
  bio: string;
  founded?: string;
  base?: string;
  driversChampionships?: number;
  teamsChampionships?: number;
  history?: string;
  logoUrl?: string;
  cardBgUrl?: string;
  carImageUrl?: string;
  totalRaces?: number;
  totalWins?: number;
  sponsors?: TeamSponsor[];
  sponsorsNote?: string;
}

export interface DriversFile {
  season: number;
  drivers: Driver[];
  teams: Team[];
}

export interface StandingEntry {
  pos: number;
  car: string;
  driver: string;
  nat: string;
  class: string;
  points: number;
  wins: number;
  seconds: number;
  thirds: number;
  team: string;
}

export interface TeamStanding {
  pos: number;
  team: string;
  points: number;
}

export interface Standings {
  standings: StandingEntry[];
  teams: TeamStanding[];
  manufacturers?: TeamStanding[];
  independentsTeams?: TeamStanding[];
  independents?: StandingEntry[];
  season: number;
  round: number;
  venue: string;
  updated: string;
}

export interface RaceResultRow {
  pos: number | string;
  no: number;
  cl?: string;
  driver: string;
  team: string;
  car: string;
  laps: number;
  time: string;
  gap: string;
  bestLap: string;
  points: number;
}

export interface RaceSession {
  label: string;
  results: RaceResultRow[];
  grid?: unknown;
}

export interface ResultsRound {
  round: number;
  venue: string;
  date: string;
  races: RaceSession[];
  youtubeUrls?: string[];
}

export interface SeasonResults {
  season: number;
  rounds: ResultsRound[];
}

export interface Track {
  location: string;
  country: string;
  lat: number;
  lng: number;
  lengthMiles: string;
  lengthKm: string;
  corners: number;
  cornersLeft: number;
  cornersRight: number;
  about: string;
  btccFact: string;
  imageUrl: string;
  // layoutImageUrl / raceImages intentionally omitted from this type - they
  // point at live btcc.net-hosted URLs and must never be rendered on this
  // site (see the "image policy" note in the build plan).
}

export type TracksFile = Record<string, Track>;

export interface HubNewsPost {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  category?: string;
  source?: string;
  pubDate?: string;
}

export interface HubNewsFile {
  posts: HubNewsPost[];
}

export interface GalleryAlbum {
  slug: string;
  title: string;
  cover: string;
  round: number | null;
  venue: string | null;
  capturedCount: number;
  totalCount: number;
  complete: boolean;
  isCanonical: boolean;
}

export interface GallerySeasonFile {
  season: number;
  albums: GalleryAlbum[];
}
