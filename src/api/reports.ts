/**
 * Space Pulse - Reports API Service
 */

import apiClient from './client';
import {
  Report,
  ReportListResponse,
  ReportQueryParams,
} from '../types';

export const reportsApi = {
  /**
   * Get paginated list of reports
   */
  getReports: async (params: ReportQueryParams = {}): Promise<ReportListResponse> => {
    const queryParams: Record<string, string | number | boolean> = {};
    
    if (params.limit) queryParams.limit = params.limit;
    if (params.offset !== undefined) queryParams.offset = params.offset;
    if (params.ordering) queryParams.ordering = params.ordering;
    if (params.search) queryParams.search = params.search;
    
    const response = await apiClient.get<ReportListResponse>('/reports/', { params: queryParams });
    return response.data;
  },

  /**
   * Get latest reports
   */
  getLatestReports: async (limit: number = 20, offset: number = 0): Promise<ReportListResponse> => {
    const response = await apiClient.get<ReportListResponse>('/reports/', {
      params: {
        limit,
        offset,
        ordering: '-published_at',
      },
    });
    return response.data;
  },

  /**
   * Get single report by ID
   */
  getReport: async (id: number): Promise<Report> => {
    const response = await apiClient.get<Report>(`/reports/${id}/`);
    return response.data;
  },

  /**
   * Search reports
   */
  searchReports: async (query: string, limit: number = 20): Promise<ReportListResponse> => {
    const response = await apiClient.get<ReportListResponse>('/reports/', {
      params: {
        search: query,
        limit,
        ordering: '-published_at',
      },
    });
    return response.data;
  },
};
