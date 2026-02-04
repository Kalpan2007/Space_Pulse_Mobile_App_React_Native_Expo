/**
 * Space Pulse - Utilities Index
 */

export { storage } from './storage';
export * from './date';
export { 
  haptics, 
  hapticLight, 
  hapticMedium, 
  hapticHeavy, 
  hapticSuccess, 
  hapticWarning, 
  hapticError, 
  hapticSelection 
} from './haptics';

// Convenience function for triggering haptic feedback
type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

export const triggerHaptic = (type: HapticType = 'light'): void => {
  // Import synchronously to avoid module resolution issues
  const { haptics } = require('./haptics');
  
  try {
    switch (type) {
      case 'light':
        haptics.light();
        break;
      case 'medium':
        haptics.medium();
        break;
      case 'heavy':
        haptics.heavy();
        break;
      case 'success':
        haptics.success();
        break;
      case 'warning':
        haptics.warning();
        break;
      case 'error':
        haptics.error();
        break;
      case 'selection':
        haptics.selection();
        break;
      default:
        haptics.light();
    }
  } catch (error) {
    // Silently fail if haptics not available
  }
};
