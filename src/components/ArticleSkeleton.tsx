/**
 * Space Pulse - Article Skeleton Loader
 * Loading placeholder for article lists
 */

import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from './Skeleton';
import { colors, spacing, borderRadius } from '../theme';

interface ArticleSkeletonProps {
  horizontal?: boolean;
}

export const ArticleSkeleton = memo<ArticleSkeletonProps>(({
  horizontal = false,
}) => {
  if (horizontal) {
    return (
      <View style={styles.horizontalContainer}>
        <Skeleton width={100} height={100} borderRadiusSize="md" />
        <View style={styles.horizontalContent}>
          <Skeleton width="40%" height={12} />
          <Skeleton width="100%" height={16} style={styles.marginTop} />
          <Skeleton width="80%" height={16} style={styles.marginTop} />
          <Skeleton width="30%" height={12} style={styles.marginTopLarge} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Skeleton width="100%" height={200} borderRadiusSize="lg" />
      <View style={styles.content}>
        <Skeleton width="30%" height={12} />
        <Skeleton width="100%" height={18} style={styles.marginTop} />
        <Skeleton width="85%" height={18} style={styles.marginTop} />
        <Skeleton width="25%" height={12} style={styles.marginTopLarge} />
      </View>
    </View>
  );
});

export const ArticleSkeletonList = memo<{ count?: number; horizontal?: boolean }>(({
  count = 5,
  horizontal = false,
}) => {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, index) => (
        <ArticleSkeleton key={index} horizontal={horizontal} />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  content: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  horizontalContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  horizontalContent: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  marginTop: {
    marginTop: spacing.sm,
  },
  marginTopLarge: {
    marginTop: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.lg,
  },
});

ArticleSkeleton.displayName = 'ArticleSkeleton';
ArticleSkeletonList.displayName = 'ArticleSkeletonList';
