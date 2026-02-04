/**
 * React Native Reanimated Polyfill
 * Provides basic compatibility for Expo Go
 */

import React from 'react';
import { View, Text, ScrollView, Animated as RNAnimated } from 'react-native';

// Create animated component wrapper - just returns the component as-is
export const createAnimatedComponent = (Component) => {
  return React.forwardRef((props, ref) => {
    const { entering, exiting, layout, style, ...rest } = props;
    // Strip out reanimated-specific props and just render the component
    return <Component ref={ref} style={style} {...rest} />;
  });
};

// Mock Animated components to use regular RN components
const Animated = {
  View: createAnimatedComponent(View),
  Text: createAnimatedComponent(Text),
  ScrollView: createAnimatedComponent(ScrollView),
  createAnimatedComponent,
};

// Mock animation functions
export const useSharedValue = (initialValue) => ({ value: initialValue });
export const useAnimatedStyle = (callback) => ({});
export const useAnimatedScrollHandler = (handler) => () => {};
export const useAnimatedProps = (callback) => ({});
export const useAnimatedRef = () => ({ current: null });
export const useDerivedValue = (callback) => ({ value: callback() });
export const useAnimatedGestureHandler = (handlers) => handlers;
export const useAnimatedReaction = (prepare, react) => {};
export const runOnJS = (fn) => fn;
export const runOnUI = (fn) => fn;
export const withSpring = (value, config, callback) => {
  if (callback) callback?.(true);
  return value;
};
export const withTiming = (value, config, callback) => {
  if (callback) callback?.(true);
  return value;
};
export const withDelay = (delay, animation) => animation;
export const withSequence = (...animations) => animations[animations.length - 1];
export const withRepeat = (animation, numberOfReps, reverse) => animation;
export const cancelAnimation = (sharedValue) => {};
export const interpolate = (value, inputRange, outputRange, options) => {
  if (typeof value === 'number') return value;
  return inputRange[0];
};
export const interpolateColor = (value, inputRange, outputRange) => outputRange[0];
export const Extrapolation = {
  CLAMP: 'clamp',
  EXTEND: 'extend',
  IDENTITY: 'identity',
};
export const Easing = {
  linear: (t) => t,
  ease: (t) => t,
  quad: (t) => t * t,
  cubic: (t) => t * t * t,
  bezier: () => (t) => t,
  in: (easing) => easing,
  out: (easing) => easing,
  inOut: (easing) => easing,
};

// Mock entrance/exit animations - just return empty object
export const FadeIn = { 
  delay: (ms) => FadeIn, 
  duration: (ms) => FadeIn,
  springify: () => FadeIn,
  damping: (value) => FadeIn,
  stiffness: (value) => FadeIn,
};
export const FadeInDown = { 
  delay: (ms) => FadeInDown, 
  duration: (ms) => FadeInDown,
  springify: () => FadeInDown,
  damping: (value) => FadeInDown,
  distance: (value) => FadeInDown,
};
export const FadeInUp = { 
  delay: (ms) => FadeInUp, 
  duration: (ms) => FadeInUp,
  springify: () => FadeInUp,
  damping: (value) => FadeInUp,
  distance: (value) => FadeInUp,
};
export const FadeInLeft = { delay: (ms) => FadeInLeft, springify: () => FadeInLeft };
export const FadeInRight = { delay: (ms) => FadeInRight, springify: () => FadeInRight };
export const FadeOut = { delay: (ms) => FadeOut, duration: (ms) => FadeOut };
export const FadeOutDown = { delay: (ms) => FadeOutDown };
export const FadeOutUp = { delay: (ms) => FadeOutUp };
export const SlideInRight = { delay: (ms) => SlideInRight, springify: () => SlideInRight };
export const SlideInLeft = { delay: (ms) => SlideInLeft, springify: () => SlideInLeft };
export const SlideInUp = { delay: (ms) => SlideInUp };
export const SlideInDown = { delay: (ms) => SlideInDown };
export const SlideOutRight = { delay: (ms) => SlideOutRight };
export const SlideOutLeft = { delay: (ms) => SlideOutLeft };
export const ZoomIn = { delay: (ms) => ZoomIn, springify: () => ZoomIn };
export const ZoomOut = { delay: (ms) => ZoomOut };

// Layout animations
export const Layout = {
  duration: (ms) => Layout,
  delay: (ms) => Layout,
  springify: () => Layout,
};
export const LinearTransition = Layout;
export const FadingTransition = Layout;
export const SequencedTransition = Layout;

export default Animated;
