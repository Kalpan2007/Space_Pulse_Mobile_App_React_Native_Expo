/**
 * Space Pulse - Main App Entry Point
 * Premium space news & activity mobile app
 */

import React, { useEffect, useCallback } from 'react';
import { StatusBar, LogBox, View, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { RootNavigator } from './src/navigation';
import { useSavedItemsStore, useSettingsStore } from './src/store';
import { colors } from './src/theme';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

// Ignore specific warnings
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

// Custom navigation theme
const SpacePulseTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.secondary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.glassBorder,
    notification: colors.accent,
  },
};

const App = () => {
  const { loadSavedItems } = useSavedItemsStore();
  const { loadSettings } = useSettingsStore();

  // Initialize app
  const initializeApp = useCallback(async () => {
    try {
      // Load persisted data
      await Promise.all([
        loadSavedItems(),
        loadSettings(),
      ]);
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      // Hide splash screen
      await SplashScreen.hideAsync();
    }
  }, [loadSavedItems, loadSettings]);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <View style={styles.container}>
          {/* Background Gradient */}
          <LinearGradient
            colors={colors.gradientSpace}
            style={StyleSheet.absoluteFill}
          />
          
          {/* Status Bar */}
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />

          {/* Navigation Container */}
          <NavigationContainer theme={SpacePulseTheme}>
            <RootNavigator />
          </NavigationContainer>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default App;
