/**
 * Space Pulse - Cached Image Component
 * Image component with loading states
 */

import React, { memo, useState } from 'react';
import { StyleSheet, View, StyleProp, ImageStyle, Image, ImageProps } from 'react-native';
import { Skeleton } from './Skeleton';
import { colors, borderRadius } from '../theme';

interface CachedImageProps extends Omit<ImageProps, 'source'> {
  uri: string;
  style?: StyleProp<ImageStyle>;
  borderRadiusSize?: keyof typeof borderRadius;
  showSkeleton?: boolean;
  fallbackColor?: string;
}

export const CachedImage = memo<CachedImageProps>(({
  uri,
  style,
  borderRadiusSize = 'md',
  showSkeleton = true,
  fallbackColor = colors.surfaceLight,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <View style={[
      styles.container,
      { borderRadius: borderRadius[borderRadiusSize] },
      style as any,
    ]}>
      {isLoading && showSkeleton && (
        <View style={StyleSheet.absoluteFill}>
          <Skeleton
            width="100%"
            height={undefined}
            style={StyleSheet.absoluteFill}
            borderRadiusSize={borderRadiusSize}
          />
        </View>
      )}
      
      {hasError ? (
        <View style={[
          styles.fallback,
          { backgroundColor: fallbackColor }
        ]}>
          <View style={styles.fallbackIcon} />
        </View>
      ) : (
        <Image
          source={{ uri }}
          style={[
            styles.image,
            { borderRadius: borderRadius[borderRadiusSize] },
          ]}
          resizeMode="cover"
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          {...props}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: colors.surfaceLight,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.textMuted,
    opacity: 0.3,
  },
});

CachedImage.displayName = 'CachedImage';
