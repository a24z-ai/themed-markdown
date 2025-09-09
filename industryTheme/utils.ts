import { Theme } from './index';

// Style value can be string, number, array of values (for responsive), or nested style object
type StyleValue = string | number | StyleValue[] | { [key: string]: StyleValue };
type StyleObject = Record<string, StyleValue>;

/**
 * Utility functions for working with the Theme UI spec-compliant theme
 */

// Get a color value from the theme
export const getColor = (theme: Theme, colorKey: string): string => {
  // Access colors directly, ignoring the modes property
  const colors = theme.colors as Record<string, unknown>;
  const value = colors[colorKey];
  return typeof value === 'string' ? value : colorKey;
};

// Get a space value from the theme scale
export const getSpace = (theme: Theme, index: number): number => {
  return theme.space[index] || 0;
};

// Get a font size from the theme scale
export const getFontSize = (theme: Theme, index: number): number => {
  return theme.fontSizes[index] || theme.fontSizes[2]; // default to index 2 (16px)
};

// Get a border radius from the theme scale
export const getRadius = (theme: Theme, index: number): number => {
  return theme.radii[index] || 0;
};

// Get a shadow from the theme scale
export const getShadow = (theme: Theme, index: number): string => {
  return theme.shadows[index] || 'none';
};

// Get a z-index from the theme scale
export const getZIndex = (theme: Theme, index: number): number => {
  return theme.zIndices[index] || 0;
};

// Helper to create responsive values
export const responsive = (values: (string | number)[]): object => {
  return values.reduce((acc, value, index) => {
    if (index === 0) {
      return value;
    }
    return {
      ...acc,
      [`@media screen and (min-width: ${values[index - 1]})`]: value,
    };
  }, {});
};

// CSS-in-JS style helpers that follow Theme UI conventions
export const sx = (styles: StyleObject) => styles;

// Create a theme-aware style object
export const createStyle = (theme: Theme, styleObj: StyleObject): StyleObject => {
  const processValue = (value: StyleValue): StyleValue => {
    if (typeof value === 'string') {
      // Check if it's a theme color reference
      if (value in theme.colors) {
        return getColor(theme, value);
      }
      return value;
    }

    if (typeof value === 'number') {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map(processValue);
    }

    if (typeof value === 'object' && value !== null) {
      const processed: StyleObject = {};
      for (const [key, val] of Object.entries(value)) {
        processed[key] = processValue(val);
      }
      return processed;
    }

    return value;
  };

  // Process the entire style object
  const processed: StyleObject = {};
  for (const [key, val] of Object.entries(styleObj)) {
    processed[key] = processValue(val);
  }
  return processed;
};

// Merge multiple themes (useful for component-specific overrides)
export const mergeThemes = (baseTheme: Theme, ...overrides: Partial<Theme>[]): Theme => {
  return overrides.reduce<Theme>(
    (theme: Theme, override: Partial<Theme>): Theme => ({
      space: override.space || theme.space,
      fonts: { ...theme.fonts, ...(override.fonts || {}) },
      fontSizes: override.fontSizes || theme.fontSizes,
      fontWeights: { ...theme.fontWeights, ...(override.fontWeights || {}) },
      lineHeights: { ...theme.lineHeights, ...(override.lineHeights || {}) },
      breakpoints: override.breakpoints || theme.breakpoints,
      sizes: override.sizes || theme.sizes,
      radii: override.radii || theme.radii,
      shadows: override.shadows || theme.shadows,
      zIndices: override.zIndices || theme.zIndices,
      colors: {
        ...theme.colors,
        ...(override.colors || {}),
      },
      buttons: { ...theme.buttons, ...(override.buttons || {}) },
      text: { ...theme.text, ...(override.text || {}) },
      cards: { ...theme.cards, ...(override.cards || {}) },
    }),
    baseTheme,
  );
};

export default {
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
};
