import { Theme } from './index';

/**
 * Override colors in a theme with type checking
 */
export function overrideColors<T extends Theme>(
  theme: T,
  colors: Partial<T['colors']>
): T {
  return {
    ...theme,
    colors: {
      ...theme.colors,
      ...colors,
    },
  };
}

/**
 * Create a new theme by extending a base theme
 */
export function makeTheme<T extends Theme>(
  baseTheme: T,
  overrides: Partial<{
    colors: Partial<T['colors']>;
    fonts: Partial<T['fonts']>;
    fontSizes: T['fontSizes'];
    space: T['space'];
    radii: T['radii'];
  }>
): T {
  return {
    ...baseTheme,
    ...overrides,
    colors: {
      ...baseTheme.colors,
      ...overrides.colors,
    },
    fonts: {
      ...baseTheme.fonts,
      ...overrides.fonts,
    },
  } as T;
}

/**
 * Add a new mode to a theme
 * @param theme - The theme to add the mode to
 * @param modeName - The name of the new mode (e.g., 'dark', 'light', 'high-contrast')
 * @param colors - Partial colors to override for this mode
 * @param baseMode - Optional existing mode to extend from (defaults to base colors)
 */
export function addMode<T extends Theme>(
  theme: T,
  modeName: string,
  colors: Partial<T['colors']>,
  baseMode?: string
): T {
  // Get the base colors to merge with
  let baseColors: T['colors'];
  
  if (baseMode && theme.modes && theme.modes[baseMode]) {
    // Merge with an existing mode
    baseColors = {
      ...theme.colors,
      ...theme.modes[baseMode],
    } as T['colors'];
  } else {
    // Use the default theme colors
    baseColors = theme.colors;
  }
  
  // Create the new mode by merging base with new colors
  const newMode = {
    ...baseColors,
    ...colors,
  };
  
  // Return theme with the new mode added
  return {
    ...theme,
    modes: {
      ...theme.modes,
      [modeName]: newMode,
    },
  };
}

/**
 * Get colors for a specific mode
 * @param theme - The theme to get colors from
 * @param mode - The mode name (returns base colors if mode doesn't exist)
 */
export function getMode<T extends Theme>(
  theme: T,
  mode?: string
): T['colors'] {
  if (!mode || !theme.modes || !theme.modes[mode]) {
    return theme.colors;
  }
  
  return {
    ...theme.colors,
    ...theme.modes[mode],
  } as T['colors'];
}