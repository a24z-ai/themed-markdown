# Theme UI Spec-Compliant Theme System

This directory contains a new Theme UI specification-compliant theme system for the PrincipleMD electron-react project.

## Files

- **`index.ts`** - Main theme configuration following Theme UI spec
- **`ThemeProvider.tsx`** - React context provider and useTheme hook
- **`utils.ts`** - Utility functions for working with theme values
- **`README.md`** - This documentation

## Usage

### 1. Wrap your app with the ThemeProvider

```tsx
import { ThemeProvider } from './theme/ThemeProvider';
import { theme } from './theme';

function App() {
  return (
    <ThemeProvider theme={theme} initialColorMode="light">
      <YourApp />
    </ThemeProvider>
  );
}
```

### 2. Use the theme in components

```tsx
import { useTheme } from './theme/ThemeProvider';
import { getSpace, getFontSize } from './theme/utils';

function MyComponent() {
  const { theme, colorMode, toggleColorMode } = useTheme();

  return (
    <div
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        padding: getSpace(theme, 4), // theme.space[4]
        fontSize: getFontSize(theme, 2), // theme.fontSizes[2]
      }}
    >
      Current mode: {colorMode}
      <button onClick={toggleColorMode}>Toggle Mode</button>
    </div>
  );
}
```

### 3. Available theme properties

#### Colors

- `theme.colors.text` - Primary text color
- `theme.colors.background` - Primary background color
- `theme.colors.primary` - Primary brand color
- `theme.colors.secondary` - Secondary brand color
- `theme.colors.success` - Success state color
- `theme.colors.warning` - Warning state color
- `theme.colors.error` - Error state color
- `theme.colors.border` - Border color
- `theme.colors.backgroundSecondary` - Secondary background
- `theme.colors.textSecondary` - Secondary text color

#### Typography

- `theme.fonts.body` - Body font family
- `theme.fonts.heading` - Heading font family
- `theme.fonts.monospace` - Monospace font family
- `theme.fontSizes[0-9]` - Font size scale (12px to 96px)
- `theme.fontWeights.body` - Body font weight
- `theme.fontWeights.heading` - Heading font weight

#### Spacing & Layout

- `theme.space[0-8]` - Spacing scale (0px to 512px)
- `theme.radii[0-7]` - Border radius scale (0px to 24px)
- `theme.shadows[0-5]` - Box shadow scale
- `theme.breakpoints` - Responsive breakpoints

### 4. Utility functions

```tsx
import { getColor, getSpace, getFontSize, getRadius } from './theme/utils';

// Get theme values safely
const backgroundColor = getColor(theme, 'background');
const padding = getSpace(theme, 3); // theme.space[3]
const fontSize = getFontSize(theme, 2); // theme.fontSizes[2]
const borderRadius = getRadius(theme, 1); // theme.radii[1]
```

## Color Modes

The theme system supports automatic light/dark mode switching:

- Automatically detects system preference on first load
- Saves user preference to localStorage
- Provides `toggleColorMode()` function
- Dark mode colors are defined in `theme.colors.modes.dark`

## Migration from old theme

The new theme maintains backward compatibility with existing color property names:

```tsx
// Old usage (still works)
theme.colors.background;
theme.colors.primary;
theme.colors.textSecondary;

// New Theme UI spec additions
theme.fontSizes[2]; // instead of hardcoded values
theme.space[4]; // instead of hardcoded spacing
theme.radii[2]; // instead of hardcoded border radius
```

## Theme UI Specification Compliance

This theme follows the [Theme UI theme specification](https://theme-ui.com/theme-spec) which provides:

- Consistent scales for spacing, typography, and colors
- Responsive design support
- Component variant support
- Color mode handling
- Standard naming conventions

## Example Component

See `ThemeExample.tsx` for a comprehensive example showing all theme features.
