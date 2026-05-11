# Architecture Documentation

## Overview

Space Pulse is a React Native mobile application built with Expo that aggregates space news from the Spaceflight News API v4. The architecture follows a clean separation of concerns with distinct layers for API communication, state management, UI components, and navigation.

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌─────────┐  │
│  │ Screens  │ │Components│ │  Hooks   │ │ Theme   │  │
│  └───────────┘ └───────────┘ └───────────┘ └─────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                    State Management Layer                   │
│  ┌───────────────────────────────────────────────────┐       │
│  │              Zustand Stores                    │       │
│  │  articlesStore │ blogsStore │ savedItemsStore   │       │
│  └───────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                         │
│  ┌─────────────────────────────────────────────────┐     │
│  │           API Services (Axios)                    │     │
│  │  articles.ts │ blogs.ts │ reports.ts │ info.ts  │     │
│  └─────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                           │
│  ┌──────────────────┐  ┌──────────────────────┐    │
│  │  API Client       │  │  AsyncStorage         │    │
│  │  (Axios + Int.)   │  │  (Persistence)       │    │
│  └──────────────────┘  └──────────────────────┘    │
└───���─────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
src/
├── api/                    # API service layer
│   ├── client.ts          # Axios instance with interceptors
│   ├── articles.ts       # Articles API calls
│   ├── blogs.ts          # Blogs API calls
│   ├── reports.ts       # Reports API calls
│   ├── info.ts          # API metadata
│   └── index.ts        # Exports
│
├── components/           # Reusable UI components
│   ├── ArticleCard.tsx
│   ├── FeaturedCarousel.tsx
│   ├── SearchBar.tsx
│   ├── SaveButton.tsx
│   ├── GlassCard.tsx
│   └── ...
│
├── screens/             # App screens
│   ├── HomeScreen.tsx
│   ├── ExploreScreen.tsx
│   ├── SearchScreen.tsx
│   ├── SavedScreen.tsx
│   ├── SettingsScreen.tsx
│   └── ...
│
├── navigation/         # Navigation configuration
│   ├── RootNavigator.tsx
│   ├── TabNavigator.tsx
│   └── index.ts
│
├── store/             # Zustand state stores
│   ├── articlesStore.ts
│   ├── blogsStore.ts
│   ├── reportsStore.ts
│   ├── savedItemsStore.ts
│   ├── settingsStore.ts
│   └── index.ts
│
├── hooks/            # Custom React hooks
│   ├── useDebounce.ts
│   ├── usePagination.ts
│   ├── useRefresh.ts
│   ├── useAnimations.ts
│   └── index.ts
│
├── theme/           # Design system
│   ├── styles.ts
│   ├── index.ts
│   └── colors.ts
│
├── types/           # TypeScript definitions
│   └── index.ts
│
└── utils/          # Utility functions
    ├── storage.ts
    ├── haptics.ts
    ├── date.ts
    └── index.ts
```

---

## API Layer

### Axios Client (`src/api/client.ts`)

The API client is configured with:
- Base URL: `https://api.spaceflightnewsapi.net/v4`
- 15-second timeout
- Request/Response interceptors for logging and error handling

**Request Interceptor:**
- Adds timestamp metadata for performance tracking
- Logs requests in development mode

**Response Interceptor:**
- Calculates request duration
- Handles HTTP errors (400, 404, 429, 500+)
- Provides user-friendly error messages

### API Services

Each domain has its own service file:
- `articles.ts` - Full CRUD + search, filters, featured, trending
- `blogs.ts` - Blog posts
- `reports.ts` - Industry reports
- `info.ts` - API metadata and news sources

---

## State Management

### Zustand Stores

The app uses Zustand for lightweight, scalable state management:

| Store | Purpose |
|-------|---------|
| `articlesStore` | Articles list, featured, trending, pagination |
| `blogsStore` | Blog posts and featured blogs |
| `reportsStore` | Industry reports |
| `savedItemsStore` | Bookmarked articles (AsyncStorage persisted) |
| `settingsStore` | User preferences |
| `newsSourcesStore` | Cached news sources |

### Store Pattern

Each store follows a consistent pattern:

```typescript
interface State {
  // Data
  items: Item[];
  
  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  
  // Error state
  error: string | null;
  
  // Actions
  fetchItems: () => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => void;
}
```

---

## Navigation

### Stack + Tab Navigation

```
RootNavigator (Stack)
├── MainTabs (Tab Navigator)
│   ├── Home Tab → HomeScreen
│   ├── Explore Tab → ExploreScreen
���   ├── Saved Tab → SavedScreen
│   └── Settings Tab → SettingsScreen
├── ArticleDetail (Stack Screen)
├── BlogDetail (Stack Screen)
├── ReportDetail (Stack Screen)
└── Search (Modal Screen)
```

### Navigation Flow

1. **Home Flow:** HomeScreen → ArticleDetailScreen → NewsSiteArticles
2. **Explore Flow:** ExploreScreen → BlogDetailScreen / ReportDetailScreen
3. **Search Flow:** SearchScreen (modal) → ArticleDetailScreen
4. **Saved Flow:** SavedScreen → ArticleDetailScreen

---

## Data Flow

### Fetching Articles

```
User Action
    │
    ▼
Screens/Components
    │ calls
    ▼
Zustand Store Action
    │ calls
    ▼
API Service
    │ calls
    ▼
Axios Client
    │ HTTP GET
    ▼
Spaceflight News API
    │ JSON Response
    ▼
Store Update + AsyncStorage Cache
    │
    ▼
UI Re-render
```

### Save Article Flow

```
SaveButton Press
    │
    ▼
Haptic Feedback
    │
    ▼
savedItemsStore.addItem()
    │
    ▼
AsyncStorage.set()
    │
    ▼
UI Update (icon change)
```

---

## Caching Strategy

### AsyncStorage Keys

| Key | Data | TTL |
|-----|------|-----|
| `cached_articles` | Latest 20 articles | 1 hour |
| `cached_featured` | Featured articles | 1 hour |
| `cached_blogs` | Latest blogs | 1 hour |
| `saved_items` | Bookmarked items | Permanent |
| `settings` | User preferences | Permanent |
| `last_opened_article` | Last viewed article | 24 hours |

### Cache Implementation

```typescript
// Storage with expiry
storage.setWithExpiry(key, data, ttlMs);
const cached = storage.getWithExpiry<T>(key);

// If API fails, load from cache
if (isOffline) {
  articles = await storage.getWithExpiry('cached_articles');
}
```

---

## Error Handling

### Error Types

| Error Code | Message | User Action |
|-----------|---------|------------|
| `ECONNABORTED` | Request timeout | Retry |
| No response | Network error | Check connection |
| 400 | Invalid request | Contact support |
| 404 | Content not found | - |
| 429 | Too many requests | Wait, retry |
| 500+ | Server error | Retry later |

### Error State UI

Components handle errors via stores:
- `isLoading` - Show skeleton
- `error` - Show ErrorState component
- Empty results - Show EmptyState component

---

## Performance Optimizations

1. **Debounced Search** - 300ms delay, cancels pending requests
2. **Pagination** - 20 items per page with infinite scroll
3. **Image Caching** - CachedImage component with Expo Image
4. **FlashList** - For long lists (60 FPS scrolling)
5. **Memoization** - React.memo on static components
6. **Request Cancellation** - AbortController for stale requests

---

## Security

- **HTTPS Only** - Axios enforces HTTPS
- **No Secrets** - API is public
- **URL Encoding** - Search queries encoded
- **Input Sanitization** - XSS prevention (future)

---

## Future Enhancements

- JWT authentication for private APIs
- Push notifications
- Offline-first with background sync
- User profiles and preferences
- Analytics integration