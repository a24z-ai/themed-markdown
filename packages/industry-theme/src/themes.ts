/**
 * Collection of available themes for PrincipleMD
 */

import { Theme } from './index';
export { glassmorphismTheme } from './glassmorphismTheme';

// Regal theme (previous default) - Dark Academia with warm amber gold
export const regalTheme: Theme = {
  // Spacing scale (used for margin, padding, etc.)
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],

  // Typography
  fonts: {
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    heading: '"Crimson Text", "Georgia", "Times New Roman", serif',
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
    body: 1.5,
    heading: 1.2,
    tight: 1.25,
    relaxed: 1.75,
  },

  // Layout
  breakpoints: ['640px', '768px', '1024px', '1280px'],
  sizes: [16, 32, 64, 128, 256, 512, 768, 1024, 1536],
  radii: [0, 2, 4, 6, 8, 12, 16, 24],
  shadows: [
    'none',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  ],
  zIndices: [0, 1, 10, 20, 30, 40, 50],

  // Colors (light mode default) - Dark Academia theme with muted gold
  colors: {
    // Base colors
    text: '#f1e8dc', // Warm cream
    background: '#1a1f2e', // Deep midnight blue
    primary: '#d4a574', // Warm amber gold
    secondary: '#e0b584', // Lighter amber on hover
    accent: '#c9b8a3', // Muted gold
    highlight: 'rgba(212, 165, 116, 0.15)', // Translucent amber
    muted: '#8b7968', // Faded bronze

    // Status colors - Jewel tones
    success: '#5c8a72', // Forest green
    warning: '#d4a574', // Amber (same as primary for consistency)
    error: '#a85751', // Burgundy red
    info: '#d4a574', // Using primary amber

    // Additional semantic colors
    border: 'rgba(212, 165, 116, 0.2)', // Translucent gold
    backgroundSecondary: '#212738', // Slightly lighter navy
    backgroundTertiary: '#2d3446', // Tertiary dark blue
    backgroundLight: 'rgba(212, 165, 116, 0.08)', // Very light amber
    backgroundHover: 'rgba(212, 165, 116, 0.15)', // Translucent amber hover
    surface: '#212738', // Dark navy surface
    textSecondary: '#c9b8a3', // Muted gold
    textTertiary: '#8b7968', // Faded bronze
    textMuted: '#8b7968', // Faded bronze

    // Search highlight colors
    highlightBg: 'rgba(255, 193, 7, 0.25)', // Semi-transparent amber/yellow
    highlightBorder: 'rgba(255, 193, 7, 0.5)', // Stronger amber for border
  },

  // Component variants
  buttons: {
    primary: {
      color: 'background',
      bg: 'primary',
      '&:hover': {
        bg: 'secondary',
      },
    },
    secondary: {
      color: 'text',
      bg: 'muted',
      '&:hover': {
        bg: 'backgroundSecondary',
      },
    },
    ghost: {
      color: 'primary',
      bg: 'transparent',
      '&:hover': {
        bg: 'muted',
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
      bg: 'background',
      border: '1px solid',
      borderColor: 'border',
      borderRadius: 2,
    },
    secondary: {
      bg: 'backgroundSecondary',
      border: '1px solid',
      borderColor: 'border',
      borderRadius: 2,
    },
  },
};

// Terminal theme - Minimalistic developer-focused dark theme with transparency
export const terminalTheme: Theme = {
  // Spacing scale (used for margin, padding, etc.)
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],

  // Typography - More monospace focused
  fonts: {
    body: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace',
    heading: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace',
    monospace: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace',
  },

  fontSizes: [12, 14, 16, 18, 20, 24, 32, 48, 64, 96],

  fontScale: 1.0,

  fontWeights: {
    body: 400,
    heading: 500,
    bold: 600,
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
  radii: [0, 2, 4, 6, 8, 12, 16, 24],
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px 0 rgba(0, 0, 0, 0.07)',
    '0 8px 12px 0 rgba(0, 0, 0, 0.08)',
    '0 16px 24px 0 rgba(0, 0, 0, 0.10)',
  ],
  zIndices: [0, 1, 10, 20, 30, 40, 50],

  // Colors - Dark terminal theme with transparency
  colors: {
    // Base colors - Dark terminal inspired with transparency
    text: '#e4e4e4', // Light gray
    background: 'rgba(10, 10, 10, 0.85)', // Semi-transparent almost black
    primary: '#66b3ff', // Bright terminal blue
    secondary: '#80c4ff', // Lighter blue
    accent: '#66ff99', // Bright terminal green
    highlight: 'rgba(102, 179, 255, 0.15)', // Translucent blue
    muted: 'rgba(26, 26, 26, 0.8)', // Semi-transparent dark gray

    // Status colors - Terminal inspired
    success: '#66ff99', // Bright green
    warning: '#ffcc66', // Bright amber
    error: '#ff6666', // Bright red
    info: '#66b3ff', // Bright blue

    // Additional semantic colors with transparency
    border: 'rgba(255, 255, 255, 0.1)', // Transparent white border
    backgroundSecondary: 'rgba(15, 15, 15, 0.9)', // Semi-transparent slightly lighter black
    backgroundTertiary: 'rgba(20, 20, 20, 0.9)', // Semi-transparent even lighter black
    backgroundLight: 'rgba(255, 255, 255, 0.05)', // Very transparent white
    backgroundHover: 'rgba(102, 179, 255, 0.08)', // Subtle blue hover
    surface: 'rgba(15, 15, 15, 0.95)', // Nearly opaque dark surface
    textSecondary: 'rgba(255, 255, 255, 0.7)', // 70% white
    textTertiary: 'rgba(255, 255, 255, 0.5)', // 50% white
    textMuted: 'rgba(255, 255, 255, 0.4)', // 40% white

    // Search highlight colors
    highlightBg: 'rgba(255, 235, 59, 0.25)', // Yellow highlight
    highlightBorder: 'rgba(255, 235, 59, 0.5)', // Stronger yellow for border
  },

  // Light mode for terminal theme
  modes: {
    light: {
      // Base colors - Light terminal with transparency
      text: '#1a1a1a', // Almost black
      background: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white
      primary: '#0066cc', // Classic terminal blue
      secondary: '#0052a3', // Darker blue
      accent: '#00cc88', // Terminal green
      highlight: 'rgba(0, 102, 204, 0.08)', // Very light blue highlight
      muted: 'rgba(245, 245, 245, 0.8)', // Semi-transparent light gray

      // Status colors - Terminal inspired
      success: '#00cc88', // Green
      warning: '#ffaa00', // Amber
      error: '#ff3333', // Red
      info: '#0066cc', // Blue

      // Additional semantic colors with transparency
      border: 'rgba(0, 0, 0, 0.1)', // Transparent black border
      backgroundSecondary: 'rgba(250, 250, 250, 0.9)', // Semi-transparent very light gray
      backgroundTertiary: 'rgba(245, 245, 245, 0.9)', // Semi-transparent light gray
      backgroundLight: 'rgba(0, 0, 0, 0.02)', // Very transparent black
      backgroundHover: 'rgba(0, 102, 204, 0.04)', // Very subtle blue hover
      surface: 'rgba(255, 255, 255, 0.95)', // Nearly opaque white surface
      textSecondary: 'rgba(0, 0, 0, 0.6)', // 60% black
      textTertiary: 'rgba(0, 0, 0, 0.4)', // 40% black
      textMuted: 'rgba(0, 0, 0, 0.3)', // 30% black

      // Search highlight colors
      highlightBg: 'rgba(255, 235, 59, 0.3)', // Light yellow highlight
      highlightBorder: 'rgba(255, 235, 59, 0.6)', // Stronger yellow for border
    },
  },

  // Component variants
  buttons: {
    primary: {
      color: 'white',
      bg: 'primary',
      borderWidth: 0,
      '&:hover': {
        bg: 'secondary',
      },
    },
    secondary: {
      color: 'primary',
      bg: 'transparent',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'primary',
      '&:hover': {
        bg: 'highlight',
      },
    },
    ghost: {
      color: 'text',
      bg: 'transparent',
      '&:hover': {
        bg: 'backgroundHover',
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
      borderRadius: 1,
    },
    secondary: {
      bg: 'backgroundSecondary',
      border: '1px solid',
      borderColor: 'border',
      borderRadius: 1,
    },
  },
};

// Matrix theme - Classic Matrix green-on-black terminal look
export const matrixTheme: Theme = {
  // Spacing scale (used for margin, padding, etc.)
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],

  // Typography - Classic terminal/Matrix fonts
  fonts: {
    body: '"Courier New", "Courier", "Lucida Console", "Monaco", monospace',
    heading: '"Courier New", "Courier", "Lucida Console", "Monaco", monospace',
    monospace: '"Courier New", "Courier", "Lucida Console", "Monaco", monospace',
  },

  fontSizes: [12, 14, 16, 18, 20, 24, 32, 48, 64, 96],

  fontScale: 1.0,

  fontWeights: {
    body: 400,
    heading: 500,
    bold: 600,
    light: 300,
    medium: 500,
    semibold: 600,
  },

  lineHeights: {
    body: 1.5,
    heading: 1.2,
    tight: 1.3,
    relaxed: 1.7,
  },

  // Layout
  breakpoints: ['640px', '768px', '1024px', '1280px'],
  sizes: [16, 32, 64, 128, 256, 512, 768, 1024, 1536],
  radii: [0, 2, 4, 6, 8, 12, 16, 24],
  shadows: [
    'none',
    '0 0 5px rgba(0, 216, 53, 0.15)',
    '0 0 10px rgba(0, 216, 53, 0.2)',
    '0 0 15px rgba(0, 216, 53, 0.25)',
    '0 0 20px rgba(0, 216, 53, 0.3)',
    '0 0 30px rgba(0, 216, 53, 0.4)',
  ],
  zIndices: [0, 1, 10, 20, 30, 40, 50],

  // Colors - Matrix inspired theme with softer whites and green accents
  colors: {
    // Base colors - Softer whites with Matrix green accents
    text: '#a8a8a8', // Much softer white for main text
    background: '#000000', // Pure black background
    primary: '#00d835', // Softer Matrix green for primary actions
    secondary: '#00a828', // Darker softer green for secondary
    accent: '#00d835', // Softer Matrix green accent
    highlight: 'rgba(0, 216, 53, 0.15)', // Translucent softer green highlight
    muted: '#0a0a0a', // Very dark gray

    // Status colors - More variety while keeping Matrix feel
    success: '#00d835', // Softer Matrix green
    warning: '#d4a000', // Softer amber warning
    error: '#d63333', // Softer red for errors
    info: '#00a8d6', // Softer cyan for info

    // Additional semantic colors
    border: 'rgba(0, 216, 53, 0.2)', // Subtle softer green border
    backgroundSecondary: '#0a0a0a', // Very dark gray
    backgroundTertiary: '#111111', // Slightly lighter dark gray
    backgroundLight: 'rgba(0, 216, 53, 0.03)', // Very faint softer green glow
    backgroundHover: 'rgba(0, 216, 53, 0.08)', // Subtle softer green hover
    surface: '#050505', // Almost black
    textSecondary: '#808080', // Even softer gray for secondary text
    textTertiary: '#606060', // Much softer medium gray
    textMuted: '#484848', // Much softer darker gray

    // Search highlight colors
    highlightBg: 'rgba(0, 216, 53, 0.25)', // Softer green highlight
    highlightBorder: 'rgba(0, 216, 53, 0.5)', // Stronger softer green for border
  },

  // Component variants
  buttons: {
    primary: {
      color: 'black',
      bg: 'primary',
      borderWidth: 0,
      '&:hover': {
        bg: 'secondary',
      },
    },
    secondary: {
      color: 'primary',
      bg: 'transparent',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'primary',
      '&:hover': {
        bg: 'highlight',
      },
    },
    ghost: {
      color: 'text',
      bg: 'transparent',
      '&:hover': {
        bg: 'backgroundHover',
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
      borderRadius: 0, // No rounded corners for authentic terminal look
    },
    secondary: {
      bg: 'backgroundSecondary',
      border: '1px solid',
      borderColor: 'border',
      borderRadius: 0,
    },
  },
};

// Matrix Minimal theme - Matrix aesthetic with white primary/secondary
export const matrixMinimalTheme: Theme = {
  // Spacing scale (used for margin, padding, etc.)
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],

  // Typography - Classic terminal/Matrix fonts
  fonts: {
    body: '"Courier New", "Courier", "Lucida Console", "Monaco", monospace',
    heading: '"Courier New", "Courier", "Lucida Console", "Monaco", monospace',
    monospace: '"Courier New", "Courier", "Lucida Console", "Monaco", monospace',
  },

  fontSizes: [12, 14, 16, 18, 20, 24, 32, 48, 64, 96],

  fontScale: 1.0,

  fontWeights: {
    body: 400,
    heading: 500,
    bold: 600,
    light: 300,
    medium: 500,
    semibold: 600,
  },

  lineHeights: {
    body: 1.5,
    heading: 1.2,
    tight: 1.3,
    relaxed: 1.7,
  },

  // Layout
  breakpoints: ['640px', '768px', '1024px', '1280px'],
  sizes: [16, 32, 64, 128, 256, 512, 768, 1024, 1536],
  radii: [0, 2, 4, 6, 8, 12, 16, 24],
  shadows: [
    'none',
    '0 1px 2px rgba(0, 0, 0, 0.05)',
    '0 2px 4px rgba(0, 0, 0, 0.1)',
    '0 4px 8px rgba(0, 0, 0, 0.15)',
    '0 8px 16px rgba(0, 0, 0, 0.2)',
    '0 0 20px rgba(0, 216, 53, 0.1)', // Subtle softer green glow for special elements
  ],
  zIndices: [0, 1, 10, 20, 30, 40, 50],

  // Colors - Minimal Matrix theme with white primary/secondary and green accents
  colors: {
    // Base colors - Whites with Matrix green as accent only
    text: '#a8a8a8', // Much softer white for main text
    background: '#000000', // Pure black background
    primary: '#b8b8b8', // Much softer off-white for primary
    secondary: '#909090', // Much softer light gray for secondary
    accent: '#00d835', // Softer Matrix green for accents only
    highlight: 'rgba(0, 216, 53, 0.1)', // Very subtle softer green highlight
    muted: '#0a0a0a', // Very dark gray

    // Status colors - Practical colors
    success: '#00d835', // Softer Matrix green for success
    warning: '#d4a000', // Softer amber warning
    error: '#d63333', // Softer red for errors
    info: '#00a8d6', // Softer cyan for info

    // Additional semantic colors
    border: 'rgba(184, 184, 184, 0.1)', // Subtle softer off-white border
    backgroundSecondary: '#0a0a0a', // Very dark gray
    backgroundTertiary: '#111111', // Slightly lighter dark gray
    backgroundLight: 'rgba(184, 184, 184, 0.02)', // Very faint softer off-white glow
    backgroundHover: 'rgba(0, 216, 53, 0.05)', // Very subtle softer green hover
    surface: '#050505', // Almost black
    textSecondary: '#808080', // Even softer gray for secondary text
    textTertiary: '#606060', // Much softer medium gray
    textMuted: '#484848', // Much softer darker gray

    // Search highlight colors
    highlightBg: 'rgba(0, 216, 53, 0.2)', // Softer green highlight for search
    highlightBorder: 'rgba(0, 216, 53, 0.4)', // Stronger softer green for border
  },

  // Component variants
  buttons: {
    primary: {
      color: 'black',
      bg: 'primary',
      borderWidth: 0,
      '&:hover': {
        bg: 'secondary',
      },
    },
    secondary: {
      color: 'primary',
      bg: 'transparent',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'primary',
      '&:hover': {
        bg: 'backgroundHover',
      },
    },
    ghost: {
      color: 'text',
      bg: 'transparent',
      '&:hover': {
        bg: 'backgroundHover',
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
      borderRadius: 0, // No rounded corners for terminal look
    },
    secondary: {
      bg: 'backgroundSecondary',
      border: '1px solid',
      borderColor: 'border',
      borderRadius: 0,
    },
  },
};

// Slate theme - Sophisticated grey-based theme with vibrant accents
export const slateTheme: Theme = {
  // Spacing scale (used for margin, padding, etc.)
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],

  // Typography
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
    tight: 1.25,
    relaxed: 1.75,
  },

  // Layout
  breakpoints: ['640px', '768px', '1024px', '1280px'],
  sizes: [16, 32, 64, 128, 256, 512, 768, 1024, 1536],
  radii: [0, 2, 4, 6, 8, 12, 16, 24],
  shadows: [
    'none',
    '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
  ],
  zIndices: [0, 1, 10, 20, 30, 40, 50],

  // Colors - Grey-based with vibrant accents
  colors: {
    // Base colors - Various shades of grey with white accents
    text: '#9ca3af', // Medium grey for most text
    background: '#1a1c1e', // Very dark charcoal
    primary: '#d1d5db', // Light grey for primary
    secondary: '#6b7280', // Medium grey for secondary
    accent: '#f59e0b', // Vibrant amber
    highlight: 'rgba(209, 213, 219, 0.15)', // Translucent light grey
    muted: '#2d3134', // Dark grey

    // Status colors - Vibrant and practical
    success: '#10b981', // Emerald green
    warning: '#f59e0b', // Amber
    error: '#ef4444', // Red
    info: '#3b82f6', // Blue

    // Additional semantic colors - Grey palette
    border: 'rgba(156, 163, 175, 0.15)', // Subtle grey border
    backgroundSecondary: '#22252a', // Slightly lighter dark grey
    backgroundTertiary: '#2d3134', // Even lighter dark grey
    backgroundLight: 'rgba(156, 163, 175, 0.05)', // Very faint grey
    backgroundHover: 'rgba(156, 163, 175, 0.1)', // Subtle grey hover
    surface: '#1f2124', // Near-black surface
    textSecondary: '#e5e7eb', // Light grey for important text (closer to white)
    textTertiary: '#6b7280', // Darker grey
    textMuted: '#4b5563', // Even darker grey

    // Search highlight colors
    highlightBg: 'rgba(245, 158, 11, 0.25)', // Amber highlight
    highlightBorder: 'rgba(245, 158, 11, 0.5)', // Stronger amber for border
  },

  // Component variants
  buttons: {
    primary: {
      color: '#1a1c1e', // Dark text on light grey
      bg: 'primary',
      borderWidth: 0,
      '&:hover': {
        bg: '#9ca3af', // Darker grey on hover
      },
    },
    secondary: {
      color: '#e5e7eb', // Light text on medium grey
      bg: 'secondary',
      borderWidth: 0,
      '&:hover': {
        bg: '#4b5563', // Darker grey on hover
      },
    },
    ghost: {
      color: 'textSecondary',
      bg: 'transparent',
      '&:hover': {
        bg: 'backgroundHover',
      },
    },
  },

  text: {
    heading: {
      fontFamily: 'heading',
      fontWeight: 'heading',
      lineHeight: 'heading',
      color: 'textSecondary', // Headers in lighter grey/white
    },
    body: {
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body',
    },
    caption: {
      fontSize: 1,
      color: 'textTertiary',
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