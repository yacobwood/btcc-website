import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getTrackEntries } from "@/lib/data";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Circuits",
  description: "Guides to every circuit on the BTCC calendar - layout, lap records and history.",
};

export default async function CircuitsIndexPage() {
  const entries = await getTrackEntries();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <SectionHeading eyebrow="Guides" title="Circuits" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map(({ slug, venue, track }) => (
          <Link
            key={slug}
            href={`/circuits/${slug}`}
            className="group overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-btcc-yellow"
          >
            <div className="relative h-40 w-full overflow-hidden bg-card">
              <Image
                src={track.imageUrl}
                alt={venue}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <p className="font-display text-xl font-bold text-foreground group-hover:text-btcc-yellow">
                {venue}
              </p>
              <p className="mt-1 text-sm text-muted">
                {track.lengthMiles} - {track.corners} corners
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
