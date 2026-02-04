/**
 * Space Pulse - Saved Items Store
 * Zustand state management for favorites/bookmarks
 */

import { create } from 'zustand';
import { Article, Blog, Report, SavedItem, ContentType } from '../types';
import { storage } from '../utils';

interface SavedItemsState {
  // Data
  savedItems: SavedItem[];
  
  // Loading states
  isLoading: boolean;
  
  // Actions
  loadSavedItems: () => Promise<void>;
  saveItem: (item: Article | Blog | Report, type: ContentType) => Promise<void>;
  removeItem: (id: number, type: ContentType) => Promise<void>;
  isItemSaved: (id: number, type: ContentType) => boolean;
  getSavedByType: (type: ContentType) => SavedItem[];
  clearAll: () => Promise<void>;
}

export const useSavedItemsStore = create<SavedItemsState>((set, get) => ({
  savedItems: [],
  isLoading: false,

  loadSavedItems: async () => {
    set({ isLoading: true });

    try {
      const items = await storage.get<SavedItem[]>(storage.keys.SAVED_ITEMS);
      set({
        savedItems: items || [],
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to load saved items:', error);
      set({ isLoading: false });
    }
  },

  saveItem: async (item: Article | Blog | Report, type: ContentType) => {
    const state = get();
    
    // Check if already saved
    const exists = state.savedItems.some(
      (saved) => saved.id === item.id && saved.type === type
    );
    
    if (exists) return;

    const newSavedItem: SavedItem = {
      id: item.id,
      type,
      savedAt: new Date().toISOString(),
      data: item,
    };

    const updatedItems = [newSavedItem, ...state.savedItems];

    try {
      await storage.set(storage.keys.SAVED_ITEMS, updatedItems);
      set({ savedItems: updatedItems });
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  },

  removeItem: async (id: number, type: ContentType) => {
    const state = get();
    
    const updatedItems = state.savedItems.filter(
      (item) => !(item.id === id && item.type === type)
    );

    try {
      await storage.set(storage.keys.SAVED_ITEMS, updatedItems);
      set({ savedItems: updatedItems });
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  },

  isItemSaved: (id: number, type: ContentType) => {
    const state = get();
    return state.savedItems.some(
      (item) => item.id === id && item.type === type
    );
  },

  getSavedByType: (type: ContentType) => {
    const state = get();
    return state.savedItems.filter((item) => item.type === type);
  },

  clearAll: async () => {
    try {
      await storage.remove(storage.keys.SAVED_ITEMS);
      set({ savedItems: [] });
    } catch (error) {
      console.error('Failed to clear saved items:', error);
    }
  },
}));
