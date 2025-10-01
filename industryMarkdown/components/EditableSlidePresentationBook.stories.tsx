import { theme, ThemeProvider } from '@a24z/industry-theme';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { EditableSlidePresentationBook } from './EditableSlidePresentationBook';

const meta = {
  title: 'IndustryMarkdown/EditableSlidePresentationBook',
  component: EditableSlidePresentationBook,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
  args: {
    theme,
  },
} satisfies Meta<typeof EditableSlidePresentationBook>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultSlides = [
  `# Welcome to Editable Book View

This is the **first slide** with markdown content.

- You can edit the content on the left
- And see the preview on the right
- Changes are saved automatically

## Features

- Live preview
- Auto-save functionality
- Keyboard shortcuts (⌘S to save)`,

  `# Second Slide

## Code Example

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('World');
\`\`\`

Try editing this code!`,

  `# Third Slide

## Markdown Features

You can use various markdown features:

1. **Bold text**
2. *Italic text*
3. \`inline code\`
4. [Links](https://example.com)

> Blockquotes work too!

---

And horizontal rules!`,

  `# Fourth Slide

## Tables

| Feature | Supported |
|---------|-----------|
| Tables | ✅ |
| Code blocks | ✅ |
| Lists | ✅ |
| Images | ✅ |`,
];

const InteractiveStory = () => {
  const [slides, setSlides] = useState(defaultSlides);

  const handleSave = async (newSlides: string[]) => {
    console.log('Saving slides:', newSlides);
    await new Promise(resolve => setTimeout(resolve, 500));
    setSlides(newSlides);
  };

  const handleContentChange = (_newSlides: string[]) => {
    console.log('Content changed');
  };

  return (
    <div style={{ height: '100vh' }}>
      <EditableSlidePresentationBook
        slides={slides}
        onSave={handleSave}
        onContentChange={handleContentChange}
        viewMode="book"
        showNavigation={true}
        showSlideCounter={true}
        showFullscreenButton={true}
        containerHeight="100%"
        editorTheme="auto"
        autoSaveDelay={2000}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <InteractiveStory />,
  args: {
    slides: defaultSlides,
  },
};


export const DarkTheme: Story = {
  args: {
    slides: defaultSlides,
    viewMode: 'book',
    showNavigation: true,
    showSlideCounter: true,
    showFullscreenButton: true,
    containerHeight: '100vh',
    editorTheme: 'dark',
    editorFontSize: 14,
  },
};

export const LightTheme: Story = {
  args: {
    slides: defaultSlides,
    viewMode: 'book',
    showNavigation: true,
    showSlideCounter: true,
    showFullscreenButton: true,
    containerHeight: '100vh',
    editorTheme: 'light',
    editorFontSize: 16,
  },
};

export const NoAutoSave: Story = {
  args: {
    slides: defaultSlides,
    viewMode: 'book',
    showNavigation: true,
    showSlideCounter: true,
    showFullscreenButton: false,
    containerHeight: '100vh',
    autoSaveDelay: 0,
  },
};

export const MinimalUI: Story = {
  args: {
    slides: defaultSlides,
    viewMode: 'book',
    showNavigation: false,
    containerHeight: '100vh',
  },
};