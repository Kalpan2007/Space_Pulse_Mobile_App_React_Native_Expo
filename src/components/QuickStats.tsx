/**
 * Space Pulse - Quick Stats Widget
 * Displays real-time stats about space news
 */

import React, { memo, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors, spacing, typography, borderRadius } from '../theme';
import { triggerHaptic } from '../utils';

interface StatItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
  color: string;
  delay?: number;
}

const StatItem = memo<StatItemProps>(({ icon, label, value, color, delay = 0 }) => (
  <Animated.View 
    entering={FadeInUp.delay(delay).springify()}
    style={styles.statItem}
  >
    <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </Animated.View>
));

interface QuickStatsProps {
  articlesCount: number;
  blogsCount: number;
  reportsCount: number;
  launchArticlesCount?: number;
  onRefresh?: () => void;
}

export const QuickStats = memo<QuickStatsProps>(({
  articlesCount,
  blogsCount,
  reportsCount,
  launchArticlesCount = 0,
  onRefresh,
}) => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    setLastUpdated(new Date());
  }, [articlesCount, blogsCount, reportsCount]);

  const handleRefresh = () => {
    triggerHaptic('light');
    onRefresh?.();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="pulse" size={18} color={colors.accent} />
          <Text style={styles.title}>Live Stats</Text>
        </View>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh" size={16} color={colors.textSecondary} />
          <Text style={styles.lastUpdated}>
            {formatTime(lastUpdated)}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <StatItem
          icon="newspaper"
          label="Articles"
          value={articlesCount > 999 ? '999+' : articlesCount}
          color={colors.accent}
          delay={0}
        />
        <View style={styles.divider} />
        <StatItem
          icon="document-text"
          label="Blogs"
          value={blogsCount > 999 ? '999+' : blogsCount}
          color={colors.secondary}
          delay={50}
        />
        <View style={styles.divider} />
        <StatItem
          icon="analytics"
          label="Reports"
          value={reportsCount > 999 ? '999+' : reportsCount}
          color={colors.success}
          delay={100}
        />
        <View style={styles.divider} />
        <StatItem
          icon="rocket"
          label="Launches"
          value={launchArticlesCount > 999 ? '999+' : launchArticlesCount}
          color={colors.warning}
          delay={150}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.xs,
  },
  lastUpdated: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  divider: {
    width: 1,
    height: 50,
    backgroundColor: colors.glassBorder,
  },
});

QuickStats.displayName = 'QuickStats';
