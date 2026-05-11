# API Documentation

## Spaceflight News API v4

Space Pulse integrates with the [Spaceflight News API](https://spaceflightnewsapi.net/) to provide real-time space news, blogs, and industry reports.

**Base URL:** `https://api.spaceflightnewsapi.net/v4`  
**Authentication:** Public API (no key required)  
**Rate Limit:** Not officially documented

---

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/articles/` | Paginated space news articles |
| `GET` | `/articles/{id}/` | Single article by ID |
| `GET` | `/blogs/` | Space industry blog posts |
| `GET` | `/blogs/{id}/` | Single blog post |
| `GET` | `/reports/` | Industry reports & analysis |
| `GET` | `/reports/{id}/` | Single report |
| `GET` | `/info/` | API metadata & news sources |

---

## Articles API

### GET /articles/

Returns a paginated list of articles.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | integer | Number of results (default: 20, max: 100) |
| `offset` | integer | Pagination offset |
| `ordering` | string | Sort field (e.g., `-published_at`) |
| `search` | string | Full-text search |
| `news_site` | string | Filter by news source |
| `is_featured` | boolean | Filter featured articles |
| `published_at_gte` | ISO8601 | Published after date |
| `published_at_lte` | ISO8601 | Published before date |
| `has_launch` | boolean | Has launch coverage |
| `has_event` | boolean | Has event coverage |
| `title_contains` | string | Title contains exact phrase |
| `title_contains_one` | string | Title contains any word (comma-separated) |

**Example Request:**

```
GET /articles/?limit=20&ordering=-published_at HTTP/1.1
Host: api.spaceflightnewsapi.net
Accept: application/json
```

**Example Response:**

```json
{
  "count": 1247,
  "next": "https://api.spaceflightnewsapi.net/v4/articles/?limit=20&offset=20",
  "previous": null,
  "results": [
    {
      "id": 12345,
      "title": "SpaceX Starship Successfully Reaches Orbit",
      "url": "https://spacenews.com/starship-orbit/",
      "image_url": "https://cdn.example.com/starship.jpg",
      "news_site": "SpaceNews",
      "summary": "SpaceX's Starship vehicle achieved orbital velocity...",
      "published_at": "2026-02-09T14:30:00Z",
      "updated_at": "2026-02-09T15:00:00Z",
      "featured": true,
      "launches": [
        {
          "launch_id": "abc-123",
          "provider": "Launch Library 2"
        }
      ],
      "events": [],
      "authors": [
        {
          "name": "John Doe",
          "socials": {
            "x": "https://twitter.com/johndoe",
            "linkedin": "https://linkedin.com/in/johndoe"
          }
        }
      ]
    }
  ]
}
```

---

### GET /articles/{id}/

Returns a single article by ID.

**Example:**

```
GET /articles/12345/ HTTP/1.1
```

---

## Blogs API

### GET /blogs/

Returns a paginated list of blog posts.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | integer | Number of results |
| `offset` | integer | Pagination offset |
| `ordering` | string | Sort field |
| `search` | string | Full-text search |
| `news_site` | string | Filter by news source |

**Example Response:**

```json
{
  "count": 342,
  "next": "https://api.spaceflightnewsapi.net/v4/blogs/?limit=20&offset=20",
  "previous": null,
  "results": [
    {
      "id": 6789,
      "title": "Inside NASA's Artemis Program",
      "url": "https://blog.nasa.gov/artemis/",
      "image_url": "https://cdn.example.com/artemis.jpg",
      "news_site": "NASA",
      "summary": "A deep dive into the lunar mission...",
      "published_at": "2026-02-08T10:00:00Z",
      "updated_at": "2026-02-08T12:00:00Z",
      "featured": false,
      "launches": [],
      "events": [],
      "authors": []
    }
  ]
}
```

---

## Reports API

### GET /reports/

Returns a paginated list of industry reports.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | integer | Number of results |
| `offset` | integer | Pagination offset |
| `ordering` | string | Sort field |
| `search` | string | Full-text search |

**Example Response:**

```json
{
  "count": 156,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 9012,
      "title": "Space Industry Year in Review 2025",
      "url": "https://example.com/reports/2025/",
      "image_url": "https://cdn.example.com/report.jpg",
      "news_site": "SpaceNews",
      "summary": "Annual analysis of the space industry...",
      "published_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-02T00:00:00Z"
    }
  ]
}
```

---

## Info API

### GET /info/

Returns API metadata and available news sources.

**Example Response:**

```json
{
  "version": "4.0.0",
  "news_sites": [
    "NASA",
    "SpaceNews",
    "SpaceX",
    "Space.com",
    "Ars Technica",
    "..."
  ]
}
```

---

## Space Pulse API Usage

### API Client Configuration

```typescript
// src/api/client.ts
const apiClient = axios.create({
  baseURL: 'https://api.spaceflightnewsapi.net/v4',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});
```

### Articles Service

```typescript
// src/api/articles.ts
export const articlesApi = {
  getArticles: async (params) => { ... },
  getFeaturedArticles: async (limit) => { ... },
  getLatestArticles: async (limit, offset) => { ... },
  getArticle: async (id) => { ... },
  searchArticles: async (query, limit) => { ... },
  getArticlesByNewsSite: async (newsSite, limit, offset) => { ... },
  getLaunchArticles: async (limit) => { ... },
  getEventArticles: async (limit) => { ... },
  getTrendingArticles: async (limit) => { ... },
  getRecentArticles: async (days, limit) => { ... },
};
```

---

## Error Handling

### HTTP Status Codes

| Status | Meaning | Handling |
|--------|---------|----------|
| 200 | Success | Process response |
| 400 | Bad Request | Validate parameters |
| 404 | Not Found | Show empty state |
| 429 | Rate Limited | Retry after delay |
| 500 | Server Error | Retry later |

### Error Messages

| Error Code | Message |
|-----------|---------|
| `ECONNABORTED` | Request timeout. Please check your connection. |
| No response | Network error. Please check your internet connection. |
| 400 | Invalid request. Please try again. |
| 404 | Content not found. |
| 429 | Too many requests. Please wait a moment. |
| 500+ | Server error. Please try again later. |

---

## Common Use Cases

### Fetch Featured Articles

```typescript
const response = await apiClient.get('/articles/', {
  params: {
    is_featured: true,
    limit: 5,
    ordering: '-published_at',
  },
});
```

### Search Articles

```typescript
const response = await apiClient.get('/articles/', {
  params: {
    search: 'Mars',
    limit: 20,
    ordering: '-published_at',
  },
});
```

### Filter by News Source

```typescript
const response = await apiClient.get('/articles/', {
  params: {
    news_site: 'NASA',
    limit: 20,
  },
});
```

### Get Recent Articles (Last 7 Days)

```typescript
const now = new Date();
const pastDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

const response = await apiClient.get('/articles/', {
  params: {
    published_at_gte: pastDate.toISOString(),
    limit: 20,
    ordering: '-published_at',
  },
});
```

---

## Pagination

The API supports offset-based pagination:

```json
{
  "count": 1247,
  "next": "https://api.spaceflightnewsapi.net/v4/articles/?limit=20&offset=20",
  "previous": null,
  "results": [...]
}
```

**Implementation:**

```typescript
const PAGE_SIZE = 20;

const loadMore = async () => {
  if (!hasMore) return;
  
  const response = await articlesApi.getArticles({
    limit: PAGE_SIZE,
    offset: currentOffset,
  });
  
  setArticles([...articles, ...response.results]);
  setHasMore(response.next !== null);
  setOffset(offset + PAGE_SIZE);
};
```

---

## TypeScript Types

### Article Type

```typescript
interface Article {
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

interface Author {
  name: string;
  socials: {
    x?: string;
    youtube?: string;
    instagram?: string;
    linkedin?: string;
    mastodon?: string;
    bluesky?: string;
  };
}

interface Launch {
  launch_id: string;
  provider: string;
}

interface Event {
  event_id: number;
  provider: string;
}
```

### Response Types

```typescript
interface ArticleListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Article[];
}
```

---

## Rate Limiting Strategy

Space Pulse implements:

1. **15-second timeout** - Prevents hanging requests
2. **Debounced search** - 300ms delay
3. **Request cancellation** - AbortController for stale requests
4. **Exponential backoff** - Future retry logic

---

## External Resources

- [Spaceflight News API](https://spaceflightnewsapi.net/)
- [API Documentation](https://api.spaceflightnewsapi.net/v4/docs/)
- [GitHub](https://github.com/spaceflightnews/go)