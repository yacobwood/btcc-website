"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

// Wraps next/link with the same-document View Transitions API for a
// shared-element photo morph into the destination page. Falls back to a
// plain Link navigation when the API is unavailable (Safari/Firefox as of
// this writing) or under prefers-reduced-motion (handled globally via the
// ::view-transition-group(*) { animation: none } rule in globals.css - the
// transition still fires, it just doesn't animate).
export default function TransitionLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (typeof document === "undefined" || !document.startViewTransition) return;
    e.preventDefault();
    document.startViewTransition(() => {
      return new Promise<void>((resolve) => {
        startTransition(() => {
          router.push(href);
          resolve();
        });
      });
    });
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
