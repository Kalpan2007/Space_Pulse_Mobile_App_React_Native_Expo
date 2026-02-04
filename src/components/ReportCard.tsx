/**
 * Space Pulse - Report Card Component
 * Card for industry reports
 */

import React, { memo, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PressableScale } from './PressableScale';
import { CachedImage } from './CachedImage';
import { SaveButton } from './SaveButton';
import { Report, RootStackParamList } from '../types';
import { formatShortDate } from '../utils';
import { colors, spacing, borderRadius, typography } from '../theme';

interface ReportCardProps {
  report: Report;
  showSaveButton?: boolean;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ReportCard = memo<ReportCardProps>(({
  report,
  showSaveButton = true,
}) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = useCallback(() => {
    navigation.navigate('ReportDetail', { reportId: report.id });
  }, [navigation, report.id]);

  return (
    <PressableScale style={styles.container} onPress={handlePress}>
      <View style={styles.iconContainer}>
        <Ionicons name="document-text" size={28} color={colors.secondary} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.newsSite}>{report.news_site}</Text>
          <View style={styles.reportBadge}>
            <Ionicons name="analytics" size={10} color={colors.text} />
            <Text style={styles.reportBadgeText}>REPORT</Text>
          </View>
        </View>
        
        <Text style={styles.title} numberOfLines={2}>
          {report.title}
        </Text>
        
        <Text style={styles.summary} numberOfLines={2}>
          {report.summary}
        </Text>
        
        <Text style={styles.date}>
          {formatShortDate(report.published_at)}
        </Text>
      </View>
      
      {showSaveButton && (
        <View style={styles.saveButton}>
          <SaveButton item={report} type="report" size={18} />
        </View>
      )}
    </PressableScale>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  newsSite: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.sm,
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    gap: 3,
  },
  reportBadgeText: {
    fontSize: 8,
    fontWeight: typography.weights.bold,
    color: colors.text,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    lineHeight: typography.sizes.md * 1.4,
    marginBottom: spacing.xs,
  },
  summary: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: typography.sizes.sm * 1.4,
    marginBottom: spacing.sm,
  },
  date: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  saveButton: {
    justifyContent: 'center',
    paddingLeft: spacing.sm,
  },
});

ReportCard.displayName = 'ReportCard';
