// Matches the app-matching pages' own driverSlug() convention exactly
// (lowercase, spaces -> hyphens) so any old shared link shape keeps working.
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}
