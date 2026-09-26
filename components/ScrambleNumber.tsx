"use client";

import { useEffect, useRef, useState } from "react";

const SCRAMBLE_MS = 500;
const TICK_MS = 40;

function randomDigits(length: number): string {
  let out = "";
  for (let i = 0; i < length; i++) out += Math.floor(Math.random() * 10);
  return out;
}

// Renders the real value immediately (SSR-safe, correct for no-JS/crawlers/
// reduced-motion) then, once mounted, briefly cycles random digits before
// settling back on the real value - same "final value first, motion is a
// mount-only extra" contract as Countdown.tsx.
export default function ScrambleNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(String(value));
  const digits = String(value).length;
  const settledRef = useRef(false);

  useEffect(() => {
    if (settledRef.current) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      if (elapsed >= SCRAMBLE_MS) {
        clearInterval(id);
        settledRef.current = true;
        setDisplay(String(value));
        return;
      }
      setDisplay(randomDigits(digits));
    }, TICK_MS);
    return () => clearInterval(id);
  }, [value, digits]);

  return <span className="tabular-nums">{display}</span>;
}
