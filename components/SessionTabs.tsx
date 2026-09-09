"use client";

import { useState } from "react";
import type { RaceSession } from "@/lib/types";
import PositionBadge from "./PositionBadge";

// Matches RoundResultsScreen.js's shortLabel() in the app exactly, so a
// round page reads the same on web and in-app.
function shortLabel(label: string): string {
  if (label === "Free Practice") return "FP";
  if (label === "Qualifying") return "QUAL";
  if (label === "Qualifying Race") return "Q RACE";
  const m = label.match(/^Race (\d)$/);
  if (m) return `R${m[1]}`;
  return label;
}

export default function SessionTabs({ races }: { races: RaceSession[] }) {
  const [active, setActive] = useState(0);
  const session = races[active];

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-border pb-4">
        {races.map((race, i) => (
          <button
            key={race.label}
            type="button"
            onClick={() => setActive(i)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-wide transition-colors ${
              i === active
                ? "bg-btcc-yellow text-background"
                : "bg-card text-muted hover:text-foreground"
            }`}
          >
            {shortLabel(race.label)}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted">
              <th className="w-10 pb-2 font-semibold" />
              <th className="pb-2 font-semibold">Driver</th>
              <th className="pb-2 font-semibold">Team</th>
              <th className="pb-2 text-right font-semibold">Best Lap</th>
              <th className="pb-2 text-right font-semibold">Gap</th>
              <th className="pb-2 text-right font-semibold">Pts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {session?.results.map((row) => (
              <tr key={`${row.pos}-${row.no}`}>
                <td className="py-2.5">
                  <PositionBadge pos={row.pos} />
                </td>
                <td className="py-2.5 font-semibold text-foreground">
                  #{row.no} {row.driver}
                </td>
                <td className="py-2.5 text-muted">{row.team}</td>
                <td className="py-2.5 text-right tabular-nums text-foreground">
                  {row.bestLap || "-"}
                </td>
                <td className="py-2.5 text-right tabular-nums text-muted">
                  {row.gap || "-"}
                </td>
                <td className="py-2.5 text-right font-bold tabular-nums text-btcc-yellow">
                  {row.points || ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
