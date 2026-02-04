/**
 * Space Pulse - Filter Chip Component
 * Selectable filter chip with animation
 */

import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { PressableScale } from './PressableScale';
import { colors, spacing, borderRadius, typography } from '../theme';

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
}

export const FilterChip = memo<FilterChipProps>(({
  label,
  isSelected,
  onPress,
  icon,
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: withSpring(
      isSelected ? colors.secondary : colors.surface,
      { damping: 15 }
    ),
    borderColor: withSpring(
      isSelected ? colors.secondary : colors.glassBorder,
      { damping: 15 }
    ),
  }));

  return (
    <PressableScale onPress={onPress} activeScale={0.95}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {icon}
        <Text
          style={[
            styles.label,
            isSelected && styles.labelSelected,
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </Animated.View>
    </PressableScale>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  labelSelected: {
    color: colors.text,
  },
});

FilterChip.displayName = 'FilterChip';
