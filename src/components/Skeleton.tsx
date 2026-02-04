/**
 * Space Pulse - Skeleton Loader Component
 * Shimmer loading placeholder
 */

import React, { memo, useEffect } from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius } from '../theme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadiusSize?: keyof typeof borderRadius;
  style?: StyleProp<ViewStyle>;
}

export const Skeleton = memo<SkeletonProps>(({
  width = '100%',
  height = 16,
  borderRadiusSize = 'sm',
  style,
}) => {
  const translateX = useSharedValue(-1);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(1, {
        duration: 1200,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value * 200 }],
  }));

  return (
    <View
      style={[
        styles.container,
        {
          width: width as any,
          height,
          borderRadius: borderRadius[borderRadiusSize],
        },
        style,
      ]}
    >
      <Animated.View style={[styles.shimmer, animatedStyle]}>
        <LinearGradient
          colors={[
            'transparent',
            'rgba(255, 255, 255, 0.08)',
            'transparent',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceLight,
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '200%',
  },
  gradient: {
    flex: 1,
  },
});

Skeleton.displayName = 'Skeleton';
