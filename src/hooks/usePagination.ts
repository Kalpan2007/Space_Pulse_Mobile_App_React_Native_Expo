/**
 * Space Pulse - usePagination Hook
 * Infinite scroll pagination
 */

import { useState, useCallback, useRef } from 'react';

interface UsePaginationOptions {
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
  threshold?: number;
}

interface UsePaginationReturn {
  isLoadingMore: boolean;
  handleEndReached: () => void;
}

export function usePagination({
  onLoadMore,
  hasMore,
  threshold = 0.5,
}: UsePaginationOptions): UsePaginationReturn {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isLoadingRef = useRef(false);

  const handleEndReached = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (isLoadingRef.current || !hasMore) return;

    isLoadingRef.current = true;
    setIsLoadingMore(true);

    try {
      await onLoadMore();
    } catch (error) {
      console.error('Load more error:', error);
    } finally {
      isLoadingRef.current = false;
      setIsLoadingMore(false);
    }
  }, [onLoadMore, hasMore]);

  return { isLoadingMore, handleEndReached };
}
