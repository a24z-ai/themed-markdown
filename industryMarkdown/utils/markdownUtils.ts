import { ContentChunk } from '../types/customMarkdownChunks';

// Simple hash function for markdown strings
function hashMarkdownString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Parses markdown content within a slide into chunks (markdown and mermaid)
 */
export function parseMarkdownChunks(markdownContent: string, idPrefix: string): ContentChunk[] {
  try {
    if (typeof markdownContent !== 'string') {
      throw new Error('Invalid markdown content provided for slide');
    }

    // Handle empty content gracefully - return empty array instead of throwing error
    if (!markdownContent || markdownContent.trim() === '') {
      return [];
    }

    const chunks: ContentChunk[] = [];
    const mermaidRegex = /^```mermaid\n([\s\S]*?)\n^```$/gm;
    let lastIndex = 0;
    let match;
    let partCounter = 0;

    while ((match = mermaidRegex.exec(markdownContent)) !== null) {
      partCounter++;
      if (match.index > lastIndex) {
        const mdContent = markdownContent.substring(lastIndex, match.index);
        if (mdContent.trim()) {
          chunks.push({
            type: 'markdown_chunk',
            content: mdContent,
            id: `${idPrefix}-md-${partCounter}-${hashMarkdownString(mdContent)}`,
          });
        }
      }
      partCounter++;
      const mermaidCode = match[1].trim();
      chunks.push({
        type: 'mermaid_chunk',
        code: mermaidCode,
        id: `${idPrefix}-mermaid-${partCounter}-${hashMarkdownString(mermaidCode)}`,
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < markdownContent.length) {
      partCounter++;
      const remainingMdContent = markdownContent.substring(lastIndex);
      if (remainingMdContent.trim()) {
        chunks.push({
          type: 'markdown_chunk',
          content: remainingMdContent,
          id: `${idPrefix}-md-${partCounter}-${hashMarkdownString(remainingMdContent)}`,
        });
      }
    }
    if (chunks.length === 0 && markdownContent.trim()) {
      chunks.push({
        type: 'markdown_chunk',
        content: markdownContent,
        id: `${idPrefix}-md-only-${hashMarkdownString(markdownContent)}`,
      });
    }
    return chunks;
  } catch (error) {
    console.error('Error in parseMarkdownChunks:', error);
    // Return a single markdown chunk with the original content to allow fallback rendering
    return markdownContent
      ? [
          {
            type: 'markdown_chunk',
            content: markdownContent,
            id: `${idPrefix}-md-error-fallback-${hashMarkdownString(markdownContent)}`,
          },
        ]
      : [];
  }
}
