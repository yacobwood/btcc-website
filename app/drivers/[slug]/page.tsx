import { getDrivers, getDriver, driverSlug } from "@/lib/data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DriverProfileView from "@/components/driver/DriverProfileView";
import calendarRaw from "@/data/calendar.json";

export async function generateStaticParams() {
  return getDrivers().map((d) => ({ slug: driverSlug(d.name) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const driver = getDriver(slug);
  if (!driver) return { title: "Driver Not Found | BTCC" };
  return {
    title: `${driver.name} | BTCC Drivers`,
    description: driver.bio,
  };
}

export default async function DriverPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const driver = getDriver(slug);
  if (!driver) notFound();

  return <DriverProfileView driver={driver} currentSeason={calendarRaw.season} />;
}
