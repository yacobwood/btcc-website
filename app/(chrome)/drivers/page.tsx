import Image from "next/image";
import Link from "next/link";
import { getDrivers, driverSlug } from "@/lib/data";
import type { Metadata } from "next";
import type { Driver } from "@/types";

export const metadata: Metadata = {
  title: "Drivers | BTCC",
  description: "Meet the 2026 BTCC driver lineup. Profiles, stats, and career history for every competitor.",
};

export default function DriversPage() {
  const drivers = getDrivers().sort((a, b) => a.number - b.number);

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
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
          2026 Drivers
        </h1>
        <p style={{ color: "#8B8FA8", fontSize: 15, marginTop: 12, paddingLeft: 20 }}>
          {drivers.length} drivers competing in the 2026 season
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 20,
        }}
      >
        {drivers.map((driver) => (
          <DriverCard key={driver.number} driver={driver} />
        ))}
      </div>
    </div>
  );
}

function DriverCard({ driver }: { driver: Driver }) {
  const slug = driverSlug(driver.name);
  return (
    <Link
      href={`/drivers/${slug}`}
      style={{
        background: "#0F1122",
        border: "1px solid #161828",
        overflow: "hidden",
        textDecoration: "none",
        display: "block",
        position: "relative",
      }}
    >
      {/* Car number accent */}
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          fontFamily: "var(--font-barlow-condensed)",
          fontWeight: 800,
          fontSize: 32,
          color: "#FEBD02",
          lineHeight: 1,
          opacity: 0.8,
          zIndex: 2,
        }}
      >
        {driver.number}
      </div>

      {/* Driver image */}
      <div style={{ height: 220, position: "relative", background: "#080912", overflow: "hidden" }}>
        {driver.imageUrl ? (
          <Image
            src={driver.imageUrl}
            alt={driver.name}
            fill
            style={{ objectFit: "cover", objectPosition: "top" }}
            unoptimized
          />
        ) : (
          <div
            style={{
              background: "linear-gradient(180deg, #161828 0%, #080912 100%)",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800, fontSize: 48, color: "#2A2D44" }}>
              {driver.number}
            </span>
          </div>
        )}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(to top, #0F1122, transparent)" }} />
      </div>

      <div style={{ padding: "16px 18px 20px" }}>
        <div
          style={{
            fontFamily: "var(--font-barlow-condensed)",
            fontWeight: 800,
            fontSize: 20,
            color: "#fff",
            letterSpacing: "0.02em",
            marginBottom: 4,
          }}
        >
          {driver.name}
        </div>
        <div style={{ color: "#8B8FA8", fontSize: 13, marginBottom: 8 }}>{driver.team}</div>
        <div
          style={{
            display: "inline-block",
            background: "#161828",
            color: "#8B8FA8",
            fontSize: 12,
            padding: "3px 8px",
            fontFamily: "var(--font-barlow-condensed)",
            fontWeight: 600,
          }}
        >
          {driver.car}
        </div>
      </div>
    </Link>
  );
}
