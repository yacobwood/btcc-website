import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | BTCC",
  description: "The story of the British Touring Car Championship — Britain's premier motorsport series since 1958.",
};

const MILESTONES = [
  { year: 1958, event: "The British Saloon Car Championship is founded, racing at Brands Hatch for the first time. The series fields production saloon cars straight from the showroom floor." },
  { year: 1987, event: "The championship is rebranded as the British Touring Car Championship. TOCA Ltd takes over as commercial rights holder, beginning a new era of professional organisation." },
  { year: 1990, event: "A new era of purpose-built Super Touring cars begins. Works teams from Ford, Vauxhall, BMW, Honda, Peugeot and others fight for supremacy, creating the most competitive years in BTCC history." },
  { year: 1995, event: "Peak Super Touring era. Television audiences reach their all-time high. Stars like Clarkson, Rouse, Harvey, Menu and Plato bring the championship mainstream appeal." },
  { year: 2011, event: "The Next Generation Touring Car (NGTC) regulations are introduced. The new technical formula reduces costs and opens the championship to more manufacturers." },
  { year: 2015, event: "Gordon Shedden becomes champion for the second time. Honda dominate, but the independent class continues to grow in strength and significance." },
  { year: 2019, event: "The Kwik Fit British Touring Car Championship is born as Kwik Fit becomes title sponsor — the UK's largest automotive services brand joining forces with the UK's biggest motorsport series." },
  { year: 2023, event: "The championship celebrates 65 years of racing. Ash Sutton claims his fourth title, cementing his place among BTCC legends. TikTok streaming brings the series to a global audience for the first time." },
  { year: 2025, event: "Charles Rainford becomes the youngest-ever BTCC champion. The series reaches a new generation of fans through live streaming, while retaining free-to-air coverage on ITV4." },
];

const FORMAT = [
  { label: "10 Rounds", detail: "Across Britain's finest circuits, April to October" },
  { label: "30 Races", detail: "Three races per round weekend — every one live on ITV4" },
  { label: "Reverse Grid", detail: "Race 3 grid set by reversed points order — guaranteeing unpredictability" },
  { label: "Ballast System", detail: "Success ballast added to leading cars after each race, keeping the field competitive" },
  { label: "3 Classes", detail: "Manufacturers, Independents, and Jack Sears Trophy — racing within racing" },
  { label: "Control Tyre", detail: "All cars run the same Goodyear tyre — driver skill, not budget, decides the outcome" },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <div
        style={{
          background: "#0F1122",
          borderBottom: "1px solid #161828",
          padding: "80px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 60% 50%, #FEBD0210 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
          <div
            style={{
              fontFamily: "var(--font-barlow-condensed)",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#FEBD02",
              marginBottom: 16,
            }}
          >
            Est. 1958
          </div>
          <h1
            style={{
              fontFamily: "var(--font-barlow-condensed)",
              fontWeight: 800,
              fontSize: "clamp(36px, 6vw, 72px)",
              letterSpacing: "0.02em",
              lineHeight: 1.0,
              margin: "0 0 24px",
              maxWidth: 700,
            }}
          >
            Britain's Greatest
            <br />
            <span style={{ color: "#FEBD02" }}>Motorsport Series</span>
          </h1>
          <p
            style={{
              color: "#8B8FA8",
              fontSize: 17,
              lineHeight: 1.7,
              maxWidth: 580,
              margin: "0 0 40px",
            }}
          >
            The Kwik Fit British Touring Car Championship has been the heartbeat of British motorsport for over six decades. Three races, one weekend, unlimited drama — on circuits from Kent to Fife, in front of the most passionate fans in motor racing.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              href="/calendar"
              style={{
                background: "#FEBD02",
                color: "#080912",
                padding: "14px 28px",
                fontFamily: "var(--font-barlow-condensed)",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              2026 Calendar
            </Link>
            <Link
              href="/drivers"
              style={{
                background: "transparent",
                color: "#fff",
                padding: "14px 28px",
                fontFamily: "var(--font-barlow-condensed)",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
                display: "inline-block",
                border: "1px solid #2A2D44",
              }}
            >
              Meet the Drivers
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 24px" }}>

        {/* Championship Format */}
        <section style={{ marginBottom: 80 }}>
          <h2
            style={{
              fontFamily: "var(--font-barlow-condensed)",
              fontWeight: 800,
              fontSize: 32,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              borderLeft: "4px solid #FEBD02",
              paddingLeft: 16,
              margin: "0 0 32px",
            }}
          >
            The Format
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 2,
            }}
          >
            {FORMAT.map((f) => (
              <div
                key={f.label}
                style={{
                  background: "#0F1122",
                  border: "1px solid #161828",
                  padding: "24px 28px",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-barlow-condensed)",
                    fontWeight: 800,
                    fontSize: 26,
                    color: "#FEBD02",
                    letterSpacing: "0.02em",
                    marginBottom: 8,
                  }}
                >
                  {f.label}
                </div>
                <div style={{ color: "#8B8FA8", fontSize: 14, lineHeight: 1.6 }}>
                  {f.detail}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* History timeline */}
        <section style={{ marginBottom: 80 }}>
          <h2
            style={{
              fontFamily: "var(--font-barlow-condensed)",
              fontWeight: 800,
              fontSize: 32,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              borderLeft: "4px solid #FEBD02",
              paddingLeft: 16,
              margin: "0 0 40px",
            }}
          >
            Championship History
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {MILESTONES.map((m, i) => (
              <div
                key={m.year}
                style={{
                  display: "grid",
                  gridTemplateColumns: "100px 1fr",
                  gap: 0,
                  borderBottom: i < MILESTONES.length - 1 ? "1px solid #161828" : "none",
                }}
              >
                <div
                  style={{
                    padding: "24px 0",
                    display: "flex",
                    alignItems: "flex-start",
                    paddingTop: 28,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-barlow-condensed)",
                      fontWeight: 800,
                      fontSize: 22,
                      color: "#FEBD02",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {m.year}
                  </span>
                </div>
                <div
                  style={{
                    padding: "24px 0 24px 24px",
                    borderLeft: "2px solid #161828",
                    color: "#D1D5DB",
                    fontSize: 15,
                    lineHeight: 1.65,
                  }}
                >
                  {m.event}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What makes it special */}
        <section style={{ marginBottom: 80 }}>
          <h2
            style={{
              fontFamily: "var(--font-barlow-condensed)",
              fontWeight: 800,
              fontSize: 32,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              borderLeft: "4px solid #FEBD02",
              paddingLeft: 16,
              margin: "0 0 32px",
            }}
          >
            Why BTCC
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {[
              {
                title: "Free to watch",
                body: "Every race live on ITV4 — free-to-air in the UK, with live streaming worldwide via TikTok and YouTube. No paywall, no subscription. The most accessible major motorsport series in Britain.",
              },
              {
                title: "The closest racing",
                body: "Ballast, reverse grids and control tyres ensure the most competitive field in motorsport. On any given Sunday, twenty cars separated by fractions of a second can fight for victory.",
              },
              {
                title: "Genuine road cars",
                body: "BMW, Toyota, Honda, Vauxhall, Hyundai — cars from manufacturers you recognise, built to regulations that keep costs manageable and talent decisive.",
              },
              {
                title: "Britain's circuits",
                body: "Brands Hatch, Silverstone, Knockhill, Thruxton — ten of Britain's most celebrated venues visited across a season from April to October. Every circuit unique, every round a different challenge.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: "#0F1122",
                  border: "1px solid #161828",
                  padding: "28px",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-barlow-condensed)",
                    fontWeight: 800,
                    fontSize: 20,
                    letterSpacing: "0.02em",
                    color: "#fff",
                    marginBottom: 12,
                  }}
                >
                  {item.title}
                </div>
                <p style={{ color: "#8B8FA8", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA row */}
        <section
          style={{
            background: "#0F1122",
            border: "1px solid #FEBD0233",
            padding: "48px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 32,
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-barlow-condensed)",
                fontWeight: 800,
                fontSize: 28,
                letterSpacing: "0.02em",
                marginBottom: 8,
              }}
            >
              Get Involved
            </div>
            <p style={{ color: "#8B8FA8", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Follow the 2026 season from the first race at Donington Park in April through to the Brands Hatch GP finale in October.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Link
              href="/calendar"
              style={{
                background: "#FEBD02",
                color: "#080912",
                padding: "14px 24px",
                fontFamily: "var(--font-barlow-condensed)",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              View Calendar →
            </Link>
            <Link
              href="/live"
              style={{
                background: "transparent",
                color: "#FEBD02",
                padding: "14px 24px",
                fontFamily: "var(--font-barlow-condensed)",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
                textAlign: "center",
                border: "1px solid #FEBD0244",
              }}
            >
              How to Watch →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
