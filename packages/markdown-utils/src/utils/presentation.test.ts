import { describe, it, expect } from 'bun:test';
import { 
  parseMarkdownIntoPresentation, 
  extractSlideTitle,
  serializePresentationToMarkdown,
  MarkdownPresentationFormat 
} from '../index';

describe('extractSlideTitle', () => {
  it('should extract title from heading', () => {
    const content = '# My Title\n\nSome content';
    expect(extractSlideTitle(content)).toBe('My Title');
  });

  it('should extract title from h2 heading', () => {
    const content = '## Another Title\n\nMore content';
    expect(extractSlideTitle(content)).toBe('Another Title');
  });

  it('should use first line when no heading', () => {
    const content = 'This is the first line\nSecond line';
    expect(extractSlideTitle(content)).toBe('This is the first line');
  });

  it('should truncate long first lines', () => {
    const longLine = 'A'.repeat(60);
    expect(extractSlideTitle(longLine)).toBe('A'.repeat(47) + '...');
  });

  it('should return default for empty content', () => {
    expect(extractSlideTitle('')).toBe('Untitled Slide');
  });
});

describe('parseMarkdownIntoPresentation', () => {
  it('should parse single slide with FULL_CONTENT format', () => {
    const content = '# Single Slide\n\nJust one slide here';
    const presentation = parseMarkdownIntoPresentation(content);
    
    expect(presentation.format).toBe(MarkdownPresentationFormat.FULL_CONTENT);
    expect(presentation.slides).toHaveLength(1);
    expect(presentation.slides[0].title).toBe('Single Slide');
    expect(presentation.slides[0].location.content).toBe(content);
  });

  it('should split slides by horizontal rules', () => {
    const content = `# Slide 1

Content 1

---

# Slide 2

Content 2

---

# Slide 3

Content 3`;

    const presentation = parseMarkdownIntoPresentation(
      content, 
      MarkdownPresentationFormat.HORIZONTAL_RULE
    );
    
    expect(presentation.slides).toHaveLength(3);
    expect(presentation.slides[0].title).toBe('Slide 1');
    expect(presentation.slides[1].title).toBe('Slide 2');
    expect(presentation.slides[2].title).toBe('Slide 3');
  });

  it('should split slides by headers', () => {
    const content = `# First Slide

Content of first

# Second Slide

Content of second

# Third Slide

Final content`;

    const presentation = parseMarkdownIntoPresentation(
      content,
      MarkdownPresentationFormat.HEADER
    );
    
    expect(presentation.slides).toHaveLength(3);
    expect(presentation.slides[0].title).toBe('First Slide');
    expect(presentation.slides[1].title).toBe('Second Slide');
    expect(presentation.slides[2].title).toBe('Third Slide');
  });

  it('should auto-detect header format with multiple headers', () => {
    const content = '# Slide 1\nContent\n# Slide 2\nMore\n## Slide 3\nFinal';
    const presentation = parseMarkdownIntoPresentation(content);
    
    expect(presentation.format).toBe(MarkdownPresentationFormat.HEADER);
    expect(presentation.slides).toHaveLength(3);
  });
});

describe('serializePresentationToMarkdown', () => {
  it('should serialize presentation back to markdown', () => {
    const originalContent = `# Slide 1

Content

---

# Slide 2

More content`;

    const presentation = parseMarkdownIntoPresentation(
      originalContent,
      MarkdownPresentationFormat.HORIZONTAL_RULE
    );
    
    const serialized = serializePresentationToMarkdown(presentation);
    
    // Should contain both slides
    expect(serialized).toContain('# Slide 1');
    expect(serialized).toContain('# Slide 2');
    expect(serialized).toContain('---');
  });
});