import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTrack, getTrackEntries } from "@/lib/data";
import SectionHeading from "@/components/SectionHeading";
import CircuitMap from "@/components/CircuitMap";
import Panel from "@/components/Panel";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getTrack(slug);
  if (!entry) return {};
  return {
    title: entry.venue,
    description: entry.track.about.slice(0, 155),
  };
}

export default async function CircuitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getTrack(slug);
  if (!entry) notFound();
  const { venue, track } = entry;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: venue,
    address: { "@type": "PostalAddress", addressLocality: track.location, addressCountry: track.country },
    geo: { "@type": "GeoCoordinates", latitude: track.lat, longitude: track.lng },
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SectionHeading eyebrow={track.location} title={venue} />

      <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-card sm:h-72">
        <Image src={track.imageUrl} alt={venue} fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" priority />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        <Panel>
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Length</p>
          <p className="mt-1 font-display text-2xl font-extrabold text-foreground">
            {track.lengthMiles}
          </p>
          <p className="text-sm text-muted">{track.lengthKm}</p>
        </Panel>
        <Panel>
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Corners</p>
          <p className="mt-1 font-display text-2xl font-extrabold text-foreground">
            {track.corners}
          </p>
          <p className="text-sm text-muted">
            {track.cornersLeft} left / {track.cornersRight} right
          </p>
        </Panel>
        <Panel>
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Location</p>
          <p className="mt-1 font-display text-lg font-bold text-foreground">
            {track.location}
          </p>
          <p className="text-sm text-muted">{track.country}</p>
        </Panel>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
        <CircuitMap slug={slug} venue={venue} />
      </div>

      <div className="mt-8 space-y-5">
        <p className="leading-relaxed text-muted">{track.about}</p>
        <blockquote className="rounded-xl border-l-4 border-btcc-yellow bg-card px-5 py-4 italic text-muted">
          {track.btccFact}
        </blockquote>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const entries = await getTrackEntries();
  return entries.map((e) => ({ slug: e.slug }));
}

export const dynamicParams = false;
