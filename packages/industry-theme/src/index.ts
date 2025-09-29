/**
 * Theme UI spec-compliant theme system for PrincipleMD
 * Based on https://theme-ui.com/theme-spec
 */

import { terminalTheme } from './themes';

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
  // Color modes (optional)
  modes?: {
    [modeName: string]: Partial<Theme['colors']>;
  };
  
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

    // Search highlight colors
    highlightBg?: string;
    highlightBorder?: string;
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


// Default theme - Terminal theme for developers
export const theme: Theme = terminalTheme;

// Export all themes for direct access
export {
  terminalTheme,
  regalTheme,
  glassmorphismTheme,
  matrixTheme,
  matrixMinimalTheme,
  slateTheme,
} from './themes';

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

// Export theme helper functions
export {
  overrideColors,
  makeTheme,
  addMode,
  getMode
} from './themeHelpers';

// Export ThemeShowcase component
export { ThemeShowcase } from './ThemeShowcase';
export type { ThemeShowcaseProps } from './ThemeShowcase';

export default theme;
