export interface Driver {
  number: number;
  name: string;
  team: string;
  car: string;
  imageUrl: string;
  nationality: string;
  bio: string;
  dateOfBirth?: string;
  birthplace?: string;
  livesIn?: string;
  class?: string; // 'I' | 'M'
  cardBgUrl?: string;
  numberImageUrl?: string;
  carImageUrl?: string;
  lightCardBg?: boolean;
  history: {
    year: number;
    team: string;
    car: string;
    pos: number;
    points: number;
    wins: number;
    podiums?: number;
    poles?: number;
    fastestLaps?: number;
    dnfs?: number;
    isChampion?: boolean;
  }[];
}

export interface StandingEntry {
  pos: number;
  driver: string;
  car: string;
  class: string;
  points: number;
  wins: number;
}

export interface TeamStanding {
  pos: number;
  team: string;
  points: number;
  wins: number;
}

export interface Round {
  round: number;
  venue: string;
  startDate: string;
  endDate: string;
  location: string;
  country: string;
  lengthMiles: string;
  lengthKm: string;
  corners: number;
  about: string;
  btccFact: string;
  imageUrl: string;
  layoutImageUrl: string;
  raceImages: string[];
  firstBtccYear: number;
  qualifyingRecord: { driver: string; time: string; speed: string; year: number };
  raceRecord: { driver: string; time: string; speed: string; year: number };
}

export interface RaceResult {
  round?: number;
  venue?: string;
  date?: string;
  results?: { pos: number | string; driver: string; car: string; laps?: number; time?: string; points?: number }[];
}

// Matches data/results.json exactly (copied 1:1 from the app's own
// data/results2026.json - see lib/data.ts's getRoundResults()).
export interface ResultRow {
  pos: number;
  no: number;
  cl: string;
  driver: string;
  team: string;
  car: string;
  laps: number;
  time: string;
  gap: string;
  bestLap: string;
  points: number;
  leadLap?: boolean;
  fastestLap?: boolean;
  pole?: boolean;
  status?: "DNF" | "DNS" | "DQ";
}

export interface GridRow {
  pos: number;
  no: number;
  cl: string;
  driver: string;
  team: string;
}

export interface RaceSession {
  label: string; // "Free Practice" | "Qualifying" | "Qualifying Race" | "Race 1" | "Race 2" | "Race 3"
  results: ResultRow[];
  grid?: GridRow[];
}

export interface ResultsRound {
  round: number;
  venue: string;
  date: string;
  races: RaceSession[];
  youtubeUrls?: string[];
}

export interface ResultsData {
  season: number;
  rounds: ResultsRound[];
}
