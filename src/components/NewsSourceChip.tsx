/**
 * Space Pulse - News Source Chip Component
 * Selectable chip for news sources
 */

import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { PressableScale } from './PressableScale';
import { colors, spacing, borderRadius, typography } from '../theme';

interface NewsSourceChipProps {
  name: string;
  isSelected: boolean;
  onPress: () => void;
}

export const NewsSourceChip = memo<NewsSourceChipProps>(({
  name,
  isSelected,
  onPress,
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: withSpring(
      isSelected ? colors.accent : colors.surface,
      { damping: 15 }
    ),
    borderColor: withSpring(
      isSelected ? colors.accent : colors.glassBorder,
      { damping: 15 }
    ),
    transform: [
      {
        scale: withSpring(isSelected ? 1.02 : 1, { damping: 15 }),
      },
    ],
  }));

  return (
    <PressableScale onPress={onPress} activeScale={0.95}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <Text
          style={[
            styles.name,
            isSelected && styles.nameSelected,
          ]}
          numberOfLines={1}
        >
          {name}
        </Text>
      </Animated.View>
    </PressableScale>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  name: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  nameSelected: {
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
});

NewsSourceChip.displayName = 'NewsSourceChip';
