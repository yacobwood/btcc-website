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
import { readInlineCircuitSvg } from "@/lib/inlineSvg";
import BigCountdown from "@/components/BigCountdown";
import AppPromoCard from "@/components/AppPromoCard";
import MarqueeTicker from "@/components/MarqueeTicker";
import StartLights from "@/components/StartLights";
import ScrambleNumber from "@/components/ScrambleNumber";
import TiltCard from "@/components/TiltCard";
import TransitionLink from "@/components/TransitionLink";

export default async function HomePage() {
  const [nextRound, news, standings, featured] = await Promise.all([
    getNextRound(),
    getHubNews(),
    getStandings(),
    getFeaturedGalleryImage(),
  ]);

  const nextRoundCircuitSlug = nextRound ? slugify(nextRound.venue) : null;
  const circuitSvg = nextRoundCircuitSlug
    ? await readInlineCircuitSvg(nextRoundCircuitSlug)
    : null;

  // The weekly "Flying Lap" digest posts all share one fixed cover image
  // (a branded mascot graphic) - not something to put in the one big
  // editorial photo slot. Prefer the freshest post with a genuine, distinct
  // photo for that slot instead.
  const realPhotoPost = news.find((p) => !p.id.startsWith("digest-") && p.imageUrl);
  const featuredPost = realPhotoPost ?? news[0];
  const restNews = news.filter((p) => p.id !== featuredPost?.id).slice(0, 6);

  const top5 = standings.standings.slice(0, 5);
  const leader = top5[0];
  const runnerUp = top5[1];
  const gap = leader && runnerUp ? leader.points - runnerUp.points : null;

  // Render-time is the point here - see the calendar page's identical
  // documented exception for this rule.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const daysToNextRound = nextRound
    ? Math.max(1, Math.ceil((new Date(nextRound.startDate).getTime() - now) / 86_400_000))
    : null;

  const tickerItems = [
    nextRound && `NEXT UP — ROUND ${nextRound.round} · ${nextRound.venue.toUpperCase()}`,
    leader && `P1 ${leader.driver} — ${leader.points} PTS`,
    runnerUp && `P2 ${runnerUp.driver} — ${runnerUp.points} PTS`,
    "22 SEASONS OF RESULTS, 2004–2026",
    "26,000+ RACE PHOTOS",
  ].filter((x): x is string => Boolean(x));

  return (
    <div>
      {/* ================= CH.01 — OPENER =================
          A statement, not a hero-plus-button-row. One giant idea fills the
          screen; the photo becomes a tinted graphic texture behind it
          rather than a literal photograph competing with the type. */}
      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden border-b border-border">
        {featured && (
          <>
            <Image
              src={featured.url}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[center_35%] grayscale contrast-125"
            />
            {/* Duotone wash - recolors the grayscale photo through the
                brand yellow via mix-blend-mode:color, so this reads as a
                graphic poster, not a photograph with text on it. */}
            <div className="absolute inset-0 bg-gradient-to-br from-btcc-yellow/70 via-btcc-yellow/20 to-transparent mix-blend-color" />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-btcc-yellow">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-btcc-yellow opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-btcc-yellow" />
              </span>
              CH.01 — {CURRENT_SEASON} SEASON
            </p>
            <StartLights />
          </div>

          {leader && gap !== null && gap > 0 ? (
            <h1 className="mt-6 font-display text-[13vw] font-extrabold uppercase leading-[0.82] tracking-tight text-foreground">
              {leader.driver.split(" ")[0]}
              <br />
              <span className="text-btcc-yellow">
                +<ScrambleNumber value={gap} />
              </span>
            </h1>
          ) : (
            <h1 className="mt-6 font-display text-[11vw] font-extrabold uppercase leading-[0.82] tracking-tight text-foreground">
              Wide open.
            </h1>
          )}

          <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
            <p className="max-w-md text-lg leading-relaxed text-white/80">
              {leader ? `${leader.driver} leads the title fight by ${gap} points.` : ""}{" "}
              {daysToNextRound && nextRound
                ? `${daysToNextRound} days to ${nextRound.venue}.`
                : ""}
            </p>
            <div className="flex gap-3">
              <Link
                href="/results"
                className="corner-bracket relative inline-block bg-btcc-yellow px-6 py-3 text-sm font-bold uppercase tracking-wide text-background"
              >
                Standings
              </Link>
              <Link
                href="/news"
                className="corner-bracket relative inline-block border-2 border-white/30 px-6 py-3 text-sm font-bold uppercase tracking-wide text-foreground"
              >
                News
              </Link>
            </div>
          </div>
        </div>

        <p
          aria-hidden
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-[0.3em] text-muted"
        >
          Scroll
        </p>
      </section>

      <MarqueeTicker items={tickerItems} />

      {/* ================= CH.02 — NEXT ROUND ================= */}
      {nextRound && (
        <section className="relative flex min-h-screen flex-col justify-center border-b border-border bg-surface py-16">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-btcc-yellow">
                CH.02 — Round {nextRound.round}
              </p>
              <h2 className="mt-4 font-display text-[10vw] font-extrabold uppercase leading-[0.85] text-foreground md:text-7xl">
                {nextRound.venue}
              </h2>
              <p className="mt-3 text-muted">
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
              <div className="mt-10">
                <BigCountdown targetIso={nextRound.startDate} />
              </div>
              <Link
                href={`/circuits/${nextRoundCircuitSlug}`}
                className="corner-bracket relative mt-10 inline-block border-2 border-white/30 px-6 py-3 text-sm font-bold uppercase tracking-wide text-foreground"
              >
                Circuit Guide &rarr;
              </Link>
            </div>
            {circuitSvg && (
              <div
                className="circuit-draw [&_svg]:h-full [&_svg]:w-full"
                dangerouslySetInnerHTML={{ __html: circuitSvg }}
              />
            )}
          </div>
        </section>
      )}

      {/* ================= CH.03 — STANDINGS ================= */}
      <section className="relative min-h-screen border-b border-border py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-btcc-yellow">
                CH.03 — {CURRENT_SEASON} Standings
              </p>
              <h2 className="mt-2 font-display text-5xl font-extrabold uppercase text-foreground sm:text-7xl">
                Timing Tower
              </h2>
            </div>
            <Link
              href="/results"
              className="hidden text-sm font-bold text-btcc-yellow hover:underline sm:block"
            >
              Full standings &rarr;
            </Link>
          </div>

          <div className="mt-10">
            {top5.map((entry) => (
              <div key={entry.pos} className="corner-bracket relative border-b border-border py-5">
                <div
                  className="absolute inset-y-0 left-0 bg-btcc-yellow/10"
                  style={{ width: `${(entry.points / (leader?.points || entry.points || 1)) * 100}%` }}
                  aria-hidden
                />
                <div className="relative flex items-center gap-6">
                  <span className="w-16 shrink-0 font-display text-4xl font-extrabold text-muted sm:text-6xl">
                    {String(entry.pos).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-2xl font-extrabold uppercase text-foreground sm:text-4xl">
                      {entry.driver}
                    </p>
                    <p className="truncate text-sm text-muted">{entry.team}</p>
                  </div>
                  <span className="shrink-0 font-display text-3xl font-extrabold text-btcc-yellow sm:text-5xl">
                    <ScrambleNumber value={entry.points} />
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/results"
            className="mt-6 block text-sm font-bold text-btcc-yellow hover:underline sm:hidden"
          >
            Full standings &rarr;
          </Link>
        </div>
      </section>

      {/* ================= CH.04 — NEWS ================= */}
      <section className="relative min-h-screen py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-btcc-yellow">
            CH.04 — Flying Lap
          </p>
          <h2 className="mt-2 font-display text-5xl font-extrabold uppercase text-foreground sm:text-7xl">
            Latest News
          </h2>

          {featuredPost && (
            <TiltCard className="corner-bracket relative mt-10 block h-[60vh] max-h-[560px] overflow-hidden border border-border">
              <TransitionLink href={`/news/${featuredPost.id}`} className="block h-full w-full">
                {featuredPost.imageUrl && (
                  <Image
                    src={featuredPost.imageUrl}
                    alt={featuredPost.title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    style={{ viewTransitionName: `news-photo-${featuredPost.id}` }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
                  {featuredPost.category && (
                    <span className="inline-block bg-btcc-yellow px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-background">
                      {featuredPost.category}
                    </span>
                  )}
                  <p className="mt-3 max-w-3xl font-display text-3xl font-extrabold uppercase leading-[0.95] text-foreground sm:text-6xl">
                    {featuredPost.title}
                  </p>
                </div>
              </TransitionLink>
            </TiltCard>
          )}

          {/* Horizontal-scroll headline strip - swipe/trackpad/drag, no JS,
              a different reading pattern from a stacked list. */}
          <div className="mt-8 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
            {restNews.map((post) => (
              <Link
                key={post.id}
                href={`/news/${post.id}`}
                className="corner-bracket relative w-72 shrink-0 snap-start border border-border bg-surface p-5"
              >
                {post.category && (
                  <p className="text-xs font-bold uppercase tracking-widest text-btcc-yellow">
                    {post.category}
                  </p>
                )}
                <p className="mt-2 font-display text-lg font-bold leading-snug text-foreground">
                  {post.title}
                </p>
              </Link>
            ))}
          </div>
          <Link
            href="/news"
            className="mt-2 inline-block text-sm font-bold text-btcc-yellow hover:underline"
          >
            All news &rarr;
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <AppPromoCard
          title="Live timing, chat & push alerts - in the app"
          body="Follow every session lap by lap, chat with fans on race day and get notified the second a session goes green."
        />
      </div>
    </div>
  );
}
