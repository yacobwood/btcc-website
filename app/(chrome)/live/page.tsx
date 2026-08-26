import Link from "next/link";
import { getCalendar, formatDateRange } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Watch Live | BTCC",
  description: "Watch the British Touring Car Championship live — ITV4, ITVX, TikTok, YouTube and more.",
};

export default function LivePage() {
  const calendar = getCalendar();
  const today = new Date();
  const nextRound = calendar.find((r) => new Date(r.endDate) >= today);
  const isLiveWeekend = nextRound
    ? new Date(nextRound.startDate) <= today && new Date(nextRound.endDate) >= today
    : false;

  const streams = [
    {
      name: "ITV4 / ITVX",
      description: "Every race live and free on ITV4 in the UK. Also available to stream on ITVX with full coverage including qualifying and race analysis.",
      badge: "UK",
      badgeColor: "#FEBD02",
      link: "https://www.itv.com/watch/itvx",
      icon: "📺",
      detail: "All 30 races · Free-to-air · UK only",
    },
    {
      name: "TikTok LIVE",
      description: "Watch every BTCC race weekend live worldwide on TikTok. Follow @BTCC for live race streams available to fans everywhere outside the UK.",
      badge: "Worldwide",
      badgeColor: "#FEBD02",
      link: "https://www.tiktok.com/@btcc",
      icon: "📱",
      detail: "All races · Free · Worldwide",
    },
    {
      name: "YouTube",
      description: "Qualifying sessions and supporting races are streamed free on the official BTCC YouTube channel. Also includes highlights, interviews and behind-the-scenes content.",
      badge: "Worldwide",
      badgeColor: "#8B8FA8",
      link: "https://www.youtube.com/@BTCC",
      icon: "▶",
      detail: "Qualifying & extras · Free · Worldwide",
    },
    {
      name: "Live Timing",
      description: "Follow the action with real-time lap-by-lap timing data, live positions, gap charts and sector times during every session.",
      badge: "Real-time",
      badgeColor: "#8B8FA8",
      link: "https://www.btcc.net/live/timing",
      icon: "⏱",
      detail: "All sessions · Free · Worldwide",
    },
    {
      name: "Live Audio Commentary",
      description: "Listen to expert live commentary for every race session, available free through the BTCC website during race weekends.",
      badge: "Audio",
      badgeColor: "#8B8FA8",
      link: "https://www.btcc.net/live/audio",
      icon: "🎙",
      detail: "All sessions · Free · Worldwide",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <div
        style={{
          background: isLiveWeekend ? "#FEBD0211" : "#0F1122",
          borderBottom: `1px solid ${isLiveWeekend ? "#FEBD0233" : "#161828"}`,
          padding: "64px 24px",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {isLiveWeekend && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FEBD02" }} />
              <span
                style={{
                  fontFamily: "var(--font-barlow-condensed)",
                  fontWeight: 800,
                  fontSize: 14,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#FEBD02",
                }}
              >
                Race Weekend in Progress
              </span>
            </div>
          )}
          <h1
            style={{
              fontFamily: "var(--font-barlow-condensed)",
              fontWeight: 800,
              fontSize: "clamp(32px, 5vw, 56px)",
              letterSpacing: "0.02em",
              lineHeight: 1.05,
              margin: 0,
              marginBottom: 16,
            }}
          >
            Watch the BTCC
            <br />
            <span style={{ color: "#FEBD02" }}>Live &amp; Free</span>
          </h1>
          <p style={{ color: "#8B8FA8", fontSize: 16, maxWidth: 540, lineHeight: 1.6, margin: 0 }}>
            Every race free to watch in the UK on ITV4, and live worldwide on TikTok. Real-time timing and audio commentary available for every session.
          </p>

          {nextRound && !isLiveWeekend && (
            <div style={{ marginTop: 32, display: "inline-flex", alignItems: "center", gap: 16, background: "#080912", border: "1px solid #161828", padding: "16px 24px" }}>
              <div>
                <div style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FEBD02", marginBottom: 4 }}>
                  Next Race Weekend
                </div>
                <div style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800, fontSize: 20, color: "#fff" }}>
                  Round {nextRound.round} · {nextRound.venue}
                </div>
                <div style={{ color: "#8B8FA8", fontSize: 14, marginTop: 2 }}>
                  {formatDateRange(nextRound.startDate, nextRound.endDate)}
                </div>
              </div>
              <Link
                href="/calendar"
                style={{
                  color: "#FEBD02",
                  fontFamily: "var(--font-barlow-condensed)",
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  flexShrink: 0,
                }}
              >
                Full Calendar →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Streaming options */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 24px" }}>
        <h2
          style={{
            fontFamily: "var(--font-barlow-condensed)",
            fontWeight: 800,
            fontSize: 22,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            borderLeft: "3px solid #FEBD02",
            paddingLeft: 12,
            marginBottom: 32,
          }}
        >
          How to Watch
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 2 }}>
          {streams.map((s) => (
            <a
              key={s.name}
              href={s.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#0F1122",
                border: "1px solid #161828",
                padding: "28px 28px",
                textDecoration: "none",
                display: "block",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 28 }}>{s.icon}</span>
                  <div
                    style={{
                      fontFamily: "var(--font-barlow-condensed)",
                      fontWeight: 800,
                      fontSize: 22,
                      color: "#fff",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {s.name}
                  </div>
                </div>
                <span
                  style={{
                    background: s.badgeColor === "#FEBD02" ? "#FEBD02" : "#161828",
                    color: s.badgeColor === "#FEBD02" ? "#080912" : "#8B8FA8",
                    fontFamily: "var(--font-barlow-condensed)",
                    fontWeight: 700,
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "3px 8px",
                    flexShrink: 0,
                  }}
                >
                  {s.badge}
                </span>
              </div>
              <p style={{ color: "#8B8FA8", fontSize: 14, lineHeight: 1.6, margin: "0 0 16px" }}>
                {s.description}
              </p>
              <div style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 600, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "#FEBD02" }}>
                {s.detail}
              </div>
            </a>
          ))}
        </div>

        {/* TV Schedule note */}
        <div
          style={{
            marginTop: 48,
            background: "#0F1122",
            border: "1px solid #161828",
            padding: "28px 32px",
            display: "flex",
            gap: 24,
            alignItems: "flex-start",
          }}
        >
          <span style={{ fontSize: 32, flexShrink: 0 }}>📅</span>
          <div>
            <div style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800, fontSize: 18, color: "#fff", marginBottom: 8 }}>
              ITV4 Broadcast Schedule
            </div>
            <p style={{ color: "#8B8FA8", fontSize: 14, lineHeight: 1.6, margin: "0 0 12px" }}>
              ITV4 typically broadcasts all three races live on Sundays throughout the BTCC season. Coverage usually begins at 11:00am with qualifying highlights, followed by Races 1 and 2 in the afternoon and Race 3 in early evening. Check the ITV TV guide for exact times each round.
            </p>
            <a
              href="https://www.itv.com/btcc"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#FEBD02", fontSize: 13, fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}
            >
              ITV BTCC Hub →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
