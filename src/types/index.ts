/**
 * Space Pulse - TypeScript Type Definitions
 * Based on Spaceflight News API v4
 */

// ============================================
// Author Types
// ============================================
export interface AuthorSocials {
  x?: string | null;
  youtube?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  mastodon?: string | null;
  bluesky?: string | null;
}

export interface Author {
  name: string;
  socials: AuthorSocials;
}

// ============================================
// Launch & Event Types
// ============================================
export interface Launch {
  launch_id: string;
  provider: string;
}

export interface Event {
  event_id: number;
  provider: string;
}

// ============================================
// Article Types
// ============================================
export interface Article {
  id: number;
  title: string;
  authors: Author[];
  url: string;
  image_url: string;
  news_site: string;
  summary: string;
  published_at: string;
  updated_at: string;
  featured: boolean;
  launches: Launch[];
  events: Event[];
}

export interface ArticleListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Article[];
}

// ============================================
// Blog Types
// ============================================
export interface Blog {
  id: number;
  title: string;
  authors: Author[];
  url: string;
  image_url: string;
  news_site: string;
  summary: string;
  published_at: string;
  updated_at: string;
  featured: boolean;
  launches: Launch[];
  events: Event[];
}

export interface BlogListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Blog[];
}

// ============================================
// Report Types
// ============================================
export interface Report {
  id: number;
  title: string;
  url: string;
  image_url: string;
  news_site: string;
  summary: string;
  published_at: string;
  updated_at: string;
}

export interface ReportListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Report[];
}

// ============================================
// Info Types (News Sources)
// ============================================
export interface NewsSource {
  name: string;
  description?: string;
}

export interface InfoResponse {
  version: string;
  news_sites: string[];
}

// ============================================
// API Query Parameters
// ============================================
export interface ArticleQueryParams {
  limit?: number;
  offset?: number;
  ordering?: string;
  search?: string;
  news_site?: string;
  is_featured?: boolean;
  published_at_gte?: string;
  published_at_lte?: string;
  has_launch?: boolean;
  has_event?: boolean;
  title_contains?: string;
  title_contains_one?: string;
  summary_contains?: string;
  summary_contains_one?: string;
}

export interface BlogQueryParams {
  limit?: number;
  offset?: number;
  ordering?: string;
  search?: string;
  news_site?: string;
}

export interface ReportQueryParams {
  limit?: number;
  offset?: number;
  ordering?: string;
  search?: string;
}

// ============================================
// App State Types
// ============================================
export type ContentType = 'article' | 'blog' | 'report';

export interface SavedItem {
  id: number;
  type: ContentType;
  savedAt: string;
  data: Article | Blog | Report;
}

export interface CachedData<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

// ============================================
// UI State Types
// ============================================
export interface LoadingState {
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: string | null;
}

export interface FilterState {
  newsSite: string | null;
  search: string;
  isFeatured: boolean | null;
  dateFrom: string | null;
  dateTo: string | null;
}

// ============================================
// Navigation Types
// ============================================
export type RootStackParamList = {
  MainTabs: undefined;
  ArticleDetail: { articleId: number };
  BlogDetail: { blogId: number };
  ReportDetail: { reportId: number };
  AuthorProfile: { author: Author };
  NewsSiteArticles: { newsSite: string };
  Search: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Explore: undefined;
  Saved: undefined;
  Settings: undefined;
};

// Alias for TabNavigator
export type TabParamList = MainTabParamList;

// ============================================
// Notification Types (Future Ready)
// ============================================
export interface NotificationPreferences {
  breakingNews: boolean;
  featuredArticles: boolean;
  dailyDigest: boolean;
}

export interface PushNotificationPayload {
  type: 'breaking_news' | 'featured_article' | 'daily_digest';
  contentId?: number;
  contentType?: ContentType;
  title: string;
  body: string;
}
