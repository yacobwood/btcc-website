import Link from "next/link";
import Image from "next/image";
import { getCalendar, getStandings, driverSlug, formatDateRange } from "@/lib/data";
import Countdown from "@/components/Countdown";

async function getNews() {
  try {
    const res = await fetch(
      "https://www.btcc.net/wp-json/wp/v2/posts?per_page=6&_embed=1",
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((post: any) => ({
      id: post.id,
      slug: post.slug,
      title: post.title?.rendered ?? "",
      excerpt: post.excerpt?.rendered?.replace(/<[^>]+>/g, "").trim() ?? "",
      date: post.date,
      imageUrl: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null,
    }));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [articles, calendar, standings] = await Promise.all([
    getNews(),
    Promise.resolve(getCalendar()),
    Promise.resolve(getStandings()),
  ]);

  const today = new Date();
  const nextRound = calendar.find((r) => new Date(r.endDate) >= today);
  const topStandings = standings.slice(0, 5);
  const hero = articles[0];
  const grid = articles.slice(1, 3);
  const more = articles.slice(3);

  return (
    <div>
      {/* Hero */}
      <section style={{ position: "relative", height: 560, overflow: "hidden", background: "#0F1122" }}>
        {hero?.imageUrl ? (
          <Image
            src={hero.imageUrl}
            alt={hero.title}
            fill
            style={{ objectFit: "cover", opacity: 0.45 }}
            priority
            unoptimized
          />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #FEBD0222 0%, #080912 60%)" }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #080912 0%, transparent 60%)" }} />
        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            paddingBottom: 56,
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "#FEBD02",
              color: "#080912",
              fontFamily: "var(--font-barlow-condensed)",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "4px 10px",
              marginBottom: 16,
              width: "fit-content",
            }}
          >
            Latest News
          </div>
          {hero ? (
            <>
              <h1
                style={{
                  fontFamily: "var(--font-barlow-condensed)",
                  fontWeight: 800,
                  fontSize: "clamp(28px, 5vw, 52px)",
                  lineHeight: 1.1,
                  maxWidth: 720,
                  marginBottom: 16,
                }}
                dangerouslySetInnerHTML={{ __html: hero.title }}
              />
              <Link
                href={`/news/${hero.slug}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#FEBD02",
                  color: "#080912",
                  padding: "12px 24px",
                  fontFamily: "var(--font-barlow-condensed)",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  width: "fit-content",
                }}
              >
                Read More →
              </Link>
            </>
          ) : (
            <h1
              style={{
                fontFamily: "var(--font-barlow-condensed)",
                fontWeight: 800,
                fontSize: "clamp(28px, 5vw, 52px)",
                lineHeight: 1.1,
                maxWidth: 720,
              }}
            >
              Britain's Most Exciting Motorsport Series
            </h1>
          )}
        </div>
      </section>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        {/* Next race + championship leader */}
        {nextRound && (
          <section
            style={{
              margin: "40px 0",
              background: "#0F1122",
              border: "1px solid #161828",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "28px 32px", borderRight: "1px solid #161828" }}>
              <div style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FEBD02", marginBottom: 8 }}>
                Next Race — Round {nextRound.round}
              </div>
              <div style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800, fontSize: 26, letterSpacing: "0.02em", marginBottom: 4 }}>
                {nextRound.venue}
              </div>
              <div style={{ color: "#8B8FA8", fontSize: 14 }}>
                {formatDateRange(nextRound.startDate, nextRound.endDate)} · {nextRound.location}
              </div>
              <div style={{ marginTop: 20 }}>
                <Countdown targetDate={nextRound.startDate} venue={nextRound.venue} />
              </div>
              <Link href="/calendar" style={{ display: "inline-block", marginTop: 16, color: "#FEBD02", fontFamily: "var(--font-barlow-condensed)", fontWeight: 600, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}>
                Full Calendar →
              </Link>
            </div>
            <div style={{ padding: "28px 32px" }}>
              <div style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FEBD02", marginBottom: 8 }}>
                Championship Leader
              </div>
              {topStandings.slice(0, 1).map((s) => (
                <div key={s.pos}>
                  <div style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800, fontSize: 26, marginBottom: 4 }}>
                    <Link href={`/drivers/${driverSlug(s.driver)}`} style={{ color: "#fff", textDecoration: "none" }}>{s.driver}</Link>
                  </div>
                  <div style={{ color: "#8B8FA8", fontSize: 14 }}>#{s.car} · {s.points} pts · {s.wins} win{s.wins !== 1 ? "s" : ""}</div>
                </div>
              ))}
              <Link href="/results" style={{ display: "inline-block", marginTop: 16, color: "#FEBD02", fontFamily: "var(--font-barlow-condensed)", fontWeight: 600, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}>
                Full Standings →
              </Link>
            </div>
          </section>
        )}

        {/* News grid */}
        {grid.length > 0 && (
          <section style={{ margin: "40px 0" }}>
            <SectionHeader title="Latest News" href="/news" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
              {grid.map((a: any) => <NewsCard key={a.id} article={a} />)}
            </div>
          </section>
        )}

        {/* More stories */}
        {more.length > 0 && (
          <section style={{ margin: "40px 0" }}>
            <SectionHeader title="More Stories" href="/news" />
            <div style={{ display: "flex", flexDirection: "column" }}>
              {more.map((a: any) => <CompactNewsRow key={a.id} article={a} />)}
            </div>
          </section>
        )}

        {/* Standings preview */}
        <section style={{ margin: "60px 0" }}>
          <SectionHeader title="Driver Standings" href="/results" />
          <div style={{ background: "#0F1122", border: "1px solid #161828", overflow: "hidden" }}>
            {topStandings.map((s, i) => (
              <div
                key={s.pos}
                style={{
                  display: "grid",
                  gridTemplateColumns: "40px 40px 1fr 80px 60px",
                  alignItems: "center",
                  padding: "14px 20px",
                  borderBottom: i < topStandings.length - 1 ? "1px solid #161828" : "none",
                  gap: 12,
                }}
              >
                <span style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800, fontSize: 20, color: s.pos === 1 ? "#FEBD02" : "#4B5563" }}>{s.pos}</span>
                <span style={{ color: "#8B8FA8", fontSize: 13, fontWeight: 600 }}>#{s.car}</span>
                <Link href={`/drivers/${driverSlug(s.driver)}`} style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, fontSize: 17, textDecoration: "none", color: "#fff", letterSpacing: "0.02em" }}>
                  {s.driver}
                </Link>
                <span style={{ color: "#8B8FA8", fontSize: 13, textAlign: "right" }}>{s.wins}W</span>
                <span style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800, fontSize: 18, textAlign: "right", color: "#fff" }}>{s.points}</span>
              </div>
            ))}
            <div style={{ padding: "14px 20px", textAlign: "center" }}>
              <Link href="/results" style={{ color: "#FEBD02", fontFamily: "var(--font-barlow-condensed)", fontWeight: 600, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}>
                View Full Standings →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
      <h2 style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800, fontSize: 22, letterSpacing: "0.04em", textTransform: "uppercase", borderLeft: "3px solid #FEBD02", paddingLeft: 12, margin: 0 }}>
        {title}
      </h2>
      <Link href={href} style={{ color: "#FEBD02", fontFamily: "var(--font-barlow-condensed)", fontWeight: 600, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}>
        View All →
      </Link>
    </div>
  );
}

function NewsCard({ article }: { article: any }) {
  return (
    <Link href={`/news/${article.slug}`} style={{ background: "#0F1122", border: "1px solid #161828", overflow: "hidden", textDecoration: "none", display: "block" }}>
      <div style={{ position: "relative", height: 200, background: "#080912", overflow: "hidden" }}>
        {article.imageUrl ? (
          <Image src={article.imageUrl} alt={article.title} fill style={{ objectFit: "cover" }} unoptimized />
        ) : (
          <div style={{ background: "linear-gradient(135deg, #FEBD0222, #080912)", height: "100%" }} />
        )}
      </div>
      <div style={{ padding: "20px 20px 24px" }}>
        <div style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, fontSize: 18, lineHeight: 1.2, marginBottom: 10, color: "#fff" }} dangerouslySetInnerHTML={{ __html: article.title }} />
        <p style={{ color: "#8B8FA8", fontSize: 13, lineHeight: 1.5, margin: 0 }}>{article.excerpt?.slice(0, 100)}{article.excerpt?.length > 100 ? "…" : ""}</p>
      </div>
    </Link>
  );
}

function CompactNewsRow({ article }: { article: any }) {
  return (
    <Link href={`/news/${article.slug}`} style={{ display: "flex", gap: 16, padding: "16px 0", borderBottom: "1px solid #161828", textDecoration: "none", alignItems: "center" }}>
      <div style={{ width: 80, height: 56, flexShrink: 0, position: "relative", background: "#0F1122", overflow: "hidden" }}>
        {article.imageUrl ? (
          <Image src={article.imageUrl} alt={article.title} fill style={{ objectFit: "cover" }} unoptimized />
        ) : (
          <div style={{ background: "#161828", height: "100%" }} />
        )}
      </div>
      <div style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 600, fontSize: 15, color: "#fff", lineHeight: 1.3 }} dangerouslySetInnerHTML={{ __html: article.title }} />
    </Link>
  );
}
