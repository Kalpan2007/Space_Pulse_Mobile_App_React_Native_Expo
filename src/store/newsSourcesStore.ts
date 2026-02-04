/**
 * Space Pulse - News Sources Store
 * Zustand state management for news sources
 */

import { create } from 'zustand';
import { infoApi } from '../api';
import { storage } from '../utils';

interface NewsSourcesState {
  // Data
  newsSites: string[];
  selectedSite: string | null;
  
  // Loading states
  isLoading: boolean;
  
  // Error state
  error: string | null;
  
  // Actions
  fetchNewsSites: () => Promise<void>;
  selectSite: (site: string | null) => void;
}

export const useNewsSourcesStore = create<NewsSourcesState>((set, get) => ({
  newsSites: [],
  selectedSite: null,
  isLoading: false,
  error: null,

  fetchNewsSites: async () => {
    const state = get();
    
    if (state.isLoading || state.newsSites.length > 0) return;

    set({ isLoading: true, error: null });

    try {
      const sites = await infoApi.getNewsSites();
      
      // Cache news sites
      await storage.setWithExpiry(
        storage.keys.NEWS_SITES,
        sites,
        24 * 60 * 60 * 1000 // 24 hours
      );

      set({
        newsSites: sites.sort(),
        isLoading: false,
      });
    } catch (error) {
      // Try to load from cache
      const cached = await storage.getWithExpiry<string[]>(storage.keys.NEWS_SITES);
      
      set({
        newsSites: cached || [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load news sources',
      });
    }
  },

  selectSite: (site: string | null) => {
    set({ selectedSite: site });
  },
}));
