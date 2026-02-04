/**
 * Space Pulse - Animated Value Hooks
 * Reanimated animation utilities
 */

import { useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  WithSpringConfig,
  WithTimingConfig,
} from 'react-native-reanimated';

const defaultSpringConfig: WithSpringConfig = {
  damping: 15,
  stiffness: 150,
  mass: 1,
};

/**
 * Hook for press scale animation
 */
export function usePressAnimation(
  activeScale: number = 0.96,
  config: WithSpringConfig = defaultSpringConfig
) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = useCallback(() => {
    scale.value = withSpring(activeScale, config);
  }, [activeScale, config, scale]);

  const onPressOut = useCallback(() => {
    scale.value = withSpring(1, config);
  }, [config, scale]);

  return {
    animatedStyle,
    onPressIn,
    onPressOut,
  };
}

/**
 * Hook for fade animation
 */
export function useFadeAnimation(
  initialOpacity: number = 0,
  duration: number = 300
) {
  const opacity = useSharedValue(initialOpacity);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const fadeIn = useCallback(() => {
    opacity.value = withTiming(1, { duration });
  }, [duration, opacity]);

  const fadeOut = useCallback(() => {
    opacity.value = withTiming(0, { duration });
  }, [duration, opacity]);

  return {
    animatedStyle,
    fadeIn,
    fadeOut,
    opacity,
  };
}

/**
 * Hook for slide animation
 */
export function useSlideAnimation(
  direction: 'up' | 'down' | 'left' | 'right' = 'up',
  distance: number = 50,
  duration: number = 300
) {
  const translate = useSharedValue(distance);
  const opacity = useSharedValue(0);

  const getTransform = () => {
    switch (direction) {
      case 'up':
        return { translateY: translate.value };
      case 'down':
        return { translateY: -translate.value };
      case 'left':
        return { translateX: translate.value };
      case 'right':
        return { translateX: -translate.value };
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [getTransform()],
  }));

  const slideIn = useCallback(() => {
    opacity.value = withTiming(1, { duration });
    translate.value = withTiming(0, { duration });
  }, [duration, opacity, translate]);

  const slideOut = useCallback(() => {
    opacity.value = withTiming(0, { duration });
    translate.value = withTiming(distance, { duration });
  }, [distance, duration, opacity, translate]);

  return {
    animatedStyle,
    slideIn,
    slideOut,
  };
}

/**
 * Hook for shimmer animation (skeleton loading)
 */
export function useShimmerAnimation() {
  const translateX = useSharedValue(-1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: `${translateX.value * 100}%` as `${number}%` }],
  }));

  const startShimmer = useCallback(() => {
    translateX.value = withTiming(1, {
      duration: 1500,
    });
  }, [translateX]);

  return {
    animatedStyle,
    startShimmer,
  };
}
