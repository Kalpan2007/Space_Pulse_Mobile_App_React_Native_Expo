/**
 * Space Pulse - Home Screen
 * Premium main feed with featured carousel, trending, stats, and launch coverage
 */

import React, { memo, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  RefreshControl,
  StatusBar,
  ScrollView,
} from 'react-native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  FeaturedCarousel,
  ArticleCardHorizontal,
  SectionHeader,
  LoadingIndicator,
  ErrorState,
  ArticleSkeletonList,
  PressableScale,
  QuickStats,
  TrendingSection,
  LaunchCoverageSection,
} from '../components';
import { useArticlesStore, useBlogsStore, useReportsStore, useSavedItemsStore } from '../store';
import { useRefresh } from '../hooks';
import { Article, RootStackParamList } from '../types';
import { colors, spacing, typography, layout } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { triggerHaptic } from '../utils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = memo(() => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  
  const {
    articles,
    featuredArticles,
    trendingArticles,
    launchArticles,
    isLoading,
    isFeaturedLoading,
    isTrendingLoading,
    isLaunchLoading,
    isLoadingMore,
    hasMore,
    totalCount,
    error,
    fetchArticles,
    fetchFeaturedArticles,
    fetchTrendingArticles,
    fetchLaunchArticles,
    loadMore,
  } = useArticlesStore();

  const blogsStore = useBlogsStore();
  const reportsStore = useReportsStore();
  const { loadSavedItems } = useSavedItemsStore();

  // Initial data fetch
  useEffect(() => {
    fetchArticles();
    fetchFeaturedArticles();
    fetchTrendingArticles();
    fetchLaunchArticles();
    blogsStore.fetchBlogs();
    reportsStore.fetchReports();
    loadSavedItems();
  }, []);

  // Pull to refresh
  const { isRefreshing, handleRefresh } = useRefresh({
    onRefresh: async () => {
      await Promise.all([
        fetchArticles(true),
        fetchFeaturedArticles(),
        fetchTrendingArticles(),
        fetchLaunchArticles(),
      ]);
    },
  });

  // Navigate to search
  const handleSearchPress = useCallback(() => {
    triggerHaptic('light');
    navigation.navigate('Search');
  }, [navigation]);

  // Stats refresh
  const handleStatsRefresh = useCallback(() => {
    fetchArticles(true);
    blogsStore.fetchBlogs();
    reportsStore.fetchReports();
  }, []);

  // Render article item
  const renderItem: ListRenderItem<Article> = useCallback(
    ({ item, index }) => (
      <Animated.View entering={FadeInDown.delay(index * 40).springify()}>
        <ArticleCardHorizontal article={item} />
      </Animated.View>
    ),
    []
  );

  // Key extractor
  const keyExtractor = useCallback((item: Article) => item.id.toString(), []);

  // End reached handler for pagination
  const handleEndReached = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      loadMore();
    }
  }, [isLoadingMore, hasMore, loadMore]);

  // List header component with all premium sections
  const ListHeader = useCallback(
    () => (
      <>
        {/* App Header */}
        <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
          <View>
            <Text style={styles.greeting}>Welcome to</Text>
            <View style={styles.titleRow}>
              <Text style={styles.appName}>Space Pulse</Text>
              <View style={styles.betaBadge}>
                <Text style={styles.betaText}>LIVE</Text>
              </View>
            </View>
          </View>
          <PressableScale
            style={styles.searchButton}
            onPress={handleSearchPress}
            scaleTo={0.95}
          >
            <Ionicons name="search" size={22} color={colors.text} />
          </PressableScale>
        </View>

        {/* Quick Stats Widget */}
        <QuickStats
          articlesCount={totalCount || articles.length}
          blogsCount={blogsStore.totalCount || 0}
          reportsCount={reportsStore.totalCount || 0}
          launchArticlesCount={launchArticles.length}
          onRefresh={handleStatsRefresh}
        />

        {/* Featured Carousel */}
        <FeaturedCarousel
          articles={featuredArticles}
          isLoading={isFeaturedLoading}
        />

        {/* Trending Now Section */}
        <TrendingSection
          articles={trendingArticles}
          isLoading={isTrendingLoading}
        />

        {/* Launch Coverage Section */}
        <LaunchCoverageSection
          articles={launchArticles}
          isLoading={isLaunchLoading}
        />

        {/* Latest News Header */}
        <SectionHeader
          title="Latest News"
          subtitle={totalCount ? totalCount.toLocaleString() + ' articles available' : articles.length + ' articles'}
          icon="newspaper-outline"
        />
      </>
    ),
    [
      insets.top, 
      featuredArticles, 
      isFeaturedLoading, 
      articles.length,
      totalCount,
      trendingArticles,
      isTrendingLoading,
      launchArticles,
      isLaunchLoading,
      blogsStore.totalCount,
      reportsStore.totalCount,
      handleSearchPress,
      handleStatsRefresh,
    ]
  );

  // List footer component
  const ListFooter = useCallback(
    () => (
      <>
        {isLoadingMore && (
          <LoadingIndicator size="small" text="Loading more..." />
        )}
        {!hasMore && articles.length > 0 && (
          <View style={styles.endContainer}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.endText}>You're all caught up!</Text>
          </View>
        )}
        <View style={{ height: layout.tabBarHeight + spacing.xl }} />
      </>
    ),
    [isLoadingMore, hasMore, articles.length]
  );

  // Error state
  if (error && articles.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={colors.gradientSpace}
          style={StyleSheet.absoluteFill}
        />
        <ErrorState
          message={error}
          onRetry={() => {
            fetchArticles();
            fetchFeaturedArticles();
            fetchTrendingArticles();
            fetchLaunchArticles();
          }}
        />
      </View>
    );
  }

  // Loading state
  if (isLoading && articles.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={colors.gradientSpace}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
          <View>
            <Text style={styles.greeting}>Welcome to</Text>
            <Text style={styles.appName}>Space Pulse</Text>
          </View>
        </View>
        <ArticleSkeletonList count={5} horizontal />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={colors.gradientSpace}
        style={StyleSheet.absoluteFill}
      />
      
      <FlashList
        data={articles}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        contentContainerStyle={styles.listContent}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  greeting: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  appName: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    letterSpacing: -0.5,
  },
  betaBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  betaText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.text,
    letterSpacing: 1,
  },
  searchButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  endContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  endText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
});

HomeScreen.displayName = 'HomeScreen';

export default HomeScreen;
