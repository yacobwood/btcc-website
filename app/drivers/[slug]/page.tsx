import Image from "next/image";
import Link from "next/link";
import { getDrivers, getDriver, driverSlug } from "@/lib/data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

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

  const age = driver.dateOfBirth
    ? Math.floor((Date.now() - new Date(driver.dateOfBirth).getTime()) / (365.25 * 24 * 3600 * 1000))
    : null;

  const latestSeason = driver.history?.[0];

  return (
    <div>
      {/* Hero banner */}
      <div
        style={{
          background: "#0F1122",
          borderBottom: "1px solid #161828",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Red stripe */}
        <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: "#FEBD02" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px", display: "flex", gap: 48, alignItems: "flex-start" }}>
          {/* Photo */}
          <div
            style={{
              width: 200,
              height: 240,
              flexShrink: 0,
              position: "relative",
              background: "#080912",
              overflow: "hidden",
            }}
          >
            {driver.imageUrl ? (
              <Image
                src={driver.imageUrl}
                alt={driver.name}
                fill
                style={{ objectFit: "cover", objectPosition: "top" }}
                unoptimized
                priority
              />
            ) : (
              <div style={{ background: "#161828", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800, fontSize: 64, color: "#2A2D44" }}>{driver.number}</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <Link href="/drivers" style={{ color: "#8B8FA8", fontSize: 13, textDecoration: "none", fontFamily: "var(--font-barlow-condensed)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              ← All Drivers
            </Link>
            <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginTop: 12, marginBottom: 4 }}>
              <span
                style={{
                  fontFamily: "var(--font-barlow-condensed)",
                  fontWeight: 800,
                  fontSize: 64,
                  color: "#FEBD02",
                  lineHeight: 1,
                }}
              >
                {driver.number}
              </span>
              <h1
                style={{
                  fontFamily: "var(--font-barlow-condensed)",
                  fontWeight: 800,
                  fontSize: 40,
                  letterSpacing: "0.02em",
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                {driver.name}
              </h1>
            </div>
            <div style={{ color: "#8B8FA8", fontSize: 15, marginBottom: 20 }}>{driver.team} · {driver.car}</div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
              {[
                { label: "Nationality", value: driver.nationality },
                age ? { label: "Age", value: String(age) } : null,
                driver.birthplace ? { label: "Birthplace", value: driver.birthplace } : null,
                latestSeason ? { label: `${latestSeason.year} Points`, value: String(latestSeason.points) } : null,
                latestSeason ? { label: `${latestSeason.year} Wins`, value: String(latestSeason.wins) } : null,
                latestSeason ? { label: `${latestSeason.year} Position`, value: `P${latestSeason.pos}` } : null,
              ].filter(Boolean).map((stat: any) => (
                <div key={stat.label}>
                  <div style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8B8FA8", marginBottom: 4 }}>
                    {stat.label}
                  </div>
                  <div style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800, fontSize: 22, color: "#fff" }}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px", display: "grid", gridTemplateColumns: "1fr 340px", gap: 48 }}>
        {/* Main */}
        <div>
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800, fontSize: 20, letterSpacing: "0.04em", textTransform: "uppercase", borderLeft: "3px solid #FEBD02", paddingLeft: 12, marginBottom: 20 }}>
              About
            </h2>
            <p style={{ color: "#D1D5DB", fontSize: 16, lineHeight: 1.7 }}>{driver.bio}</p>
          </section>

          {driver.history?.length > 0 && (
            <section>
              <h2 style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800, fontSize: 20, letterSpacing: "0.04em", textTransform: "uppercase", borderLeft: "3px solid #FEBD02", paddingLeft: 12, marginBottom: 20 }}>
                Career History
              </h2>
              <div style={{ background: "#0F1122", border: "1px solid #161828", overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr 70px 70px 60px", gap: 12, padding: "10px 20px", background: "#161828" }}>
                  {["Year", "Team", "Car", "Pos", "Points", "Wins"].map((h) => (
                    <span key={h} style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8B8FA8" }}>{h}</span>
                  ))}
                </div>
                {driver.history.map((h, i) => (
                  <div key={h.year} style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr 70px 70px 60px", gap: 12, padding: "14px 20px", borderTop: "1px solid #161828", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, fontSize: 15, color: i === 0 ? "#FEBD02" : "#fff" }}>{h.year}</span>
                    <span style={{ fontSize: 14, color: "#D1D5DB" }}>{h.team}</span>
                    <span style={{ fontSize: 13, color: "#8B8FA8" }}>{h.car}</span>
                    <span style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, fontSize: 16, color: "#fff", textAlign: "center" }}>P{h.pos}</span>
                    <span style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, fontSize: 16, color: "#fff", textAlign: "center" }}>{h.points}</span>
                    <span style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, fontSize: 16, color: h.wins > 0 ? "#FEBD02" : "#8B8FA8", textAlign: "center" }}>{h.wins}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div style={{ background: "#0F1122", border: "1px solid #161828", padding: "24px" }}>
            <h3 style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800, fontSize: 16, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 20, color: "#FEBD02" }}>
              Driver Details
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Car Number", value: `#${driver.number}` },
                { label: "Nationality", value: driver.nationality },
                driver.dateOfBirth ? { label: "Date of Birth", value: new Date(driver.dateOfBirth).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) } : null,
                driver.birthplace ? { label: "Birthplace", value: driver.birthplace } : null,
                { label: "Team", value: driver.team },
                { label: "Car", value: driver.car },
              ].filter(Boolean).map((item: any) => (
                <div key={item.label} style={{ borderBottom: "1px solid #161828", paddingBottom: 16 }}>
                  <div style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8B8FA8", marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 15, color: "#fff" }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
