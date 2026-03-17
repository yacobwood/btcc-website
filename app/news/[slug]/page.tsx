import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

async function getPost(slug: string) {
  try {
    const res = await fetch(
      `https://www.btcc.net/wp-json/wp/v2/posts?slug=${slug}&_embed=1`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.length) return null;
    const post = data[0];
    return {
      id: post.id,
      slug: post.slug,
      title: post.title?.rendered ?? "",
      content: post.content?.rendered ?? "",
      excerpt: post.excerpt?.rendered?.replace(/<[^>]+>/g, "").trim() ?? "",
      date: post.date,
      imageUrl: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null,
      categories: post._embedded?.["wp:term"]?.[0]?.map((t: any) => t.name) ?? [],
    };
  } catch {
    return null;
  }
}

async function getRecentPosts(excludeId: number) {
  try {
    const res = await fetch(
      `https://www.btcc.net/wp-json/wp/v2/posts?per_page=4&_embed=1`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data
      .filter((p: any) => p.id !== excludeId)
      .slice(0, 3)
      .map((post: any) => ({
        id: post.id,
        slug: post.slug,
        title: post.title?.rendered ?? "",
        imageUrl: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null,
        date: post.date,
      }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article Not Found | BTCC" };
  return {
    title: `${post.title.replace(/<[^>]+>/g, "")} | BTCC News`,
    description: post.excerpt,
    openGraph: {
      title: post.title.replace(/<[^>]+>/g, ""),
      description: post.excerpt,
      images: post.imageUrl ? [post.imageUrl] : [],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, recent] = await Promise.all([
    getPost(slug),
    getPost(slug).then((p) => p ? getRecentPosts(p.id) : []),
  ]);

  if (!post) notFound();

  const dateStr = new Date(post.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      {/* Hero image */}
      {post.imageUrl && (
        <div style={{ position: "relative", height: 480, background: "#0F1122", overflow: "hidden" }}>
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            style={{ objectFit: "cover", opacity: 0.7 }}
            unoptimized
            priority
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #080912 10%, transparent 70%)" }} />
        </div>
      )}

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 48, alignItems: "start", marginTop: post.imageUrl ? -120 : 48, position: "relative", zIndex: 10 }}>
          {/* Article */}
          <article>
            {/* Breadcrumb */}
            <div style={{ marginBottom: 20 }}>
              <Link
                href="/news"
                style={{
                  color: "#8B8FA8",
                  fontSize: 13,
                  textDecoration: "none",
                  fontFamily: "var(--font-barlow-condensed)",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                ← News
              </Link>
            </div>

            {/* Categories */}
            {post.categories.length > 0 && (
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                {post.categories.map((cat: string) => (
                  <span
                    key={cat}
                    style={{
                      background: "#FEBD02",
                      color: "#080912",
                      fontFamily: "var(--font-barlow-condensed)",
                      fontWeight: 700,
                      fontSize: 10,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      padding: "3px 8px",
                    }}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1
              style={{
                fontFamily: "var(--font-barlow-condensed)",
                fontWeight: 800,
                fontSize: "clamp(24px, 4vw, 42px)",
                lineHeight: 1.1,
                letterSpacing: "0.02em",
                marginBottom: 16,
                color: "#fff",
              }}
              dangerouslySetInnerHTML={{ __html: post.title }}
            />

            {/* Date */}
            <div style={{ color: "#8B8FA8", fontSize: 14, marginBottom: 32, paddingBottom: 32, borderBottom: "1px solid #161828" }}>
              {dateStr}
            </div>

            {/* Content */}
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* Sidebar */}
          <aside style={{ paddingTop: post.imageUrl ? 160 : 0 }}>
            {recent.length > 0 && (
              <div style={{ background: "#0F1122", border: "1px solid #161828", overflow: "hidden" }}>
                <div
                  style={{
                    padding: "14px 20px",
                    background: "#161828",
                    fontFamily: "var(--font-barlow-condensed)",
                    fontWeight: 800,
                    fontSize: 13,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#FEBD02",
                  }}
                >
                  More News
                </div>
                {recent.map((r: any, i: number) => (
                  <Link
                    key={r.id}
                    href={`/news/${r.slug}`}
                    style={{
                      display: "flex",
                      gap: 14,
                      padding: "14px 16px",
                      borderTop: i > 0 ? "1px solid #161828" : "none",
                      textDecoration: "none",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ width: 72, height: 50, flexShrink: 0, position: "relative", background: "#080912", overflow: "hidden" }}>
                      {r.imageUrl ? (
                        <Image src={r.imageUrl} alt={r.title} fill style={{ objectFit: "cover" }} unoptimized />
                      ) : (
                        <div style={{ background: "#161828", height: "100%" }} />
                      )}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-barlow-condensed)",
                        fontWeight: 600,
                        fontSize: 14,
                        color: "#fff",
                        lineHeight: 1.3,
                      }}
                      dangerouslySetInnerHTML={{ __html: r.title }}
                    />
                  </Link>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>

      <div style={{ height: 80 }} />
    </div>
  );
}
