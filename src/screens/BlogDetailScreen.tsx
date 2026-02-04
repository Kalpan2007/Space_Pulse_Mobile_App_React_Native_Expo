/**
 * Space Pulse - Blog Detail Screen
 * Full blog view with author info
 */

import React, { memo, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Linking,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import {
  PressableScale,
  CachedImage,
  SaveButton,
  AuthorSocialLinks,
  LoadingIndicator,
  ErrorState,
} from '../components';
import { useBlogsStore } from '../store';
import { formatFullDate, formatRelativeTime } from '../utils';
import { RootStackParamList } from '../types';
import { colors, spacing, typography, borderRadius } from '../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HERO_HEIGHT = SCREEN_HEIGHT * 0.4;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type BlogDetailRouteProp = RouteProp<RootStackParamList, 'BlogDetail'>;

const BlogDetailScreen = memo(() => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<BlogDetailRouteProp>();
  const { blogId } = route.params;

  const { currentBlog, isLoading, error, fetchBlog } = useBlogsStore();

  const scrollY = useSharedValue(0);

  // Fetch blog on mount
  useEffect(() => {
    fetchBlog(blogId);
  }, [blogId, fetchBlog]);

  // Scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Parallax effect
  const imageAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [-100, 0, HERO_HEIGHT],
      [-50, 0, HERO_HEIGHT * 0.5],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      scrollY.value,
      [-100, 0],
      [1.2, 1],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleOpenInBrowser = useCallback(() => {
    if (currentBlog?.url) {
      Linking.openURL(currentBlog.url);
    }
  }, [currentBlog]);

  if (isLoading || !currentBlog) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={colors.gradientSpace} style={StyleSheet.absoluteFill} />
        <LoadingIndicator fullScreen text="Loading blog..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={colors.gradientSpace} style={StyleSheet.absoluteFill} />
        <ErrorState message={error} onRetry={() => fetchBlog(blogId)} />
      </View>
    );
  }

  const primaryAuthor = currentBlog.authors?.[0];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Back Button */}
      <View style={[styles.backButton, { top: insets.top + spacing.sm }]}>
        <PressableScale onPress={handleGoBack} style={styles.iconButton}>
          <BlurView intensity={60} tint="dark" style={styles.iconBlur}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </BlurView>
        </PressableScale>
      </View>

      {/* Action Buttons */}
      <View style={[styles.actionButtons, { top: insets.top + spacing.sm }]}>
        <SaveButton item={currentBlog} type="blog" size={22} />
        <PressableScale onPress={handleOpenInBrowser} style={styles.iconButton}>
          <BlurView intensity={60} tint="dark" style={styles.iconBlur}>
            <Ionicons name="open-outline" size={20} color={colors.text} />
          </BlurView>
        </PressableScale>
      </View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Animated.View style={[styles.heroImage, imageAnimatedStyle]}>
            <CachedImage
              uri={currentBlog.image_url}
              style={StyleSheet.absoluteFill}
              borderRadiusSize="xs"
            />
          </Animated.View>
          
          <LinearGradient
            colors={['transparent', colors.background]}
            style={styles.heroGradient}
          />

          {/* Blog Badge */}
          <Animated.View entering={FadeIn.delay(100)} style={styles.blogBadge}>
            <Ionicons name="create-outline" size={14} color={colors.text} />
            <Text style={styles.blogBadgeText}>Blog Post</Text>
          </Animated.View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title */}
          <Animated.Text entering={FadeInDown.delay(150)} style={styles.title}>
            {currentBlog.title}
          </Animated.Text>

          {/* Meta Info */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.metaContainer}>
            <View style={styles.sourceContainer}>
              <Ionicons name="globe-outline" size={14} color={colors.accent} />
              <Text style={styles.sourceText}>{currentBlog.news_site}</Text>
            </View>
            <View style={styles.dateContainer}>
              <Ionicons name="time-outline" size={14} color={colors.textMuted} />
              <Text style={styles.dateText}>
                {formatRelativeTime(currentBlog.published_at)}
              </Text>
            </View>
          </Animated.View>

          {/* Author Section */}
          {primaryAuthor && (
            <Animated.View entering={FadeInDown.delay(250)} style={styles.authorSection}>
              <AuthorSocialLinks author={primaryAuthor} />
            </Animated.View>
          )}

          {/* Summary */}
          <Animated.View entering={FadeInDown.delay(300)} style={styles.summaryContainer}>
            <Text style={styles.summaryLabel}>Summary</Text>
            <Text style={styles.summaryText}>{currentBlog.summary}</Text>
          </Animated.View>

          {/* Published Date */}
          <Animated.View entering={FadeInDown.delay(350)} style={styles.publishedContainer}>
            <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
            <Text style={styles.publishedText}>
              Published on {formatFullDate(currentBlog.published_at)}
            </Text>
          </Animated.View>

          {/* Read Full Blog Button */}
          <Animated.View entering={FadeInDown.delay(400)}>
            <PressableScale style={styles.readButton} onPress={handleOpenInBrowser}>
              <LinearGradient
                colors={colors.gradientPurple}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.readButtonGradient}
              >
                <Text style={styles.readButtonText}>Read Full Blog Post</Text>
                <Ionicons name="arrow-forward" size={18} color={colors.text} />
              </LinearGradient>
            </PressableScale>
          </Animated.View>
        </View>
      </Animated.ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    position: 'absolute',
    left: spacing.lg,
    zIndex: 101,
  },
  actionButtons: {
    position: 'absolute',
    right: spacing.lg,
    zIndex: 101,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconButton: {
    overflow: 'hidden',
    borderRadius: 22,
  },
  iconBlur: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  scrollContent: {
    paddingBottom: spacing.huge,
  },
  heroContainer: {
    height: HERO_HEIGHT,
    overflow: 'hidden',
  },
  heroImage: {
    height: HERO_HEIGHT + 100,
    width: SCREEN_WIDTH,
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  blogBadge: {
    position: 'absolute',
    bottom: spacing.xxxl,
    left: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  blogBadgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.lg,
  },
  title: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    lineHeight: typography.sizes.xxxl * 1.2,
    marginBottom: spacing.lg,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.lg,
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sourceText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.accent,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dateText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  authorSection: {
    marginBottom: spacing.xl,
  },
  summaryContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  summaryLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  summaryText: {
    fontSize: typography.sizes.md,
    color: colors.text,
    lineHeight: typography.sizes.md * 1.7,
  },
  publishedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  publishedText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  readButton: {
    marginTop: spacing.md,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  readButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  readButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
});

BlogDetailScreen.displayName = 'BlogDetailScreen';

export default BlogDetailScreen;
