import type { Metadata } from "next";
import AppGate from "@/components/AppGate";

export const metadata: Metadata = {
  title: "BTCC Hub — Get the App",
  description: "Live timing, results, driver profiles, and the full photo gallery - get the BTCC Hub app.",
  robots: { index: false },
};

// The site's only route now (see middleware.ts) - every real path (results,
// news, drivers, gallery, calendar, teams...) is rewritten here, carrying
// the originally-requested path+query in `path` so AppGate can try to open
// the app to the exact thing that was shared, not just a generic app-open.
export default async function GatePage({
  searchParams,
}: {
  searchParams: Promise<{ path?: string }>;
}) {
  const { path } = await searchParams;
  return <AppGate path={path ?? "/"} />;
}
