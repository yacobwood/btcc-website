// Shared Android app-link constants/helpers - used by OpenInAppBanner (the
// sticky top banner mounted on every page) and the site-wide gate page
// (app/page.tsx, everything middleware.ts rewrites to). Extracted here
// rather than duplicated so both have exactly one definition of "how do we
// try to open the app" to keep in sync.
export const PACKAGE_NAME = "com.btccfanhub";
export const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${PACKAGE_NAME}`;

// Android only - there is currently no live iOS distribution to open (BTCC
// declined the permission needed for it), so an iOS equivalent would just be
// a dead end.
export function isAndroid() {
  return typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);
}

// Reproduces the Android-native `intent://` URI - this is the one link
// format that reliably bypasses an in-app browser forcing a bound
// CustomTabsSession (which is exactly why links tapped inside WhatsApp open
// Chrome instead of the app), AND the mechanism Android itself uses to fall
// back to the Play Store when the app isn't installed
// (S.browser_fallback_url) - there's no reliable way for a web page to ask
// "is this app installed?" directly, so this delegates that exact decision
// to the OS rather than trying to reimplement it.
export function buildIntentUrl(pathAndQuery: string) {
  const target = `https://btcchub.vercel.app${pathAndQuery}`;
  const withoutScheme = target.replace(/^https?:\/\//, "");
  const fallback = encodeURIComponent(PLAY_STORE_URL);
  return `intent://${withoutScheme}#Intent;scheme=https;package=${PACKAGE_NAME};S.browser_fallback_url=${fallback};end`;
}
