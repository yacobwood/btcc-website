"use client";

import { useCountdown } from "@/lib/useCountdown";

const UNITS: Array<{ key: "days" | "hours" | "minutes" | "seconds"; label: string }> = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hrs" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Sec" },
];

// Compact, boxed digit display. See BigCountdown.tsx for the full-bleed
// chapter-scale variant - both share useCountdown()'s mount-then-tick logic.
export default function Countdown({ targetIso }: { targetIso: string }) {
  const remaining = useCountdown(targetIso);

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
