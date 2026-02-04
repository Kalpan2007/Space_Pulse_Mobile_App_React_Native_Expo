/**
 * Space Pulse - Theme System
 * Premium Space-Themed Design System
 */

export const colors = {
  // Primary Colors
  primary: '#0B0F1A',
  secondary: '#6C63FF',
  accent: '#00E5FF',
  
  // Background Colors
  background: '#05070D',
  backgroundSecondary: '#0D1117',
  backgroundTertiary: '#161B22',
  
  // Surface Colors
  surface: '#1C2128',
  surfaceLight: '#2D333B',
  
  // Text Colors
  text: '#FFFFFF',
  textSecondary: '#A0A7B8',
  textMuted: '#6E7681',
  
  // Status Colors
  success: '#3FB950',
  warning: '#D29922',
  error: '#F85149',
  info: '#58A6FF',
  
  // Gradient Colors
  gradientPurple: ['#6C63FF', '#8B5CF6'],
  gradientCyan: ['#00E5FF', '#00D4E5'],
  gradientSpace: ['#0B0F1A', '#1A1F35', '#0B0F1A'],
  
  // Glassmorphism
  glass: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  glassLight: 'rgba(255, 255, 255, 0.08)',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.6)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  
  // Tab Bar
  tabBarBackground: 'rgba(5, 7, 13, 0.85)',
  tabBarActive: '#00E5FF',
  tabBarInactive: '#6E7681',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

export const typography = {
  // Font Sizes
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 22,
    xxxl: 28,
    huge: 34,
    display: 42,
  },
  
  // Font Weights
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  
  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  glow: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  accentGlow: {
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
} as const;

export const animations = {
  fast: 150,
  normal: 250,
  slow: 400,
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
  springBouncy: {
    damping: 10,
    stiffness: 200,
    mass: 0.8,
  },
} as const;

export const layout = {
  screenPadding: spacing.lg,
  cardPadding: spacing.lg,
  headerHeight: 60,
  tabBarHeight: 80,
  bottomSafeArea: 34,
} as const;

// Theme object for easy access
const theme = {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
  animations,
  layout,
};

export default theme;
