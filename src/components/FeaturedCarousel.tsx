/**
 * Space Pulse - Featured Carousel Component
 * Premium carousel with centered cards, navigation arrows, and smooth animations
 */

import React, { memo, useCallback, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';
import { PressableScale } from './PressableScale';
import { CachedImage } from './CachedImage';
import { Skeleton } from './Skeleton';
import { Article, RootStackParamList } from '../types';
import { colors, spacing, typography, borderRadius } from '../theme';
import { formatRelativeTime, triggerHaptic } from '../utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDE_SPACING = spacing.xxl + spacing.md;
const CARD_WIDTH = SCREEN_WIDTH - (SIDE_SPACING * 2);
const CARD_HEIGHT = 240;
const SNAP_INTERVAL = CARD_WIDTH + spacing.md;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface FeaturedCarouselProps {
  articles: Article[];
  isLoading?: boolean;
}

interface CarouselItemProps {
  article: Article;
  index: number;
  scrollX: SharedValue<number>;
  totalItems: number;
}

const CarouselItem = memo<CarouselItemProps>(({ article, index, scrollX, totalItems }) => {
  const navigation = useNavigation<NavigationProp>();

  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SNAP_INTERVAL,
      index * SNAP_INTERVAL,
      (index + 1) * SNAP_INTERVAL,
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.92, 1, 0.92],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.6, 1, 0.6],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const handlePress = useCallback(() => {
    triggerHaptic('light');
    navigation.navigate('ArticleDetail', { articleId: article.id });
  }, [navigation, article.id]);

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      <PressableScale onPress={handlePress} style={styles.card} scaleTo={0.98}>
        <CachedImage
          uri={article.image_url}
          style={styles.image}
          borderRadiusSize="xl"
        />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.95)']}
          locations={[0, 0.5, 1]}
          style={styles.gradient}
        />
        
        <LinearGradient
          colors={['rgba(255,255,255,0.15)', 'transparent']}
          style={styles.shine}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.3 }}
        />
        
        <View style={styles.content}>
          <View style={styles.topRow}>
            <View style={styles.featuredBadge}>
              <Ionicons name="star" size={10} color={colors.text} />
              <Text style={styles.featuredText}>FEATURED</Text>
            </View>
            <View style={styles.counterBadge}>
              <Text style={styles.counterText}>{index + 1}/{totalItems}</Text>
            </View>
          </View>
          
          <View style={styles.textContainer}>
            <View style={styles.sourceRow}>
              <View style={styles.sourceDot} />
              <Text style={styles.newsSite}>{article.news_site}</Text>
            </View>
            
            <Text style={styles.title} numberOfLines={2}>
              {article.title}
            </Text>
            
            <View style={styles.metaRow}>
              <View style={styles.timeContainer}>
                <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
                <Text style={styles.time}>{formatRelativeTime(article.published_at)}</Text>
              </View>
              <View style={styles.readMore}>
                <Text style={styles.readMoreText}>Read More</Text>
                <Ionicons name="arrow-forward" size={12} color={colors.accent} />
              </View>
            </View>
          </View>
        </View>
      </PressableScale>
    </Animated.View>
  );
});

const SkeletonCard = memo(() => (
  <View style={styles.skeletonContainer}>
    <Skeleton
      width={CARD_WIDTH}
      height={CARD_HEIGHT}
      borderRadiusSize="xl"
    />
  </View>
));

interface NavButtonProps {
  direction: 'left' | 'right';
  onPress: () => void;
  disabled?: boolean;
}

const NavButton = memo<NavButtonProps>(({ direction, onPress, disabled }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.7}
    style={[
      styles.navButton,
      direction === 'left' ? styles.navButtonLeft : styles.navButtonRight,
      disabled && styles.navButtonDisabled,
    ]}
  >
    <BlurView intensity={40} tint="dark" style={styles.navButtonBlur}>
      <Ionicons
        name={direction === 'left' ? 'chevron-back' : 'chevron-forward'}
        size={20}
        color={disabled ? colors.textMuted : colors.text}
      />
    </BlurView>
  </TouchableOpacity>
));

export const FeaturedCarousel = memo<FeaturedCarouselProps>(({
  articles,
  isLoading = false,
}) => {
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList<Article>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const scrollToIndex = useCallback((index: number) => {
    if (index >= 0 && index < articles.length) {
      triggerHaptic('light');
      flatListRef.current?.scrollToOffset({
        offset: index * SNAP_INTERVAL,
        animated: true,
      });
      setCurrentIndex(index);
    }
  }, [articles.length]);

  const handlePrev = useCallback(() => {
    scrollToIndex(currentIndex - 1);
  }, [currentIndex, scrollToIndex]);

  const handleNext = useCallback(() => {
    scrollToIndex(currentIndex + 1);
  }, [currentIndex, scrollToIndex]);

  const onMomentumScrollEnd = useCallback((event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SNAP_INTERVAL);
    setCurrentIndex(Math.max(0, Math.min(index, articles.length - 1)));
  }, [articles.length]);

  const renderItem: ListRenderItem<Article> = useCallback(
    ({ item, index }) => (
      <CarouselItem 
        article={item} 
        index={index} 
        scrollX={scrollX} 
        totalItems={articles.length}
      />
    ),
    [scrollX, articles.length]
  );

  const keyExtractor = useCallback((item: Article) => item.id.toString(), []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Featured Stories</Text>
        </View>
        <SkeletonCard />
      </View>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Ionicons name="flame" size={22} color={colors.secondary} />
          <Text style={styles.sectionTitle}>Featured Stories</Text>
        </View>
        <View style={styles.headerAccent} />
      </View>
      
      <View style={styles.carouselWrapper}>
        <AnimatedFlatList
          ref={flatListRef}
          data={articles}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={SNAP_INTERVAL}
          decelerationRate="fast"
          contentContainerStyle={styles.listContent}
          onScroll={scrollHandler}
          onMomentumScrollEnd={onMomentumScrollEnd}
          scrollEventThrottle={16}
        />
        
        {articles.length > 1 && (
          <>
            <NavButton
              direction="left"
              onPress={handlePrev}
              disabled={currentIndex === 0}
            />
            <NavButton
              direction="right"
              onPress={handleNext}
              disabled={currentIndex === articles.length - 1}
            />
          </>
        )}
      </View>
      
      <View style={styles.paginationContainer}>
        <View style={styles.pagination}>
          {articles.map((_, index) => (
            <PaginationDot
              key={index}
              index={index}
              scrollX={scrollX}
              isActive={index === currentIndex}
            />
          ))}
        </View>
        <Text style={styles.paginationText}>
          {currentIndex + 1} of {articles.length}
        </Text>
      </View>
    </View>
  );
});

interface PaginationDotProps {
  index: number;
  scrollX: SharedValue<number>;
  isActive: boolean;
}

const PaginationDot = memo<PaginationDotProps>(({ index, scrollX, isActive }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SNAP_INTERVAL,
      index * SNAP_INTERVAL,
      (index + 1) * SNAP_INTERVAL,
    ];

    const width = interpolate(
      scrollX.value,
      inputRange,
      [8, 28, 8],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolation.CLAMP
    );

    return { width, opacity };
  });

  return (
    <TouchableOpacity activeOpacity={0.7}>
      <Animated.View style={[styles.dot, animatedStyle, isActive && styles.dotActive]} />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xxl,
  },
  headerRow: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    letterSpacing: 0.5,
  },
  headerAccent: {
    height: 3,
    width: 60,
    backgroundColor: colors.secondary,
    borderRadius: 2,
    marginTop: spacing.sm,
    marginLeft: spacing.sm + 22,
  },
  carouselWrapper: {
    position: 'relative',
  },
  listContent: {
    paddingHorizontal: SIDE_SPACING,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: spacing.md,
  },
  card: {
    flex: 1,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  skeletonContainer: {
    paddingHorizontal: SIDE_SPACING,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
  },
  featuredText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.text,
    letterSpacing: 1.2,
  },
  counterBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  counterText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  textContainer: {
    marginTop: 'auto',
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sourceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: spacing.sm,
  },
  newsSite: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    lineHeight: typography.sizes.xl * 1.35,
    marginBottom: spacing.sm,
  },
  metaRow: {
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
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  readMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  readMoreText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.accent,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    zIndex: 10,
  },
  navButtonLeft: {
    left: spacing.sm,
  },
  navButtonRight: {
    right: spacing.sm,
  },
  navButtonBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Platform.OS === 'android' ? 'rgba(0,0,0,0.6)' : undefined,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  paginationText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    fontWeight: typography.weights.medium,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textMuted,
  },
  dotActive: {
    backgroundColor: colors.accent,
  },
});

CarouselItem.displayName = 'CarouselItem';
SkeletonCard.displayName = 'SkeletonCard';
NavButton.displayName = 'NavButton';
PaginationDot.displayName = 'PaginationDot';
FeaturedCarousel.displayName = 'FeaturedCarousel';
