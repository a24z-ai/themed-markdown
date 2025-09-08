// Chunk Types for markdown content parsing
export interface MarkdownChunk {
  type: 'markdown_chunk';
  content: string;
  id: string;
}

export interface MermaidChunk {
  type: 'mermaid_chunk';
  code: string;
  id: string;
}

export interface SlideChunk {
  type: 'slide_chunk';
  content: string; // Markdown content *within* the slide
  id: string;
}

export interface CodeChunk {
  type: 'code_chunk';
  content?: string;
  code?: string;
  language?: string;
  id?: string;
}

export type ContentChunk = MarkdownChunk | MermaidChunk | CodeChunk;
