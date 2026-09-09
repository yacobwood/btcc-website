// Pure CSS - no client JS needed for the scroll itself. Content is rendered
// twice back to back so the track can loop by translating exactly -50% of
// its own width, then jump back to 0 invisibly (identical content resumes).
export default function MarqueeTicker({ items }: { items: string[] }) {
  const track = [...items, ...items];

  return (
    <div
      className="overflow-hidden border-y border-btcc-yellow/40 bg-card py-3"
      style={{ clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)" }}
    >
      <div className="marquee-track flex w-max animate-[marquee_32s_linear_infinite] gap-12">
        {track.map((item, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-3 text-sm font-bold uppercase tracking-widest text-foreground"
          >
            <span className="text-btcc-yellow">◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
