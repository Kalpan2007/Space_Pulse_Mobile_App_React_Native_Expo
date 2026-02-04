/**
 * Space Pulse - Save Button Component
 * Animated bookmark/save button
 */

import React, { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { PressableScale } from './PressableScale';
import { useSavedItemsStore } from '../store';
import { Article, Blog, Report, ContentType } from '../types';
import { haptics } from '../utils';
import { colors } from '../theme';

interface SaveButtonProps {
  item: Article | Blog | Report;
  type: ContentType;
  size?: number;
  showBackground?: boolean;
}

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

export const SaveButton = memo<SaveButtonProps>(({
  item,
  type,
  size = 24,
  showBackground = true,
}) => {
  const { isItemSaved, saveItem, removeItem } = useSavedItemsStore();
  const isSaved = isItemSaved(item.id, type);
  
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const handlePress = useCallback(async () => {
    // Trigger animation
    scale.value = withSequence(
      withSpring(1.3, { damping: 8 }),
      withSpring(1, { damping: 10 })
    );

    if (isSaved) {
      await removeItem(item.id, type);
      haptics.light();
    } else {
      await saveItem(item, type);
      haptics.success();
      
      // Extra animation for saving
      rotation.value = withSequence(
        withSpring(-10),
        withSpring(10),
        withSpring(0)
      );
    }
  }, [isSaved, item, type, saveItem, removeItem, scale, rotation]);

  return (
    <PressableScale
      onPress={handlePress}
      style={[
        styles.container,
        showBackground && styles.background,
        { width: size + 16, height: size + 16 },
      ]}
      enableHaptics={false}
    >
      <Animated.View style={animatedStyle}>
        <Ionicons
          name={isSaved ? 'bookmark' : 'bookmark-outline'}
          size={size}
          color={isSaved ? colors.accent : colors.text}
        />
      </Animated.View>
    </PressableScale>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 100,
  },
});

SaveButton.displayName = 'SaveButton';
