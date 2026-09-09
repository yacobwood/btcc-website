import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="font-display text-7xl font-extrabold text-btcc-yellow">404</p>
      <h1 className="mt-3 font-display text-2xl font-bold text-foreground">
        Off the racing line
      </h1>
      <p className="mt-2 text-muted">
        That page doesn&apos;t exist - it might have moved, or the link was wrong.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-btcc-yellow px-6 py-3 text-sm font-bold text-background"
      >
        Back to Home
      </Link>
    </div>
  );
}
