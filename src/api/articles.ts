/**
 * Space Pulse - Articles API Service
 * Full API v4 capabilities
 */

import apiClient from './client';
import {
  Article,
  ArticleListResponse,
  ArticleQueryParams,
} from '../types';

export const articlesApi = {
  /**
   * Get paginated list of articles
   */
  getArticles: async (params: ArticleQueryParams = {}): Promise<ArticleListResponse> => {
    const queryParams: Record<string, string | number | boolean> = {};
    
    if (params.limit) queryParams.limit = params.limit;
    if (params.offset !== undefined) queryParams.offset = params.offset;
    if (params.ordering) queryParams.ordering = params.ordering;
    if (params.search) queryParams.search = params.search;
    if (params.news_site) queryParams.news_site = params.news_site;
    if (params.is_featured !== undefined) queryParams.is_featured = params.is_featured;
    if (params.published_at_gte) queryParams.published_at_gte = params.published_at_gte;
    if (params.published_at_lte) queryParams.published_at_lte = params.published_at_lte;
    if (params.has_launch !== undefined) queryParams.has_launch = params.has_launch;
    if (params.has_event !== undefined) queryParams.has_event = params.has_event;
    if (params.title_contains) queryParams.title_contains = params.title_contains;
    if (params.title_contains_one) queryParams.title_contains_one = params.title_contains_one;
    
    const response = await apiClient.get<ArticleListResponse>('/articles/', { params: queryParams });
    return response.data;
  },

  /**
   * Get featured articles
   */
  getFeaturedArticles: async (limit: number = 5): Promise<ArticleListResponse> => {
    const response = await apiClient.get<ArticleListResponse>('/articles/', {
      params: {
        is_featured: true,
        limit,
        ordering: '-published_at',
      },
    });
    return response.data;
  },

  /**
   * Get latest articles
   */
  getLatestArticles: async (limit: number = 20, offset: number = 0): Promise<ArticleListResponse> => {
    const response = await apiClient.get<ArticleListResponse>('/articles/', {
      params: {
        limit,
        offset,
        ordering: '-published_at',
      },
    });
    return response.data;
  },

  /**
   * Get single article by ID
   */
  getArticle: async (id: number): Promise<Article> => {
    const response = await apiClient.get<Article>(`/articles/${id}/`);
    return response.data;
  },

  /**
   * Search articles
   */
  searchArticles: async (query: string, limit: number = 20): Promise<ArticleListResponse> => {
    const response = await apiClient.get<ArticleListResponse>('/articles/', {
      params: {
        search: query,
        limit,
        ordering: '-published_at',
      },
    });
    return response.data;
  },

  /**
   * Get articles by news site
   */
  getArticlesByNewsSite: async (
    newsSite: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<ArticleListResponse> => {
    const response = await apiClient.get<ArticleListResponse>('/articles/', {
      params: {
        news_site: newsSite,
        limit,
        offset,
        ordering: '-published_at',
      },
    });
    return response.data;
  },

  /**
   * Get articles with launch coverage
   */
  getLaunchArticles: async (limit: number = 10): Promise<ArticleListResponse> => {
    const response = await apiClient.get<ArticleListResponse>('/articles/', {
      params: {
        has_launch: true,
        limit,
        ordering: '-published_at',
      },
    });
    return response.data;
  },

  /**
   * Get articles with event coverage
   */
  getEventArticles: async (limit: number = 10): Promise<ArticleListResponse> => {
    const response = await apiClient.get<ArticleListResponse>('/articles/', {
      params: {
        has_event: true,
        limit,
        ordering: '-published_at',
      },
    });
    return response.data;
  },

  /**
   * Get trending articles (most recently published from popular sources)
   */
  getTrendingArticles: async (limit: number = 5): Promise<ArticleListResponse> => {
    const response = await apiClient.get<ArticleListResponse>('/articles/', {
      params: {
        limit,
        ordering: '-published_at',
        title_contains_one: 'SpaceX,NASA,Starship,Falcon,Artemis,ISS,Mars,Moon',
      },
    });
    return response.data;
  },

  /**
   * Get articles by title keyword
   */
  getArticlesByKeyword: async (keyword: string, limit: number = 10): Promise<ArticleListResponse> => {
    const response = await apiClient.get<ArticleListResponse>('/articles/', {
      params: {
        title_contains: keyword,
        limit,
        ordering: '-published_at',
      },
    });
    return response.data;
  },

  /**
   * Get articles from last N days
   */
  getRecentArticles: async (days: number = 7, limit: number = 20): Promise<ArticleListResponse> => {
    const now = new Date();
    const pastDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    const response = await apiClient.get<ArticleListResponse>('/articles/', {
      params: {
        published_at_gte: pastDate.toISOString(),
        limit,
        ordering: '-published_at',
      },
    });
    return response.data;
  },
};
