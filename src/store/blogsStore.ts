/**
 * Space Pulse - Blogs Store
 * Zustand state management for blogs
 */

import { create } from 'zustand';
import { blogsApi } from '../api';
import { Blog, BlogQueryParams } from '../types';

interface BlogsState {
  // Data
  blogs: Blog[];
  currentBlog: Blog | null;
  
  // Pagination
  hasMore: boolean;
  offset: number;
  totalCount: number;
  
  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  
  // Error state
  error: string | null;
  
  // Search
  searchQuery: string;
  
  // Actions
  fetchBlogs: (refresh?: boolean) => Promise<void>;
  fetchBlog: (id: number) => Promise<void>;
  loadMore: () => Promise<void>;
  searchBlogs: (query: string) => Promise<void>;
  reset: () => void;
}

const ITEMS_PER_PAGE = 20;

export const useBlogsStore = create<BlogsState>((set, get) => ({
  // Initial state
  blogs: [],
  currentBlog: null,
  hasMore: true,
  offset: 0,
  totalCount: 0,
  isLoading: false,
  isRefreshing: false,
  isLoadingMore: false,
  error: null,
  searchQuery: '',

  fetchBlogs: async (refresh = false) => {
    const state = get();
    
    if (state.isLoading && !refresh) return;
    
    set({
      isLoading: !refresh,
      isRefreshing: refresh,
      error: null,
    });

    try {
      const params: BlogQueryParams = {
        limit: ITEMS_PER_PAGE,
        offset: 0,
        ordering: '-published_at',
      };

      if (state.searchQuery) {
        params.search = state.searchQuery;
      }

      const response = await blogsApi.getBlogs(params);

      set({
        blogs: response.results,
        totalCount: response.count,
        hasMore: response.next !== null,
        offset: ITEMS_PER_PAGE,
        isLoading: false,
        isRefreshing: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        isRefreshing: false,
        error: error instanceof Error ? error.message : 'Failed to load blogs',
      });
    }
  },

  fetchBlog: async (id: number) => {
    set({ isLoading: true, error: null });

    try {
      const blog = await blogsApi.getBlog(id);

      set({
        currentBlog: blog,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load blog',
      });
    }
  },

  loadMore: async () => {
    const state = get();
    
    if (state.isLoadingMore || !state.hasMore) return;

    set({ isLoadingMore: true });

    try {
      const params: BlogQueryParams = {
        limit: ITEMS_PER_PAGE,
        offset: state.offset,
        ordering: '-published_at',
      };

      if (state.searchQuery) {
        params.search = state.searchQuery;
      }

      const response = await blogsApi.getBlogs(params);

      set({
        blogs: [...state.blogs, ...response.results],
        hasMore: response.next !== null,
        offset: state.offset + ITEMS_PER_PAGE,
        isLoadingMore: false,
      });
    } catch (error) {
      set({
        isLoadingMore: false,
        error: error instanceof Error ? error.message : 'Failed to load more blogs',
      });
    }
  },

  searchBlogs: async (query: string) => {
    set({
      isLoading: true,
      error: null,
      searchQuery: query,
    });

    try {
      const response = await blogsApi.searchBlogs(query);

      set({
        blogs: response.results,
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

  reset: () => {
    set({
      blogs: [],
      currentBlog: null,
      hasMore: true,
      offset: 0,
      totalCount: 0,
      isLoading: false,
      isRefreshing: false,
      isLoadingMore: false,
      error: null,
      searchQuery: '',
    });
  },
}));
