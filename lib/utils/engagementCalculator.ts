import type { PostStats } from '@/types';

/**
 * Calculate engagement score with weighted formula
 *
 * Formula: reactions + (comments × 2) + (reposts × 3)
 *
 * Rationale:
 * - Reactions (likes, love, celebrate) are low-effort (weight: 1×)
 * - Comments require more thought and engagement (weight: 2×)
 * - Reposts show highest endorsement (weight: 3×)
 *
 * @param stats - Post engagement statistics
 * @returns Numeric engagement score (0+)
 */
export function calculateEngagementScore(stats: PostStats): number {
  const { total_reactions, comments, reposts } = stats;

  const score = total_reactions + comments * 2 + reposts * 3;

  return Math.max(0, score); // Ensure non-negative
}

/**
 * Calculate normalized engagement score (per 1000 followers)
 *
 * Useful for comparing posts across companies of different sizes
 *
 * @param engagementScore - Raw engagement score
 * @param followerCount - Company follower count
 * @returns Normalized score per 1000 followers
 */
export function normalizeEngagementScore(
  engagementScore: number,
  followerCount: number
): number {
  if (followerCount === 0) return 0;

  return (engagementScore / followerCount) * 1000;
}

/**
 * Calculate engagement rate as percentage
 *
 * @param stats - Post engagement statistics
 * @param followerCount - Company follower count
 * @returns Engagement rate as percentage (0-100)
 */
export function calculateEngagementRate(
  stats: PostStats,
  followerCount: number
): number {
  if (followerCount === 0) return 0;

  const totalEngagement = stats.total_reactions + stats.comments + stats.reposts;
  const rate = (totalEngagement / followerCount) * 100;

  return Math.min(100, rate); // Cap at 100%
}
