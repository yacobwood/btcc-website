import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | BTCC Hub",
  robots: { index: false },
};

export default function MagicLinkPage({
  searchParams,
}: {
  searchParams: { link?: string };
}) {
  const link = searchParams.link ?? "";
  const appUrl = link
    ? `btccfanhub://magic-link?link=${encodeURIComponent(link)}`
    : "btccfanhub://";

  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#080912",
        padding: "40px 24px",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <img
          src="https://btcchub-af77a.firebaseapp.com/logo.png"
          alt="BTCC Hub"
          style={{ width: 160, marginBottom: 32 }}
        />
        <h1
          style={{
            fontFamily: "var(--font-barlow-condensed)",
            fontWeight: 800,
            fontSize: 32,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#ffffff",
            margin: "0 0 16px",
          }}
        >
          Sign In to BTCC Hub
        </h1>
        <p
          style={{
            color: "#8B8FA8",
            fontSize: 15,
            lineHeight: 1.65,
            margin: "0 0 36px",
          }}
        >
          Tap the button below to open the BTCC Hub app and complete sign in.
        </p>
        <a
          href={appUrl}
          style={{
            display: "inline-block",
            background: "#FEBD02",
            color: "#080912",
            padding: "14px 36px",
            fontFamily: "var(--font-barlow-condensed)",
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          Open BTCC Hub
        </a>
        <p
          style={{
            color: "#8B8FA8",
            fontSize: 12,
            marginTop: 24,
            lineHeight: 1.5,
          }}
        >
          If the button does not work, make sure BTCC Hub is installed on your device.
        </p>
      </div>
    </div>
  );
}
