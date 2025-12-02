/**
 * Convert a string to a URL-friendly slug
 *
 * @param text - Input string to slugify
 * @returns Lowercase, hyphenated slug
 *
 * Example:
 * slugify("Sequoia Capital") → "sequoia-capital"
 * slugify("Andreessen Horowitz (a16z)") → "andreessen-horowitz-a16z"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars (except spaces/hyphens)
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
