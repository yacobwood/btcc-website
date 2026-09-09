import Link from "next/link";
import type { Metadata } from "next";
import { getDrivers, CURRENT_SEASON } from "@/lib/data";
import { slugify } from "@/lib/slug";
import SectionHeading from "@/components/SectionHeading";
import DriverAvatar from "@/components/DriverAvatar";

export const metadata: Metadata = {
  title: "Drivers",
  description: `The full ${CURRENT_SEASON} BTCC grid.`,
};

export default async function DriversIndexPage() {
  const drivers = await getDrivers();
  // false = departed mid-season; null/undefined = still racing. Order
  // active drivers first, same distinction the app makes on DriversScreen.
  const sorted = [...drivers].sort((a, b) =>
    Number(a.currentlyRacing === false) - Number(b.currentlyRacing === false)
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <SectionHeading eyebrow={`${CURRENT_SEASON} Season`} title="Drivers" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((driver) => (
          <Link
            key={driver.name}
            href={`/drivers/${slugify(driver.name)}`}
            className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-btcc-yellow"
          >
            <DriverAvatar imageUrl={driver.imageUrl} name={driver.name} number={driver.number} size={64} />
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-bold text-foreground group-hover:text-btcc-yellow">
                #{driver.number} {driver.name}
              </p>
              <p className="truncate text-sm text-muted">{driver.team}</p>
              {driver.currentlyRacing === false && (
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  No longer racing
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
