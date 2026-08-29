"use client";

import { useEffect, useState } from "react";
import { Colors, SYSTEM_FONT_STACK } from "@/lib/appTheme";
import { PLAY_STORE_URL, isAndroid, buildIntentUrl } from "@/lib/appLinks";

export default function AppGate({ path }: { path: string }) {
  // Starts as the plain Play Store link (a safe, universally-valid default
  // for the first paint, matching OpenInAppBanner's own hydration-safe
  // pattern) - replaced once the effect below knows the real device/path.
  const [href, setHref] = useState(PLAY_STORE_URL);

  // Deliberately NOT an automatic `window.location.href = intentHref` on
  // mount here - confirmed live (2026-08-29, real device/emulator testing,
  // not assumed) that Chrome requires a genuine user gesture (a tap) before
  // it will honour navigation to a custom scheme like `intent://`. An
  // automatic redirect fired from an effect has no gesture behind it, so
  // Chrome doesn't silently fail it - it actively falls through to the
  // intent URI's own embedded browser_fallback_url (the Play Store)
  // immediately, which is worse than doing nothing: it was firing the "not
  // installed" outcome even on a device that DOES have the app. The button
  // below is the only trigger - a real tap is a real gesture, which is what
  // lets `intent://` actually switch to the app (confirmed working via a
  // real tap, not just theorised).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHref(isAndroid() ? buildIntentUrl(path) : PLAY_STORE_URL);
  }, [path]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: Colors.background,
        color: Colors.textPrimary,
        fontFamily: SYSTEM_FONT_STACK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-barlow-condensed)",
          fontWeight: 800,
          fontSize: 14,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: Colors.yellow,
          marginBottom: 12,
        }}
      >
        BTCC Hub
      </div>
      <h1
        style={{
          fontFamily: "var(--font-barlow-condensed)",
          fontSize: "clamp(24px, 6vw, 34px)",
          fontWeight: 800,
          margin: "0 0 12px",
          maxWidth: 420,
          lineHeight: 1.15,
        }}
      >
        Get the full BTCC Hub experience in the app
      </h1>
      <p style={{ color: Colors.textSecondary, fontSize: 15, maxWidth: 380, margin: "0 0 28px", lineHeight: 1.5 }}>
        Live timing, results, driver profiles, and the full photo gallery - free on Android.
      </p>
      <a
        href={href}
        style={{
          background: Colors.yellow,
          color: Colors.navy,
          fontFamily: "var(--font-barlow-condensed)",
          fontWeight: 800,
          fontSize: 15,
          letterSpacing: "0.04em",
          padding: "14px 32px",
          borderRadius: 24,
          textDecoration: "none",
        }}
      >
        OPEN IN APP
      </a>
      <p style={{ color: Colors.textSecondary, fontSize: 12, marginTop: 16, minHeight: 16 }}>
        Opens the app if it&apos;s installed, or the Play Store to get it
      </p>
    </div>
  );
}
