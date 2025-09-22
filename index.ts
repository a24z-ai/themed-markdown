// Main entry point for themed-markdown package

// Components
export { IndustryMarkdownSlide } from './industryMarkdown/components/IndustryMarkdownSlide';
export type { IndustryMarkdownSlideProps } from './industryMarkdown/components/IndustryMarkdownSlide';

export { SlidePresentation } from './industryMarkdown/components/SlidePresentation';
export type { SlidePresentationProps } from './industryMarkdown/components/SlidePresentation';

export { DocumentView } from './industryMarkdown/components/DocumentView';
export type { DocumentViewProps } from './industryMarkdown/components/DocumentView';

export { IndustryEditableMarkdownSlide } from './industryMarkdown/components/IndustryEditableMarkdownSlide';
export type { IndustryEditableMarkdownSlideProps } from './industryMarkdown/components/IndustryEditableMarkdownSlide';

export { createIndustryMarkdownComponents } from './industryMarkdown/components/IndustryMarkdownComponents';

// Modal components
export { IndustryHtmlModal, useIndustryHtmlModal } from './industryMarkdown/components/IndustryHtmlModal';
export { IndustryPlaceholderModal } from './industryMarkdown/components/IndustryPlaceholderModal';
export { IndustryMermaidModal } from './industryMarkdown/components/IndustryMermaidModal';
export { IndustryLazyMermaidDiagram } from './industryMarkdown/components/IndustryLazyMermaidDiagram';
export { IndustryZoomableMermaidDiagram } from './industryMarkdown/components/IndustryZoomableMermaidDiagram';

// Utilities
export {
  parseMarkdownIntoPresentation,
  serializePresentationToMarkdown,
  updatePresentationSlide,
  parseMarkdownIntoPresentationFromSource,
  createGithubFileSource,
  extractSlideTitle,
  createPresentationWithErrorMessage,
  reconstructMarkdownContent,
  getAllSlideTitles,
  findSlideByTitle,
  findSlideIndexByTitle,
  updateSlideTitle,
  updateSlideContent,
} from './industryMarkdown/utils/presentationUtils';

export { parseMarkdownChunks } from './industryMarkdown/utils/markdownUtils';

// Types
export type {
  MarkdownPresentation,
  MarkdownSlide,
  MarkdownSource,
  MarkdownSourceType,
  RepositoryInfo,
  MarkdownSlideLocation,
} from './industryMarkdown/types/presentation';

export type {
  ContentChunk,
  MarkdownChunk,
  MermaidChunk,
  CodeChunk,
} from './industryMarkdown/types/customMarkdownChunks';

// Theme system
export type { Theme } from './industryTheme';
export { theme as defaultTheme } from './industryTheme';
export {
  ThemeProvider,
  useTheme,
  withTheme
} from './industryTheme/ThemeProvider';
export {
  scaleThemeFonts,
  increaseFontScale,
  decreaseFontScale,
  resetFontScale
} from './industryTheme';

// Export all available themes
export {
  terminalTheme,
  regalTheme,
  glassmorphismTheme,
  matrixTheme,
  matrixMinimalTheme
} from './industryTheme/themes';