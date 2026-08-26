// Design tokens for the 3 "app-matching" pages (results/[round], news/[slug],
// drivers/[slug]) - the pages a shared link from the BTCC Hub app actually
// lands on. These are deliberately NOT styled like the rest of the website
// (see app/(chrome)/layout.tsx) - they mirror the native app's own screens
// exactly, values copied 1:1 from src/theme/colors.js in the app repo.
// Keep this file's values in sync with that file if the app's palette ever
// changes - there is no automated link between the two repos.
export const Colors = {
  yellow: "#FEBD02",
  yellowDark: "#CC9800",
  navy: "#020255",
  background: "#080912",
  surface: "#0F1122",
  card: "#161828",
  textPrimary: "#FFFFFF",
  textSecondary: "#8B8FA8",
  outline: "#2A2D44",
} as const;

// Medal colors used for P1/P2/P3 across ResultsScreen.js and RoundResultsScreen.js
export const MedalColors = {
  gold: "#FFD700",
  silver: "#C0C0C0",
  bronze: "#CD7F32",
} as const;

// Season-history badge accents (DriverDetailScreen.js) - not in Colors above
// because the app defines these as one-off literals at their call sites,
// not shared theme tokens.
export const BadgeColors = {
  points: "#00C853",
  wins: Colors.yellow,
  podiums: "#C0C0C0",
  poles: "#5BA3FF",
  fastestLaps: "#A855F7",
  dnfs: "#ff4444",
} as const;

// The app uses zero custom typefaces anywhere - plain system font at native
// weights. This is the closest web equivalent of React Native's default
// (San Francisco on iOS, Roboto on Android).
export const SYSTEM_FONT_STACK =
  '-apple-system, Roboto, "Segoe UI", system-ui, sans-serif';
