/**
 * Space Pulse - Explore Screen
 * Search and filter news with source browser
 */

import React, { memo, useCallback, useEffect, useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  SearchBar,
  FilterChip,
  ArticleCardHorizontal,
  BlogCard,
  ReportCard,
  NewsSourceChip,
  SectionHeader,
  LoadingIndicator,
  EmptyState,
  ErrorState,
  ArticleSkeletonList,
} from '../components';
import {
  useArticlesStore,
  useBlogsStore,
  useReportsStore,
  useNewsSourcesStore,
} from '../store';
import { useDebounce, useRefresh } from '../hooks';
import { Article, Blog, Report } from '../types';
import { colors, spacing, typography, layout, borderRadius } from '../theme';
import { Ionicons } from '@expo/vector-icons';

type ContentTab = 'articles' | 'blogs' | 'reports';

const ExploreScreen = memo(() => {
  const insets = useSafeAreaInsets();
  
  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<ContentTab>('articles');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  
  // Debounced search
  const debouncedSearch = useDebounce(searchQuery, 500);
  
  // Stores
  const articlesStore = useArticlesStore();
  const blogsStore = useBlogsStore();
  const reportsStore = useReportsStore();
  const { newsSites, selectedSite, fetchNewsSites, selectSite } = useNewsSourcesStore();

  // Initial fetch
  useEffect(() => {
    fetchNewsSites();
    blogsStore.fetchBlogs();
    reportsStore.fetchReports();
  }, []);

  // Search effect
  useEffect(() => {
    if (debouncedSearch) {
      switch (activeTab) {
        case 'articles':
          articlesStore.searchArticles(debouncedSearch);
          break;
        case 'blogs':
          blogsStore.searchBlogs(debouncedSearch);
          break;
        case 'reports':
          reportsStore.searchReports(debouncedSearch);
          break;
      }
    } else {
      // Reset to default when search is cleared
      articlesStore.clearFilters();
      articlesStore.fetchArticles();
    }
  }, [debouncedSearch, activeTab]);

  // Filter by news site effect
  useEffect(() => {
    if (selectedSite) {
      articlesStore.setFilters({ newsSite: selectedSite });
      articlesStore.fetchArticles();
    }
  }, [selectedSite]);

  // Featured filter effect
  useEffect(() => {
    articlesStore.setFilters({ isFeatured: showFeaturedOnly ? true : null });
    articlesStore.fetchArticles();
  }, [showFeaturedOnly]);

  // Refresh handler
  const { isRefreshing, handleRefresh } = useRefresh({
    onRefresh: async () => {
      switch (activeTab) {
        case 'articles':
          await articlesStore.fetchArticles(true);
          break;
        case 'blogs':
          await blogsStore.fetchBlogs(true);
          break;
        case 'reports':
          await reportsStore.fetchReports(true);
          break;
      }
    },
  });

  // Tab change handler
  const handleTabChange = useCallback((tab: ContentTab) => {
    setActiveTab(tab);
    setSearchQuery('');
  }, []);

  // Clear news site filter
  const handleClearSiteFilter = useCallback(() => {
    selectSite(null);
    articlesStore.setFilters({ newsSite: null });
    articlesStore.fetchArticles();
  }, [selectSite]);

  // Get current data and loading state
  const getCurrentData = useMemo(() => {
    switch (activeTab) {
      case 'articles':
        return {
          data: articlesStore.articles,
          isLoading: articlesStore.isLoading,
          error: articlesStore.error,
          loadMore: articlesStore.loadMore,
          hasMore: articlesStore.hasMore,
          isLoadingMore: articlesStore.isLoadingMore,
        };
      case 'blogs':
        return {
          data: blogsStore.blogs,
          isLoading: blogsStore.isLoading,
          error: blogsStore.error,
          loadMore: blogsStore.loadMore,
          hasMore: blogsStore.hasMore,
          isLoadingMore: blogsStore.isLoadingMore,
        };
      case 'reports':
        return {
          data: reportsStore.reports,
          isLoading: reportsStore.isLoading,
          error: reportsStore.error,
          loadMore: reportsStore.loadMore,
          hasMore: reportsStore.hasMore,
          isLoadingMore: reportsStore.isLoadingMore,
        };
    }
  }, [activeTab, articlesStore, blogsStore, reportsStore]);

  // Render article item
  const renderArticleItem: ListRenderItem<Article> = useCallback(
    ({ item, index }) => (
      <Animated.View entering={FadeInDown.delay(index * 30).springify()}>
        <ArticleCardHorizontal article={item} />
      </Animated.View>
    ),
    []
  );

  // Render blog item
  const renderBlogItem: ListRenderItem<Blog> = useCallback(
    ({ item, index }) => (
      <Animated.View entering={FadeInDown.delay(index * 30).springify()}>
        <BlogCard blog={item} />
      </Animated.View>
    ),
    []
  );

  // Render report item
  const renderReportItem: ListRenderItem<Report> = useCallback(
    ({ item, index }) => (
      <Animated.View entering={FadeInDown.delay(index * 30).springify()}>
        <ReportCard report={item} />
      </Animated.View>
    ),
    []
  );

  // Key extractors
  const keyExtractor = useCallback((item: Article | Blog | Report) => 
    item.id.toString(), 
    []
  );

  // End reached handler
  const handleEndReached = useCallback(() => {
    if (!getCurrentData.isLoadingMore && getCurrentData.hasMore) {
      getCurrentData.loadMore();
    }
  }, [getCurrentData]);

  // List header
  const ListHeader = useCallback(
    () => (
      <>
        {/* News Sources */}
        {activeTab === 'articles' && newsSites.length > 0 && (
          <View style={styles.sourcesContainer}>
            <SectionHeader title="News Sources" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sourcesScroll}
            >
              <NewsSourceChip
                name="All Sources"
                isSelected={!selectedSite}
                onPress={handleClearSiteFilter}
              />
              {newsSites.slice(0, 10).map((site) => (
                <NewsSourceChip
                  key={site}
                  name={site}
                  isSelected={selectedSite === site}
                  onPress={() => selectSite(site)}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Articles Filters */}
        {activeTab === 'articles' && (
          <View style={styles.filtersRow}>
            <FilterChip
              label="Featured"
              isSelected={showFeaturedOnly}
              onPress={() => setShowFeaturedOnly(!showFeaturedOnly)}
              icon={<Ionicons name="star" size={14} color={showFeaturedOnly ? colors.text : colors.textSecondary} />}
            />
          </View>
        )}

        {/* Results count */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {getCurrentData.data.length} {activeTab}
          </Text>
        </View>
      </>
    ),
    [activeTab, newsSites, selectedSite, showFeaturedOnly, getCurrentData.data.length, handleClearSiteFilter, selectSite]
  );

  // List footer
  const ListFooter = useCallback(
    () => (
      <>
        {getCurrentData.isLoadingMore && (
          <LoadingIndicator size="small" text="Loading more..." />
        )}
        <View style={{ height: layout.tabBarHeight + spacing.xl }} />
      </>
    ),
    [getCurrentData.isLoadingMore]
  );

  // Get render item based on tab
  const getRenderItem = () => {
    switch (activeTab) {
      case 'articles':
        return renderArticleItem as ListRenderItem<Article | Blog | Report>;
      case 'blogs':
        return renderBlogItem as ListRenderItem<Article | Blog | Report>;
      case 'reports':
        return renderReportItem as ListRenderItem<Article | Blog | Report>;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={colors.gradientSpace}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.title}>Explore</Text>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={`Search ${activeTab}...`}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <FilterChip
            label="Articles"
            isSelected={activeTab === 'articles'}
            onPress={() => handleTabChange('articles')}
          />
          <FilterChip
            label="Blogs"
            isSelected={activeTab === 'blogs'}
            onPress={() => handleTabChange('blogs')}
          />
          <FilterChip
            label="Reports"
            isSelected={activeTab === 'reports'}
            onPress={() => handleTabChange('reports')}
          />
        </View>
      </View>

      {/* Content */}
      {getCurrentData.error && getCurrentData.data.length === 0 ? (
        <ErrorState
          message={getCurrentData.error}
          onRetry={handleRefresh}
        />
      ) : getCurrentData.isLoading && getCurrentData.data.length === 0 ? (
        <ArticleSkeletonList count={5} horizontal />
      ) : getCurrentData.data.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="No results found"
          message={searchQuery ? `No ${activeTab} matching "${searchQuery}"` : `No ${activeTab} available`}
          actionText="Clear search"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <FlashList
          data={getCurrentData.data}
          renderItem={getRenderItem()}
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
            />
          }
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  searchContainer: {
    marginBottom: spacing.lg,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  sourcesContainer: {
    marginBottom: spacing.lg,
  },
  sourcesScroll: {
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filtersRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  resultsHeader: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  resultsCount: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    textTransform: 'capitalize',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
  },
});

ExploreScreen.displayName = 'ExploreScreen';

export default ExploreScreen;
