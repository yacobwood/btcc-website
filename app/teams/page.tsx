import Link from "next/link";
import Image from "next/image";
import { getDrivers, getTeamStandings, driverSlug } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teams | BTCC",
  description: "The 2026 BTCC team lineup — full driver rosters, team standings and championship points.",
};

export default function TeamsPage() {
  const allDrivers = getDrivers();
  const teamStandings = getTeamStandings();

  // Build a map of team name → drivers
  const teamDriverMap: Record<string, typeof allDrivers> = {};
  for (const driver of allDrivers) {
    if (!teamDriverMap[driver.team]) teamDriverMap[driver.team] = [];
    teamDriverMap[driver.team].push(driver);
  }

  // Merge standings with driver data
  const teams = teamStandings.map((t) => ({
    ...t,
    drivers: teamDriverMap[t.team] ?? [],
  }));

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
          2026 Teams
        </h1>
        <p style={{ color: "#8B8FA8", fontSize: 15, marginTop: 12, paddingLeft: 20 }}>
          {teams.length} teams competing in the 2026 season
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {teams.map((team) => (
          <div
            key={team.team}
            style={{
              background: "#0F1122",
              border: "1px solid #161828",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "64px 1fr auto", alignItems: "center", gap: 0 }}>
              {/* Position */}
              <div
                style={{
                  background: team.pos === 1 ? "#FEBD02" : "#161828",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "stretch",
                  minHeight: 80,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-barlow-condensed)",
                    fontWeight: 800,
                    fontSize: 28,
                    color: team.pos === 1 ? "#080912" : "#4B5563",
                  }}
                >
                  {team.pos}
                </span>
              </div>

              {/* Team info + drivers */}
              <div style={{ padding: "20px 28px" }}>
                <div
                  style={{
                    fontFamily: "var(--font-barlow-condensed)",
                    fontWeight: 800,
                    fontSize: 20,
                    letterSpacing: "0.02em",
                    color: "#fff",
                    marginBottom: 14,
                  }}
                >
                  {team.team}
                </div>

                {/* Driver roster */}
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {team.drivers.length > 0 ? (
                    team.drivers.map((driver) => (
                      <Link
                        key={driver.number}
                        href={`/drivers/${driverSlug(driver.name)}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          background: "#080912",
                          border: "1px solid #161828",
                          padding: "8px 12px 8px 8px",
                          textDecoration: "none",
                        }}
                      >
                        <div style={{ width: 36, height: 44, position: "relative", flexShrink: 0, background: "#161828", overflow: "hidden" }}>
                          {driver.imageUrl ? (
                            <Image
                              src={driver.imageUrl}
                              alt={driver.name}
                              fill
                              style={{ objectFit: "cover", objectPosition: "top" }}
                              unoptimized
                            />
                          ) : null}
                        </div>
                        <div>
                          <div
                            style={{
                              fontFamily: "var(--font-barlow-condensed)",
                              fontWeight: 700,
                              fontSize: 14,
                              color: "#fff",
                              lineHeight: 1.2,
                            }}
                          >
                            {driver.name}
                          </div>
                          <div style={{ color: "#FEBD02", fontSize: 12, fontFamily: "var(--font-barlow-condensed)", fontWeight: 700 }}>
                            #{driver.number}
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <span style={{ color: "#4B5563", fontSize: 13 }}>Driver roster TBC</span>
                  )}
                </div>

                {/* Car model */}
                {team.drivers[0]?.car && (
                  <div style={{ marginTop: 12, color: "#8B8FA8", fontSize: 13 }}>
                    {team.drivers[0].car}
                  </div>
                )}
              </div>

              {/* Points */}
              <div style={{ padding: "20px 28px", textAlign: "right", flexShrink: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-barlow-condensed)",
                    fontWeight: 800,
                    fontSize: 36,
                    color: "#fff",
                    lineHeight: 1,
                  }}
                >
                  {team.points}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-barlow-condensed)",
                    fontWeight: 600,
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#8B8FA8",
                    marginTop: 4,
                  }}
                >
                  Points
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
