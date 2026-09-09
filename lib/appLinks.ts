// Real, shipped app-distribution facts (verified against the app repo's own
// production config, not assumed) - reused everywhere the site cross-promotes
// the app instead of gating on it.
export const PACKAGE_NAME = "com.btccfanhub";
export const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${PACKAGE_NAME}`;

// There is currently no live iOS distribution (BTCC declined the permission
// needed for it) - the site must never show an App Store badge/link, a dead
// link here would undercut exactly the credibility this site exists to
// build.
export const IOS_AVAILABLE = false;
