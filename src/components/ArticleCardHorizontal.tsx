/**
 * Space Pulse - Article Card Horizontal Component
 * Premium horizontal article card for lists with enhanced UI
 */

import React, { memo, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { PressableScale } from './PressableScale';
import { CachedImage } from './CachedImage';
import { SaveButton } from './SaveButton';
import { Article } from '../types';
import { RootStackParamList } from '../types';
import { formatRelativeTime, triggerHaptic } from '../utils';
import { colors, spacing, borderRadius, typography } from '../theme';

interface ArticleCardHorizontalProps {
  article: Article;
  showSaveButton?: boolean;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ArticleCardHorizontal = memo<ArticleCardHorizontalProps>(({
  article,
  showSaveButton = true,
}) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = useCallback(() => {
    triggerHaptic('light');
    navigation.navigate('ArticleDetail', { articleId: article.id });
  }, [navigation, article.id]);

  return (
    <PressableScale style={styles.container} onPress={handlePress} scaleTo={0.98}>
      {/* Image with overlay */}
      <View style={styles.imageContainer}>
        <CachedImage
          uri={article.image_url}
          style={styles.image}
          borderRadiusSize="md"
        />
        {/* Optional: subtle gradient overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)']}
          style={styles.imageGradient}
        />
      </View>
      
      <View style={styles.content}>
        {/* Header with source and badges */}
        <View style={styles.header}>
          <View style={styles.sourceContainer}>
            <View style={styles.sourceDot} />
            <Text style={styles.newsSite}>{article.news_site}</Text>
          </View>
          {article.featured && (
            <View style={styles.featuredBadge}>
              <Ionicons name="star" size={8} color={colors.text} />
            </View>
          )}
        </View>
        
        <Text style={styles.title} numberOfLines={2}>
          {article.title}
        </Text>
        
        {/* Footer with time and read indicator */}
        <View style={styles.footer}>
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={11} color={colors.textMuted} />
            <Text style={styles.time}>{formatRelativeTime(article.published_at)}</Text>
          </View>
          <View style={styles.readIndicator}>
            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
          </View>
        </View>
      </View>
      
      {showSaveButton && (
        <View style={styles.saveButton}>
          <SaveButton item={article} type="article" size={20} />
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
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.md,
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    borderBottomLeftRadius: borderRadius.md,
    borderBottomRightRadius: borderRadius.md,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.accent,
    marginRight: spacing.xs,
  },
  newsSite: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  featuredBadge: {
    backgroundColor: colors.secondary,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    lineHeight: typography.sizes.md * 1.4,
    marginVertical: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  time: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  readIndicator: {
    opacity: 0.5,
  },
  saveButton: {
    justifyContent: 'center',
    paddingLeft: spacing.sm,
  },
});

ArticleCardHorizontal.displayName = 'ArticleCardHorizontal';
