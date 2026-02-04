/**
 * Space Pulse - Section Header Component
 * Section title with optional icon and action button
 */

import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PressableScale } from './PressableScale';
import { colors, spacing, typography } from '../theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  actionText?: string;
  onAction?: () => void;
}

export const SectionHeader = memo<SectionHeaderProps>(({
  title,
  subtitle,
  icon,
  iconColor = colors.secondary,
  actionText,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
            <Ionicons name={icon} size={18} color={iconColor} />
          </View>
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && (
            <Text style={styles.subtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      
      {actionText && onAction && (
        <PressableScale
          style={styles.actionButton}
          onPress={onAction}
          activeScale={0.95}
        >
          <Text style={styles.actionText}>{actionText}</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.accent} />
        </PressableScale>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.accent,
  },
});

SectionHeader.displayName = 'SectionHeader';
