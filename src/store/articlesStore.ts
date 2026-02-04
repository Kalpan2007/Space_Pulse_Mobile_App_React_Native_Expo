/**
 * Space Pulse - Articles Store
 * Zustand state management for articles with full API capabilities
 */

import { create } from 'zustand';
import { articlesApi } from '../api';
import { Article, ArticleQueryParams, FilterState } from '../types';
import { storage } from '../utils';

interface ArticlesState {
  // Data
  articles: Article[];
  featuredArticles: Article[];
  trendingArticles: Article[];
  launchArticles: Article[];
  currentArticle: Article | null;
  
  // Pagination
  hasMore: boolean;
  offset: number;
  totalCount: number;
  
  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  isFeaturedLoading: boolean;
  isTrendingLoading: boolean;
  isLaunchLoading: boolean;
  
  // Error state
  error: string | null;
  
  // Filters
  filters: FilterState;
  
  // Actions
  fetchArticles: (refresh?: boolean) => Promise<void>;
  fetchFeaturedArticles: () => Promise<void>;
  fetchTrendingArticles: () => Promise<void>;
  fetchLaunchArticles: () => Promise<void>;
  fetchArticle: (id: number) => Promise<void>;
  loadMore: () => Promise<void>;
  searchArticles: (query: string) => Promise<void>;
  setFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;
  reset: () => void;
}

const ITEMS_PER_PAGE = 20;

const initialFilters: FilterState = {
  newsSite: null,
  search: '',
  isFeatured: null,
  dateFrom: null,
  dateTo: null,
};

export const useArticlesStore = create<ArticlesState>((set, get) => ({
  // Initial state
  articles: [],
  featuredArticles: [],
  trendingArticles: [],
  launchArticles: [],
  currentArticle: null,
  hasMore: true,
  offset: 0,
  totalCount: 0,
  isLoading: false,
  isRefreshing: false,
  isLoadingMore: false,
  isFeaturedLoading: false,
  isTrendingLoading: false,
  isLaunchLoading: false,
  error: null,
  filters: initialFilters,

  fetchArticles: async (refresh = false) => {
    const state = get();
    
    if (state.isLoading && !refresh) return;
    
    set({
      isLoading: !refresh,
      isRefreshing: refresh,
      error: null,
    });

    try {
      const params: ArticleQueryParams = {
        limit: ITEMS_PER_PAGE,
        offset: 0,
        ordering: '-published_at',
      };

      // Apply filters
      if (state.filters.search) params.search = state.filters.search;
      if (state.filters.newsSite) params.news_site = state.filters.newsSite;
      if (state.filters.isFeatured !== null) params.is_featured = state.filters.isFeatured;
      if (state.filters.dateFrom) params.published_at_gte = state.filters.dateFrom;
      if (state.filters.dateTo) params.published_at_lte = state.filters.dateTo;

      const response = await articlesApi.getArticles(params);
      
      // Cache latest articles for offline
      await storage.setWithExpiry(
        storage.keys.CACHED_ARTICLES,
        response.results.slice(0, 20)
      );

      set({
        articles: response.results,
        totalCount: response.count,
        hasMore: response.next !== null,
        offset: ITEMS_PER_PAGE,
        isLoading: false,
        isRefreshing: false,
      });
    } catch (error) {
      // Try to load from cache on error
      const cached = await storage.getWithExpiry<Article[]>(storage.keys.CACHED_ARTICLES);
      
      set({
        articles: cached || [],
        isLoading: false,
        isRefreshing: false,
        error: error instanceof Error ? error.message : 'Failed to load articles',
      });
    }
  },

  fetchFeaturedArticles: async () => {
    set({ isFeaturedLoading: true });

    try {
      const response = await articlesApi.getFeaturedArticles(5);
      
      // Cache featured articles
      await storage.setWithExpiry(
        storage.keys.CACHED_FEATURED,
        response.results
      );

      set({
        featuredArticles: response.results,
        isFeaturedLoading: false,
      });
    } catch (error) {
      // Try to load from cache
      const cached = await storage.getWithExpiry<Article[]>(storage.keys.CACHED_FEATURED);
      
      set({
        featuredArticles: cached || [],
        isFeaturedLoading: false,
      });
    }
  },

  fetchTrendingArticles: async () => {
    set({ isTrendingLoading: true });

    try {
      const response = await articlesApi.getTrendingArticles(8);
      
      set({
        trendingArticles: response.results,
        isTrendingLoading: false,
      });
    } catch (error) {
      set({
        trendingArticles: [],
        isTrendingLoading: false,
      });
    }
  },

  fetchLaunchArticles: async () => {
    set({ isLaunchLoading: true });

    try {
      const response = await articlesApi.getLaunchArticles(10);
      
      set({
        launchArticles: response.results,
        isLaunchLoading: false,
      });
    } catch (error) {
      set({
        launchArticles: [],
        isLaunchLoading: false,
      });
    }
  },

  fetchArticle: async (id: number) => {
    set({ isLoading: true, error: null });

    try {
      const article = await articlesApi.getArticle(id);
      
      // Cache last opened article
      await storage.set(storage.keys.LAST_OPENED_ARTICLE, article);

      set({
        currentArticle: article,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load article',
      });
    }
  },

  loadMore: async () => {
    const state = get();
    
    if (state.isLoadingMore || !state.hasMore) return;

    set({ isLoadingMore: true });

    try {
      const params: ArticleQueryParams = {
        limit: ITEMS_PER_PAGE,
        offset: state.offset,
        ordering: '-published_at',
      };

      // Apply filters
      if (state.filters.search) params.search = state.filters.search;
      if (state.filters.newsSite) params.news_site = state.filters.newsSite;
      if (state.filters.isFeatured !== null) params.is_featured = state.filters.isFeatured;

      const response = await articlesApi.getArticles(params);

      set({
        articles: [...state.articles, ...response.results],
        hasMore: response.next !== null,
        offset: state.offset + ITEMS_PER_PAGE,
        isLoadingMore: false,
      });
    } catch (error) {
      set({
        isLoadingMore: false,
        error: error instanceof Error ? error.message : 'Failed to load more articles',
      });
    }
  },

  searchArticles: async (query: string) => {
    set({
      isLoading: true,
      error: null,
      filters: { ...get().filters, search: query },
    });

    try {
      const response = await articlesApi.searchArticles(query);

      set({
        articles: response.results,
        totalCount: response.count,
        hasMore: response.next !== null,
        offset: ITEMS_PER_PAGE,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Search failed',
      });
    }
  },

  setFilters: (filters: Partial<FilterState>) => {
    set({ filters: { ...get().filters, ...filters } });
  },

  clearFilters: () => {
    set({ filters: initialFilters });
  },

  reset: () => {
    set({
      articles: [],
      featuredArticles: [],
      currentArticle: null,
      hasMore: true,
      offset: 0,
      totalCount: 0,
      isLoading: false,
      isRefreshing: false,
      isLoadingMore: false,
      error: null,
      filters: initialFilters,
    });
  },
}));
