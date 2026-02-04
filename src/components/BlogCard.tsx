/**
 * Space Pulse - Blog Card Component
 * Card component for blog entries with author info
 */

import React, { memo, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PressableScale } from './PressableScale';
import { CachedImage } from './CachedImage';
import { SaveButton } from './SaveButton';
import { Blog, RootStackParamList } from '../types';
import { formatRelativeTime } from '../utils';
import { colors, spacing, borderRadius, typography } from '../theme';

interface BlogCardProps {
  blog: Blog;
  showSaveButton?: boolean;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const BlogCard = memo<BlogCardProps>(({
  blog,
  showSaveButton = true,
}) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = useCallback(() => {
    navigation.navigate('BlogDetail', { blogId: blog.id });
  }, [navigation, blog.id]);

  const primaryAuthor = blog.authors?.[0];

  return (
    <PressableScale style={styles.container} onPress={handlePress}>
      <CachedImage
        uri={blog.image_url}
        style={styles.image}
        borderRadiusSize="md"
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.newsSite}>{blog.news_site}</Text>
          <View style={styles.blogBadge}>
            <Text style={styles.blogBadgeText}>BLOG</Text>
          </View>
        </View>
        
        <Text style={styles.title} numberOfLines={2}>
          {blog.title}
        </Text>
        
        {primaryAuthor && (
          <View style={styles.authorContainer}>
            <View style={styles.authorAvatar}>
              <Text style={styles.authorInitial}>
                {primaryAuthor.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.authorName} numberOfLines={1}>
              {primaryAuthor.name}
            </Text>
          </View>
        )}
        
        <Text style={styles.time}>
          {formatRelativeTime(blog.published_at)}
        </Text>
      </View>
      
      {showSaveButton && (
        <View style={styles.saveButton}>
          <SaveButton item={blog} type="blog" size={18} />
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
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  image: {
    width: 100,
    height: 110,
    borderRadius: borderRadius.md,
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
  blogBadge: {
    marginLeft: spacing.sm,
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  blogBadgeText: {
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
    marginBottom: spacing.sm,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  authorAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  authorInitial: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  authorName: {
    flex: 1,
    fontSize: typography.sizes.xs,
    color: colors.accent,
    fontWeight: typography.weights.medium,
  },
  time: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  saveButton: {
    justifyContent: 'center',
    paddingLeft: spacing.sm,
  },
});

BlogCard.displayName = 'BlogCard';
