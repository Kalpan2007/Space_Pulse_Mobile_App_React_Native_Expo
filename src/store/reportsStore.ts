/**
 * Space Pulse - Reports Store
 * Zustand state management for reports
 */

import { create } from 'zustand';
import { reportsApi } from '../api';
import { Report, ReportQueryParams } from '../types';

interface ReportsState {
  // Data
  reports: Report[];
  currentReport: Report | null;
  
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
  fetchReports: (refresh?: boolean) => Promise<void>;
  fetchReport: (id: number) => Promise<void>;
  loadMore: () => Promise<void>;
  searchReports: (query: string) => Promise<void>;
  reset: () => void;
}

const ITEMS_PER_PAGE = 20;

export const useReportsStore = create<ReportsState>((set, get) => ({
  // Initial state
  reports: [],
  currentReport: null,
  hasMore: true,
  offset: 0,
  totalCount: 0,
  isLoading: false,
  isRefreshing: false,
  isLoadingMore: false,
  error: null,
  searchQuery: '',

  fetchReports: async (refresh = false) => {
    const state = get();
    
    if (state.isLoading && !refresh) return;
    
    set({
      isLoading: !refresh,
      isRefreshing: refresh,
      error: null,
    });

    try {
      const params: ReportQueryParams = {
        limit: ITEMS_PER_PAGE,
        offset: 0,
        ordering: '-published_at',
      };

      if (state.searchQuery) {
        params.search = state.searchQuery;
      }

      const response = await reportsApi.getReports(params);

      set({
        reports: response.results,
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
        error: error instanceof Error ? error.message : 'Failed to load reports',
      });
    }
  },

  fetchReport: async (id: number) => {
    set({ isLoading: true, error: null });

    try {
      const report = await reportsApi.getReport(id);

      set({
        currentReport: report,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load report',
      });
    }
  },

  loadMore: async () => {
    const state = get();
    
    if (state.isLoadingMore || !state.hasMore) return;

    set({ isLoadingMore: true });

    try {
      const params: ReportQueryParams = {
        limit: ITEMS_PER_PAGE,
        offset: state.offset,
        ordering: '-published_at',
      };

      if (state.searchQuery) {
        params.search = state.searchQuery;
      }

      const response = await reportsApi.getReports(params);

      set({
        reports: [...state.reports, ...response.results],
        hasMore: response.next !== null,
        offset: state.offset + ITEMS_PER_PAGE,
        isLoadingMore: false,
      });
    } catch (error) {
      set({
        isLoadingMore: false,
        error: error instanceof Error ? error.message : 'Failed to load more reports',
      });
    }
  },

  searchReports: async (query: string) => {
    set({
      isLoading: true,
      error: null,
      searchQuery: query,
    });

    try {
      const response = await reportsApi.searchReports(query);

      set({
        reports: response.results,
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
      reports: [],
      currentReport: null,
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
