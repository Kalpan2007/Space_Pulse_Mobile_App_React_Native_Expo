/**
 * Type declarations for react-native-reanimated polyfill
 * This allows TypeScript to recognize the polyfill
 */
declare module 'react-native-reanimated' {
  import { ComponentType, RefAttributes, ComponentProps } from 'react';
  import { View, Text, ScrollView, Image, FlatList, Pressable, ViewStyle, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

  // Shared Value
  export interface SharedValue<T> {
    value: T;
  }

  export function useSharedValue<T>(initialValue: T): SharedValue<T>;

  // Animated Style
  export function useAnimatedStyle<T extends ViewStyle>(
    updater: () => T,
    dependencies?: readonly any[]
  ): T;

  // Animated Scroll Handler
  export interface AnimatedScrollHandlers {
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  }

  export function useAnimatedScrollHandler(
    handlers: {
      onScroll?: (event: any, context?: any) => void;
      onBeginDrag?: (event: any, context?: any) => void;
      onEndDrag?: (event: any, context?: any) => void;
      onMomentumBegin?: (event: any, context?: any) => void;
      onMomentumEnd?: (event: any, context?: any) => void;
    },
    dependencies?: readonly any[]
  ): (event: NativeSyntheticEvent<NativeScrollEvent>) => void;

  // Spring animations
  export interface SpringConfig {
    damping?: number;
    mass?: number;
    stiffness?: number;
    overshootClamping?: boolean;
    restDisplacementThreshold?: number;
    restSpeedThreshold?: number;
  }

  // Aliases for compatibility
  export type WithSpringConfig = SpringConfig;

  export function withSpring<T extends number | string>(
    toValue: T,
    config?: SpringConfig,
    callback?: (finished?: boolean, current?: T) => void
  ): T;

  // Timing animations
  export interface TimingConfig {
    duration?: number;
    easing?: (value: number) => number;
  }

  // Aliases for compatibility
  export type WithTimingConfig = TimingConfig;

  export function withTiming<T extends number | string>(
    toValue: T,
    config?: TimingConfig,
    callback?: (finished?: boolean, current?: T) => void
  ): T;

  // Sequence and other combinators
  export function withSequence<T extends number | string>(...animations: T[]): T;
  export function withRepeat<T extends number | string>(
    animation: T,
    numberOfReps?: number,
    reverse?: boolean,
    callback?: (finished?: boolean, current?: T) => void
  ): T;
  export function withDelay<T extends number | string>(delayMs: number, animation: T): T;

  // Interpolation
  export interface InterpolateConfig {
    inputRange: readonly number[];
    outputRange: readonly (number | string)[];
    extrapolate?: 'extend' | 'clamp' | 'identity';
    extrapolateLeft?: 'extend' | 'clamp' | 'identity';
    extrapolateRight?: 'extend' | 'clamp' | 'identity';
  }

  export function interpolate(
    value: number,
    inputRange: readonly number[],
    outputRange: readonly number[],
    extrapolateLeft?: 'extend' | 'clamp' | 'identity',
    extrapolateRight?: 'extend' | 'clamp' | 'identity'
  ): number;

  export const Extrapolate: {
    EXTEND: 'extend';
    CLAMP: 'clamp';
    IDENTITY: 'identity';
  };

  export const Extrapolation: {
    EXTEND: 'extend';
    CLAMP: 'clamp';
    IDENTITY: 'identity';
  };

  // Easing functions
  export const Easing: {
    linear: (t: number) => number;
    ease: (t: number) => number;
    quad: (t: number) => number;
    cubic: (t: number) => number;
    poly: (n: number) => (t: number) => number;
    sin: (t: number) => number;
    circle: (t: number) => number;
    exp: (t: number) => number;
    elastic: (bounciness?: number) => (t: number) => number;
    back: (s?: number) => (t: number) => number;
    bounce: (t: number) => number;
    bezier: (x1: number, y1: number, x2: number, y2: number) => (t: number) => number;
    in: (easing: (t: number) => number) => (t: number) => number;
    out: (easing: (t: number) => number) => (t: number) => number;
    inOut: (easing: (t: number) => number) => (t: number) => number;
  };

  // Layout Animations
  interface BaseAnimationBuilder {
    delay: (ms: number) => BaseAnimationBuilder;
    duration: (ms: number) => BaseAnimationBuilder;
    springify: () => BaseAnimationBuilder;
    damping: (value: number) => BaseAnimationBuilder;
    mass: (value: number) => BaseAnimationBuilder;
    stiffness: (value: number) => BaseAnimationBuilder;
    overshootClamping: (value: boolean) => BaseAnimationBuilder;
    restDisplacementThreshold: (value: number) => BaseAnimationBuilder;
    restSpeedThreshold: (value: number) => BaseAnimationBuilder;
    withCallback: (callback: (finished: boolean) => void) => BaseAnimationBuilder;
    randomDelay: () => BaseAnimationBuilder;
    build: () => any;
    distance: (value: number) => BaseAnimationBuilder;
  }

  export const FadeIn: BaseAnimationBuilder;
  export const FadeOut: BaseAnimationBuilder;
  export const FadeInUp: BaseAnimationBuilder;
  export const FadeInDown: BaseAnimationBuilder;
  export const FadeInLeft: BaseAnimationBuilder;
  export const FadeInRight: BaseAnimationBuilder;
  export const FadeOutUp: BaseAnimationBuilder;
  export const FadeOutDown: BaseAnimationBuilder;
  export const FadeOutLeft: BaseAnimationBuilder;
  export const FadeOutRight: BaseAnimationBuilder;

  export const SlideInUp: BaseAnimationBuilder;
  export const SlideInDown: BaseAnimationBuilder;
  export const SlideInLeft: BaseAnimationBuilder;
  export const SlideInRight: BaseAnimationBuilder;
  export const SlideOutUp: BaseAnimationBuilder;
  export const SlideOutDown: BaseAnimationBuilder;
  export const SlideOutLeft: BaseAnimationBuilder;
  export const SlideOutRight: BaseAnimationBuilder;

  export const ZoomIn: BaseAnimationBuilder;
  export const ZoomOut: BaseAnimationBuilder;
  export const ZoomInUp: BaseAnimationBuilder;
  export const ZoomInDown: BaseAnimationBuilder;
  export const ZoomOutUp: BaseAnimationBuilder;
  export const ZoomOutDown: BaseAnimationBuilder;

  export const BounceIn: BaseAnimationBuilder;
  export const BounceOut: BaseAnimationBuilder;
  export const BounceInUp: BaseAnimationBuilder;
  export const BounceInDown: BaseAnimationBuilder;

  export const FlipInYLeft: BaseAnimationBuilder;
  export const FlipInYRight: BaseAnimationBuilder;
  export const FlipInXUp: BaseAnimationBuilder;
  export const FlipInXDown: BaseAnimationBuilder;

  export const StretchInX: BaseAnimationBuilder;
  export const StretchInY: BaseAnimationBuilder;
  export const StretchOutX: BaseAnimationBuilder;
  export const StretchOutY: BaseAnimationBuilder;

  export const LightSpeedInLeft: BaseAnimationBuilder;
  export const LightSpeedInRight: BaseAnimationBuilder;
  export const LightSpeedOutLeft: BaseAnimationBuilder;
  export const LightSpeedOutRight: BaseAnimationBuilder;

  export const PinwheelIn: BaseAnimationBuilder;
  export const PinwheelOut: BaseAnimationBuilder;

  export const RotateInDownLeft: BaseAnimationBuilder;
  export const RotateInDownRight: BaseAnimationBuilder;
  export const RotateInUpLeft: BaseAnimationBuilder;
  export const RotateInUpRight: BaseAnimationBuilder;
  export const RotateOutDownLeft: BaseAnimationBuilder;
  export const RotateOutDownRight: BaseAnimationBuilder;
  export const RotateOutUpLeft: BaseAnimationBuilder;
  export const RotateOutUpRight: BaseAnimationBuilder;

  export const RollInLeft: BaseAnimationBuilder;
  export const RollInRight: BaseAnimationBuilder;
  export const RollOutLeft: BaseAnimationBuilder;
  export const RollOutRight: BaseAnimationBuilder;

  // Layout Transition
  export const Layout: BaseAnimationBuilder;

  // Animated Components with proper typing
  interface AnimatedViewProps extends ComponentProps<typeof View> {
    entering?: BaseAnimationBuilder;
    exiting?: BaseAnimationBuilder;
    layout?: BaseAnimationBuilder;
    children?: React.ReactNode;
  }

  interface AnimatedTextProps extends ComponentProps<typeof Text> {
    entering?: BaseAnimationBuilder;
    exiting?: BaseAnimationBuilder;
    layout?: BaseAnimationBuilder;
    children?: React.ReactNode;
  }

  interface AnimatedScrollViewProps extends ComponentProps<typeof ScrollView> {
    entering?: BaseAnimationBuilder;
    exiting?: BaseAnimationBuilder;
    layout?: BaseAnimationBuilder;
    children?: React.ReactNode;
  }

  interface AnimatedImageProps extends ComponentProps<typeof Image> {
    entering?: BaseAnimationBuilder;
    exiting?: BaseAnimationBuilder;
    layout?: BaseAnimationBuilder;
  }

  interface AnimatedFlatListProps<T> extends ComponentProps<typeof FlatList<T>> {
    entering?: BaseAnimationBuilder;
    exiting?: BaseAnimationBuilder;
    layout?: BaseAnimationBuilder;
  }

  interface AnimatedPressableProps extends ComponentProps<typeof Pressable> {
    entering?: BaseAnimationBuilder;
    exiting?: BaseAnimationBuilder;
    layout?: BaseAnimationBuilder;
    children?: React.ReactNode;
  }

  interface AnimatedComponentsType {
    View: ComponentType<AnimatedViewProps>;
    Text: ComponentType<AnimatedTextProps>;
    ScrollView: ComponentType<AnimatedScrollViewProps>;
    Image: ComponentType<AnimatedImageProps>;
    FlatList: <T>(props: AnimatedFlatListProps<T>) => JSX.Element;
    Pressable: ComponentType<AnimatedPressableProps>;
    createAnimatedComponent: <T extends ComponentType<any>>(component: T) => T;
    SharedValue: typeof SharedValue;
  }

  // Allow Animated.SharedValue<T> usage
  namespace Animated {
    export type SharedValue<T> = import('react-native-reanimated').SharedValue<T>;
  }

  const Animated: AnimatedComponentsType;
  export default Animated;

  // Run on JS
  export function runOnJS<A extends any[], R>(fn: (...args: A) => R): (...args: A) => void;
  export function runOnUI<A extends any[], R>(fn: (...args: A) => R): (...args: A) => void;

  // Cancel animation
  export function cancelAnimation(sharedValue: SharedValue<any>): void;

  // Worklet
  export function makeMutable<T>(initialValue: T): SharedValue<T>;
}
