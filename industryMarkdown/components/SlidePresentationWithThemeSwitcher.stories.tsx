import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { ThemeProvider, Theme, theme as defaultTheme } from '../../industryTheme';

import { SlidePresentation } from './SlidePresentation';

// Alexandria themes from /Users/griever/Developer/alexandria/src/lib/alexandria-theme.ts
const previewTheme: Theme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    
    // Base colors
    text: '#361B1B',           // Dark Brown/Near Black
    background: '#F6F2EA',     // Parchment/Off-White
    primary: '#0D3B4A',        // Deep Teal/Blue
    secondary: '#EFCF83',      // Gold/Ochre
    accent: '#AA5725',         // Terracotta/Red Ocher
    highlight: '#F6DEB9',      // Lighter Gold/Brightened Ochre
    muted: '#8A837A',          // Muted Gray-Brown
    
    // Status colors
    success: '#4CAF50',        // Standard green
    warning: '#FFC107',        // Standard amber
    error: '#F44336',          // Standard red
    info: '#2196F3',           // Standard blue
    
    // Additional semantic colors
    border: '#C7B9A3',         // Lighter muted tone for borders
    surface: '#FFFFFF',        // Pure white for cards
    backgroundSecondary: '#EDE9E0',  // Slightly darker parchment
    backgroundTertiary: '#DBCEB8',   // Even darker for section headers
    backgroundLight: '#FFFFFF',      // Pure white for clean contrast
    backgroundHover: '#E9E4DB',      // Subtle hover state
    textSecondary: '#5C4B4B',        // Slightly lighter text
    textTertiary: '#8A837A',         // Muted text (matches muted base)
    textMuted: '#B0A79A',            // Very light, subtle text
  },
};

const alexandriaTheme: Theme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    
    // Light mode colors - converted from OKLCH to hex
    text: '#252525',           // oklch(0.145 0 0)
    background: '#faf9f7',     // oklch(0.98 0.005 45) - warm off-white
    primary: '#343434',        // oklch(0.205 0 0)
    secondary: '#f7f7f7',      // oklch(0.97 0 0)
    accent: '#f7f7f7',         // oklch(0.97 0 0)
    muted: '#f7f7f7',          // oklch(0.97 0 0)
    border: '#ebebeb',         // oklch(0.922 0 0)
    
    // Surface and background variations
    surface: '#faf9f7',        // Same as background
    backgroundSecondary: '#faf9f7',
    backgroundTertiary: '#f7f7f7',
    backgroundLight: '#f7f7f7',
    backgroundHover: '#f7f7f7',
    
    // Text variations
    textSecondary: '#8e8e8e',  // oklch(0.556 0 0)
    textTertiary: '#8e8e8e',
    textMuted: '#8e8e8e',
    
    // Semantic colors
    error: '#ef4444',          // oklch(0.577 0.245 27.325) - red
    warning: '#f59e0b',        // amber
    success: '#10b981',        // emerald
    info: '#3b82f6',           // blue
    
    // Dark mode colors
  },
};

// Dark theme with inverted colors
const darkTheme: Theme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    
    // Dark mode colors
    text: '#e4e4e7',           // Light gray text
    background: '#18181b',     // Very dark gray/black background
    primary: '#f59e0b',        // Amber for primary actions
    secondary: '#1f2937',      // Dark gray for secondary elements
    accent: '#d97706',         // Darker amber for accents
    highlight: 'rgba(245, 158, 11, 0.2)', // Translucent amber
    muted: '#71717a',          // Muted gray
    
    // Status colors (slightly adjusted for dark mode)
    success: '#10b981',        // Emerald green
    warning: '#f59e0b',        // Amber
    error: '#ef4444',          // Red
    info: '#3b82f6',           // Blue
    
    // Additional semantic colors
    border: '#27272a',         // Dark border
    surface: '#1f1f23',        // Slightly lighter than background
    backgroundSecondary: '#1f1f23',  // Secondary background
    backgroundTertiary: '#27272a',   // Tertiary background
    backgroundLight: '#27272a',      // Light background (still dark in dark mode)
    backgroundHover: '#2a2a2e',      // Hover state
    textSecondary: '#a1a1aa',        // Secondary text
    textTertiary: '#71717a',         // Tertiary text
    textMuted: '#52525b',            // Very muted text
  },
};

// Cyberpunk theme with neon colors
const cyberpunkTheme: Theme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    
    // Cyberpunk neon colors
    text: '#f0abfc',           // Bright purple-pink text
    background: '#0a0a0a',     // Pure black background
    primary: '#00ffff',        // Cyan neon
    secondary: '#ff00ff',      // Magenta neon
    accent: '#ffff00',         // Yellow neon
    highlight: 'rgba(0, 255, 255, 0.3)', // Translucent cyan
    muted: '#4a5568',          // Dark gray
    
    // Status colors with neon feel
    success: '#00ff00',        // Neon green
    warning: '#ffff00',        // Neon yellow
    error: '#ff0066',          // Hot pink
    info: '#00ccff',           // Light cyan
    
    // Additional semantic colors
    border: '#ff00ff40',       // Translucent magenta border
    surface: '#1a1a1a',        // Slightly lighter than background
    backgroundSecondary: '#141414',  // Secondary background
    backgroundTertiary: '#1f1f1f',   // Tertiary background
    backgroundLight: '#2a2a2a',      // Light background
    backgroundHover: '#333333',      // Hover state
    textSecondary: '#d8b4fe',        // Light purple
    textTertiary: '#a78bfa',         // Medium purple
    textMuted: '#8b5cf6',            // Dark purple
  },
};

const themes = {
  default: defaultTheme,
  preview: previewTheme,
  alexandria: alexandriaTheme,
  dark: darkTheme,
  cyberpunk: cyberpunkTheme,
};

// Interactive wrapper component with theme switcher
interface SlidePresentationWithThemeSwitcherProps {
  slides: string[];
  initialSlide?: number;
  showNavigation?: boolean;
  showSlideCounter?: boolean;
  showFullscreenButton?: boolean;
  slideIdPrefix?: string;
  onSlideChange?: (slideIndex: number) => void;
  onCheckboxChange?: (slideIndex: number, lineNumber: number, checked: boolean) => void;
  onLinkClick?: (href: string, event?: MouseEvent) => void;
  containerHeight?: string;
}

const SlidePresentationWithThemeSwitcher = ({ slides, ...props }: SlidePresentationWithThemeSwitcherProps) => {
  const [currentTheme, setCurrentTheme] = useState<keyof typeof themes>('default');

  // Apply dark mode if available
  const activeTheme = themes[currentTheme];

  return (
    <ThemeProvider theme={activeTheme}>
      <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Theme Switcher Controls */}
        <div style={{ 
          padding: '16px', 
          backgroundColor: activeTheme.colors.backgroundSecondary,
          borderBottom: `1px solid ${activeTheme.colors.border}`,
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <span style={{ 
            color: activeTheme.colors.text, 
            fontWeight: 600,
            marginRight: '8px'
          }}>
            Theme:
          </span>
          
          {/* Theme buttons */}
          {Object.keys(themes).map((themeName) => (
            <button
              key={themeName}
              onClick={() => setCurrentTheme(themeName as keyof typeof themes)}
              style={{
                padding: '8px 16px',
                backgroundColor: currentTheme === themeName 
                  ? activeTheme.colors.primary 
                  : activeTheme.colors.background,
                color: currentTheme === themeName 
                  ? activeTheme.colors.background 
                  : activeTheme.colors.text,
                border: `2px solid ${currentTheme === themeName 
                  ? activeTheme.colors.primary 
                  : activeTheme.colors.border}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: currentTheme === themeName ? 600 : 400,
                textTransform: 'capitalize',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (currentTheme !== themeName) {
                  e.currentTarget.style.backgroundColor = activeTheme.colors.backgroundHover;
                }
              }}
              onMouseLeave={(e) => {
                if (currentTheme !== themeName) {
                  e.currentTarget.style.backgroundColor = activeTheme.colors.background;
                }
              }}
            >
              {themeName}
            </button>
          ))}
          
          {/* Current theme info */}
          <div style={{ 
            marginLeft: 'auto',
            fontSize: '14px',
            color: activeTheme.colors.textSecondary
          }}>
            Current: <strong style={{ textTransform: 'capitalize' }}>{currentTheme}</strong>
          </div>
        </div>
        
        {/* Slide Presentation */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <SlidePresentation slides={slides} {...props} />
        </div>
      </div>
    </ThemeProvider>
  );
};

const meta: Meta<typeof SlidePresentation> = {
  title: 'IndustryMarkdown/SlidePresentationWithThemeSwitcher',
  component: SlidePresentationWithThemeSwitcher,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    initialSlide: {
      control: { type: 'number', min: 0, max: 10 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const demoSlides = [
  `# Theme Switcher Demo
  
## Dynamic Theme Support

This presentation demonstrates the ability to switch between different themes dynamically.

### Available Themes:
- **Default Theme** - Dark Academia with warm amber gold
- **Preview Theme** - Warm, rich colors with parchment background
- **Alexandria Theme** - Minimalist with OKLCH colors
- **Dark Theme** - Classic dark mode with amber accents
- **Cyberpunk Theme** - Neon colors on black background

### Features:
- Live theme switching
- Dark mode toggle
- Persistent navigation controls
- Smooth transitions

Use the controls above to switch themes and see the changes in real-time!`,

  `# Typography & Colors

## Heading Styles

### Primary Colors
The primary color changes based on the selected theme.

### Secondary Colors
Secondary colors provide accent and emphasis.

### Text Hierarchy
- Primary text for main content
- Secondary text for supporting information
- Muted text for less important details

\`\`\`javascript
// Code blocks adapt to theme colors
function greetUser(name) {
  return \`Hello, \${name}! Welcome to themed presentations.\`;
}
\`\`\`

> Blockquotes also inherit theme styles for consistency.`,

  `# Tables & Lists

## Data Presentation

| Feature | Default | Preview | Alexandria | Dark | Cyberpunk |
|---------|---------|---------|------------|------|-----------|
| Background | Dark Navy | Parchment | Off-white | Black | Pure Black |
| Primary | Amber Gold | Deep Teal | Minimal Gray | Amber | Cyan Neon |
| Accent | Muted Gold | Terracotta | Light Gray | Dark Amber | Yellow Neon |
| Text | Warm Cream | Dark Brown | Dark Gray | Light Gray | Purple-Pink |

### Theme Characteristics

1. **Default Theme**
   - Dark academia aesthetic
   - Warm amber gold accents
   - Deep midnight blue background

2. **Preview Theme**
   - Rich, warm colors
   - Parchment-like background
   - Terracotta and ochre accents

3. **Alexandria Theme**
   - Minimalist design
   - OKLCH color space
   - High contrast

4. **Dark Theme**
   - Classic dark mode
   - Amber accent colors
   - Easy on the eyes
   - Perfect for low-light environments

5. **Cyberpunk Theme**
   - Neon color scheme
   - High contrast neon on black
   - Futuristic aesthetic
   - Bold and vibrant`,

  `# Mermaid Diagrams

## Visual Elements

\`\`\`mermaid
graph TD
    A[User Selects Theme] --> B{Theme Type}
    B -->|Default| C[Dark Academia]
    B -->|Preview| D[Warm Rich Colors]
    B -->|Alexandria| E[Minimalist]
    B -->|Dark| H[Classic Dark Mode]
    B -->|Cyberpunk| I[Neon Aesthetic]
    C --> F[Apply Theme]
    D --> F
    E --> F
    H --> F
    I --> F
    F --> G[Update UI]
\`\`\`

## Theme Flow

\`\`\`mermaid
sequenceDiagram
    participant User
    participant ThemeProvider
    participant Component
    
    User->>ThemeProvider: Select Theme
    ThemeProvider->>ThemeProvider: Update Context
    ThemeProvider->>Component: Propagate Theme
    Component->>User: Render with New Theme
\`\`\``,

  `# Interactive Elements

## Checkboxes and Tasks

Try interacting with these elements in different themes:

- [ ] Test default theme
- [ ] Test preview theme
- [ ] Test alexandria theme
- [ ] Test dark theme
- [ ] Test cyberpunk theme
- [ ] Check navigation controls
- [ ] Verify color contrast
- [ ] Test theme persistence

### Links and Actions

- [Documentation](#) - Theme documentation
- [Source Code](#) - View implementation
- [Examples](#) - More theme examples

### Code Examples

\`\`\`typescript
interface ThemeColors {
  text: string;
  background: string;
  primary: string;
  secondary: string;
  accent: string;
}

type ThemeMode = 'light' | 'dark';
\`\`\``,

  `# Summary

## Theme System Benefits

### Flexibility
- Multiple pre-configured themes
- Easy theme switching
- Dark mode support

### Consistency
- Unified color system
- Consistent typography
- Coherent visual hierarchy

### Accessibility
- High contrast options
- Readable text colors
- Clear visual indicators

### Developer Experience
- Type-safe theme definitions
- Easy customization
- Theme provider pattern

---

*Switch between themes using the controls above to see how this presentation adapts!*`
];

export const ThemeSwitcherDemo: Story = {
  args: {
    slides: demoSlides,
    initialSlide: 0,
    showNavigation: true,
    showSlideCounter: true,
    showFullscreenButton: true,
    slideIdPrefix: 'theme-demo',
  },
};

export const MinimalThemeSwitcher: Story = {
  args: {
    slides: [
      `# Minimal Theme Demo

This story shows the theme switcher with minimal navigation controls.

## Key Points

- Theme buttons remain visible
- Dark mode toggle available
- Simplified slide navigation
- Clean, focused presentation

Try switching themes to see how the minimal layout adapts!`,
      
      `# Second Slide

Content adapts to the selected theme while maintaining readability.

### Features
- Clean typography
- Consistent spacing
- Theme-aware colors
- Smooth transitions`,
    ],
    initialSlide: 0,
    showNavigation: true,
    showSlideCounter: false,
    showFullscreenButton: false,
    slideIdPrefix: 'minimal-theme',
  },
};