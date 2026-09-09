import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getHubNews, getHubNewsPost } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getHubNewsPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.imageUrl ? [post.imageUrl] : undefined,
    },
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getHubNewsPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {post.category && (
        <p className="text-xs font-bold uppercase tracking-widest text-btcc-yellow">
          {post.category}
        </p>
      )}
      <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
        {post.title}
      </h1>
      {post.pubDate && (
        <p className="mt-3 text-sm text-muted">
          {new Date(post.pubDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      )}
      {post.imageUrl && (
        <div className="relative mt-6 h-72 w-full overflow-hidden rounded-2xl bg-card sm:h-96">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      )}
      <div
        className="article-content mt-8"
        // Trusted source: content authored by this operation's own editorial
        // pipeline (data/hub_news.json), same HTML this exact article renders
        // as inside the app's ArticleScreen WebView.
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}

export async function generateStaticParams() {
  const posts = await getHubNews();
  return posts.map((post) => ({ slug: post.id }));
}
