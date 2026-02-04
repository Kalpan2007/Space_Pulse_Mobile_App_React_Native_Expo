/**
 * Space Pulse - API Client
 * Axios-based HTTP client with interceptors and error handling
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = 'https://api.spaceflightnewsapi.net/v4';
const TIMEOUT = 15000; // 15 seconds

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add request timestamp for performance tracking
    config.metadata = { startTime: new Date().getTime() };
    
    if (__DEV__) {
      console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error: AxiosError) => {
    if (__DEV__) {
      console.error('❌ [API Request Error]', error.message);
    }
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = new Date().getTime() - (response.config.metadata?.startTime || 0);
    
    if (__DEV__) {
      console.log(`✅ [API Response] ${response.config.url} - ${duration}ms`);
    }
    
    return response;
  },
  (error: AxiosError) => {
    if (__DEV__) {
      console.error('❌ [API Response Error]', error.message);
    }
    
    // Handle specific error cases
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timeout. Please check your connection.'));
    }
    
    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check your internet connection.'));
    }
    
    const status = error.response.status;
    
    switch (status) {
      case 400:
        return Promise.reject(new Error('Invalid request. Please try again.'));
      case 404:
        return Promise.reject(new Error('Content not found.'));
      case 429:
        return Promise.reject(new Error('Too many requests. Please wait a moment.'));
      case 500:
      case 502:
      case 503:
        return Promise.reject(new Error('Server error. Please try again later.'));
      default:
        return Promise.reject(new Error('Something went wrong. Please try again.'));
    }
  }
);

// Extend axios config type
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
  }
}

export default apiClient;
