import { describe, it, expect } from 'bun:test';
import { parseMarkdownIntoPresentation, MarkdownPresentationFormat } from '../index';

describe('parseMarkdownIntoPresentation with code blocks', () => {
  it('should not split slides on headers inside code blocks', () => {
    const content = `# First Slide

Some content here

\`\`\`markdown
# This is inside a code block
## So is this
Should not trigger a slide split
\`\`\`

Still in first slide

## Second Slide

This should be a new slide`;

    const presentation = parseMarkdownIntoPresentation(
      content,
      MarkdownPresentationFormat.HEADER
    );
    
    expect(presentation.slides).toHaveLength(2);
    expect(presentation.slides[0].title).toBe('First Slide');
    expect(presentation.slides[0].location.content).toContain('This is inside a code block');
    expect(presentation.slides[0].location.content).toContain('Still in first slide');
    expect(presentation.slides[1].title).toBe('Second Slide');
  });

  it('should not split on --- inside code blocks', () => {
    const content = `# Slide One

Content here

\`\`\`yaml
key: value
---
another: document
\`\`\`

Still in slide one

---

# Slide Two`;

    const presentation = parseMarkdownIntoPresentation(
      content,
      MarkdownPresentationFormat.HORIZONTAL_RULE
    );
    
    expect(presentation.slides).toHaveLength(2);
    expect(presentation.slides[0].location.content).toContain('---');
    expect(presentation.slides[0].location.content).toContain('Still in slide one');
  });

  it('should handle triple tilde code blocks too', () => {
    const content = `# First Slide

~~~markdown
# Header in tilde block
## Another header
~~~

# Second Slide`;

    const presentation = parseMarkdownIntoPresentation(
      content,
      MarkdownPresentationFormat.HEADER
    );
    
    expect(presentation.slides).toHaveLength(2);
    expect(presentation.slides[0].location.content).toContain('Header in tilde block');
  });

  it('should detect format correctly ignoring code blocks', () => {
    const content = `# Only One Real Header

\`\`\`markdown
# Fake header in code
## Another fake header
\`\`\`

No slide splitting should occur`;

    const presentation = parseMarkdownIntoPresentation(content);
    
    // Should detect as FULL_CONTENT since only 1 real header
    expect(presentation.format).toBe(MarkdownPresentationFormat.FULL_CONTENT);
    expect(presentation.slides).toHaveLength(1);
  });
});