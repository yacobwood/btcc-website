import Image from "next/image";
import { getCalendar } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | BTCC",
  description: "Race photography from every BTCC circuit — action from across the season.",
};

export default function GalleryPage() {
  const rounds = getCalendar();

  // Flatten all race images with venue labels
  const allImages = rounds.flatMap((r) =>
    r.raceImages.map((url, i) => ({
      url,
      venue: r.venue,
      round: r.round,
      key: `${r.round}-${i}`,
    }))
  );

  // Group by round
  const byRound = rounds
    .map((r) => ({
      round: r.round,
      venue: r.venue,
      location: r.location,
      images: r.raceImages,
    }))
    .filter((r) => r.images.length > 0);

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
          Photo Gallery
        </h1>
        <p style={{ color: "#8B8FA8", fontSize: 15, marginTop: 12, paddingLeft: 20 }}>
          {allImages.length} photos from across the BTCC circuits
        </p>
      </div>

      {byRound.map((r) => (
        <section key={r.round} style={{ marginBottom: 56 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 16,
              marginBottom: 16,
              paddingBottom: 12,
              borderBottom: "1px solid #161828",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-barlow-condensed)",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#FEBD02",
              }}
            >
              Round {r.round}
            </span>
            <h2
              style={{
                fontFamily: "var(--font-barlow-condensed)",
                fontWeight: 800,
                fontSize: 22,
                letterSpacing: "0.02em",
                margin: 0,
              }}
            >
              {r.venue}
            </h2>
            <span style={{ color: "#8B8FA8", fontSize: 14 }}>{r.location}</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 4,
            }}
          >
            {r.images.map((url, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  paddingTop: i === 0 ? "56.25%" : "66.66%",
                  gridColumn: i === 0 ? "1 / span 2" : "auto",
                  overflow: "hidden",
                  background: "#161828",
                }}
              >
                <Image
                  src={url}
                  alt={`${r.venue} Round ${r.round} photo ${i + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
