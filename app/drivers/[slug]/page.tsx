import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDriver, getDrivers } from "@/lib/data";
import { slugify } from "@/lib/slug";
import DriverAvatar from "@/components/DriverAvatar";

const FALLBACK_DESCRIPTION = (name: string, team: string) =>
  `${name} - ${team}, British Touring Car Championship.`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const driver = await getDriver(slug);
  if (!driver) return {};
  return {
    title: driver.name,
    description: driver.bio
      ? driver.bio.slice(0, 155)
      : FALLBACK_DESCRIPTION(driver.name, driver.team),
    openGraph: driver.imageUrl ? { images: [driver.imageUrl] } : undefined,
  };
}

export default async function DriverPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const driver = await getDriver(slug);
  if (!driver) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: driver.name,
    nationality: driver.nationality,
    ...(driver.imageUrl ? { image: driver.imageUrl } : {}),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
        <div className="rounded-full border-4 border-btcc-yellow">
          <DriverAvatar imageUrl={driver.imageUrl} name={driver.name} number={driver.number} size={128} />
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-btcc-yellow">
            #{driver.number} - {driver.nationality}
          </p>
          <h1 className="font-display text-4xl font-extrabold text-foreground">
            {driver.name}
          </h1>
          <Link
            href={`/teams/${slugify(driver.team)}`}
            className="mt-1 inline-block text-muted hover:text-foreground"
          >
            {driver.team}
          </Link>
          <p className="mt-1 text-sm text-muted">{driver.car}</p>
          {driver.reserveOnly && (
            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-muted">
              Reserve driver
            </p>
          )}
        </div>
      </div>

      <div className="mt-10 space-y-4 whitespace-pre-line leading-relaxed text-muted">
        {driver.bio ?? FALLBACK_DESCRIPTION(driver.name, driver.team)}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const drivers = await getDrivers();
  return drivers.map((d) => ({ slug: slugify(d.name) }));
}
