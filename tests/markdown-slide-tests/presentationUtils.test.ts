import { describe, it, expect } from '@jest/globals';
import { parseMarkdownIntoPresentation } from '../../industryMarkdown/utils/presentationUtils';

describe('parseMarkdownIntoPresentation', () => {
  it('should split document by ## headers', () => {
    const markdown = `# Title
Introduction content

## Section 1
Content for section 1

## Section 2
More content for section 2`;

    const result = parseMarkdownIntoPresentation(markdown);
    expect(result.slides).toHaveLength(3); // Intro + 2 sections
    expect(result.slides[0].title).toBe('Title');
    expect(result.slides[1].title).toBe('Section 1');
    expect(result.slides[2].title).toBe('Section 2');
  });

  it('should NOT split by --- horizontal rules', () => {
    const markdown = `## Section 1
Content before rule
---
More content after rule`;

    const result = parseMarkdownIntoPresentation(markdown);
    expect(result.slides).toHaveLength(1); // Should ignore ---
    expect(result.slides[0].location.content).toContain('Content before rule');
    expect(result.slides[0].location.content).toContain('More content after rule');
  });

  it('should handle documents with no headers as single slide', () => {
    const markdown = `Just plain content
No headers here
Multiple lines of text`;

    const result = parseMarkdownIntoPresentation(markdown);
    expect(result.slides).toHaveLength(1);
    expect(result.slides[0].location.content).toBe(markdown);
  });

  it('should handle mixed # and ## headers correctly', () => {
    const markdown = `# Main Title
Intro text

## First Section
Section content

### Subsection
Subsection content

## Second Section
More section content`;

    const result = parseMarkdownIntoPresentation(markdown);
    expect(result.slides).toHaveLength(3); // Main + 2 sections
    expect(result.slides[0].title).toBe('Main Title');
    expect(result.slides[1].title).toBe('First Section');
    expect(result.slides[1].location.content).toContain('### Subsection');
    expect(result.slides[2].title).toBe('Second Section');
  });

  it('should skip empty sections between headers', () => {
    const markdown = `## Section 1
Content

## Empty Section

## Section 3
More content`;

    const result = parseMarkdownIntoPresentation(markdown);
    // Should include empty section but mark it appropriately
    expect(result.slides).toHaveLength(3);
    expect(result.slides[1].location.content.trim()).toBe('## Empty Section');
  });

  it('should preserve metadata with correct line numbers', () => {
    const markdown = `# Title
Line 2
Line 3

## Section 1
Line 6
Line 7

## Section 2
Line 10`;

    const result = parseMarkdownIntoPresentation(markdown);

    expect(result.slides[0].location.startLine).toBe(0);
    expect(result.slides[0].location.endLine).toBe(3);

    expect(result.slides[1].location.startLine).toBe(4);
    expect(result.slides[1].location.endLine).toBe(7);

    expect(result.slides[2].location.startLine).toBe(8);
    expect(result.slides[2].location.endLine).toBe(9);
  });

  it('should handle complex real-world markdown', () => {
    const markdown = `# OLLAMA Integration Guide

## Overview
This guide covers integration with OLLAMA.

### Prerequisites
- Node.js installed
- OLLAMA running

## Installation
\`\`\`bash
npm install ollama
\`\`\`

## Configuration
Set the following environment variables:
- OLLAMA_HOST
- OLLAMA_PORT

## Usage Examples
### Basic Example
\`\`\`javascript
const ollama = require('ollama');
\`\`\`

## Troubleshooting
Common issues and solutions.`;

    const result = parseMarkdownIntoPresentation(markdown);
    expect(result.slides).toHaveLength(6); // Title + 5 ## sections (includes Overview)
    expect(result.slides[0].title).toBe('OLLAMA Integration Guide');
    expect(result.slides[1].title).toBe('Overview');
    expect(result.slides[2].title).toBe('Installation');
    expect(result.slides[3].title).toBe('Configuration');
    expect(result.slides[4].title).toBe('Usage Examples');
    expect(result.slides[5].title).toBe('Troubleshooting');
  });

  it('should maintain slide indices correctly', () => {
    const markdown = `# Doc
## Section 1
## Section 2
## Section 3`;

    const result = parseMarkdownIntoPresentation(markdown);

    // Check that slides are in order and have unique IDs
    expect(result.slides).toHaveLength(4); // 1 title + 3 sections
    result.slides.forEach((slide, index) => {
      expect(slide.id).toContain('slide-');
      // Each slide should have a unique ID
      const otherSlides = result.slides.filter((_, i) => i !== index);
      expect(otherSlides.every(other => other.id !== slide.id)).toBe(true);
    });
  });

  it('should handle edge case with only ## headers (no # header)', () => {
    const markdown = `## First Section
Content

## Second Section
More content`;

    const result = parseMarkdownIntoPresentation(markdown);
    expect(result.slides).toHaveLength(2);
    expect(result.slides[0].title).toBe('First Section');
    expect(result.slides[1].title).toBe('Second Section');
  });

  it('should preserve code blocks within slides', () => {
    const markdown = `## Code Section
Here's some code:

\`\`\`javascript
function test() {
  return true;
}
\`\`\`

More text after code`;

    const result = parseMarkdownIntoPresentation(markdown);
    expect(result.slides[0].location.content).toContain('```javascript');
    expect(result.slides[0].location.content).toContain('function test()');
    expect(result.slides[0].location.content).toContain('```');
  });
});
