/**
 * Space Pulse - Loading Indicator Component
 * Centered loading spinner with optional text
 */

import React, { memo, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors, spacing, typography } from '../theme';

interface LoadingIndicatorProps {
  size?: 'small' | 'large';
  text?: string;
  fullScreen?: boolean;
}

export const LoadingIndicator = memo<LoadingIndicatorProps>(({
  size = 'large',
  text,
  fullScreen = false,
}) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <Animated.View style={animatedStyle}>
        <ActivityIndicator
          size={size}
          color={colors.accent}
        />
      </Animated.View>
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  text: {
    marginTop: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

LoadingIndicator.displayName = 'LoadingIndicator';
