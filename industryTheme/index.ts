/**
 * Theme UI spec-compliant theme system for PrincipleMD
 * Based on https://theme-ui.com/theme-spec
 */

// Component style variant types
type ButtonVariant = {
  color?: string;
  backgroundColor?: string;
  bg?: string; // Theme UI shorthand for backgroundColor
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: string;
  padding?: string | number;
  fontSize?: number | string;
  fontWeight?: number;
  cursor?: string;
  '&:hover'?: Partial<ButtonVariant>;
  '&:active'?: Partial<ButtonVariant>;
  '&:disabled'?: Partial<ButtonVariant>;
};

type TextVariant = {
  fontSize?: number | string;
  fontWeight?: number | string;
  lineHeight?: number | string;
  color?: string;
  fontFamily?: string;
};

type CardVariant = {
  padding?: string | number;
  backgroundColor?: string;
  bg?: string; // Theme UI shorthand for backgroundColor
  borderRadius?: number;
  boxShadow?: string;
  border?: string;
  borderColor?: string;
};

export interface Theme {
  // Scale values for consistent spacing
  space: number[];

  // Typography
  fonts: {
    body: string;
    heading: string;
    monospace: string;
  };

  fontSizes: number[];

  // Font scaling factor (1.0 = normal, 1.2 = 20% larger, 0.8 = 20% smaller)
  fontScale?: number;

  fontWeights: {
    body: number;
    heading: number;
    bold: number;
    light: number;
    medium: number;
    semibold: number;
  };

  lineHeights: {
    body: number;
    heading: number;
    tight: number;
    relaxed: number;
  };

  // Layout
  breakpoints: string[];
  sizes: number[];
  radii: number[];
  shadows: string[];
  zIndices: number[];

  // Colors - Theme UI spec structure
  colors: {
    // Base colors
    text: string;
    background: string;
    primary: string;
    secondary: string;
    accent: string;
    highlight: string;
    muted: string;

    // Status colors
    success: string;
    warning: string;
    error: string;
    info: string;

    // Additional semantic colors for our use case
    border: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    backgroundLight: string;
    backgroundHover: string;
    surface: string;
    textSecondary: string;
    textTertiary: string;
    textMuted: string;
  };

  // Component variants (optional but useful)
  buttons: {
    primary: ButtonVariant;
    secondary: ButtonVariant;
    ghost: ButtonVariant;
  };

  text: {
    heading: TextVariant;
    body: TextVariant;
    caption: TextVariant;
  };

  cards: {
    primary: CardVariant;
    secondary: CardVariant;
  };
}


// Default theme following Theme UI conventions
export const theme: Theme = {
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
    textMuted: '#8b7968', // Faded bronze,
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

/**
 * Scale font sizes in a theme by a given factor
 */
export function scaleThemeFonts(theme: Theme, scale: number): Theme {
  const currentScale = theme.fontScale || 1.0;

  // Calculate effective scale (remove current scale and apply new scale)
  const effectiveScale = scale / currentScale;

  return {
    ...theme,
    fontSizes: theme.fontSizes.map(size => Math.round(size * effectiveScale)),
    fontScale: scale,
  };
}

/**
 * Increase font scale by 10%
 */
export function increaseFontScale(theme: Theme): Theme {
  const currentScale = theme.fontScale || 1.0;
  const newScale = Math.min(currentScale * 1.1, 2.0); // Cap at 200%
  return scaleThemeFonts(theme, newScale);
}

/**
 * Decrease font scale by 10%
 */
export function decreaseFontScale(theme: Theme): Theme {
  const currentScale = theme.fontScale || 1.0;
  const newScale = Math.max(currentScale * 0.9, 0.5); // Floor at 50%
  return scaleThemeFonts(theme, newScale);
}

/**
 * Reset font scale to 100%
 */
export function resetFontScale(theme: Theme): Theme {
  return scaleThemeFonts(theme, 1.0);
}

// Export ThemeProvider and related utilities
export {
  ThemeProvider,
  useTheme,
  withTheme,
} from './ThemeProvider';

// Export theme utilities
export {
  getColor,
  getSpace,
  getFontSize,
  getRadius,
  getShadow,
  getZIndex,
  responsive,
  sx,
  createStyle,
  mergeThemes,
} from './utils';

export default theme;
