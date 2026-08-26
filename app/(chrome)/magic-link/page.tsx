import { Suspense } from "react";
import type { Metadata } from "next";
import MagicLinkRedirect from "./MagicLinkRedirect";

export const metadata: Metadata = {
  title: "Sign In | BTCC Hub",
  robots: { index: false },
};

export default function MagicLinkPage() {
  return (
    <Suspense>
      <MagicLinkRedirect />
    </Suspense>
  );
}
