// Matches src/utils/driverName.js in the app exactly - "Ashley Sutton"
// becomes "Ashley SUTTON". Results data (data/results.json) already comes
// pre-formatted this way from the scraper, so this is only needed for
// driver-profile data (data/drivers.json), which stores plain title case.
export function formatDriverName(name: string): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return name.toUpperCase();
  const first = parts[0];
  const surname = parts.slice(1).join(" ").toUpperCase();
  return `${first} ${surname}`;
}
