/**
 * Space Pulse - Pressable Scale Component
 * Animated pressable with scale effect and haptic feedback
 */

import React, { memo, useCallback } from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { haptics } from '../utils';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressableScaleProps extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  activeScale?: number;
  scaleTo?: number; // Alias for activeScale
  enableHaptics?: boolean;
  hapticType?: 'light' | 'medium' | 'heavy' | 'selection';
}

const springConfig = {
  damping: 15,
  stiffness: 200,
  mass: 0.8,
};

export const PressableScale = memo<PressableScaleProps>(({
  children,
  style,
  activeScale = 0.96,
  scaleTo,
  enableHaptics = true,
  hapticType = 'light',
  onPressIn,
  onPressOut,
  onPress,
  ...props
}) => {
  const scale = useSharedValue(1);
  const targetScale = scaleTo ?? activeScale;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback((event: any) => {
    scale.value = withSpring(targetScale, springConfig);
    onPressIn?.(event);
  }, [targetScale, onPressIn, scale]);

  const handlePressOut = useCallback((event: any) => {
    scale.value = withSpring(1, springConfig);
    onPressOut?.(event);
  }, [onPressOut, scale]);

  const handlePress = useCallback((event: any) => {
    if (enableHaptics) {
      haptics[hapticType]();
    }
    onPress?.(event);
  }, [enableHaptics, hapticType, onPress]);

  return (
    <AnimatedPressable
      style={[animatedStyle, style]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
});

PressableScale.displayName = 'PressableScale';
