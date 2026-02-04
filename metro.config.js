const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Alias react-native-reanimated to our polyfill for Expo Go compatibility
config.resolver.extraNodeModules = {
  'react-native-reanimated': path.resolve(__dirname, 'react-native-reanimated.js'),
};

module.exports = config;
