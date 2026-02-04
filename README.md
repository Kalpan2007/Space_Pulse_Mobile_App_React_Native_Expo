
# 🚀 Space Pulse

<p align="center">
   <img src="https://user-images.githubusercontent.com/placeholder/space-pulse-logo.png" alt="Space Pulse Logo" width="120" />
</p>

<p align="center">
   <b>The ultimate space news & activity app</b><br>
   <i>Stay ahead of the universe with real-time news, blogs, and reports from the space industry.</i>
</p>

<p align="center">
   <img src="https://img.shields.io/github/stars/Kalpan2007/Space_Pulse_Mobile_App_React_Native_Expo?style=for-the-badge" />
   <img src="https://img.shields.io/github/license/Kalpan2007/Space_Pulse_Mobile_App_React_Native_Expo?style=for-the-badge" />
   <img src="https://img.shields.io/badge/Expo-54.0.33-blueviolet?style=for-the-badge&logo=expo" />
   <img src="https://img.shields.io/badge/React_Native-0.81.5-61dafb?style=for-the-badge&logo=react" />
</p>

---

<p align="center">
   <img src="https://user-images.githubusercontent.com/placeholder/space-pulse-demo.gif" alt="Space Pulse Demo" width="600" />
   <br>
   <i>Stunning UI. Real-time space news. Lightning fast.</i>
</p>

---

A premium space news & activity mobile app built with React Native and Expo. Get the latest space news, blog posts, and industry reports from the Spaceflight News API.



---

## 📱 Screenshots

<p align="center">
   <img src="https://user-images.githubusercontent.com/placeholder/screenshot1.png" width="200" />
   <img src="https://user-images.githubusercontent.com/placeholder/screenshot2.png" width="200" />
   <img src="https://user-images.githubusercontent.com/placeholder/screenshot3.png" width="200" />
</p>

---


## 🛠️ Tech Stack

<p>
   <img src="https://img.shields.io/badge/Expo-54.0.33-blueviolet?logo=expo" />
   <img src="https://img.shields.io/badge/React_Native-0.81.5-61dafb?logo=react" />
   <img src="https://img.shields.io/badge/TypeScript-5.1.3-3178c6?logo=typescript" />
   <img src="https://img.shields.io/badge/Zustand-4.4.7-ff9800?logo=react" />
   <img src="https://img.shields.io/badge/Axios-1.6.2-5a29e4?logo=axios" />
   <img src="https://img.shields.io/badge/FlashList-2.0.2-00bcd4" />
   <img src="https://img.shields.io/badge/Reanimated-3.0.0-00e676" />
</p>


## 🚀 Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/Kalpan2007/Space_Pulse_Mobile_App_React_Native_Expo.git
cd Space_Pulse_Mobile_App_React_Native_Expo

# 2. Install dependencies
npm install

# 3. Start the app
npx expo start
```

Open in Expo Go, iOS Simulator, or Android Emulator.


## 📁 Project Structure

```text
src/
   api/         # API service layer
   components/  # Reusable UI components
   hooks/       # Custom React hooks
   navigation/  # Navigation config
   screens/     # App screens
   store/       # Zustand state stores
   theme/       # Design system
   types/       # TypeScript types
   utils/       # Utility functions
```


## 🎨 Design System

- **Colors:** Deep Space (#0B0F1A), Cosmic Purple (#6C63FF), Electric Cyan (#00E5FF), Void Black (#05070D)
- **UI:** Glassmorphism, gradients, animated skeletons, spring micro-interactions

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


---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

MIT License — use this project for learning or as a template.


---

## 🙏 Credits

- [Spaceflight News API](https://spaceflightnewsapi.net/) — Free API for space news
- [Expo](https://expo.dev/) — React Native development platform
- [Ionicons](https://ionic.io/ionicons) — Premium icon library
