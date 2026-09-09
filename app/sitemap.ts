import type { MetadataRoute } from "next";
import {
  getHubNews,
  getDrivers,
  getTeams,
  getTrackEntries,
  EARLIEST_RESULTS_YEAR,
  CURRENT_SEASON,
} from "@/lib/data";
import { slugify } from "@/lib/slug";

const BASE_URL = "https://btcchub.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, drivers, teams, circuits] = await Promise.all([
    getHubNews(),
    getDrivers(),
    getTeams(),
    getTrackEntries(),
  ]);

  const staticRoutes = ["", "/news", "/results", "/calendar", "/circuits", "/drivers", "/teams"].map(
    (path) => ({ url: `${BASE_URL}${path}`, changeFrequency: "daily" as const })
  );

  const years = Array.from(
    { length: CURRENT_SEASON - EARLIEST_RESULTS_YEAR + 1 },
    (_, i) => CURRENT_SEASON - i
  ).map((year) => ({ url: `${BASE_URL}/results/${year}`, changeFrequency: "weekly" as const }));

  const newsRoutes = news.map((post) => ({
    url: `${BASE_URL}/news/${post.id}`,
    changeFrequency: "monthly" as const,
  }));

  const driverRoutes = drivers.map((d) => ({
    url: `${BASE_URL}/drivers/${slugify(d.name)}`,
    changeFrequency: "weekly" as const,
  }));

  const teamRoutes = teams.map((t) => ({
    url: `${BASE_URL}/teams/${slugify(t.name)}`,
    changeFrequency: "weekly" as const,
  }));

  const circuitRoutes = circuits.map((c) => ({
    url: `${BASE_URL}/circuits/${c.slug}`,
    changeFrequency: "monthly" as const,
  }));

  return [...staticRoutes, ...years, ...newsRoutes, ...driverRoutes, ...teamRoutes, ...circuitRoutes];
}
