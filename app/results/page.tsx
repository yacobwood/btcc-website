import Link from "next/link";
import { getStandings, getTeamStandings, driverSlug } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Results & Standings | BTCC",
  description: "2026 BTCC driver and team championship standings.",
};

export default function ResultsPage() {
  const drivers = getStandings();
  const teams = getTeamStandings();

  const maxPoints = drivers[0]?.points ?? 1;

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
          2026 Standings
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 40, alignItems: "start" }}>
        {/* Drivers standings */}
        <section>
          <h2 style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800, fontSize: 18, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16, color: "#8B8FA8" }}>
            Driver Championship
          </h2>
          <div style={{ background: "#0F1122", border: "1px solid #161828", overflow: "hidden" }}>
            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "48px 40px 1fr 56px 56px 56px",
                gap: 8,
                padding: "10px 16px",
                background: "#161828",
              }}
            >
              {["Pos", "#", "Driver", "Cls", "W", "Pts"].map((h) => (
                <span
                  key={h}
                  style={{
                    fontFamily: "var(--font-barlow-condensed)",
                    fontWeight: 700,
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#8B8FA8",
                    textAlign: h === "W" || h === "Pts" || h === "Cls" ? "center" : "left",
                  }}
                >
                  {h}
                </span>
              ))}
            </div>

            {drivers.map((d, i) => {
              const barWidth = `${(d.points / maxPoints) * 100}%`;
              const isTop3 = d.pos <= 3;
              return (
                <div
                  key={d.pos}
                  style={{
                    position: "relative",
                    borderTop: "1px solid #161828",
                    overflow: "hidden",
                  }}
                >
                  {/* Points bar background */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "100%",
                      width: barWidth,
                      background: isTop3 ? "#FEBD020A" : "#FFFFFF05",
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "48px 40px 1fr 56px 56px 56px",
                      gap: 8,
                      padding: "12px 16px",
                      position: "relative",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-barlow-condensed)",
                        fontWeight: 800,
                        fontSize: isTop3 ? 22 : 18,
                        color: d.pos === 1 ? "#FEBD02" : d.pos <= 3 ? "#fff" : "#6B7280",
                      }}
                    >
                      {d.pos}
                    </span>
                    <span style={{ color: "#8B8FA8", fontSize: 13, fontWeight: 600 }}>#{d.car}</span>
                    <Link
                      href={`/drivers/${driverSlug(d.driver)}`}
                      style={{
                        fontFamily: "var(--font-barlow-condensed)",
                        fontWeight: isTop3 ? 800 : 600,
                        fontSize: isTop3 ? 17 : 15,
                        textDecoration: "none",
                        color: "#fff",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {d.driver}
                    </Link>
                    <span
                      style={{
                        textAlign: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        color: d.class === "M" ? "#FEBD02" : "#8B8FA8",
                        background: d.class === "M" ? "#FEBD0211" : "#161828",
                        padding: "2px 6px",
                        borderRadius: 2,
                        fontFamily: "var(--font-barlow-condensed)",
                        letterSpacing: "0.05em",
                        justifySelf: "center",
                      }}
                    >
                      {d.class}
                    </span>
                    <span style={{ textAlign: "center", fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, fontSize: 15, color: d.wins > 0 ? "#FEBD02" : "#8B8FA8" }}>
                      {d.wins}
                    </span>
                    <span
                      style={{
                        textAlign: "right",
                        fontFamily: "var(--font-barlow-condensed)",
                        fontWeight: 800,
                        fontSize: isTop3 ? 20 : 17,
                        color: "#fff",
                      }}
                    >
                      {d.points}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Class legend */}
          <div style={{ display: "flex", gap: 24, marginTop: 16, color: "#8B8FA8", fontSize: 13 }}>
            <span><span style={{ color: "#FEBD02", fontWeight: 700 }}>M</span> = Manufacturer</span>
            <span><span style={{ color: "#8B8FA8", fontWeight: 700 }}>I</span> = Independent</span>
          </div>
        </section>

        {/* Teams standings */}
        <section>
          <h2 style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800, fontSize: 18, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16, color: "#8B8FA8" }}>
            Teams Championship
          </h2>
          <div style={{ background: "#0F1122", border: "1px solid #161828", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 60px", gap: 8, padding: "10px 16px", background: "#161828" }}>
              {["Pos", "Team", "Pts"].map((h) => (
                <span key={h} style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8B8FA8", textAlign: h === "Pts" ? "right" : "left" }}>{h}</span>
              ))}
            </div>
            {teams.map((t, i) => (
              <div key={t.pos} style={{ display: "grid", gridTemplateColumns: "40px 1fr 60px", gap: 8, padding: "14px 16px", borderTop: "1px solid #161828", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800, fontSize: 18, color: t.pos === 1 ? "#FEBD02" : "#6B7280" }}>{t.pos}</span>
                <span style={{ fontSize: 14, color: "#fff", lineHeight: 1.3 }}>{t.team}</span>
                <span style={{ textAlign: "right", fontFamily: "var(--font-barlow-condensed)", fontWeight: 800, fontSize: 18, color: "#fff" }}>{t.points}</span>
              </div>
            ))}
          </div>

          {/* Gap indicator for top 2 */}
          {drivers.length >= 2 && (
            <div
              style={{
                marginTop: 24,
                background: "#0F1122",
                border: "1px solid #161828",
                padding: "20px",
              }}
            >
              <div style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8B8FA8", marginBottom: 12 }}>
                Championship Gap
              </div>
              <div style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800, fontSize: 36, color: "#FEBD02" }}>
                {drivers[0].points - drivers[1].points}
              </div>
              <div style={{ color: "#8B8FA8", fontSize: 13, marginTop: 4 }}>
                points between <Link href={`/drivers/${driverSlug(drivers[0].driver)}`} style={{ color: "#fff", textDecoration: "none" }}>{drivers[0].driver}</Link> and <Link href={`/drivers/${driverSlug(drivers[1].driver)}`} style={{ color: "#fff", textDecoration: "none" }}>{drivers[1].driver}</Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
