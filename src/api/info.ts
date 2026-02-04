/**
 * Space Pulse - Info API Service
 * Get news sources and API info
 */

import apiClient from './client';
import { InfoResponse } from '../types';

export const infoApi = {
  /**
   * Get API info including all news sources
   */
  getInfo: async (): Promise<InfoResponse> => {
    const response = await apiClient.get<InfoResponse>('/info/');
    return response.data;
  },

  /**
   * Get list of all news sites
   */
  getNewsSites: async (): Promise<string[]> => {
    const response = await apiClient.get<InfoResponse>('/info/');
    return response.data.news_sites;
  },
};
