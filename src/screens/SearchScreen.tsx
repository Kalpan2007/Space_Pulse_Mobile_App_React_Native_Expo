/**
 * Space Pulse - Search Screen
 * Global search across all content types
 */

import React, { memo, useCallback, useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Keyboard,
} from 'react-native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  SearchBar,
  FilterChip,
  ArticleCardHorizontal,
  BlogCard,
  ReportCard,
  EmptyState,
  LoadingIndicator,
  PressableScale,
} from '../components';
import { articlesApi, blogsApi, reportsApi } from '../api';
import { useDebounce } from '../hooks';
import { Article, Blog, Report, RootStackParamList } from '../types';
import { colors, spacing, typography, borderRadius } from '../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type SearchTab = 'all' | 'articles' | 'blogs' | 'reports';

interface SearchResult {
  type: 'article' | 'blog' | 'report';
  data: Article | Blog | Report;
}

const SearchScreen = memo(() => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('all');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'SpaceX',
    'NASA',
    'Mars',
    'Starship',
    'ISS',
  ]);
  
  const debouncedSearch = useDebounce(searchQuery, 400);

  // Perform search
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);

      try {
        const results: SearchResult[] = [];

        if (activeTab === 'all' || activeTab === 'articles') {
          const articlesResponse = await articlesApi.searchArticles(debouncedSearch, 10);
          results.push(
            ...articlesResponse.results.map((article) => ({
              type: 'article' as const,
              data: article,
            }))
          );
        }

        if (activeTab === 'all' || activeTab === 'blogs') {
          const blogsResponse = await blogsApi.searchBlogs(debouncedSearch, 10);
          results.push(
            ...blogsResponse.results.map((blog) => ({
              type: 'blog' as const,
              data: blog,
            }))
          );
        }

        if (activeTab === 'all' || activeTab === 'reports') {
          const reportsResponse = await reportsApi.searchReports(debouncedSearch, 10);
          results.push(
            ...reportsResponse.results.map((report) => ({
              type: 'report' as const,
              data: report,
            }))
          );
        }

        // Sort by published date
        results.sort((a, b) => 
          new Date(b.data.published_at).getTime() - new Date(a.data.published_at).getTime()
        );

        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedSearch, activeTab]);

  // Handle close
  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Handle recent search tap
  const handleRecentSearchTap = useCallback((query: string) => {
    setSearchQuery(query);
    Keyboard.dismiss();
  }, []);

  // Render search result
  const renderItem: ListRenderItem<SearchResult> = useCallback(
    ({ item, index }) => (
      <Animated.View entering={FadeInDown.delay(index * 30).springify()}>
        {item.type === 'article' && (
          <ArticleCardHorizontal article={item.data as Article} />
        )}
        {item.type === 'blog' && (
          <BlogCard blog={item.data as Blog} />
        )}
        {item.type === 'report' && (
          <ReportCard report={item.data as Report} />
        )}
      </Animated.View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: SearchResult) => `${item.type}-${item.data.id}`,
    []
  );

  // Filter counts
  const filterCounts = useMemo(() => ({
    all: searchResults.length,
    articles: searchResults.filter((r) => r.type === 'article').length,
    blogs: searchResults.filter((r) => r.type === 'blog').length,
    reports: searchResults.filter((r) => r.type === 'report').length,
  }), [searchResults]);

  // Filtered results based on active tab
  const filteredResults = useMemo(() => {
    if (activeTab === 'all') return searchResults;
    return searchResults.filter((r) => r.type === activeTab.slice(0, -1));
  }, [searchResults, activeTab]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={colors.gradientSpace} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <Animated.View 
        entering={FadeInUp.delay(100)}
        style={[styles.header, { paddingTop: insets.top + spacing.md }]}
      >
        <View style={styles.headerTop}>
          <Text style={styles.title}>Search</Text>
          <PressableScale onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </PressableScale>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search articles, blogs, reports..."
            autoFocus
          />
        </View>

        {/* Filter Tabs */}
        {searchResults.length > 0 && (
          <View style={styles.tabsContainer}>
            <FilterChip
              label={`All (${filterCounts.all})`}
              isSelected={activeTab === 'all'}
              onPress={() => setActiveTab('all')}
            />
            <FilterChip
              label={`Articles (${filterCounts.articles})`}
              isSelected={activeTab === 'articles'}
              onPress={() => setActiveTab('articles')}
            />
            <FilterChip
              label={`Blogs (${filterCounts.blogs})`}
              isSelected={activeTab === 'blogs'}
              onPress={() => setActiveTab('blogs')}
            />
            <FilterChip
              label={`Reports (${filterCounts.reports})`}
              isSelected={activeTab === 'reports'}
              onPress={() => setActiveTab('reports')}
            />
          </View>
        )}
      </Animated.View>

      {/* Content */}
      {isSearching ? (
        <LoadingIndicator text="Searching..." />
      ) : searchQuery.length === 0 ? (
        // Show recent searches when no query
        <View style={styles.recentContainer}>
          <Text style={styles.recentTitle}>Recent Searches</Text>
          <View style={styles.recentTags}>
            {recentSearches.map((query, index) => (
              <Animated.View
                key={query}
                entering={FadeInDown.delay(index * 50).springify()}
              >
                <PressableScale
                  style={styles.recentTag}
                  onPress={() => handleRecentSearchTap(query)}
                >
                  <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.recentTagText}>{query}</Text>
                </PressableScale>
              </Animated.View>
            ))}
          </View>

          {/* Popular Topics */}
          <Text style={[styles.recentTitle, { marginTop: spacing.xl }]}>
            Popular Topics
          </Text>
          <View style={styles.topicsList}>
            {['Rocket Launches', 'Space Exploration', 'Satellites', 'Astronomy'].map(
              (topic, index) => (
                <Animated.View
                  key={topic}
                  entering={FadeInDown.delay(200 + index * 50).springify()}
                >
                  <PressableScale
                    style={styles.topicItem}
                    onPress={() => handleRecentSearchTap(topic)}
                  >
                    <View style={styles.topicIcon}>
                      <Ionicons name="trending-up" size={16} color={colors.accent} />
                    </View>
                    <Text style={styles.topicText}>{topic}</Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                  </PressableScale>
                </Animated.View>
              )
            )}
          </View>
        </View>
      ) : filteredResults.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="No results found"
          message={`We couldn't find anything matching "${searchQuery}"`}
        />
      ) : (
        <FlashList
          data={filteredResults}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    marginBottom: spacing.md,
  },
  tabsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.huge,
  },
  recentContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  recentTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  recentTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  recentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  recentTagText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  topicsList: {
    gap: spacing.sm,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  topicIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.accent}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  topicText: {
    flex: 1,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
});

SearchScreen.displayName = 'SearchScreen';

export default SearchScreen;
