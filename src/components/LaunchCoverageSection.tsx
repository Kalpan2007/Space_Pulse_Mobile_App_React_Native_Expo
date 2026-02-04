/**
 * Space Pulse - Launch Coverage Section
 * Shows articles related to space launches
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
import Animated, { FadeInUp } from 'react-native-reanimated';
import { CachedImage } from './CachedImage';
import { Skeleton } from './Skeleton';
import { Article, RootStackParamList } from '../types';
import { colors, spacing, typography, borderRadius } from '../theme';
import { formatRelativeTime, triggerHaptic } from '../utils';

const CARD_WIDTH = 280;
const CARD_HEIGHT = 160;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface LaunchCardProps {
  article: Article;
  index: number;
}

const LaunchCard = memo<LaunchCardProps>(({ article, index }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = useCallback(() => {
    triggerHaptic('light');
    navigation.navigate('ArticleDetail', { articleId: article.id });
  }, [navigation, article.id]);

  const launchCount = article.launches?.length || 0;

  return (
    <Animated.View 
      entering={FadeInUp.delay(index * 80).springify()}
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
          colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.95)']}
          locations={[0, 0.4, 1]}
          style={styles.gradient}
        />
        
        {/* Launch badge */}
        <View style={styles.launchBadge}>
          <Ionicons name="rocket" size={12} color={colors.text} />
          <Text style={styles.launchText}>
            {launchCount > 0 ? `${launchCount} Launch${launchCount > 1 ? 'es' : ''}` : 'Launch News'}
          </Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.sourceRow}>
            <View style={styles.sourceDot} />
            <Text style={styles.source}>{article.news_site}</Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.time}>{formatRelativeTime(article.published_at)}</Text>
          </View>
          
          <Text style={styles.title} numberOfLines={2}>
            {article.title}
          </Text>
          
          {/* Launch providers if available */}
          {article.launches && article.launches.length > 0 && (
            <View style={styles.providersRow}>
              {article.launches.slice(0, 2).map((launch, i) => (
                <View key={i} style={styles.providerBadge}>
                  <Text style={styles.providerText}>{launch.provider}</Text>
                </View>
              ))}
            </View>
          )}
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

interface LaunchCoverageSectionProps {
  articles: Article[];
  isLoading?: boolean;
}

export const LaunchCoverageSection = memo<LaunchCoverageSectionProps>(({
  articles,
  isLoading = false,
}) => {  const navigation = useNavigation<NavigationProp>();

  const handleSeeAll = useCallback(() => {
    triggerHaptic('light');
    // Navigate to Explore tab
    navigation.navigate('Explore' as any);
  }, [navigation]);  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="rocket" size={18} color={colors.text} />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Launch Coverage</Text>
              <Text style={styles.subtitle}>Recent launch-related news</Text>
            </View>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {[1, 2].map((i) => (
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
          <View style={styles.iconContainer}>
            <Ionicons name="rocket" size={18} color={colors.text} />
          </View>
          <View>
            <Text style={styles.sectionTitle}>Launch Coverage</Text>
            <Text style={styles.subtitle}>{articles.length} articles with launch info</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.seeAllButton} onPress={handleSeeAll} activeOpacity={0.7}>
          <Text style={styles.seeAllText}>See All</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.accent} />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + spacing.md}
      >
        {articles.slice(0, 10).map((article, index) => (
          <LaunchCard key={article.id} article={article} index={index} />
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
    gap: spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  seeAllText: {
    fontSize: typography.sizes.sm,
    color: colors.accent,
    fontWeight: typography.weights.medium,
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
  launchBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  launchText: {
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
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sourceDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.accent,
    marginRight: spacing.xs,
  },
  source: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  separator: {
    color: colors.textMuted,
    marginHorizontal: spacing.xs,
    fontSize: typography.sizes.xs,
  },
  time: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    lineHeight: typography.sizes.md * 1.4,
  },
  providersRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  providerBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  providerText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
});

LaunchCard.displayName = 'LaunchCard';
SkeletonCard.displayName = 'SkeletonCard';
LaunchCoverageSection.displayName = 'LaunchCoverageSection';
