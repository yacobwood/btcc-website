import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partners | BTCC",
  description: "The official partners and sponsors of the British Touring Car Championship.",
};

const PARTNERS = [
  {
    tier: "Title Sponsor",
    partners: [
      {
        name: "Kwik Fit",
        role: "Title Sponsor",
        description:
          "Kwik Fit is the official title sponsor of the British Touring Car Championship, the UK's leading automotive servicing brand with over 600 centres nationwide. The partnership has been central to BTCC's identity for years, bringing the championship to millions of UK consumers.",
        website: "https://www.kwik-fit.com",
        logoUrl: "https://btcc.net/wp-content/uploads/2023/11/KF_BTCC_Combined_logo_landscape_White_Out.png",
        logoBg: "transparent",
      },
    ],
  },
  {
    tier: "Official Suppliers",
    partners: [
      {
        name: "Goodyear",
        role: "Official Tyre Supplier",
        description:
          "Goodyear supplies the official control tyre for all BTCC competitors. Every car on the grid races on the same specification Goodyear tyre, ensuring the championship remains a test of driver skill and team strategy.",
        website: "https://www.goodyear.co.uk",
        logoUrl: "https://btcc.net/wp-content/uploads/2024/03/Goodyear.jpg",
        logoBg: "#fff",
      },
      {
        name: "Liqui-Moly",
        role: "Official Lubricants Partner",
        description:
          "Liqui-Moly is the official lubricants partner of the BTCC, supplying high-performance motor oils and additives to teams throughout the paddock. Their products are trusted by racing teams worldwide.",
        website: "https://www.liqui-moly.com",
        logoUrl: "https://btcc.net/wp-content/uploads/2024/07/Liqui-Moly-Logo-RGB.png",
        logoBg: "#fff",
      },
    ],
  },
  {
    tier: "Broadcast Partners",
    partners: [
      {
        name: "ITV",
        role: "Official Broadcast Partner",
        description:
          "ITV is the exclusive UK broadcast partner for the BTCC, broadcasting all 30 races live and free-to-air on ITV4. Full coverage is also available to stream on ITVX, ensuring fans across the UK never miss a moment of the action.",
        website: "https://www.itv.com",
        logoUrl: "https://btcc.net/wp-content/uploads/2024/08/itv4-logo-no-back.png",
        logoBg: "#161828",
      },
      {
        name: "Autocar",
        role: "Official Media Partner",
        description:
          "Autocar is the official media partner of the BTCC, providing in-depth championship coverage, driver interviews and technical analysis throughout the season in both print and digital formats.",
        website: "https://www.autocar.co.uk",
        logoUrl: "https://btcc.net/wp-content/uploads/2024/03/Autocar_logo.png",
        logoBg: "#fff",
      },
    ],
  },
  {
    tier: "Governing Bodies",
    partners: [
      {
        name: "Motorsport UK",
        role: "Official Governing Body",
        description:
          "Motorsport UK is the governing body for four-wheel motorsport in the United Kingdom, sanctioning the BTCC and ensuring the championship operates to the highest standards of safety and sporting integrity.",
        website: "https://www.motorsportuk.org",
        logoUrl: "https://btcc.net/wp-content/uploads/2024/03/Motorsport-UK-logo.png",
        logoBg: "#fff",
      },
      {
        name: "BARC",
        role: "Sanctioning Body",
        description:
          "The British Automobile Racing Club (BARC) is one of the oldest motorsport clubs in the world and acts as the official sanctioning body for the BTCC, organising and administering the championship's technical and sporting regulations.",
        website: "https://www.barc.net",
        logoUrl: "https://btcc.net/wp-content/uploads/2024/03/BARC.jpg",
        logoBg: "#fff",
      },
      {
        name: "TOCA",
        role: "Championship Organiser",
        description:
          "TOCA Ltd is the commercial rights holder and organiser of the British Touring Car Championship. TOCA manages the commercial, marketing and broadcast relationships that keep the championship thriving as Britain's premier motorsport series.",
        website: "https://www.btcc.net",
        logoUrl: "https://btcc.net/wp-content/uploads/2024/03/Toca.jpg",
        logoBg: "#fff",
      },
    ],
  },
];

export default function PartnersPage() {
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ marginBottom: 48 }}>
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
          Partners &amp; Sponsors
        </h1>
        <p style={{ color: "#8B8FA8", fontSize: 15, marginTop: 12, paddingLeft: 20, maxWidth: 600 }}>
          The BTCC is made possible by the support of our official partners, sponsors, and governing bodies who share our passion for British motorsport.
        </p>
      </div>

      {PARTNERS.map((tier) => (
        <section key={tier.tier} style={{ marginBottom: 56 }}>
          <h2
            style={{
              fontFamily: "var(--font-barlow-condensed)",
              fontWeight: 800,
              fontSize: 18,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#8B8FA8",
              marginBottom: 20,
              paddingBottom: 12,
              borderBottom: "1px solid #161828",
            }}
          >
            {tier.tier}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: 16,
            }}
          >
            {tier.partners.map((p) => (
              <a
                key={p.name}
                href={p.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#0F1122",
                  border: "1px solid #161828",
                  padding: "28px",
                  textDecoration: "none",
                  display: "block",
                }}
              >
                {/* Official logo */}
                <div
                  style={{
                    background: p.logoBg,
                    height: 80,
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 20,
                    padding: p.logoBg !== "transparent" ? "12px 16px" : "0",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={p.logoUrl}
                    alt={p.name + " logo"}
                    width={220}
                    height={56}
                    style={{ objectFit: "contain", objectPosition: "left center", maxHeight: 56 }}
                    unoptimized
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-barlow-condensed)",
                      fontWeight: 800,
                      fontSize: 24,
                      letterSpacing: "0.02em",
                      color: "#fff",
                    }}
                  >
                    {p.name}
                  </div>
                  <span
                    style={{
                      background: tier.tier === "Title Sponsor" ? "#FEBD02" : "#161828",
                      color: tier.tier === "Title Sponsor" ? "#080912" : "#8B8FA8",
                      fontFamily: "var(--font-barlow-condensed)",
                      fontWeight: 700,
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "3px 8px",
                      flexShrink: 0,
                      marginLeft: 12,
                    }}
                  >
                    {p.role}
                  </span>
                </div>
                <p style={{ color: "#8B8FA8", fontSize: 14, lineHeight: 1.6, margin: "0 0 16px" }}>
                  {p.description}
                </p>
                <span
                  style={{
                    color: "#FEBD02",
                    fontFamily: "var(--font-barlow-condensed)",
                    fontWeight: 600,
                    fontSize: 12,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Visit Website →
                </span>
              </a>
            ))}
          </div>
        </section>
      ))}

      {/* Become a partner CTA */}
      <div
        style={{
          background: "#0F1122",
          border: "1px solid #FEBD0233",
          padding: "40px",
          textAlign: "center",
          marginTop: 16,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-barlow-condensed)",
            fontWeight: 800,
            fontSize: 28,
            letterSpacing: "0.02em",
            marginBottom: 12,
          }}
        >
          Interested in Partnership?
        </div>
        <p style={{ color: "#8B8FA8", fontSize: 15, maxWidth: 500, margin: "0 auto 24px", lineHeight: 1.6 }}>
          The BTCC offers unrivalled access to passionate motorsport fans across the UK. Contact the commercial team to discuss partnership opportunities.
        </p>
        <a
          href="mailto:commercial@toca.co.uk"
          style={{
            display: "inline-block",
            background: "#FEBD02",
            color: "#080912",
            padding: "14px 32px",
            fontFamily: "var(--font-barlow-condensed)",
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          Get in Touch
        </a>
      </div>
    </div>
  );
}
