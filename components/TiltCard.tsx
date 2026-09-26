"use client";

import { useRef } from "react";

const MAX_TILT_DEG = 4;

// Writes --tilt-x/--tilt-y CSS custom properties (consumed by .tilt-card in
// globals.css) directly via the DOM rather than React state, so a fast
// mouse doesn't trigger a re-render per pixel - only the rAF-throttled style
// write happens, exactly like a native CSS/JS parallax effect. Touch is
// skipped entirely (no listener cost, not just a CSS override) since tilt
// is a mouse/trackpad-only affordance.
export default function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      el.style.setProperty("--tilt-x", `${px * MAX_TILT_DEG * 2}deg`);
      el.style.setProperty("--tilt-y", `${-py * MAX_TILT_DEG * 2}deg`);
    });
  }

  function handlePointerLeave() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </div>
  );
}
