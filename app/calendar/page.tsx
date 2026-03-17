import Image from "next/image";
import { getCalendar, formatDateRange } from "@/lib/data";
import type { Metadata } from "next";
import type { Round } from "@/types";

export const metadata: Metadata = {
  title: "Race Calendar | BTCC",
  description: "The 2026 BTCC race calendar — 10 rounds across Britain, April to October.",
};

export default function CalendarPage() {
  const rounds = getCalendar();
  const today = new Date();

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
          2026 Race Calendar
        </h1>
        <p style={{ color: "#8B8FA8", fontSize: 15, marginTop: 12, paddingLeft: 20 }}>
          {rounds.length} rounds · April – October 2026
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {rounds.map((round) => {
          const isPast = new Date(round.endDate) < today;
          const isNext = !isPast && rounds.find((r) => new Date(r.endDate) >= today)?.round === round.round;
          return <RoundRow key={round.round} round={round} isPast={isPast} isNext={isNext} />;
        })}
      </div>
    </div>
  );
}

function RoundRow({ round, isPast, isNext }: { round: Round; isPast: boolean; isNext: boolean }) {
  return (
    <div
      style={{
        background: isNext ? "#0F1122" : "#0F1114",
        border: `1px solid ${isNext ? "#FEBD0233" : "#161828"}`,
        overflow: "hidden",
        opacity: isPast ? 0.6 : 1,
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", minHeight: 200 }}>
        {/* Image */}
        <div style={{ position: "relative", background: "#080912" }}>
          {round.imageUrl ? (
            <Image src={round.imageUrl} alt={round.venue} fill style={{ objectFit: "cover", opacity: isPast ? 0.5 : 0.85 }} unoptimized />
          ) : (
            <div style={{ background: "#0F1122", height: "100%" }} />
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 60%, #0F1114)" }} />
          {isNext && (
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                background: "#FEBD02",
                color: "#080912",
                fontFamily: "var(--font-barlow-condensed)",
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "4px 10px",
              }}
            >
              Next Race
            </div>
          )}
          {isPast && (
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                background: "#161828",
                color: "#8B8FA8",
                fontFamily: "var(--font-barlow-condensed)",
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "4px 10px",
              }}
            >
              Completed
            </div>
          )}
        </div>

        {/* Details */}
        <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-barlow-condensed)",
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: isNext ? "#FEBD02" : "#8B8FA8",
                  marginBottom: 6,
                }}
              >
                Round {round.round} · {round.country}
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-barlow-condensed)",
                  fontWeight: 800,
                  fontSize: 28,
                  letterSpacing: "0.02em",
                  margin: 0,
                  marginBottom: 4,
                }}
              >
                {round.venue}
              </h2>
              <div style={{ color: "#8B8FA8", fontSize: 14, marginBottom: 16 }}>
                {formatDateRange(round.startDate, round.endDate)} · {round.location}
              </div>
            </div>

            {/* Circuit stats */}
            <div style={{ display: "flex", gap: 24, flexShrink: 0 }}>
              <Stat label="Length" value={round.lengthMiles} />
              <Stat label="Corners" value={String(round.corners)} />
              <Stat label="First BTCC" value={String(round.firstBtccYear)} />
            </div>
          </div>

          <p style={{ color: "#8B8FA8", fontSize: 14, lineHeight: 1.6, marginBottom: 16, maxWidth: 600 }}>
            {round.about.slice(0, 200)}
            {round.about.length > 200 ? "…" : ""}
          </p>

          {/* Records */}
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8B8FA8", marginBottom: 3 }}>
                Qualifying Record
              </div>
              <div style={{ fontSize: 13, color: "#D1D5DB" }}>
                {round.qualifyingRecord.driver} · {round.qualifyingRecord.time} · {round.qualifyingRecord.speed} ({round.qualifyingRecord.year})
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8B8FA8", marginBottom: 3 }}>
                Race Record
              </div>
              <div style={{ fontSize: 13, color: "#D1D5DB" }}>
                {round.raceRecord.driver} · {round.raceRecord.time} · {round.raceRecord.speed} ({round.raceRecord.year})
              </div>
            </div>
          </div>

          {/* BTCC Fact */}
          <div
            style={{
              marginTop: 16,
              padding: "12px 16px",
              background: "#FEBD020A",
              borderLeft: "3px solid #FEBD02",
            }}
          >
            <span style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#FEBD02", marginRight: 8 }}>
              BTCC Fact
            </span>
            <span style={{ color: "#8B8FA8", fontSize: 13 }}>{round.btccFact}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800, fontSize: 22, color: "#fff" }}>{value}</div>
      <div style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8B8FA8", marginTop: 2 }}>{label}</div>
    </div>
  );
}
