import type { PostCategory } from '@/types';

/**
 * Auto-categorize a post based on keyword matching
 *
 * @param text - Post text content to analyze
 * @param categories - Array of categories with keywords
 * @returns Category slug (e.g., 'events', 'portfolio', 'other')
 *
 * Logic:
 * 1. Convert text to lowercase for case-insensitive matching
 * 2. Iterate through categories (except 'other')
 * 3. Check if any keyword exists in text
 * 4. Return first matching category slug
 * 5. Default to 'other' if no match
 */
export function categorizePost(
  text: string,
  categories: Array<{ slug: string; keywords: string[] }>
): string {
  if (!text) return 'other';

  const lowerText = text.toLowerCase();

  for (const category of categories) {
    // Skip 'other' category (it's the fallback)
    if (category.slug === 'other') continue;

    for (const keyword of category.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        return category.slug;
      }
    }
  }

  // No match found, return 'other'
  return 'other';
}

/**
 * Get category ID by slug
 *
 * Helper function to find category ID from slug
 */
export function getCategoryIdBySlug(
  slug: string,
  categories: PostCategory[]
): string | null {
  const category = categories.find((cat) => cat.slug === slug);
  return category?.id || null;
}
