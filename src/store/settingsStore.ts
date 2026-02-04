/**
 * Space Pulse - Settings Store
 * App settings and preferences
 */

import { create } from 'zustand';
import { storage } from '../utils';
import { NotificationPreferences } from '../types';

interface SettingsState {
  // Theme
  isDarkMode: boolean;
  useSystemTheme: boolean;
  
  // Notifications
  notificationPreferences: NotificationPreferences;
  
  // Cache
  enableOfflineMode: boolean;
  
  // Loading
  isLoading: boolean;
  
  // Actions
  loadSettings: () => Promise<void>;
  toggleDarkMode: () => Promise<void>;
  toggleSystemTheme: () => Promise<void>;
  updateNotificationPrefs: (prefs: Partial<NotificationPreferences>) => Promise<void>;
  toggleOfflineMode: () => Promise<void>;
  clearCache: () => Promise<void>;
}

interface StoredSettings {
  isDarkMode: boolean;
  useSystemTheme: boolean;
  notificationPreferences: NotificationPreferences;
  enableOfflineMode: boolean;
}

const defaultSettings: StoredSettings = {
  isDarkMode: true,
  useSystemTheme: true,
  notificationPreferences: {
    breakingNews: true,
    featuredArticles: true,
    dailyDigest: false,
  },
  enableOfflineMode: true,
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...defaultSettings,
  isLoading: false,

  loadSettings: async () => {
    set({ isLoading: true });

    try {
      const settings = await storage.get<StoredSettings>(storage.keys.SETTINGS);
      
      if (settings) {
        set({
          ...settings,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      set({ isLoading: false });
    }
  },

  toggleDarkMode: async () => {
    const state = get();
    const newValue = !state.isDarkMode;
    
    set({ isDarkMode: newValue });
    
    await saveSettings(get());
  },

  toggleSystemTheme: async () => {
    const state = get();
    const newValue = !state.useSystemTheme;
    
    set({ useSystemTheme: newValue });
    
    await saveSettings(get());
  },

  updateNotificationPrefs: async (prefs: Partial<NotificationPreferences>) => {
    const state = get();
    const newPrefs = { ...state.notificationPreferences, ...prefs };
    
    set({ notificationPreferences: newPrefs });
    
    await saveSettings(get());
  },

  toggleOfflineMode: async () => {
    const state = get();
    const newValue = !state.enableOfflineMode;
    
    set({ enableOfflineMode: newValue });
    
    await saveSettings(get());
  },

  clearCache: async () => {
    await storage.remove(storage.keys.CACHED_ARTICLES);
    await storage.remove(storage.keys.CACHED_FEATURED);
    await storage.remove(storage.keys.LAST_OPENED_ARTICLE);
    await storage.remove(storage.keys.SEARCH_HISTORY);
  },
}));

// Helper function to save settings
async function saveSettings(state: SettingsState) {
  const settings: StoredSettings = {
    isDarkMode: state.isDarkMode,
    useSystemTheme: state.useSystemTheme,
    notificationPreferences: state.notificationPreferences,
    enableOfflineMode: state.enableOfflineMode,
  };
  
  await storage.set(storage.keys.SETTINGS, settings);
}
