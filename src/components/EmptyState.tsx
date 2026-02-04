/**
 * Space Pulse - Empty State Component
 * Display when no content is available
 */

import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PressableScale } from './PressableScale';
import { colors, spacing, borderRadius, typography } from '../theme';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState = memo<EmptyStateProps>(({
  icon = 'planet-outline',
  title,
  message,
  actionText,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={64} color={colors.textMuted} />
      </View>
      
      <Text style={styles.title}>{title}</Text>
      
      {message && (
        <Text style={styles.message}>{message}</Text>
      )}
      
      {actionText && onAction && (
        <PressableScale style={styles.button} onPress={onAction}>
          <Text style={styles.buttonText}>{actionText}</Text>
        </PressableScale>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxxl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.sizes.md * 1.5,
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
  },
  buttonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
});

EmptyState.displayName = 'EmptyState';
