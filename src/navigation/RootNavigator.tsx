/**
 * Space Pulse - Root Stack Navigator
 * Main navigation stack with all screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import {
  ArticleDetailScreen,
  BlogDetailScreen,
  ReportDetailScreen,
  SearchScreen,
} from '../screens';
import { colors } from '../theme';
import type { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
        animation: 'slide_from_right',
      }}
    >
      {/* Main Tab Navigator */}
      <Stack.Screen name="MainTabs" component={TabNavigator} />

      {/* Detail Screens */}
      <Stack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={{
          animation: 'slide_from_bottom',
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="BlogDetail"
        component={BlogDetailScreen}
        options={{
          animation: 'slide_from_bottom',
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="ReportDetail"
        component={ReportDetailScreen}
        options={{
          animation: 'slide_from_bottom',
          gestureEnabled: true,
        }}
      />

      {/* Modal Screens */}
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          presentation: 'fullScreenModal',
          animation: 'fade',
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
