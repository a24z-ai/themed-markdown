import React, { createContext, useContext, ReactNode } from 'react';

import { Theme, theme as defaultTheme } from './index';

// Theme context
interface ThemeContextValue {
  theme: Theme;
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

// Theme provider component
interface ThemeProviderProps {
  children: ReactNode;
  theme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  theme: customTheme = defaultTheme,
}) => {
  const value: ThemeContextValue = {
    theme: customTheme,
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
