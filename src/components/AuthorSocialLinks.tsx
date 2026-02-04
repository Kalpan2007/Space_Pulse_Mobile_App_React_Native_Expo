/**
 * Space Pulse - Author Social Links Component
 * Display author social media buttons
 */

import React, { memo, useCallback } from 'react';
import { StyleSheet, View, Text, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PressableScale } from './PressableScale';
import { Author, AuthorSocials } from '../types';
import { colors, spacing, borderRadius, typography } from '../theme';

interface AuthorSocialLinksProps {
  author: Author;
  showName?: boolean;
}

interface SocialButtonProps {
  platform: keyof AuthorSocials;
  url: string;
}

const SOCIAL_CONFIG: Record<keyof AuthorSocials, { icon: string; color: string; name: string }> = {
  x: { icon: 'logo-twitter', color: '#1DA1F2', name: 'X (Twitter)' },
  youtube: { icon: 'logo-youtube', color: '#FF0000', name: 'YouTube' },
  instagram: { icon: 'logo-instagram', color: '#E4405F', name: 'Instagram' },
  linkedin: { icon: 'logo-linkedin', color: '#0A66C2', name: 'LinkedIn' },
  mastodon: { icon: 'chatbubble-ellipses', color: '#6364FF', name: 'Mastodon' },
  bluesky: { icon: 'cloud', color: '#0085FF', name: 'Bluesky' },
};

const SocialButton = memo<SocialButtonProps>(({ platform, url }) => {
  const config = SOCIAL_CONFIG[platform];

  const handlePress = useCallback(async () => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', `Cannot open ${config.name} link`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open link');
    }
  }, [url, config.name]);

  return (
    <PressableScale
      style={[styles.socialButton, { backgroundColor: config.color }]}
      onPress={handlePress}
    >
      <Ionicons
        name={config.icon as any}
        size={18}
        color={colors.text}
      />
    </PressableScale>
  );
});

export const AuthorSocialLinks = memo<AuthorSocialLinksProps>(({
  author,
  showName = true,
}) => {
  const socialEntries = Object.entries(author.socials || {}).filter(
    ([_, value]) => value !== null && value !== undefined
  ) as [keyof AuthorSocials, string][];

  if (socialEntries.length === 0 && !showName) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.authorInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {author.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        
        {showName && (
          <View style={styles.nameContainer}>
            <Text style={styles.authorLabel}>Written by</Text>
            <Text style={styles.authorName}>{author.name}</Text>
          </View>
        )}
      </View>
      
      {socialEntries.length > 0 && (
        <View style={styles.socialContainer}>
          {socialEntries.map(([platform, url]) => (
            <SocialButton key={platform} platform={platform} url={url} />
          ))}
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  nameContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  authorLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginBottom: 2,
  },
  authorName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  socialButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

SocialButton.displayName = 'SocialButton';
AuthorSocialLinks.displayName = 'AuthorSocialLinks';
