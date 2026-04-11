"use client";

import { useState, useEffect } from "react";

const FLAGS_URL =
  "https://raw.githubusercontent.com/yacobwood/BTCC/main/data/flags.json";

const FLAG_DESCRIPTIONS: Record<string, string> = {
  podcasts_enabled: "Show the Podcasts & Interviews section in the app",
  podcast_last_episode_url: "URL of the last podcast episode that triggered a notification (auto-managed)",
  radio_tab: "Show the Radio section in the app",
  banner_ad: "Show banner ads in the app",
  newsfeed_ad: "Show ads within the news feed",
  whats_new: "Show the What's New dialog on app update",
  live_updates: "Enable live timing SignalR updates",
  results_notifications: "Enable push notifications for results",
  track_weather: "Show weather data on track detail screens",
  widget_race_weekend_test: "Test mode for race weekend widget",
  merch_hub_enabled: "Show the merch hub section",
  shop_home_premium: "Show premium merch on home screen",
  shop_home_standard: "Show standard merch on home screen",
};

export default function AdminPage() {
  const [flags, setFlags] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(FLAGS_URL)
      .then((r) => r.json())
      .then((data) => { setFlags(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const boolFlags = flags
    ? Object.entries(flags).filter(([, v]) => typeof v === "boolean")
    : [];
  const stringFlags = flags
    ? Object.entries(flags).filter(([, v]) => typeof v === "string")
    : [];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FEBD02", marginBottom: 8 }}>
          App Management
        </div>
        <h1 style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800, fontSize: 36, letterSpacing: "0.02em", margin: 0 }}>
          Feature Flags
        </h1>
        <p style={{ color: "#8B8FA8", marginTop: 8, fontSize: 14 }}>
          Current live flag values fetched from GitHub. To change a flag, edit{" "}
          <a
            href="https://github.com/yacobwood/BTCC/blob/main/data/flags.json"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#FEBD02" }}
          >
            data/flags.json
          </a>{" "}
          on the main branch. Changes take effect immediately on next app launch.
        </p>
      </div>

      {loading && (
        <p style={{ color: "#8B8FA8" }}>Loading flags…</p>
      )}
      {error && (
        <p style={{ color: "#E3000B" }}>Failed to load flags.</p>
      )}

      {flags && (
        <>
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8B8FA8", borderBottom: "1px solid #161828", paddingBottom: 12, marginBottom: 0 }}>
              Feature Toggles
            </h2>
            {boolFlags.map(([key, value]) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 0",
                  borderBottom: "1px solid #161828",
                  gap: 16,
                }}
              >
                <div>
                  <div style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, fontSize: 16, letterSpacing: "0.02em" }}>
                    {key}
                  </div>
                  {FLAG_DESCRIPTIONS[key] && (
                    <div style={{ color: "#8B8FA8", fontSize: 13, marginTop: 2 }}>
                      {FLAG_DESCRIPTIONS[key]}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    padding: "4px 14px",
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: "var(--font-barlow-condensed)",
                    letterSpacing: "0.06em",
                    backgroundColor: value ? "#FEBD0222" : "#E3000B22",
                    color: value ? "#FEBD02" : "#E3000B",
                    border: `1px solid ${value ? "#FEBD0244" : "#E3000B44"}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {value ? "ON" : "OFF"}
                </div>
              </div>
            ))}
          </section>

          {stringFlags.length > 0 && (
            <section>
              <h2 style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8B8FA8", borderBottom: "1px solid #161828", paddingBottom: 12, marginBottom: 0 }}>
                Config Values
              </h2>
              {stringFlags.map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    padding: "16px 0",
                    borderBottom: "1px solid #161828",
                  }}
                >
                  <div style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, fontSize: 16, letterSpacing: "0.02em", marginBottom: 4 }}>
                    {key}
                  </div>
                  {FLAG_DESCRIPTIONS[key] && (
                    <div style={{ color: "#8B8FA8", fontSize: 13, marginBottom: 6 }}>
                      {FLAG_DESCRIPTIONS[key]}
                    </div>
                  )}
                  <div style={{ fontFamily: "monospace", fontSize: 12, color: "#8B8FA8", background: "#0F1122", padding: "6px 10px", borderRadius: 4, wordBreak: "break-all" }}>
                    {value || <em>empty</em>}
                  </div>
                </div>
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}
