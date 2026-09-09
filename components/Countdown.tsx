"use client";

import { useEffect, useState } from "react";

function getRemaining(targetIso: string) {
  const diff = new Date(targetIso).getTime() - Date.now();
  const clamped = Math.max(diff, 0);
  return {
    days: Math.floor(clamped / 86_400_000),
    hours: Math.floor((clamped % 86_400_000) / 3_600_000),
    minutes: Math.floor((clamped % 3_600_000) / 60_000),
    seconds: Math.floor((clamped % 60_000) / 1_000),
    hasPassed: diff <= 0,
  };
}

const UNITS: Array<{ key: "days" | "hours" | "minutes" | "seconds"; label: string }> = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hrs" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Sec" },
];

// Renders nothing time-sensitive until mounted - the server and the client's
// first paint would otherwise disagree on "now", which React flags as a
// hydration mismatch.
export default function Countdown({ targetIso }: { targetIso: string }) {
  const [remaining, setRemaining] = useState<ReturnType<typeof getRemaining> | null>(null);

  useEffect(() => {
    // The synchronous setState right after mount is flagged by
    // react-hooks/set-state-in-effect - deliberate here, same as this
    // codebase's own established exception for this exact rule (see
    // AppGate.tsx in the app repo): without it the countdown would render
    // nothing for a full second until the interval's first tick.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRemaining(getRemaining(targetIso));
    const id = setInterval(() => setRemaining(getRemaining(targetIso)), 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  if (!remaining || remaining.hasPassed) {
    return null;
  }

  return (
    <div className="flex gap-3">
      {UNITS.map((unit) => (
        <div
          key={unit.key}
          className="flex w-16 flex-col items-center rounded-xl border border-border bg-card py-2.5"
        >
          <span className="font-display text-2xl font-extrabold tabular-nums text-btcc-yellow">
            {String(remaining[unit.key]).padStart(2, "0")}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
