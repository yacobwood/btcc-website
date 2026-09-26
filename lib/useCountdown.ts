"use client";

import { useEffect, useState } from "react";

export interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  hasPassed: boolean;
}

function getRemaining(targetIso: string): Remaining {
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

// Shared by Countdown.tsx (compact, boxed digits) and BigCountdown.tsx
// (full-bleed chapter numerals) - same mount-then-tick contract either way:
// null until mounted (avoids a server/client "now" hydration mismatch),
// then ticks every second.
export function useCountdown(targetIso: string): Remaining | null {
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    // Deliberate - see Countdown.tsx's own established exception for this
    // exact rule (without it, the countdown renders nothing for a full
    // second until the interval's first tick).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRemaining(getRemaining(targetIso));
    const id = setInterval(() => setRemaining(getRemaining(targetIso)), 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  return remaining;
}
