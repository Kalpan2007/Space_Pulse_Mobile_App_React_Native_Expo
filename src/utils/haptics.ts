/**
 * Space Pulse - Haptic Utilities
 */

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Light haptic feedback for selections
 */
export const hapticLight = async (): Promise<void> => {
  if (Platform.OS === 'ios') {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } else {
    await Haptics.selectionAsync();
  }
};

/**
 * Medium haptic feedback for button presses
 */
export const hapticMedium = async (): Promise<void> => {
  if (Platform.OS === 'ios') {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } else {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
};

/**
 * Heavy haptic feedback for important actions
 */
export const hapticHeavy = async (): Promise<void> => {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
};

/**
 * Success haptic notification
 */
export const hapticSuccess = async (): Promise<void> => {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

/**
 * Warning haptic notification
 */
export const hapticWarning = async (): Promise<void> => {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
};

/**
 * Error haptic notification
 */
export const hapticError = async (): Promise<void> => {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
};

/**
 * Selection haptic feedback
 */
export const hapticSelection = async (): Promise<void> => {
  await Haptics.selectionAsync();
};

export const haptics = {
  light: hapticLight,
  medium: hapticMedium,
  heavy: hapticHeavy,
  success: hapticSuccess,
  warning: hapticWarning,
  error: hapticError,
  selection: hapticSelection,
};

export default haptics;
