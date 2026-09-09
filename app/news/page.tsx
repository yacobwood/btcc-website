import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getHubNews } from "@/lib/data";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "News",
  description: "The latest BTCC news, race weekend reports and season analysis.",
};

export default async function NewsIndexPage() {
  const posts = await getHubNews();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <SectionHeading eyebrow="Flying Lap" title="News" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/news/${post.id}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-btcc-yellow"
          >
            {post.imageUrl && (
              <div className="relative h-44 w-full overflow-hidden bg-card">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex flex-1 flex-col p-5">
              {post.category && (
                <p className="text-xs font-bold uppercase tracking-widest text-btcc-yellow">
                  {post.category}
                </p>
              )}
              <p className="mt-1 font-display text-xl font-bold leading-snug text-foreground group-hover:text-btcc-yellow">
                {post.title}
              </p>
              <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted">
                {post.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
