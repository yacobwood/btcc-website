import Image from "next/image";

// A handful of real drivers (a newly-confirmed signing, a reserve who
// hasn't raced yet) have no photo in the source data - falls back to a
// number badge instead of passing an empty src to next/image, which throws.
export default function DriverAvatar({
  imageUrl,
  name,
  number,
  size,
}: {
  imageUrl?: string;
  name: string;
  number: number;
  size: number;
}) {
  if (!imageUrl) {
    return (
      <div
        className="flex shrink-0 items-center justify-center rounded-full bg-card font-display font-extrabold text-muted"
        style={{ width: size, height: size, fontSize: size * 0.32 }}
      >
        {number}
      </div>
    );
  }

  return (
    <div className="relative shrink-0 overflow-hidden rounded-full bg-card" style={{ width: size, height: size }}>
      <Image src={imageUrl} alt={name} fill sizes={`${size}px`} className="object-cover" />
    </div>
  );
}
