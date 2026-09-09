const MEDAL_STYLES: Record<number, string> = {
  1: "bg-gold text-background",
  2: "bg-silver text-background",
  3: "bg-bronze text-background",
};

export default function PositionBadge({ pos }: { pos: number | string }) {
  const numeric = typeof pos === "number" ? pos : parseInt(pos, 10);
  const medal = Number.isFinite(numeric) ? MEDAL_STYLES[numeric] : undefined;

  return (
    <span
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
        medal ?? "bg-card text-muted"
      }`}
    >
      {pos}
    </span>
  );
}
