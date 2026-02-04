# Space Pulse 🚀

A premium space news & activity mobile app built with React Native and Expo. Get the latest space news, blog posts, and industry reports from the Spaceflight News API.

## ✨ Features

- **Home Feed** - Featured carousel with parallax animations, latest articles with infinite scroll
- **News Explorer** - Search and filter articles, blogs, and reports with content type tabs
- **Bookmarks** - Save your favorite content for offline access
- **Settings** - Customize notifications and manage storage
- **Premium UI** - Glassmorphism effects, blur backgrounds, gradient accents

## 🛠️ Tech Stack

- **React Native** with Expo SDK 50
- **React Navigation v6** - Bottom tabs + Native stack navigation
- **Zustand** - Lightweight state management
- **Axios** - API calls with interceptors
- **FlashList** - High-performance list rendering
- **React Native Reanimated** - Smooth 60fps animations
- **Expo Blur** - Native blur effects
- **TypeScript** - Full type safety

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or Expo Go app)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/space-pulse.git
cd space-pulse
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on your device:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app

## 📁 Project Structure

```
src/
├── api/              # API service layer
│   ├── client.ts     # Axios instance with interceptors
│   ├── articles.ts   # Articles endpoints
│   ├── blogs.ts      # Blogs endpoints
│   ├── reports.ts    # Reports endpoints
│   └── info.ts       # Info endpoints
├── components/       # Reusable UI components
│   ├── ArticleCard.tsx
│   ├── FeaturedCarousel.tsx
│   ├── GlassCard.tsx
│   └── ...
├── hooks/            # Custom React hooks
│   ├── useDebounce.ts
│   ├── usePagination.ts
│   └── useAnimations.ts
├── navigation/       # Navigation configuration
│   ├── TabNavigator.tsx
│   └── RootNavigator.tsx
├── screens/          # App screens
│   ├── HomeScreen.tsx
│   ├── ExploreScreen.tsx
│   ├── SavedScreen.tsx
│   └── SettingsScreen.tsx
├── store/            # Zustand state stores
│   ├── articlesStore.ts
│   ├── savedItemsStore.ts
│   └── settingsStore.ts
├── theme/            # Design system
│   ├── colors.ts
│   ├── typography.ts
│   └── spacing.ts
├── types/            # TypeScript definitions
└── utils/            # Utility functions
```

## 🎨 Design System

### Colors
- **Primary**: #0B0F1A (Deep Space)
- **Secondary**: #6C63FF (Cosmic Purple)
- **Accent**: #00E5FF (Electric Cyan)
- **Background**: #05070D (Void Black)

### UI Elements
- Glassmorphism cards with blur effects
- Gradient accent buttons
- Animated skeleton loaders
- Spring-based micro-interactions

## 📡 API

This app uses the [Spaceflight News API v4](https://api.spaceflightnewsapi.net/v4/docs/):

- `GET /articles/` - Space news articles
- `GET /blogs/` - Blog posts from space industry
- `GET /reports/` - Industry reports and analysis
- `GET /info/` - API info and news sources

## 🔧 Building for Production

### Using EAS Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure your project
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

### Local Build

```bash
# Generate native projects
npx expo prebuild

# Build iOS (requires macOS)
cd ios && pod install && cd ..
npx expo run:ios

# Build Android
npx expo run:android
```

## 📄 License

MIT License - feel free to use this project for learning or as a template.

## 🙏 Credits

- [Spaceflight News API](https://spaceflightnewsapi.net/) - Free API for space news
- [Expo](https://expo.dev/) - React Native development platform
- [Ionicons](https://ionic.io/ionicons) - Premium icon library
