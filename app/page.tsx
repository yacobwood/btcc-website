import Link from "next/link";
import Image from "next/image";
import {
  getNextRound,
  getHubNews,
  getStandings,
  getFeaturedGalleryImage,
  CURRENT_SEASON,
} from "@/lib/data";
import { slugify } from "@/lib/slug";
import Countdown from "@/components/Countdown";
import PositionBadge from "@/components/PositionBadge";
import AppPromoCard from "@/components/AppPromoCard";
import MarqueeTicker from "@/components/MarqueeTicker";

export default async function HomePage() {
  const [nextRound, news, standings, featured] = await Promise.all([
    getNextRound(),
    getHubNews(),
    getStandings(),
    getFeaturedGalleryImage(),
  ]);

  // The weekly "Flying Lap" digest posts all share one fixed cover image
  // (a branded mascot graphic, same as a podcast series reusing one cover
  // per episode) - real content, but not something to put in the site's one
  // big "featured photo" slot 3 times over. Prefer the freshest post that
  // carries a genuine, distinct photo for that slot instead.
  const realPhotoPost = news.find((p) => !p.id.startsWith("digest-") && p.imageUrl);
  const featuredPost = realPhotoPost ?? news[0];
  const restNews = news.filter((p) => p.id !== featuredPost?.id).slice(0, 4);

  const leader = standings.standings[0];
  const runnerUp = standings.standings[1];
  const gap = leader && runnerUp ? leader.points - runnerUp.points : null;

  // Same react-hooks/purity tradeoff as the calendar page's "is this round
  // live/past" badge - reading the wall clock at render time is genuinely
  // fine here, this copy is meant to reflect render time and the page's
  // data already carries its own short revalidate window.
  const now =
    // eslint-disable-next-line react-hooks/purity
    Date.now();
  const daysToNextRound = nextRound
    ? Math.max(1, Math.ceil((new Date(nextRound.startDate).getTime() - now) / 86_400_000))
    : null;

  // Lead with what's happening right now (next round, the live title
  // fight) - the season's 22-year depth is a real trust signal, but it
  // reads as a database when it's the FIRST thing said, not the fifth.
  const tickerItems = [
    nextRound && `NEXT UP — ROUND ${nextRound.round} · ${nextRound.venue.toUpperCase()}`,
    leader && `P1 ${leader.driver} — ${leader.points} PTS`,
    runnerUp && `P2 ${runnerUp.driver} — ${runnerUp.points} PTS`,
    "22 SEASONS OF RESULTS, 2004–2026",
    "26,000+ RACE PHOTOS",
  ].filter((x): x is string => Boolean(x));

  return (
    <div>
      {/* Hero - full-bleed real race photo, not a stock gradient */}
      <section className="relative isolate flex min-h-[88vh] items-end overflow-hidden">
        {featured ? (
          <Image
            src={featured.url}
            alt={`${featured.venue}, Round ${featured.round}`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_38%] saturate-[1.2] contrast-[1.08]"
          />
        ) : (
          <div className="absolute inset-0 bg-surface" />
        )}
        {/* Scrim - heavy at the bottom where text sits, lighter up top and on
            the right so the photo stays vivid rather than reading as a
            faded, dusty archive print. */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/55 via-background/5 to-transparent" />

        {/* Giant ghost numeral - purely decorative depth, ignored by screen readers */}
        {featured && (
          <span
            aria-hidden
            className="pointer-events-none absolute -right-6 top-[8%] select-none font-display text-[38vw] font-extrabold italic leading-none text-white/[0.05] sm:text-[26vw]"
          >
            {String(featured.round).padStart(2, "0")}
          </span>
        )}

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6 sm:pb-20">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.3em] text-btcc-yellow">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-btcc-yellow opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-btcc-yellow" />
            </span>
            {CURRENT_SEASON} Season
          </p>
          {leader && gap !== null && gap > 0 ? (
            <h1 className="mt-3 max-w-3xl font-display text-6xl font-extrabold uppercase leading-[0.95] tracking-tight text-foreground sm:text-8xl">
              {leader.driver}
              <br />
              leads by{" "}
              <span className="inline-block -skew-x-6 bg-btcc-yellow px-2 text-background">
                {gap} points.
              </span>
            </h1>
          ) : (
            <h1 className="mt-3 max-w-3xl font-display text-6xl font-extrabold uppercase leading-[0.95] tracking-tight text-foreground sm:text-8xl">
              The title fight is{" "}
              <span className="inline-block -skew-x-6 bg-btcc-yellow px-2 text-background">
                still wide open.
              </span>
            </h1>
          )}
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/80">
            {daysToNextRound && nextRound
              ? `${daysToNextRound} days to ${nextRound.venue}. `
              : ""}
            Live standings, full race weekends and 22 years of results -
            built by the team behind the BTCC Hub app.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/results"
              className="group inline-block -skew-x-6 bg-btcc-yellow transition-transform hover:-translate-y-0.5"
            >
              <span className="inline-block skew-x-6 px-7 py-3 text-sm font-bold uppercase tracking-wide text-background">
                View Standings
              </span>
            </Link>
            <Link
              href="/calendar"
              className="group inline-block -skew-x-6 border-2 border-white/40 transition-colors hover:border-btcc-yellow"
            >
              <span className="inline-block skew-x-6 px-7 py-3 text-sm font-bold uppercase tracking-wide text-foreground">
                Season Calendar
              </span>
            </Link>
          </div>

          {nextRound && (
            <div className="relative mt-14 flex max-w-3xl flex-col gap-5 border-l-4 border-btcc-yellow bg-background/60 py-5 pl-6 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:pr-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted">
                  Next up - Round {nextRound.round}
                </p>
                <Link
                  href={`/circuits/${slugify(nextRound.venue)}`}
                  className="font-display text-3xl font-extrabold uppercase text-foreground hover:text-btcc-yellow"
                >
                  {nextRound.venue}
                </Link>
                <p className="mt-1 text-sm text-muted">
                  {new Date(nextRound.startDate).toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}{" "}
                  -{" "}
                  {new Date(nextRound.endDate).toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
              <Countdown targetIso={nextRound.startDate} />
            </div>
          )}
        </div>
      </section>

      <MarqueeTicker items={tickerItems} />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          {/* News - one bled, oversized featured story + a headline list,
              not a repeated grid of identical cards. */}
          <section>
            <div className="mb-6 flex items-end justify-between">
              <p className="text-xs font-bold uppercase tracking-widest text-btcc-yellow">
                Flying Lap
              </p>
              <Link
                href="/news"
                className="text-sm font-bold text-btcc-yellow hover:underline"
              >
                All news &rarr;
              </Link>
            </div>

            {featuredPost && (
              <Link
                href={`/news/${featuredPost.id}`}
                className="group relative mb-6 block h-72 overflow-hidden bg-card sm:h-96"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 96%, 0 100%)" }}
              >
                {featuredPost.imageUrl && (
                  <Image
                    src={featuredPost.imageUrl}
                    alt={featuredPost.title}
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  {featuredPost.category && (
                    <span className="inline-block -skew-x-6 bg-btcc-yellow px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-background">
                      {featuredPost.category}
                    </span>
                  )}
                  <p className="mt-3 font-display text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
                    {featuredPost.title}
                  </p>
                </div>
              </Link>
            )}

            <ul className="divide-y divide-border">
              {restNews.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/news/${post.id}`}
                    className="group flex items-center justify-between gap-4 py-4"
                  >
                    <div className="min-w-0">
                      {post.category && (
                        <p className="text-xs font-bold uppercase tracking-widest text-btcc-yellow">
                          {post.category}
                        </p>
                      )}
                      <p className="mt-0.5 truncate font-display text-lg font-bold text-foreground group-hover:text-btcc-yellow">
                        {post.title}
                      </p>
                    </div>
                    <span className="shrink-0 text-btcc-yellow opacity-0 transition-opacity group-hover:opacity-100">
                      &rarr;
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Standings snapshot - angled panel + a leader bar under each row */}
          <section>
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-btcc-yellow">
              {CURRENT_SEASON} Standings
            </p>
            <div
              className="overflow-hidden border border-border bg-surface"
              style={{ clipPath: "polygon(0 0, 100% 2%, 100% 100%, 0 98%)" }}
            >
              <ul className="divide-y divide-border">
                {standings.standings.slice(0, 5).map((entry) => (
                  <li key={entry.pos} className="relative">
                    <div
                      className="absolute inset-y-0 left-0 bg-btcc-yellow/10"
                      style={{ width: `${(entry.points / (leader?.points || entry.points || 1)) * 100}%` }}
                      aria-hidden
                    />
                    <div className="relative flex items-center gap-3 px-5 py-3">
                      <PositionBadge pos={entry.pos} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {entry.driver}
                        </p>
                        <p className="truncate text-xs text-muted">{entry.team}</p>
                      </div>
                      <span className="font-display text-lg font-bold text-btcc-yellow">
                        {entry.points}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <Link
                href="/results"
                className="block border-t border-border px-5 py-3 text-center text-sm font-bold text-btcc-yellow hover:underline"
              >
                Full standings &rarr;
              </Link>
            </div>
          </section>
        </div>

        <div className="mt-16">
          <AppPromoCard
            title="Live timing, chat & push alerts - in the app"
            body="Follow every session lap by lap, chat with fans on race day and get notified the second a session goes green."
          />
        </div>
      </div>
    </div>
  );
}
