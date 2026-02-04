/**
 * Space Pulse - Article Card Component
 * Main news article card with image and metadata
 */

import React, { memo, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PressableScale } from './PressableScale';
import { CachedImage } from './CachedImage';
import { SaveButton } from './SaveButton';
import { Article } from '../types';
import { RootStackParamList } from '../types';
import { formatRelativeTime } from '../utils';
import { colors, spacing, borderRadius, typography } from '../theme';

interface ArticleCardProps {
  article: Article;
  size?: 'small' | 'medium' | 'large';
  showSaveButton?: boolean;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ArticleCard = memo<ArticleCardProps>(({
  article,
  size = 'medium',
  showSaveButton = true,
}) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = useCallback(() => {
    navigation.navigate('ArticleDetail', { articleId: article.id });
  }, [navigation, article.id]);

  const getCardHeight = () => {
    switch (size) {
      case 'small':
        return 120;
      case 'large':
        return 280;
      default:
        return 200;
    }
  };

  return (
    <PressableScale
      style={[styles.container, { height: getCardHeight() }]}
      onPress={handlePress}
    >
      <CachedImage
        uri={article.image_url}
        style={styles.image}
        borderRadiusSize="lg"
      />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />
      
      <View style={styles.content}>
        {article.featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>FEATURED</Text>
          </View>
        )}
        
        <View style={styles.textContainer}>
          <Text style={styles.newsSite}>{article.news_site}</Text>
          <Text style={styles.title} numberOfLines={size === 'small' ? 2 : 3}>
            {article.title}
          </Text>
          <Text style={styles.time}>
            {formatRelativeTime(article.published_at)}
          </Text>
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
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  featuredText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.text,
    letterSpacing: 1,
  },
  textContainer: {
    marginTop: 'auto',
  },
  newsSite: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    lineHeight: typography.sizes.lg * 1.3,
  },
  time: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  saveButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
});

ArticleCard.displayName = 'ArticleCard';
