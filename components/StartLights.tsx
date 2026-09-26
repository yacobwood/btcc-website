// Pure markup, server-renderable - no "use client" needed, the animation
// is entirely CSS (@keyframes lights-on-sequence in globals.css). Purely
// decorative: aria-hidden, never gates anything else on the page.
export default function StartLights() {
  return (
    <div className="start-lights" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="start-light" />
      ))}
    </div>
  );
}
