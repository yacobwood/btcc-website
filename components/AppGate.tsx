"use client";

import { useEffect, useRef, useState } from "react";
import { Colors, SYSTEM_FONT_STACK } from "@/lib/appTheme";
import { PLAY_STORE_URL, isAndroid, buildIntentUrl } from "@/lib/appLinks";

// How long to wait, after attempting to open the app, before concluding it
// isn't installed and switching to the "get the app" state. There's no
// reliable way for a web page to directly ask "is this app installed?" -
// this is the same timing heuristic every app doing this relies on
// (Instagram, Twitter, etc.): attempt the open, and if the tab is still
// visible once this fires, the OS never switched away.
const AUTO_ATTEMPT_TIMEOUT_MS = 1500;

export default function AppGate({ path }: { path: string }) {
  // Starts as the plain Play Store link (a safe, universally-valid default
  // for the first paint, matching OpenInAppBanner's own hydration-safe
  // pattern) - replaced once the effect below knows the real device/path.
  const [href, setHref] = useState(PLAY_STORE_URL);
  // Whether to show the "didn't open automatically" state (button label
  // changes, a hint appears) - not whether the ad COPY is visible, that's
  // always on screen regardless, so there's something to read immediately
  // rather than a blank moment while the auto-attempt is still pending.
  const [showFallback, setShowFallback] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isAndroid()) {
      // intent:// is an Android-specific scheme - on iOS/desktop it wouldn't
      // do anything useful, so this is a plain Play Store link instead.
      // There's no live iOS app to offer (BTCC declined the permission
      // needed for that distribution), so there's nothing else to try here.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHref(PLAY_STORE_URL);
      setShowFallback(true);
      return;
    }

    const intentHref = buildIntentUrl(path);
    setHref(intentHref);
    window.location.href = intentHref;

    const onVisibilityChange = () => {
      // Tab backgrounded - the OS switched to the app. Nothing further to
      // do; cancel the fallback timer so it can't fire after the fact (e.g.
      // if the visitor switches back to this tab later for some reason).
      if (document.hidden && timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    timerRef.current = setTimeout(() => setShowFallback(true), AUTO_ATTEMPT_TIMEOUT_MS);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
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
        {showFallback ? "GET THE APP" : "OPEN IN APP"}
      </a>
      <p style={{ color: Colors.textSecondary, fontSize: 12, marginTop: 16, minHeight: 16 }}>
        {showFallback ? "Available on Android" : "Opening BTCC Hub…"}
      </p>
    </div>
  );
}
