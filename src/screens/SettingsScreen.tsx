/**
 * Space Pulse - Settings Screen
 * App settings and preferences
 */

import React, { memo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Switch,
  Alert,
  Linking,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { PressableScale, GlassCard } from '../components';
import { useSettingsStore, useSavedItemsStore } from '../store';
import { haptics } from '../utils';
import { colors, spacing, typography, borderRadius, layout } from '../theme';

interface SettingRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  title: string;
  subtitle?: string;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  onPress?: () => void;
  showChevron?: boolean;
}

const SettingRow = memo<SettingRowProps>(({
  icon,
  iconColor = colors.accent,
  title,
  subtitle,
  value,
  onValueChange,
  onPress,
  showChevron = false,
}) => {
  const content = (
    <View style={styles.settingRow}>
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && (
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        )}
      </View>
      
      {value !== undefined && onValueChange && (
        <Switch
          value={value}
          onValueChange={(newValue) => {
            haptics.light();
            onValueChange(newValue);
          }}
          trackColor={{ false: colors.surfaceLight, true: colors.secondary }}
          thumbColor={colors.text}
          ios_backgroundColor={colors.surfaceLight}
        />
      )}
      
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      )}
    </View>
  );

  if (onPress) {
    return (
      <PressableScale onPress={onPress}>
        {content}
      </PressableScale>
    );
  }

  return content;
});

const SettingsScreen = memo(() => {
  const insets = useSafeAreaInsets();
  
  const {
    notificationPreferences,
    enableOfflineMode,
    updateNotificationPrefs,
    toggleOfflineMode,
    clearCache,
  } = useSettingsStore();

  const { clearAll: clearSavedItems, savedItems } = useSavedItemsStore();

  // Handle clear cache
  const handleClearCache = useCallback(() => {
    Alert.alert(
      'Clear Cache',
      'This will remove all cached articles and search history. Your saved items will not be affected.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearCache();
            haptics.success();
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  }, [clearCache]);

  // Handle clear saved items
  const handleClearSaved = useCallback(() => {
    if (savedItems.length === 0) {
      Alert.alert('No Saved Items', 'You have no saved items to clear.');
      return;
    }

    Alert.alert(
      'Clear Saved Items',
      `This will remove all ${savedItems.length} saved items. This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await clearSavedItems();
            haptics.success();
            Alert.alert('Success', 'All saved items cleared');
          },
        },
      ]
    );
  }, [savedItems.length, clearSavedItems]);

  // Handle open link
  const handleOpenLink = useCallback((url: string) => {
    Linking.openURL(url);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={colors.gradientSpace}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + spacing.md },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInUp.delay(100)}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your experience</Text>
        </Animated.View>

        {/* Notifications Section */}
        <Animated.View entering={FadeInUp.delay(200)}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <GlassCard style={styles.section}>
            <SettingRow
              icon="flash"
              iconColor={colors.warning}
              title="Breaking News"
              subtitle="Get notified about major space news"
              value={notificationPreferences.breakingNews}
              onValueChange={(value) => updateNotificationPrefs({ breakingNews: value })}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="star"
              iconColor={colors.secondary}
              title="Featured Articles"
              subtitle="Notifications for featured content"
              value={notificationPreferences.featuredArticles}
              onValueChange={(value) => updateNotificationPrefs({ featuredArticles: value })}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="mail"
              iconColor={colors.info}
              title="Daily Digest"
              subtitle="Daily summary of top stories"
              value={notificationPreferences.dailyDigest}
              onValueChange={(value) => updateNotificationPrefs({ dailyDigest: value })}
            />
          </GlassCard>
        </Animated.View>

        {/* Storage Section */}
        <Animated.View entering={FadeInUp.delay(300)}>
          <Text style={styles.sectionTitle}>Storage</Text>
          <GlassCard style={styles.section}>
            <SettingRow
              icon="cloud-offline"
              iconColor={colors.accent}
              title="Offline Mode"
              subtitle="Cache articles for offline reading"
              value={enableOfflineMode}
              onValueChange={toggleOfflineMode}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="trash-outline"
              iconColor={colors.error}
              title="Clear Cache"
              subtitle="Remove cached data"
              onPress={handleClearCache}
              showChevron
            />
            <View style={styles.divider} />
            <SettingRow
              icon="bookmark-outline"
              iconColor={colors.warning}
              title="Clear Saved Items"
              subtitle={`${savedItems.length} items saved`}
              onPress={handleClearSaved}
              showChevron
            />
          </GlassCard>
        </Animated.View>

        {/* About Section */}
        <Animated.View entering={FadeInUp.delay(400)}>
          <Text style={styles.sectionTitle}>About</Text>
          <GlassCard style={styles.section}>
            <SettingRow
              icon="rocket-outline"
              iconColor={colors.secondary}
              title="Space Pulse"
              subtitle="Version 1.0.0"
            />
            <View style={styles.divider} />
            <SettingRow
              icon="globe-outline"
              iconColor={colors.accent}
              title="Spaceflight News API"
              subtitle="View API documentation"
              onPress={() => handleOpenLink('https://api.spaceflightnewsapi.net/v4/docs')}
              showChevron
            />
            <View style={styles.divider} />
            <SettingRow
              icon="heart-outline"
              iconColor={colors.error}
              title="Rate the App"
              subtitle="Share your feedback"
              onPress={() => Alert.alert('Thank you!', 'Rating feature coming soon.')}
              showChevron
            />
          </GlassCard>
        </Animated.View>

        {/* Footer */}
        <Animated.View entering={FadeInUp.delay(500)} style={styles.footer}>
          <View style={styles.footerLogo}>
            <Ionicons name="planet" size={32} color={colors.accent} />
          </View>
          <Text style={styles.footerText}>Space Pulse</Text>
          <Text style={styles.footerSubtext}>
            Made with ❤️ for space enthusiasts
          </Text>
          <Text style={styles.footerApi}>
            Powered by Spaceflight News API
          </Text>
        </Animated.View>

        <View style={{ height: layout.tabBarHeight + spacing.xl }} />
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
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
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  section: {
    padding: 0,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  settingSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.glassBorder,
    marginLeft: spacing.lg + 36 + spacing.md,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  footerLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  footerText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  footerSubtext: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  footerApi: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
});

SettingRow.displayName = 'SettingRow';
SettingsScreen.displayName = 'SettingsScreen';

export default SettingsScreen;
