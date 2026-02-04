/**
 * Space Pulse - Blogs API Service
 */

import apiClient from './client';
import {
  Blog,
  BlogListResponse,
  BlogQueryParams,
} from '../types';

export const blogsApi = {
  /**
   * Get paginated list of blogs
   */
  getBlogs: async (params: BlogQueryParams = {}): Promise<BlogListResponse> => {
    const queryParams: Record<string, string | number | boolean> = {};
    
    if (params.limit) queryParams.limit = params.limit;
    if (params.offset !== undefined) queryParams.offset = params.offset;
    if (params.ordering) queryParams.ordering = params.ordering;
    if (params.search) queryParams.search = params.search;
    if (params.news_site) queryParams.news_site = params.news_site;
    
    const response = await apiClient.get<BlogListResponse>('/blogs/', { params: queryParams });
    return response.data;
  },

  /**
   * Get latest blogs
   */
  getLatestBlogs: async (limit: number = 20, offset: number = 0): Promise<BlogListResponse> => {
    const response = await apiClient.get<BlogListResponse>('/blogs/', {
      params: {
        limit,
        offset,
        ordering: '-published_at',
      },
    });
    return response.data;
  },

  /**
   * Get single blog by ID
   */
  getBlog: async (id: number): Promise<Blog> => {
    const response = await apiClient.get<Blog>(`/blogs/${id}/`);
    return response.data;
  },

  /**
   * Search blogs
   */
  searchBlogs: async (query: string, limit: number = 20): Promise<BlogListResponse> => {
    const response = await apiClient.get<BlogListResponse>('/blogs/', {
      params: {
        search: query,
        limit,
        ordering: '-published_at',
      },
    });
    return response.data;
  },
};
