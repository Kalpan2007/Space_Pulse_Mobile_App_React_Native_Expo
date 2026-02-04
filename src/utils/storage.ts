/**
 * Space Pulse - Storage Utilities
 * AsyncStorage wrapper with error handling
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { CachedData } from '../types';

const STORAGE_KEYS = {
  SAVED_ITEMS: '@space_pulse/saved_items',
  CACHED_ARTICLES: '@space_pulse/cached_articles',
  CACHED_FEATURED: '@space_pulse/cached_featured',
  LAST_OPENED_ARTICLE: '@space_pulse/last_opened_article',
  NEWS_SITES: '@space_pulse/news_sites',
  SETTINGS: '@space_pulse/settings',
  SEARCH_HISTORY: '@space_pulse/search_history',
} as const;

// Default cache expiration: 30 minutes
const DEFAULT_CACHE_DURATION = 30 * 60 * 1000;

export const storage = {
  /**
   * Store data with key
   */
  set: async <T>(key: string, value: T): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Storage set error for key ${key}:`, error);
      throw error;
    }
  },

  /**
   * Get data by key
   */
  get: async <T>(key: string): Promise<T | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Storage get error for key ${key}:`, error);
      return null;
    }
  },

  /**
   * Remove data by key
   */
  remove: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Storage remove error for key ${key}:`, error);
    }
  },

  /**
   * Store data with cache expiration
   */
  setWithExpiry: async <T>(
    key: string,
    data: T,
    expiresIn: number = DEFAULT_CACHE_DURATION
  ): Promise<void> => {
    const cached: CachedData<T> = {
      data,
      timestamp: Date.now(),
      expiresIn,
    };
    await storage.set(key, cached);
  },

  /**
   * Get cached data if not expired
   */
  getWithExpiry: async <T>(key: string): Promise<T | null> => {
    try {
      const cached = await storage.get<CachedData<T>>(key);
      
      if (!cached) return null;
      
      const now = Date.now();
      const isExpired = now - cached.timestamp > cached.expiresIn;
      
      if (isExpired) {
        await storage.remove(key);
        return null;
      }
      
      return cached.data;
    } catch (error) {
      console.error(`Storage getWithExpiry error for key ${key}:`, error);
      return null;
    }
  },

  /**
   * Clear all app storage
   */
  clearAll: async (): Promise<void> => {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Storage clearAll error:', error);
    }
  },

  keys: STORAGE_KEYS,
};

export default storage;
