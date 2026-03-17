import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News | BTCC",
  description: "The latest news from the British Touring Car Championship.",
};

async function getNews(page = 1) {
  try {
    const res = await fetch(
      `https://www.btcc.net/wp-json/wp/v2/posts?per_page=20&page=${page}&_embed=1`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return { articles: [], total: 0 };
    const data = await res.json();
    const total = parseInt(res.headers.get("X-WP-TotalPages") ?? "1");
    return {
      articles: data.map((post: any) => ({
        id: post.id,
        slug: post.slug,
        title: post.title?.rendered ?? "",
        excerpt: post.excerpt?.rendered?.replace(/<[^>]+>/g, "").trim() ?? "",
        date: post.date,
        imageUrl: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null,
        categories: post._embedded?.["wp:term"]?.[0]?.map((t: any) => t.name) ?? [],
      })),
      total,
    };
  } catch {
    return { articles: [], total: 0 };
  }
}

export default async function NewsPage() {
  const { articles } = await getNews();
  const hero = articles[0];
  const rest = articles.slice(1);

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
      {/* Page header */}
      <div style={{ marginBottom: 40 }}>
        <h1
          style={{
            fontFamily: "var(--font-barlow-condensed)",
            fontWeight: 800,
            fontSize: 40,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            borderLeft: "4px solid #FEBD02",
            paddingLeft: 16,
            margin: 0,
          }}
        >
          Latest News
        </h1>
      </div>

      {/* Hero article */}
      {hero && (
        <Link
          href={`/news/${hero.slug}`}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0,
            background: "#0F1122",
            border: "1px solid #161828",
            overflow: "hidden",
            textDecoration: "none",
            marginBottom: 40,
          }}
        >
          <div style={{ position: "relative", height: 340, background: "#080912" }}>
            {hero.imageUrl ? (
              <Image src={hero.imageUrl} alt={hero.title} fill style={{ objectFit: "cover" }} unoptimized priority />
            ) : (
              <div style={{ background: "linear-gradient(135deg, #FEBD0222, #080912)", height: "100%" }} />
            )}
          </div>
          <div style={{ padding: "40px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div
              style={{
                display: "inline-block",
                background: "#FEBD02",
                color: "#080912",
                fontFamily: "var(--font-barlow-condensed)",
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "3px 8px",
                marginBottom: 16,
                width: "fit-content",
              }}
            >
              Featured
            </div>
            <h2
              style={{
                fontFamily: "var(--font-barlow-condensed)",
                fontWeight: 800,
                fontSize: 28,
                lineHeight: 1.15,
                color: "#fff",
                marginBottom: 16,
              }}
              dangerouslySetInnerHTML={{ __html: hero.title }}
            />
            <p style={{ color: "#8B8FA8", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
              {hero.excerpt?.slice(0, 160)}{hero.excerpt?.length > 160 ? "…" : ""}
            </p>
            <span
              style={{
                color: "#FEBD02",
                fontFamily: "var(--font-barlow-condensed)",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Read More →
            </span>
          </div>
        </Link>
      )}

      {/* Article grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 24,
        }}
      >
        {rest.map((a: any) => (
          <Link
            key={a.id}
            href={`/news/${a.slug}`}
            style={{
              background: "#0F1122",
              border: "1px solid #161828",
              overflow: "hidden",
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ position: "relative", height: 180, background: "#080912", flexShrink: 0 }}>
              {a.imageUrl ? (
                <Image src={a.imageUrl} alt={a.title} fill style={{ objectFit: "cover" }} unoptimized />
              ) : (
                <div style={{ background: "linear-gradient(135deg, #FEBD0211, #080912)", height: "100%" }} />
              )}
            </div>
            <div style={{ padding: "18px 20px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
              <div
                style={{
                  fontFamily: "var(--font-barlow-condensed)",
                  fontWeight: 700,
                  fontSize: 17,
                  lineHeight: 1.25,
                  color: "#fff",
                  marginBottom: 10,
                }}
                dangerouslySetInnerHTML={{ __html: a.title }}
              />
              <p style={{ color: "#8B8FA8", fontSize: 13, lineHeight: 1.5, margin: 0, flex: 1 }}>
                {a.excerpt?.slice(0, 90)}{a.excerpt?.length > 90 ? "…" : ""}
              </p>
              <div
                style={{
                  marginTop: 14,
                  color: "#FEBD02",
                  fontFamily: "var(--font-barlow-condensed)",
                  fontWeight: 600,
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Read More →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {articles.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0", color: "#4B5563" }}>
          <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 18 }}>No articles available right now.</p>
        </div>
      )}
    </div>
  );
}
