"use client";
import { useEffect, useState } from "react";

export default function Countdown({ targetDate, venue }: { targetDate: string; venue: string }) {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, live: false });

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const target = new Date(targetDate).getTime();
      const diff = target - now;
      if (diff <= 0) {
        setT({ days: 0, hours: 0, minutes: 0, seconds: 0, live: true });
        return;
      }
      setT({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        live: false,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const unit = (n: number, label: string) => (
    <div style={{ textAlign: "center", minWidth: 64 }}>
      <div
        style={{
          fontFamily: "var(--font-barlow-condensed)",
          fontWeight: 800,
          fontSize: 40,
          lineHeight: 1,
          color: "#fff",
        }}
      >
        {String(n).padStart(2, "0")}
      </div>
      <div
        style={{
          fontFamily: "var(--font-barlow-condensed)",
          fontWeight: 600,
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#8B8FA8",
          marginTop: 4,
        }}
      >
        {label}
      </div>
    </div>
  );

  if (t.live) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FEBD02", animation: "pulse 1s infinite" }} />
        <span style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800, fontSize: 20, color: "#FEBD02", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Live Now
        </span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
      {unit(t.days, "Days")}
      <span style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800, fontSize: 36, color: "#FEBD02", lineHeight: 1, paddingTop: 2 }}>:</span>
      {unit(t.hours, "Hours")}
      <span style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800, fontSize: 36, color: "#FEBD02", lineHeight: 1, paddingTop: 2 }}>:</span>
      {unit(t.minutes, "Mins")}
      <span style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800, fontSize: 36, color: "#FEBD02", lineHeight: 1, paddingTop: 2 }}>:</span>
      {unit(t.seconds, "Secs")}
    </div>
  );
}
