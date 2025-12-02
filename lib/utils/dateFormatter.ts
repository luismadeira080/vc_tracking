import { format, formatDistanceToNow } from 'date-fns';

/**
 * Format date as relative time (e.g., "3 days ago")
 *
 * @param date - Date string or Date object
 * @returns Relative time string
 */
export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Format date as short date (e.g., "Jan 15, 2025")
 *
 * @param date - Date string or Date object
 * @returns Formatted short date
 */
export function formatShortDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy');
}

/**
 * Format date as full date with time (e.g., "January 15, 2025 3:45 PM")
 *
 * @param date - Date string or Date object
 * @returns Formatted full date with time
 */
export function formatFullDateTime(date: string | Date): string {
  return format(new Date(date), 'MMMM d, yyyy h:mm a');
}

/**
 * Format date for chart display (e.g., "Jan 15")
 *
 * @param date - Date string or Date object
 * @returns Formatted date for charts
 */
export function formatChartDate(date: string | Date): string {
  return format(new Date(date), 'MMM d');
}
