import { NextRequest, NextResponse } from "next/server";

// The website's only job now is getting a visitor into the app - every real
// route (home, results, news, drivers, gallery, calendar, teams...) is
// rewritten to the single gate page at app/page.tsx, which tries to open the
// app to whatever was actually requested (via the `path` param below) and
// falls back to a "get the app" ad if that doesn't work. See the project
// plan/memory for the full reasoning; this file only needs to get the
// rewrite + the exceptions right.
//
// Named proxy.ts (not middleware.ts) - Next.js 16 renamed this file
// convention; middleware.ts still builds but with a deprecation warning.
//
// Two things must stay reachable as real files, not swallowed into the gate:
//   - /.well-known/* (assetlinks.json) - Android's own OS-level App Links
//     verification reads this directly; it's what lets the app open WITHOUT
//     ever reaching this website in the first place. Breaking this would
//     undermine the exact mechanism this whole feature depends on.
//   - /app-ads.txt - ad-network verification file, same "must stay a plain
//     reachable file" reasoning.
// Both are excluded by the matcher's own "anything with a file extension"
// exclusion below (.json/.txt), not handled here in the function body.
//
// /magic-link is the one *route* (no file extension, so the matcher alone
// wouldn't skip it) that's a real functional step - completing passwordless
// sign-in - not content, so it's excluded explicitly here instead.
const EXCLUDED_ROUTE_PREFIXES = ["/magic-link"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/" || EXCLUDED_ROUTE_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const originalPathAndQuery = pathname + search;
  url.pathname = "/";
  url.search = `?path=${encodeURIComponent(originalPathAndQuery)}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Next.js's own documented pattern for "run on every page route, skip
    // static files": `.*\..*` treats any path containing a dot anywhere as
    // a static asset (covers /.well-known/assetlinks.json, /app-ads.txt,
    // /favicon.ico, any /_next asset) - real page routes (/results/5,
    // /gallery/2026/x/3, /magic-link) never contain a dot, so this doesn't
    // affect them.
    "/((?!_next/static|_next/image|.*\\..*).*)",
  ],
};
