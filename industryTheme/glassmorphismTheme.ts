/**
 * Glassmorphism theme - Showcasing transparency and blur effects
 * Designed to work over gradient or image backgrounds
 */

import { Theme } from './index';

export const glassmorphismTheme: Theme = {
  // Spacing scale
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],

  // Typography - Modern sans-serif
  fonts: {
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    monospace: '"Fira Code", "SF Mono", Monaco, Inconsolata, monospace',
  },

  fontSizes: [12, 14, 16, 18, 20, 24, 32, 48, 64, 96],

  fontScale: 1.0,

  fontWeights: {
    body: 400,
    heading: 600,
    bold: 700,
    light: 300,
    medium: 500,
    semibold: 600,
  },

  lineHeights: {
    body: 1.6,
    heading: 1.3,
    tight: 1.4,
    relaxed: 1.8,
  },

  // Layout
  breakpoints: ['640px', '768px', '1024px', '1280px'],
  sizes: [16, 32, 64, 128, 256, 512, 768, 1024, 1536],
  radii: [0, 8, 12, 16, 20, 24, 32, 40],
  shadows: [
    'none',
    '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
    '0 12px 40px 0 rgba(31, 38, 135, 0.2)',
    '0 16px 48px 0 rgba(31, 38, 135, 0.25)',
    '0 20px 56px 0 rgba(31, 38, 135, 0.3)',
    '0 24px 64px 0 rgba(31, 38, 135, 0.35)',
  ],
  zIndices: [0, 1, 10, 20, 30, 40, 50],

  // Colors - Heavy use of transparency for glass effect
  colors: {
    // Base colors with transparency
    text: 'rgba(255, 255, 255, 0.95)', // Nearly opaque white
    background: 'rgba(255, 255, 255, 0.1)', // Very transparent white
    primary: 'rgba(99, 102, 241, 0.9)', // Semi-transparent indigo
    secondary: 'rgba(139, 92, 246, 0.9)', // Semi-transparent purple
    accent: 'rgba(236, 72, 153, 0.9)', // Semi-transparent pink
    highlight: 'rgba(99, 102, 241, 0.2)', // Transparent indigo
    muted: 'rgba(255, 255, 255, 0.05)', // Barely visible white

    // Status colors with transparency
    success: 'rgba(34, 197, 94, 0.9)', // Semi-transparent green
    warning: 'rgba(251, 146, 60, 0.9)', // Semi-transparent orange
    error: 'rgba(239, 68, 68, 0.9)', // Semi-transparent red
    info: 'rgba(59, 130, 246, 0.9)', // Semi-transparent blue

    // Glass effect colors
    border: 'rgba(255, 255, 255, 0.18)', // Transparent white border
    backgroundSecondary: 'rgba(255, 255, 255, 0.15)', // Slightly more opaque
    backgroundTertiary: 'rgba(255, 255, 255, 0.2)', // Even more opaque
    backgroundLight: 'rgba(255, 255, 255, 0.08)', // Very light overlay
    backgroundHover: 'rgba(255, 255, 255, 0.25)', // Hover state
    surface: 'rgba(255, 255, 255, 0.12)', // Surface panels
    textSecondary: 'rgba(255, 255, 255, 0.8)', // Slightly transparent text
    textTertiary: 'rgba(255, 255, 255, 0.6)', // More transparent text
    textMuted: 'rgba(255, 255, 255, 0.5)', // Half transparent text

    // Search highlight colors
    highlightBg: 'rgba(251, 191, 36, 0.3)', // Transparent yellow
    highlightBorder: 'rgba(251, 191, 36, 0.5)', // Stronger yellow border
  },

  // Dark mode with different transparency levels
  modes: {
    dark: {
      // Dark glass colors
      text: 'rgba(255, 255, 255, 0.95)',
      background: 'rgba(0, 0, 0, 0.3)', // Semi-transparent black
      primary: 'rgba(129, 140, 248, 0.9)', // Lighter indigo
      secondary: 'rgba(167, 139, 250, 0.9)', // Lighter purple
      accent: 'rgba(244, 114, 182, 0.9)', // Lighter pink
      highlight: 'rgba(129, 140, 248, 0.25)',
      muted: 'rgba(0, 0, 0, 0.15)',

      success: 'rgba(74, 222, 128, 0.9)',
      warning: 'rgba(251, 191, 36, 0.9)',
      error: 'rgba(248, 113, 113, 0.9)',
      info: 'rgba(96, 165, 250, 0.9)',

      border: 'rgba(255, 255, 255, 0.15)',
      backgroundSecondary: 'rgba(0, 0, 0, 0.4)',
      backgroundTertiary: 'rgba(0, 0, 0, 0.5)',
      backgroundLight: 'rgba(0, 0, 0, 0.2)',
      backgroundHover: 'rgba(255, 255, 255, 0.1)',
      surface: 'rgba(0, 0, 0, 0.35)',
      textSecondary: 'rgba(255, 255, 255, 0.8)',
      textTertiary: 'rgba(255, 255, 255, 0.6)',
      textMuted: 'rgba(255, 255, 255, 0.4)',

      highlightBg: 'rgba(251, 191, 36, 0.35)',
      highlightBorder: 'rgba(251, 191, 36, 0.6)',
    },

    // Frosted mode - maximum blur effect
    frosted: {
      text: 'rgba(31, 41, 55, 0.95)', // Dark text for light backgrounds
      background: 'rgba(255, 255, 255, 0.3)', // More opaque white
      primary: 'rgba(79, 70, 229, 0.95)', // Solid indigo
      secondary: 'rgba(124, 58, 237, 0.95)', // Solid purple
      accent: 'rgba(219, 39, 119, 0.95)', // Solid pink
      highlight: 'rgba(79, 70, 229, 0.15)',
      muted: 'rgba(255, 255, 255, 0.4)',

      success: 'rgba(16, 185, 129, 0.95)',
      warning: 'rgba(245, 158, 11, 0.95)',
      error: 'rgba(220, 38, 38, 0.95)',
      info: 'rgba(37, 99, 235, 0.95)',

      border: 'rgba(255, 255, 255, 0.5)',
      backgroundSecondary: 'rgba(255, 255, 255, 0.4)',
      backgroundTertiary: 'rgba(255, 255, 255, 0.5)',
      backgroundLight: 'rgba(255, 255, 255, 0.25)',
      backgroundHover: 'rgba(255, 255, 255, 0.6)',
      surface: 'rgba(255, 255, 255, 0.35)',
      textSecondary: 'rgba(31, 41, 55, 0.8)',
      textTertiary: 'rgba(31, 41, 55, 0.6)',
      textMuted: 'rgba(31, 41, 55, 0.5)',

      highlightBg: 'rgba(251, 191, 36, 0.4)',
      highlightBorder: 'rgba(251, 191, 36, 0.7)',
    }
  },

  // Component variants
  buttons: {
    primary: {
      color: 'white',
      bg: 'primary',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      '&:hover': {
        bg: 'secondary',
      },
    },
    secondary: {
      color: 'text',
      bg: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      '&:hover': {
        bg: 'rgba(255, 255, 255, 0.2)',
      },
    },
    ghost: {
      color: 'text',
      bg: 'transparent',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'transparent',
      '&:hover': {
        borderColor: 'rgba(255, 255, 255, 0.2)',
        bg: 'rgba(255, 255, 255, 0.05)',
      },
    },
  },

  text: {
    heading: {
      fontFamily: 'heading',
      fontWeight: 'heading',
      lineHeight: 'heading',
    },
    body: {
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body',
    },
    caption: {
      fontSize: 1,
      color: 'textSecondary',
    },
  },

  cards: {
    primary: {
      bg: 'surface',
      border: '1px solid',
      borderColor: 'border',
      borderRadius: 3,
    },
    secondary: {
      bg: 'backgroundSecondary',
      border: '1px solid',
      borderColor: 'border',
      borderRadius: 3,
    },
  },
};