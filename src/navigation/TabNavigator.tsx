/**
 * Space Pulse - Tab Navigator
 * Bottom tab navigation with blur background and glow effects
 */

import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import {
  HomeScreen,
  ExploreScreen,
  SavedScreen,
  SettingsScreen,
} from '../screens';
import { triggerHaptic } from '../utils';
import { colors, spacing, borderRadius } from '../theme';
import type { TabParamList } from '../types';

const Tab = createBottomTabNavigator<TabParamList>();

interface TabIconProps {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  color: string;
}

const TabIcon = ({ name, focused, color }: TabIconProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(focused ? 1.15 : 1, {
            damping: 12,
            stiffness: 150,
          }),
        },
      ],
    };
  });

  return (
    <View style={styles.tabIconContainer}>
      {focused && <View style={[styles.tabGlow, { backgroundColor: color }]} />}
      <Animated.View style={animatedStyle}>
        <Ionicons name={name} size={24} color={color} />
      </Animated.View>
    </View>
  );
};

const TabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 65 + (Platform.OS === 'ios' ? insets.bottom : spacing.md),
            paddingBottom: Platform.OS === 'ios' ? insets.bottom : spacing.md,
          },
        ],
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint="dark"
            style={StyleSheet.absoluteFill}
          >
            <View style={styles.tabBarOverlay} />
          </BlurView>
        ),
      }}
      screenListeners={{
        tabPress: () => {
          triggerHaptic('light');
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'compass' : 'compass-outline'} focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'bookmark' : 'bookmark-outline'} focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'settings' : 'settings-outline'} focused={focused} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: 0,
    borderTopColor: 'transparent',
  },
  tabBarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: `${colors.background}CC`,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 28,
  },
  tabGlow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    opacity: 0.2,
  },
});

export default TabNavigator;
