export default function CircuitMap({ slug, venue }: { slug: string; venue: string }) {
  // These SVGs already stroke the layout in the app's own yellow
  // (#febd02, fill:none) built for a dark background - no recoloring needed,
  // unlike a plain black-on-transparent icon.
  return (
    // Local static SVG - next/image adds no optimization benefit here.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/circuits/${slug}.svg`}
      alt={`${venue} circuit layout`}
      className="w-full"
      loading="lazy"
    />
  );
}
