/**
 * Space Pulse - Report Detail Screen
 * Full report view for industry analysis
 */

import React, { memo, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Linking,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  PressableScale,
  CachedImage,
  SaveButton,
  LoadingIndicator,
  ErrorState,
} from '../components';
import { useReportsStore } from '../store';
import { formatFullDate } from '../utils';
import { RootStackParamList } from '../types';
import { colors, spacing, typography, borderRadius } from '../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ReportDetailRouteProp = RouteProp<RootStackParamList, 'ReportDetail'>;

const ReportDetailScreen = memo(() => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ReportDetailRouteProp>();
  const { reportId } = route.params;

  const { currentReport, isLoading, error, fetchReport } = useReportsStore();

  // Fetch report on mount
  useEffect(() => {
    fetchReport(reportId);
  }, [reportId, fetchReport]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleOpenInBrowser = useCallback(() => {
    if (currentReport?.url) {
      Linking.openURL(currentReport.url);
    }
  }, [currentReport]);

  if (isLoading || !currentReport) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={colors.gradientSpace} style={StyleSheet.absoluteFill} />
        <LoadingIndicator fullScreen text="Loading report..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={colors.gradientSpace} style={StyleSheet.absoluteFill} />
        <ErrorState message={error} onRetry={() => fetchReport(reportId)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={colors.gradientSpace} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <PressableScale onPress={handleGoBack} style={styles.iconButton}>
          <BlurView intensity={60} tint="dark" style={styles.iconBlur}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </BlurView>
        </PressableScale>

        <View style={styles.headerActions}>
          <SaveButton item={currentReport} type="report" size={22} />
          <PressableScale onPress={handleOpenInBrowser} style={styles.iconButton}>
            <BlurView intensity={60} tint="dark" style={styles.iconBlur}>
              <Ionicons name="open-outline" size={20} color={colors.text} />
            </BlurView>
          </PressableScale>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Report Icon */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.iconContainer}>
          <LinearGradient
            colors={colors.gradientPurple}
            style={styles.iconGradient}
          >
            <Ionicons name="document-text" size={48} color={colors.text} />
          </LinearGradient>
        </Animated.View>

        {/* Report Badge */}
        <Animated.View entering={FadeInDown.delay(150)} style={styles.reportBadge}>
          <Ionicons name="analytics" size={14} color={colors.text} />
          <Text style={styles.reportBadgeText}>Industry Report</Text>
        </Animated.View>

        {/* Title */}
        <Animated.Text entering={FadeInDown.delay(200)} style={styles.title}>
          {currentReport.title}
        </Animated.Text>

        {/* Meta Info */}
        <Animated.View entering={FadeInDown.delay(250)} style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Ionicons name="globe-outline" size={16} color={colors.accent} />
            <Text style={styles.metaText}>{currentReport.news_site}</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
            <Text style={styles.metaTextMuted}>
              {formatFullDate(currentReport.published_at)}
            </Text>
          </View>
        </Animated.View>

        {/* Image */}
        {currentReport.image_url && (
          <Animated.View entering={FadeInDown.delay(300)} style={styles.imageContainer}>
            <CachedImage
              uri={currentReport.image_url}
              style={styles.image}
              borderRadiusSize="lg"
            />
          </Animated.View>
        )}

        {/* Summary */}
        <Animated.View entering={FadeInDown.delay(350)} style={styles.summaryContainer}>
          <View style={styles.summaryHeader}>
            <Ionicons name="document-text-outline" size={18} color={colors.accent} />
            <Text style={styles.summaryLabel}>Report Summary</Text>
          </View>
          <Text style={styles.summaryText}>{currentReport.summary}</Text>
        </Animated.View>

        {/* Read Full Report Button */}
        <Animated.View entering={FadeInDown.delay(400)}>
          <PressableScale style={styles.readButton} onPress={handleOpenInBrowser}>
            <LinearGradient
              colors={colors.gradientCyan}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.readButtonGradient}
            >
              <Ionicons name="document-text" size={20} color={colors.primary} />
              <Text style={styles.readButtonText}>Read Full Report</Text>
            </LinearGradient>
          </PressableScale>
        </Animated.View>

        {/* Info Section */}
        <Animated.View entering={FadeInDown.delay(450)} style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Ionicons name="information-circle-outline" size={20} color={colors.textMuted} />
            <Text style={styles.infoText}>
              This is a summary of the report. Click "Read Full Report" to access the complete analysis.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
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
    paddingBottom: spacing.md,
  },
  headerActions: {
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
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.huge,
  },
  iconContainer: {
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  reportBadgeText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    textAlign: 'center',
    lineHeight: typography.sizes.xxl * 1.3,
    marginBottom: spacing.lg,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
    marginHorizontal: spacing.md,
  },
  metaText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.accent,
  },
  metaTextMuted: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  imageContainer: {
    marginBottom: spacing.xl,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  summaryContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  summaryLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.accent,
  },
  summaryText: {
    fontSize: typography.sizes.md,
    color: colors.text,
    lineHeight: typography.sizes.md * 1.8,
  },
  readButton: {
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.xl,
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
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  infoSection: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    lineHeight: typography.sizes.sm * 1.6,
  },
});

ReportDetailScreen.displayName = 'ReportDetailScreen';

export default ReportDetailScreen;
