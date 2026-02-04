/**
 * Space Pulse - useRefresh Hook
 * Pull to refresh functionality
 */

import { useState, useCallback } from 'react';

interface UseRefreshOptions {
  onRefresh: () => Promise<void>;
  minDuration?: number;
}

interface UseRefreshReturn {
  isRefreshing: boolean;
  handleRefresh: () => void;
}

export function useRefresh({
  onRefresh,
  minDuration = 800,
}: UseRefreshOptions): UseRefreshReturn {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);

    const startTime = Date.now();
    
    try {
      await onRefresh();
    } catch (error) {
      console.error('Refresh error:', error);
    }

    // Ensure minimum refresh duration for better UX
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, minDuration - elapsed);

    setTimeout(() => {
      setIsRefreshing(false);
    }, remaining);
  }, [onRefresh, minDuration]);

  return { isRefreshing, handleRefresh };
}
