import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { Theme, theme as defaultTheme } from './index';

// Theme context
interface ThemeContextValue {
  theme: Theme;
  colorMode: 'light' | 'dark';
  setColorMode: (mode: 'light' | 'dark') => void;
  toggleColorMode: () => void;
}

// Create a singleton context instance that persists across module boundaries
let ThemeContext: React.Context<ThemeContextValue | undefined>;

// Use a global variable to ensure single instance across all imports
const getThemeContext = () => {
  if (typeof window !== 'undefined') {
    // Store on window to ensure true singleton in browser
    const globalWindow = window as Window & {
      __principlemd_theme_context__?: React.Context<ThemeContextValue | undefined>;
    };
    if (!globalWindow.__principlemd_theme_context__) {
      globalWindow.__principlemd_theme_context__ = createContext<ThemeContextValue | undefined>(
        undefined,
      );
    }
    return globalWindow.__principlemd_theme_context__;
  } else {
    // Server-side rendering or Node environment
    if (!ThemeContext) {
      ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
    }
    return ThemeContext;
  }
};

// Get the singleton context
const ThemeContextSingleton = getThemeContext();

// Hook to use theme
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContextSingleton);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context as ThemeContextValue;
};

// Helper function to get the current theme with color mode applied
export const getThemeWithMode = (baseTheme: Theme, colorMode: 'light' | 'dark'): Theme => {
  if (colorMode === 'light') {
    return baseTheme;
  }

  // Apply dark mode colors
  const darkModeColors = baseTheme.colors.modes.dark;
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      ...darkModeColors,
    },
  };
};

// Theme provider component
interface ThemeProviderProps {
  children: ReactNode;
  theme?: Theme;
  initialColorMode?: 'light' | 'dark';
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  theme: customTheme = defaultTheme,
  initialColorMode = 'dark',
}) => {
  const [colorMode, setColorMode] = useState<'light' | 'dark'>(initialColorMode);

  // Load saved color mode from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('principlemd-color-mode');
    if (savedMode === 'light' || savedMode === 'dark') {
      setColorMode(savedMode);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setColorMode(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Save color mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('principlemd-color-mode', colorMode);
  }, [colorMode]);

  const toggleColorMode = () => {
    setColorMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Get the theme with the current color mode applied
  const themeWithMode = getThemeWithMode(customTheme, colorMode);

  const value: ThemeContextValue = {
    theme: themeWithMode,
    colorMode,
    setColorMode,
    toggleColorMode,
  };

  return <ThemeContextSingleton.Provider value={value}>{children}</ThemeContextSingleton.Provider>;
};

// Higher-order component for theme access
export const withTheme = <P extends object>(
  Component: React.ComponentType<P & { theme: Theme }>,
) => {
  return (props: P) => {
    const { theme } = useTheme();
    return <Component {...props} theme={theme} />;
  };
};

export default ThemeProvider;
