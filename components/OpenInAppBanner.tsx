"use client";

import { useEffect, useState } from "react";
import { Colors } from "@/lib/appTheme";
import { PLAY_STORE_URL, isAndroid, buildIntentUrl } from "@/lib/appLinks";

const DISMISS_KEY = "btcchub_open_in_app_dismissed";

export default function OpenInAppBanner() {
  const [visible, setVisible] = useState(false);
  const [href, setHref] = useState(PLAY_STORE_URL);

  useEffect(() => {
    if (!isAndroid()) return;
    try {
      if (localStorage.getItem(DISMISS_KEY)) return;
    } catch {
      // localStorage unavailable (private mode etc) - fall through and show it anyway
    }
    // Deliberately not useSyncExternalStore here: this isn't subscribing to
    // an ongoing external source, it's a one-time "what device/URL am I on"
    // check that can only run after mount (server-rendered HTML has no
    // navigator/window at all). Rendering nothing until then is what keeps
    // this hydration-safe - the server and the client's first paint agree.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHref(buildIntentUrl(window.location.pathname + window.location.search));
    setVisible(true);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore - worst case the banner reappears next visit
    }
  };

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 16px",
        background: Colors.surface,
        borderBottom: `1px solid ${Colors.outline}`,
      }}
    >
      <img
        src="/logo.png"
        alt=""
        width={28}
        height={28}
        style={{ borderRadius: 6, flexShrink: 0 }}
      />
      <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: Colors.textPrimary, lineHeight: 1.3 }}>
        Get the full experience in the BTCC Hub app
      </span>
      <a
        href={href}
        style={{
          background: Colors.yellow,
          color: Colors.navy,
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: 0.3,
          padding: "8px 14px",
          borderRadius: 20,
          textDecoration: "none",
          whiteSpace: "nowrap",
        }}
      >
        OPEN
      </a>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        style={{
          background: "none",
          border: "none",
          color: Colors.textSecondary,
          fontSize: 20,
          lineHeight: 1,
          padding: 4,
          cursor: "pointer",
        }}
      >
        ×
      </button>
    </div>
  );
}
