import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { ThemeProvider } from '../../industryTheme';

import { IndustryMarkdownSlide } from './IndustryMarkdownSlide';

const meta: Meta<typeof IndustryMarkdownSlide> = {
  title: 'IndustryMarkdown/IndustryMarkdownSlide',
  component: IndustryMarkdownSlide,
  decorators: [
    Story => (
      <ThemeProvider>
        <div style={{ height: '100vh', width: '100%' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: '# Hello World\n\nThis is a test slide with some **bold text** and *italic text*.',
    slideIdPrefix: 'story',
    slideIndex: 0,
    isVisible: true,
  },
};

export const WithCode: Story = {
  args: {
    content: `# Code Example

Here's some JavaScript code:

\`\`\`javascript
function greet(name) {
  console.log("Hello, " + name + "!");
}

greet("World");
\`\`\`

And some inline \`code\` as well.`,
    slideIdPrefix: 'story',
    slideIndex: 0,
    isVisible: true,
  },
};

export const WithMermaid: Story = {
  args: {
    content: `# Mermaid Diagram with Fit Toggle

Here's a flowchart with a toggle button to switch between height-fit and scrollable width-fit modes:

\`\`\`mermaid
graph TB
    subgraph "Client Browser"
        UI[React UI Components]
        Router[Astro Router]
    end
    
    subgraph "Alexandria Frontend (Astro + React)"
        HomePage[Home Page<br/>index.astro]
        RepoPage[Repository Page<br/>repo.astro]
        
        Alexandria[Alexandria.tsx<br/>Main Component]
        RepoViewer[RepositoryViewer.tsx<br/>Repository Browser]
        ViewDisplay[ViewDisplay.tsx<br/>Document Viewer]
        
        HomePage --> Alexandria
        RepoPage --> RepoViewer
        RepoViewer --> ViewDisplay
    end
    
    subgraph "Data Layer"
        API[AlexandriaAPI Client<br/>alexandria-api.ts]
        Alexandria --> API
        RepoViewer --> API
        ViewDisplay --> API
    end
    
    subgraph "External Services"
        GitGallery[git-gallery.com<br/>Alexandria API]
        GitHub[GitHub<br/>Raw Content]
        
        API --> GitGallery
        API --> GitHub
    end
    
    subgraph "Repository Structure"
        GitRepo[GitHub Repository]
        ViewsJSON[.a24z/views.json]
        Docs[Documentation Files<br/>*.md]
        
        GitRepo --> ViewsJSON
        GitRepo --> Docs
    end
    
    GitGallery --> GitRepo
    GitHub --> Docs
    
    UI --> Router
    Router --> HomePage
    Router --> RepoPage
\`\`\`

Click the toggle button in the top-right corner to switch between:
- **Height Fit**: Scales to fit container height (default)
- **Width Fit**: Uses full width with vertical scrolling in fixed container`,
    slideIdPrefix: 'story',
    slideIndex: 0,
    isVisible: true,
    onShowMermaidInPanel: undefined,
  },
};

export const WithMermaidWidthFit: Story = {
  args: {
    content: `# Mermaid Diagram (Width Fit)

Here's a wide flowchart that would fit to parent width:

\`\`\`mermaid
graph LR
    A[Start] --> B[Process 1] --> C[Process 2] --> D[Process 3]
    D --> E[Process 4] --> F[Process 5] --> G[Process 6]
    G --> H[Process 7] --> I[Process 8] --> J[End]
    
    B --> K[Alternative Path]
    K --> L[Merge Point] --> F
    
    D --> M[Another Branch]
    M --> N[Complex Processing]
    N --> O[More Steps]
    O --> H
\`\`\`

Note: To use width fitting, pass fitMode="width" to the mermaid component.`,
    slideIdPrefix: 'story-width',
    slideIndex: 0,
    isVisible: true,
    onShowMermaidInPanel: undefined,
  },
};

export const WithMermaidTallDiagram: Story = {
  args: {
    onShowMermaidInPanel: undefined,
    content: `# Tall Mermaid Diagram (Height Fit)

A tall diagram that benefits from height-based fitting:

\`\`\`mermaid
graph TD
    A[Start] --> B[Step 1]
    B --> C[Step 2]
    C --> D[Step 3]
    D --> E[Step 4]
    E --> F[Step 5]
    F --> G[Step 6]
    G --> H[Step 7]
    H --> I[Step 8]
    I --> J[Step 9]
    J --> K[Step 10]
    K --> L[Step 11]
    L --> M[Step 12]
    M --> N[Step 13]
    N --> O[Step 14]
    O --> P[End]
\`\`\`

With height fitting (default), this tall diagram scales to fit the viewport height.`,
    slideIdPrefix: 'story-tall',
    slideIndex: 0,
    isVisible: true,
  },
};

export const WithTaskList: Story = {
  args: {
    content: `# Task List

- [x] Completed task
- [ ] Pending task
- [ ] Another pending task
  - [x] Subtask completed
  - [ ] Subtask pending`,
    slideIdPrefix: 'story',
    slideIndex: 0,
    isVisible: true,
    onCheckboxChange: (slideIndex, lineNumber, checked) => {
      console.log('Checkbox changed:', { slideIndex, lineNumber, checked });
    },
  },
};

export const WithTable: Story = {
  args: {
    content: `# Data Table

| Name | Age | City |
|------|-----|------|
| Alice | 30 | New York |
| Bob | 25 | San Francisco |
| Charlie | 35 | Chicago |`,
    slideIdPrefix: 'story',
    slideIndex: 0,
    isVisible: true,
  },
};

export const LongContent: Story = {
  args: {
    content: `# Long Content Example

This slide demonstrates scrolling behavior with lots of content.

## Section 1

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Section 2

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

## Section 3

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

## Section 4

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.`,
    slideIdPrefix: 'story',
    slideIndex: 0,
    isVisible: true,
  },
};

export const WithASCIITable: Story = {
  args: {
    content: `# ASCII Box Drawing Table

This slide tests ASCII tables with box-drawing characters to ensure they render properly without cramping.

## Grid Layout Architecture

\`\`\`
┌───────────┬───────────┬───────────┬───────────┐
│   [0,0]   │   [0,1]   │   [0,2]   │   [0,3]   │
│ Provider  │ Pattern   │  Cache    │  Loader   │
│   Core    │ Resolver  │  Manager  │  Config   │
├───────────┼───────────┼───────────┼───────────┤
│   [1,0]   │   [1,1]   │   [1,2]   │   [1,3]   │
│   Tree    │  File     │ Priority  │  Virtual  │
│   Items   │ Watchers  │  System   │   Tree    │
├───────────┼───────────┼───────────┼───────────┤
│   [2,0]   │   [2,1]   │   [2,2]   │   [2,3]   │
│ Commands  │Decorations│  Context  │  Status   │
│           │           │   Menu    │    Bar    │
├───────────┼───────────┼───────────┼───────────┤
│   [3,0]   │   [3,1]   │   [3,2]   │   [3,3]   │
│  Types    │   Tests   │Integration│   Docs    │
└───────────┴───────────┴───────────┴───────────┘
\`\`\`

## Simple ASCII Tree

\`\`\`
project/
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── utils/
│   │   └── helpers.ts
│   └── index.ts
├── tests/
│   └── index.test.ts
└── package.json
\`\`\`

## Box Drawing Test Patterns

\`\`\`
Single Box:
┌─────────┐
│ Content │
└─────────┘

Double Line Box:
╔═════════╗
║ Content ║
╚═════════╝

Mixed Connectors:
├── Item 1
│   ├─ Sub 1.1
│   └─ Sub 1.2
└── Item 2
    ├─ Sub 2.1
    └─ Sub 2.2
\`\`\`

## Expected Behavior

The box-drawing characters should:
- Connect seamlessly without gaps
- Align properly in monospace font
- Not appear cramped or overlapping
- Maintain proper vertical alignment`,
    slideIdPrefix: 'story',
    slideIndex: 0,
    isVisible: true,
  },
};

export const WithResizeObserver: Story = {
  args: {
    content: `# ResizeObserver Demo

This slide demonstrates automatic width detection using ResizeObserver.

## Features

- **No containerWidth prop**: The component automatically measures its container
- **Responsive padding**: Dynamic padding adjusts based on measured width
- **Real-time updates**: Padding updates when container is resized

## How it works

1. When \`containerWidth\` is not provided, a ResizeObserver is attached
2. The observer measures the actual container dimensions
3. Dynamic padding is calculated using the measured width
4. Padding updates automatically when the container is resized

## Benefits

- **Automatic**: No need to manually pass container width
- **Responsive**: Adapts to any container size
- **Efficient**: Only observes when needed
- **Fallback**: Uses default width (800px) if measurement fails`,
    slideIdPrefix: 'story',
    slideIndex: 0,
    isVisible: true,
    // containerWidth intentionally omitted to demonstrate ResizeObserver
  },
};

export const MermaidFontScaling: Story = {
  name: 'Mermaid with Font Scaling',
  args: {
    content: `# Font Scaling with Mermaid Diagrams

This story demonstrates how Mermaid diagrams respond to different font scaling values.

## Standard Size (fontSizeScale: 1.0)

\`\`\`mermaid
graph TB
    A[Normal Size Text] --> B[Step 1]
    B --> C[Step 2] 
    C --> D[Result with longer text]
    
    subgraph "Processing Group"
        D --> E[Data Processing]
        E --> F[Validation]
        F --> G[Output Generation]
    end
\`\`\`

## Class Diagram Example

\`\`\`mermaid
classDiagram
    class Vehicle {
        +String make
        +String model
        +int year
        +start()
        +stop()
        +getInfo()
    }
    class Car {
        +int doors
        +String fuel_type
        +accelerate()
        +brake()
    }
    class Motorcycle {
        +String type
        +boolean hasSidecar
        +wheelie()
    }
    Vehicle <|-- Car
    Vehicle <|-- Motorcycle
\`\`\`

## Sequence Diagram

\`\`\`mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Database
    
    User->>Frontend: Submit Form
    Frontend->>API: POST /api/data
    API->>Database: INSERT query
    Database-->>API: Success response
    API-->>Frontend: 201 Created
    Frontend-->>User: Success message
\`\`\`

The diagrams above should scale with the font size controls. Try different scaling values to see the effect on text size within the Mermaid diagrams.`,
    slideIdPrefix: 'font-scale-story',
    slideIndex: 0,
    isVisible: true,
    fontSizeScale: 1.0,
    // Ensure all required props are provided
    containerWidth: 800,
    // Disable the "Show in Panel" button for cleaner demo
    onShowMermaidInPanel: undefined,
    // showMermaidFitToggle removed - now each diagram has individual zoom controls
  },
  argTypes: {
    fontSizeScale: {
      control: {
        type: 'range',
        min: 0.5,
        max: 2.0,
        step: 0.1,
      },
      description: 'Scale factor for font sizes in the Mermaid diagrams',
    },
  },
};
