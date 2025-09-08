// Industry-themed markdown components using Theme UI spec-compliant themes
export { IndustryMarkdownSlide } from './components/IndustryMarkdownSlide';
export type { IndustryMarkdownSlideProps } from './components/IndustryMarkdownSlide';

// Slide presentation component with navigation controls
export { SlidePresentation } from './components/SlidePresentation';
export type { SlidePresentationProps } from './components/SlidePresentation';

// Document view component for continuous or segmented display
export { DocumentView } from './components/DocumentView';
export type { DocumentViewProps } from './components/DocumentView';

// Industry-themed editable markdown component
export { IndustryEditableMarkdownSlide } from './components/IndustryEditableMarkdownSlide';
export type { IndustryEditableMarkdownSlideProps } from './components/IndustryEditableMarkdownSlide';

// Industry-themed markdown component creators
export { createIndustryMarkdownComponents } from './components/IndustryMarkdownComponents';

// Industry-themed modal components
export { IndustryHtmlModal, useIndustryHtmlModal } from './components/IndustryHtmlModal';
export { IndustryPlaceholderModal } from './components/IndustryPlaceholderModal';
export { IndustryMermaidModal } from './components/IndustryMermaidModal';
export { IndustryLazyMermaidDiagram } from './components/IndustryLazyMermaidDiagram';
export { IndustryZoomableMermaidDiagram } from './components/IndustryZoomableMermaidDiagram';

// Presentation utilities for parsing and serializing markdown presentations
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
} from './utils/presentationUtils';

// Markdown chunk utilities
export { parseMarkdownChunks } from './utils/markdownUtils';

// Presentation types
export type {
  MarkdownPresentation,
  MarkdownSlide,
  MarkdownPresentationFormat,
  MarkdownSource,
  MarkdownSourceType,
  RepositoryInfo,
  MarkdownSlideLocation,
} from './types/presentation';

// Theme system is now imported from the local industryTheme module
export type { Theme } from '../industryTheme';
