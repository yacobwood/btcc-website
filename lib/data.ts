import type {
  Calendar,
  DriversFile,
  Driver,
  Team,
  Standings,
  SeasonResults,
  ResultsRound,
  TracksFile,
  Track,
  HubNewsFile,
  HubNewsPost,
  GallerySeasonFile,
} from "./types";
import { slugify } from "./slug";

// Every fetcher pulls the same GitHub-raw JSON the BTCC Hub app itself
// fetches at runtime (src/api/client.js in the BTCC repo) - no separate
// backend, no copy-pasted snapshot to keep in sync. ISR revalidate windows
// are set per file to how often that data actually changes (see comments
// below), so the site never serves visibly stale data on a race weekend
// without re-fetching on every single request either.
const DATA_ROOT =
  "https://raw.githubusercontent.com/yacobwood/BTCC/main/data";

export const EARLIEST_RESULTS_YEAR = 2004;
export const CURRENT_SEASON = 2026;

async function getJson<T>(path: string, revalidateSeconds: number): Promise<T> {
  const res = await fetch(`${DATA_ROOT}/${path}`, {
    next: { revalidate: revalidateSeconds },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// Calendar rarely changes mid-week - 1 hour is plenty.
export async function getCalendar(): Promise<Calendar> {
  return getJson<Calendar>("calendar.json", 3600);
}

export async function getNextRound(): Promise<Calendar["rounds"][number] | undefined> {
  const calendar = await getCalendar();
  const now = Date.now();
  return calendar.rounds.find((r) => new Date(r.endDate).getTime() >= now);
}

// Driver roster changes rarely outside the close season - 1 hour.
export async function getDriversFile(): Promise<DriversFile> {
  return getJson<DriversFile>("drivers.json", 3600);
}

export async function getDrivers(): Promise<Driver[]> {
  const file = await getDriversFile();
  return file.drivers;
}

export async function getDriver(slug: string): Promise<Driver | undefined> {
  const drivers = await getDrivers();
  return drivers.find((d) => slugify(d.name) === slug);
}

export async function getTeams(): Promise<Team[]> {
  const file = await getDriversFile();
  return file.teams;
}

export async function getTeam(slug: string): Promise<Team | undefined> {
  const teams = await getTeams();
  return teams.find((t) => slugify(t.name) === slug);
}

// Standings update after every session on a race weekend - short window.
export async function getStandings(): Promise<Standings> {
  return getJson<Standings>("standings.json", 300);
}

// Results for a past season never change again - cache hard. The current
// season's file updates all race weekend - short window there instead.
export async function getSeasonResults(year: number): Promise<SeasonResults> {
  const revalidate = year === CURRENT_SEASON ? 300 : 86400;
  return getJson<SeasonResults>(`results${year}.json`, revalidate);
}

export async function getRoundResults(
  year: number,
  round: number
): Promise<ResultsRound | undefined> {
  const season = await getSeasonResults(year);
  return season.rounds.find((r) => r.round === round);
}

// A known, already-flagged data bug in the upstream app repo's own
// tracks.json (see project_circuit_guide_seo_pages memory): the Silverstone
// entry gives the full Grand Prix Arena circuit's length (3.666mi/5.891km),
// but BTCC actually races the shorter National layout. Corrected here at the
// read layer, verified against 4 independent sources (Wikipedia,
// racingcircuits.info, oversteer48.com, lapmeta.com) - narrow, documented
// override rather than silently trusting the source file.
const TRACK_OVERRIDES: Record<string, Partial<Track>> = {
  Silverstone: { lengthMiles: "1.640 mi", lengthKm: "2.639 km" },
};

// Circuit facts are effectively static - cache for a day.
export async function getTracks(): Promise<TracksFile> {
  const tracks = await getJson<TracksFile>("tracks.json", 86400);
  for (const [venue, override] of Object.entries(TRACK_OVERRIDES)) {
    if (tracks[venue]) {
      tracks[venue] = { ...tracks[venue], ...override };
    }
  }
  return tracks;
}

export async function getTrackEntries(): Promise<Array<{ slug: string; venue: string; track: Track }>> {
  const tracks = await getTracks();
  return Object.entries(tracks).map(([venue, track]) => ({
    slug: slugify(venue),
    venue,
    track,
  }));
}

export async function getTrack(slug: string): Promise<{ venue: string; track: Track } | undefined> {
  const entries = await getTrackEntries();
  return entries.find((e) => e.slug === slug);
}

// Every driver/team/circuit imageUrl in the source data is a mirrored
// raw.githubusercontent.com asset (verified directly, not assumed) except
// tracks.json's one MSV-hosted exception (allowlisted deliberately in
// next.config.ts). hub_news.json is editorial content pulled together by
// hand, though, and at least one post's imageUrl points straight at a
// Reddit preview CDN link - not something to blanket-trust the same way:
// those links can expire, and it's a random submitter's image, not an
// asset this operation controls. Strip anything outside the trusted host
// rather than allowlisting Reddit itself.
const TRUSTED_IMAGE_HOSTS = ["raw.githubusercontent.com"];

function sanitizeImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    return TRUSTED_IMAGE_HOSTS.includes(new URL(url).hostname) ? url : undefined;
  } catch {
    return undefined;
  }
}

// Hub News (original editorial) is the freshest content on the site -
// short window so a just-published digest shows up quickly.
export async function getHubNews(): Promise<HubNewsPost[]> {
  const file = await getJson<HubNewsFile>("hub_news.json", 300);
  return file.posts.map((post) => ({
    ...post,
    imageUrl: sanitizeImageUrl(post.imageUrl),
  }));
}

export async function getHubNewsPost(slug: string): Promise<HubNewsPost | undefined> {
  const posts = await getHubNews();
  return posts.find((p) => p.id === slug || slugify(p.title) === slug);
}

// A real, recent race photo for the homepage hero - not a stock image. Each
// gallery album's "cover" field is a small ~480px thumb; every photo in this
// bucket also has a matching ~1920px "display" variant at the identical
// path with that one segment swapped (confirmed live against the real
// bucket, same convention the app's own PhotoLightbox relies on for
// full-size viewing) - no extra fetch needed to upgrade it.
function toDisplayVariant(coverUrl: string): string {
  return coverUrl.replace("thumb-gallery-", "display-gallery-");
}

export async function getFeaturedGalleryImage(): Promise<
  { url: string; venue: string; round: number } | null
> {
  const file = await getJson<GallerySeasonFile>(`gallery${CURRENT_SEASON}.json`, 3600);
  const canonical = file.albums
    .filter((a): a is typeof a & { round: number; venue: string } => a.isCanonical && a.round != null && !!a.venue)
    .sort((a, b) => b.round - a.round);
  const top = canonical[0];
  if (!top) return null;
  return { url: toDisplayVariant(top.cover), venue: top.venue, round: top.round };
}
