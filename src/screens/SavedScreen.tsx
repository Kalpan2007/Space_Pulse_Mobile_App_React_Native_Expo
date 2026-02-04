/**
 * Space Pulse - Saved Screen
 * Display bookmarked articles, blogs, and reports
 */

import React, { memo, useCallback, useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
} from 'react-native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  FilterChip,
  ArticleCardHorizontal,
  BlogCard,
  ReportCard,
  EmptyState,
} from '../components';
import { useSavedItemsStore } from '../store';
import { SavedItem, ContentType, Article, Blog, Report } from '../types';
import { colors, spacing, typography, layout } from '../theme';
import { Ionicons } from '@expo/vector-icons';

type FilterType = 'all' | ContentType;

const SavedScreen = memo(() => {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  
  const { savedItems } = useSavedItemsStore();

  // Filter saved items
  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') {
      return savedItems;
    }
    return savedItems.filter((item) => item.type === activeFilter);
  }, [savedItems, activeFilter]);

  // Get counts for each type
  const counts = useMemo(() => ({
    all: savedItems.length,
    article: savedItems.filter((i) => i.type === 'article').length,
    blog: savedItems.filter((i) => i.type === 'blog').length,
    report: savedItems.filter((i) => i.type === 'report').length,
  }), [savedItems]);

  // Render saved item based on type
  const renderItem: ListRenderItem<SavedItem> = useCallback(
    ({ item, index }) => {
      const content = (
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
      );

      return content;
    },
    []
  );

  const keyExtractor = useCallback(
    (item: SavedItem) => `${item.type}-${item.id}`,
    []
  );

  // List header
  const ListHeader = useCallback(
    () => (
      <Animated.View entering={FadeInUp.delay(100)}>
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="bookmark" size={24} color={colors.accent} />
            <Text style={styles.statNumber}>{counts.all}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="newspaper-outline" size={24} color={colors.secondary} />
            <Text style={styles.statNumber}>{counts.article}</Text>
            <Text style={styles.statLabel}>Articles</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="document-text-outline" size={24} color={colors.success} />
            <Text style={styles.statNumber}>{counts.blog + counts.report}</Text>
            <Text style={styles.statLabel}>Others</Text>
          </View>
        </View>

        {/* Filter chips */}
        <View style={styles.filterContainer}>
          <FilterChip
            label={`All (${counts.all})`}
            isSelected={activeFilter === 'all'}
            onPress={() => setActiveFilter('all')}
          />
          <FilterChip
            label={`Articles (${counts.article})`}
            isSelected={activeFilter === 'article'}
            onPress={() => setActiveFilter('article')}
          />
          <FilterChip
            label={`Blogs (${counts.blog})`}
            isSelected={activeFilter === 'blog'}
            onPress={() => setActiveFilter('blog')}
          />
          <FilterChip
            label={`Reports (${counts.report})`}
            isSelected={activeFilter === 'report'}
            onPress={() => setActiveFilter('report')}
          />
        </View>

        {/* Results count */}
        <Text style={styles.resultsText}>
          {filteredItems.length} saved {activeFilter === 'all' ? 'items' : activeFilter + 's'}
        </Text>
      </Animated.View>
    ),
    [counts, activeFilter, filteredItems.length]
  );

  // List footer
  const ListFooter = useCallback(
    () => <View style={{ height: layout.tabBarHeight + spacing.xl }} />,
    []
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={colors.gradientSpace}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.title}>Saved</Text>
        <Text style={styles.subtitle}>Your bookmarked content</Text>
      </View>

      {/* Content */}
      {savedItems.length === 0 ? (
        <EmptyState
          icon="bookmark-outline"
          title="No saved items"
          message="Articles, blogs, and reports you save will appear here"
        />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon="filter-outline"
          title={`No saved ${activeFilter}s`}
          message={`You haven't saved any ${activeFilter}s yet`}
          actionText="View all"
          onAction={() => setActiveFilter('all')}
        />
      ) : (
        <FlashList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={ListFooter}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.glassBorder,
  },
  statNumber: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginTop: spacing.sm,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  resultsText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
  },
});

SavedScreen.displayName = 'SavedScreen';

export default SavedScreen;
