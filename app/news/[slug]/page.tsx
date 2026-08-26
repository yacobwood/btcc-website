import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Colors, SYSTEM_FONT_STACK } from "@/lib/appTheme";
import ArticleEngagement from "@/components/article/ArticleEngagement";

// The article mirror (see project_wp_rest_api_lockdown memory) - btcc.net's
// own wp-json REST API is now rate-limited/blocked in production, exactly
// the problem that forced the app to migrate off it already. This page was
// still pointed at the blocked endpoint until now, silently 404ing on every
// article. GitHub raw content isn't cached by Next's fetch the same way a
// normal API would be, so a short revalidate window keeps this reasonably
// fresh without hammering it on every request.
const MIRROR_BASE = "https://raw.githubusercontent.com/yacobwood/BTCC/main/data/articles";

interface MirrorPost {
  id: string;
  slug: string;
  link: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: { "wp:featuredmedia"?: { source_url: string }[] };
}

async function getIndex(): Promise<Record<string, number>> {
  try {
    const res = await fetch(`${MIRROR_BASE}/index.json`, { next: { revalidate: 300 } });
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

async function getPage(page: number): Promise<MirrorPost[]> {
  try {
    const res = await fetch(`${MIRROR_BASE}/page_${page}.json`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getPost(slug: string) {
  const index = await getIndex();
  const page = index[slug];
  if (!page) return null;
  const posts = await getPage(page);
  const post = posts.find((p) => p.slug === slug);
  if (!post) return null;
  return {
    id: post.id,
    slug: post.slug,
    link: post.link,
    title: post.title?.rendered ?? "",
    content: post.content?.rendered ?? "",
    date: post.date,
    imageUrl: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article Not Found | BTCC" };
  const plainTitle = post.title.replace(/<[^>]+>/g, "");
  return {
    title: `${plainTitle} | BTCC News`,
    openGraph: { title: plainTitle, images: post.imageUrl ? [post.imageUrl] : [] },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const dateStr = new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={{ minHeight: "100vh", background: Colors.background, fontFamily: SYSTEM_FONT_STACK, color: Colors.textPrimary }}>
      {/* Hero - title/date overlaid directly on the image, matching
          ArticleScreen.js's buildHtml() gradient treatment exactly, rather
          than the website's old pattern of a plain image with the title
          placed below it in a separate content column. */}
      <div style={{ position: "relative", height: post.imageUrl ? 320 : "auto", background: Colors.surface, overflow: "hidden" }}>
        {post.imageUrl && (
          <Image src={post.imageUrl} alt="" fill style={{ objectFit: "cover" }} unoptimized priority />
        )}
        <div
          style={{
            position: post.imageUrl ? "absolute" : "static",
            inset: 0,
            background: post.imageUrl
              ? "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 30%, transparent 50%, rgba(8,9,18,0.95) 100%)"
              : "none",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <div style={{ padding: "16px 16px 20px", width: "100%" }}>
            <Link href="/news" style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>
              ← News
            </Link>
            <h1
              style={{ fontSize: "clamp(22px, 5vw, 34px)", fontWeight: 800, lineHeight: 1.15, margin: "10px 0 6px", color: "#fff" }}
              dangerouslySetInnerHTML={{ __html: post.title }}
            />
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{dateStr}</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px 64px" }}>
        <div className="article-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        <p style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${Colors.outline}`, fontSize: 12, color: Colors.textSecondary, wordBreak: "break-all" }}>
          Source: <a href={post.link} style={{ color: Colors.textSecondary, textDecoration: "underline" }}>btcc.net</a>
        </p>
        <ArticleEngagement slug={post.slug} />
      </div>
    </div>
  );
}
