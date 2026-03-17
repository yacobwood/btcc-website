import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "#0F1122", borderTop: "1px solid #161828", marginTop: 80 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40 }}>
          {/* Brand */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-barlow-condensed)",
                fontWeight: 800,
                fontSize: 22,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              <span style={{ color: "#FEBD02" }}>BTCC</span>
            </div>
            <p style={{ color: "#8B8FA8", fontSize: 14, lineHeight: 1.6, maxWidth: 240 }}>
              Britain's premier motorsport series — three races, one weekend, unlimited drama.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-barlow-condensed)",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#8B8FA8",
                marginBottom: 16,
              }}
            >
              Quick Links
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { href: "/news", label: "Latest News" },
                { href: "/drivers", label: "Drivers" },
                { href: "/results", label: "Results & Standings" },
                { href: "/calendar", label: "Race Calendar" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  style={{
                    color: "#8B8FA8",
                    textDecoration: "none",
                    fontSize: 14,
                    transition: "color 0.2s",
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* More links */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-barlow-condensed)",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#8B8FA8",
                marginBottom: 16,
              }}
            >
              More
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { href: "/teams", label: "Teams" },
                { href: "/live", label: "Watch Live" },
                { href: "/gallery", label: "Gallery" },
                { href: "/partners", label: "Partners" },
                { href: "/about", label: "About" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  style={{
                    color: "#8B8FA8",
                    textDecoration: "none",
                    fontSize: 14,
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-barlow-condensed)",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#8B8FA8",
                marginBottom: 16,
              }}
            >
              Follow BTCC
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { href: "https://x.com/btcc", label: "X / Twitter" },
                { href: "https://www.tiktok.com/@btcc", label: "TikTok" },
                { href: "https://www.facebook.com/BTCCofficial", label: "Facebook" },
                { href: "https://www.instagram.com/btcc", label: "Instagram" },
                { href: "https://www.youtube.com/@BTCC", label: "YouTube" },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#8B8FA8",
                    textDecoration: "none",
                    fontSize: 14,
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: "1px solid #161828",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p style={{ color: "#8B8FA8", fontSize: 13 }}>
            © 2026 British Touring Car Championship
          </p>
          <p style={{ color: "#4B5563", fontSize: 12 }}>
            BTCC is a registered trademark of TOCA Ltd
          </p>
        </div>
      </div>
    </footer>
  );
}
