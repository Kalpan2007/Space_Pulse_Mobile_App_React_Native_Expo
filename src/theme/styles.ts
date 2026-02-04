/**
 * Space Pulse - Common Styles
 * Reusable style utilities
 */

import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from './index';

export const commonStyles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  // Cards
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  glassCard: {
    backgroundColor: colors.glass,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
  },
  
  // Text Styles
  displayText: {
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.bold,
    color: colors.text,
    letterSpacing: -0.5,
  },
  headingText: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    letterSpacing: -0.3,
  },
  titleText: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  subtitleText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  bodyText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.regular,
    color: colors.text,
    lineHeight: typography.sizes.md * typography.lineHeights.normal,
  },
  captionText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.regular,
    color: colors.textMuted,
  },
  
  // Buttons
  primaryButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    ...shadows.glow,
  },
  primaryButtonText: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    textAlign: 'center',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: colors.secondary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
  },
  outlineButtonText: {
    color: colors.secondary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    textAlign: 'center',
  },
  
  // Inputs
  input: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.text,
    fontSize: typography.sizes.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  
  // Shadows
  shadowSm: shadows.sm,
  shadowMd: shadows.md,
  shadowLg: shadows.lg,
  
  // Spacing utilities
  mt8: { marginTop: 8 },
  mt16: { marginTop: 16 },
  mt24: { marginTop: 24 },
  mb8: { marginBottom: 8 },
  mb16: { marginBottom: 16 },
  mb24: { marginBottom: 24 },
  
  // Image styles
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.glassBorder,
    marginVertical: spacing.lg,
  },
  
  // Badge
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondary,
  },
  badgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    textTransform: 'uppercase',
  },
});
