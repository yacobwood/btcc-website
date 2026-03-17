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
  history: {
    year: number;
    team: string;
    car: string;
    pos: number;
    points: number;
    wins: number;
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
