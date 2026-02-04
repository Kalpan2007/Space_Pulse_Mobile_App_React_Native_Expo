/**
 * Space Pulse - Trending Section Component
 * Horizontal scrolling trending topics with beautiful cards
 */

import React, { memo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { CachedImage } from './CachedImage';
import { Skeleton } from './Skeleton';
import { Article, RootStackParamList } from '../types';
import { colors, spacing, typography, borderRadius } from '../theme';
import { formatRelativeTime, triggerHaptic } from '../utils';

const CARD_WIDTH = 200;
const CARD_HEIGHT = 140;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface TrendingCardProps {
  article: Article;
  index: number;
}

const TrendingCard = memo<TrendingCardProps>(({ article, index }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = useCallback(() => {
    triggerHaptic('light');
    navigation.navigate('ArticleDetail', { articleId: article.id });
  }, [navigation, article.id]);

  // Determine trend icon based on keywords
  const getTrendIcon = (): keyof typeof Ionicons.glyphMap => {
    const title = article.title.toLowerCase();
    if (title.includes('spacex') || title.includes('falcon') || title.includes('starship')) return 'rocket';
    if (title.includes('nasa') || title.includes('artemis')) return 'planet';
    if (title.includes('iss') || title.includes('station')) return 'home';
    if (title.includes('moon') || title.includes('lunar')) return 'moon';
    if (title.includes('mars')) return 'planet';
    if (title.includes('satellite')) return 'radio';
    return 'trending-up';
  };

  return (
    <Animated.View 
      entering={FadeInRight.delay(index * 100).springify()}
      style={styles.cardContainer}
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        style={styles.card}
      >
        <CachedImage
          uri={article.image_url}
          style={styles.image}
          borderRadiusSize="lg"
        />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)']}
          locations={[0, 0.5, 1]}
          style={styles.gradient}
        />
        
        {/* Trend indicator */}
        <View style={styles.trendBadge}>
          <Ionicons name={getTrendIcon()} size={10} color={colors.text} />
          <Text style={styles.trendText}>#{index + 1}</Text>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.source}>{article.news_site}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {article.title}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

const SkeletonCard = memo(() => (
  <View style={styles.cardContainer}>
    <Skeleton
      width={CARD_WIDTH}
      height={CARD_HEIGHT}
      borderRadiusSize="lg"
    />
  </View>
));

interface TrendingSectionProps {
  articles: Article[];
  isLoading?: boolean;
  title?: string;
}

export const TrendingSection = memo<TrendingSectionProps>(({
  articles,
  isLoading = false,
  title = 'Trending Now',
}) => {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Ionicons name="trending-up" size={20} color={colors.warning} />
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </ScrollView>
      </View>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="trending-up" size={20} color={colors.warning} />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
      >
        {articles.slice(0, 8).map((article, index) => (
          <TrendingCard key={article.id} article={article} index={index} />
        ))}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.error,
  },
  liveText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.error,
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  card: {
    flex: 1,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  trendBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.warning,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  trendText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
  },
  source: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    lineHeight: typography.sizes.sm * 1.4,
  },
});

TrendingCard.displayName = 'TrendingCard';
SkeletonCard.displayName = 'SkeletonCard';
TrendingSection.displayName = 'TrendingSection';
