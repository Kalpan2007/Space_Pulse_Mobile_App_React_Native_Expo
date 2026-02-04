/**
 * Space Pulse - Glass Card Component
 * Glassmorphism card with blur effect
 */

import React, { memo } from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, borderRadius, spacing } from '../theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  padding?: number;
  borderRadiusSize?: keyof typeof borderRadius;
}

export const GlassCard = memo<GlassCardProps>(({
  children,
  style,
  intensity = 30,
  padding = spacing.lg,
  borderRadiusSize = 'lg',
}) => {
  return (
    <View style={[
      styles.container,
      { borderRadius: borderRadius[borderRadiusSize] },
      style,
    ]}>
      <BlurView
        intensity={intensity}
        tint="dark"
        style={[
          styles.blur,
          {
            borderRadius: borderRadius[borderRadiusSize],
            padding,
          },
        ]}
      >
        {children}
      </BlurView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glass,
  },
  blur: {
    overflow: 'hidden',
  },
});

GlassCard.displayName = 'GlassCard';
