/**
 * Space Pulse - Search Bar Component
 * Animated search input with blur background
 */

import React, { memo, useState, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TextInputProps,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { PressableScale } from './PressableScale';
import { colors, spacing, borderRadius, typography } from '../theme';

interface SearchBarProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const SearchBar = memo<SearchBarProps>(({
  value,
  onChangeText,
  onClear,
  onFocus,
  onBlur,
  placeholder = 'Search space news...',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  
  const borderColor = useSharedValue(0);
  const scale = useSharedValue(1);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value === 1
      ? colors.accent
      : colors.glassBorder,
    transform: [{ scale: scale.value }],
  }));

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    borderColor.value = withTiming(1, { duration: 200 });
    scale.value = withSpring(1.02, { damping: 15 });
    onFocus?.();
  }, [borderColor, scale, onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    borderColor.value = withTiming(0, { duration: 200 });
    scale.value = withSpring(1, { damping: 15 });
    onBlur?.();
  }, [borderColor, scale, onBlur]);

  const handleClear = useCallback(() => {
    onChangeText('');
    onClear?.();
    inputRef.current?.focus();
  }, [onChangeText, onClear]);

  const handleCancel = useCallback(() => {
    onChangeText('');
    Keyboard.dismiss();
  }, [onChangeText]);

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <BlurView intensity={30} tint="dark" style={styles.blur}>
        <View style={styles.inputContainer}>
          <Ionicons
            name="search"
            size={20}
            color={isFocused ? colors.accent : colors.textMuted}
            style={styles.searchIcon}
          />
          
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.accent}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            {...props}
          />
          
          {value.length > 0 && (
            <PressableScale
              onPress={handleClear}
              style={styles.clearButton}
              activeScale={0.9}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.textMuted}
              />
            </PressableScale>
          )}
        </View>
      </BlurView>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    overflow: 'hidden',
  },
  blur: {
    overflow: 'hidden',
    borderRadius: borderRadius.full,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.text,
    padding: 0,
  },
  clearButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
});

SearchBar.displayName = 'SearchBar';
