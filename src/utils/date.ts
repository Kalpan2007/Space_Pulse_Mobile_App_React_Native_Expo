/**
 * Space Pulse - Date Utilities
 */

import { formatDistanceToNow, format, parseISO, isValid } from 'date-fns';

/**
 * Format date as relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Unknown date';
    
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Unknown date';
  }
};

/**
 * Format date as full date (e.g., "January 15, 2024")
 */
export const formatFullDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Unknown date';
    
    return format(date, 'MMMM d, yyyy');
  } catch {
    return 'Unknown date';
  }
};

/**
 * Format date as short date (e.g., "Jan 15, 2024")
 */
export const formatShortDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Unknown date';
    
    return format(date, 'MMM d, yyyy');
  } catch {
    return 'Unknown date';
  }
};

/**
 * Format date with time (e.g., "Jan 15, 2024 at 3:30 PM")
 */
export const formatDateTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Unknown date';
    
    return format(date, "MMM d, yyyy 'at' h:mm a");
  } catch {
    return 'Unknown date';
  }
};

/**
 * Format date for API query (ISO format)
 */
export const formatForApi = (date: Date): string => {
  return date.toISOString();
};

/**
 * Get start of today in ISO format
 */
export const getStartOfToday = (): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString();
};

/**
 * Get date N days ago in ISO format
 */
export const getDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
};
