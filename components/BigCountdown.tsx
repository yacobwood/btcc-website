"use client";

import { useCountdown } from "@/lib/useCountdown";

const UNITS: Array<{ key: "days" | "hours" | "minutes" | "seconds"; label: string }> = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hrs" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Sec" },
];

// Chapter-scale countdown - massive tabular numerals, no box/border/card
// anywhere, separated only by a hairline rule (matches this page's flat
// broadcast-graphics language, not a boxed widget).
export default function BigCountdown({ targetIso }: { targetIso: string }) {
  const remaining = useCountdown(targetIso);

  if (!remaining || remaining.hasPassed) {
    return null;
  }

  return (
    <div className="flex divide-x divide-border">
      {UNITS.map((unit) => (
        <div key={unit.key} className="flex flex-col items-start px-4 first:pl-0">
          <span className="font-display text-4xl font-extrabold tabular-nums leading-none text-btcc-yellow sm:text-5xl">
            {String(remaining[unit.key]).padStart(2, "0")}
          </span>
          <span className="mt-1.5 text-xs font-bold uppercase tracking-widest text-muted">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
