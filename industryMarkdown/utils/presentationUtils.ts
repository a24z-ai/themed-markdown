import {
  MarkdownPresentation,
  MarkdownSlide,
  MarkdownPresentationFormat,
  MarkdownSource,
  MarkdownSourceType,
  RepositoryInfo,
} from '../types/presentation';

import { parseMarkdownChunks } from './markdownUtils';

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
 * Extract the title from slide content (first heading or first line)
 */
export function extractSlideTitle(content: string): string {
  const lines = content.split('\n').filter(line => line.trim());

  // Look for the first heading
  for (const line of lines) {
    const headingMatch = line.match(/^#+\s+(.+)$/);
    if (headingMatch) {
      return headingMatch[1].trim();
    }
  }

  // If no heading, use first non-empty line (truncated)
  if (lines.length > 0) {
    const firstLine = lines[0];
    return firstLine.length > 50 ? firstLine.substring(0, 47) + '...' : firstLine;
  }

  return 'Untitled Slide';
}

export function parseMarkdownIntoPresentationFromSource(
  source: MarkdownSource,
): MarkdownPresentation {
  let presentation: MarkdownPresentation;
  switch (source.type) {
    case MarkdownSourceType.WORKSPACE_FILE:
    case MarkdownSourceType.GITHUB_FILE:
    case MarkdownSourceType.DRAFT:
      presentation = parseMarkdownIntoPresentation(source.content);
      break;
    default:
      throw new Error(`Unsupported source type: ${source.type}`);
  }
  presentation.source = source;
  // Experimental: Add repository info to the presentation
  presentation.repositoryInfo = source.repositoryInfo;
  return presentation;
}

export function createGithubFileSource(
  content: string,
  repositoryInfo: RepositoryInfo,
): MarkdownSource {
  return {
    type: MarkdownSourceType.GITHUB_FILE,
    content,
    repositoryInfo,
    editable: false,
    deletable: false,
  };
}

/**
 * Enhanced version of markdown slide parsing that preserves location information
 * and returns a structured Presentation object
 */
export function parseMarkdownIntoPresentation(markdownContent: string): MarkdownPresentation {
  try {
    if (typeof markdownContent !== 'string') {
      console.error('Invalid markdown content provided - not a string');
      return {
        slides: [],
        originalContent: '',
        format: MarkdownPresentationFormat.FULL_CONTENT,
      };
    }

    // Handle empty content gracefully without logging
    if (!markdownContent || markdownContent.trim() === '') {
      return {
        slides: [],
        originalContent: '',
        format: MarkdownPresentationFormat.FULL_CONTENT,
      };
    }

    const slides: MarkdownSlide[] = [];
    let format: MarkdownPresentationFormat = MarkdownPresentationFormat.FULL_CONTENT;

    // Try splitting by ## headers
    let slideCounter = 0;
    const headerMatches = Array.from(markdownContent.matchAll(/^(##\s+.*$)/gm));

    if (headerMatches.length > 0) {
      format = MarkdownPresentationFormat.HEADER;

      // Handle content before first ## if it exists
      const firstHeaderStart = headerMatches[0].index!;
      const firstContent = markdownContent.substring(0, firstHeaderStart).trim();
      if (firstContent) {
        slideCounter++;
        slides.push({
          id: `slide-${slideCounter}-${hashMarkdownString(firstContent)}`,
          title: extractSlideTitle(firstContent),
          location: {
            startLine: 1,
            endLine: firstContent.split('\n').length,
            content: firstContent,
            type: MarkdownPresentationFormat.HEADER,
          },
          chunks: parseMarkdownChunks(firstContent, `slide-${slideCounter}`),
        });
      }

      // Process each header section
      for (let i = 0; i < headerMatches.length; i++) {
        const headerMatch = headerMatches[i];
        const startIndex = headerMatch.index!;
        const endIndex =
          i < headerMatches.length - 1 ? headerMatches[i + 1].index! : markdownContent.length;
        const content = markdownContent.substring(startIndex, endIndex).trim();

        if (content) {
          slideCounter++;
          const startLine = markdownContent.substring(0, startIndex).split('\n').length;
          const endLine = startLine + content.split('\n').length - 1;

          slides.push({
            id: `slide-${slideCounter}-${hashMarkdownString(content)}`,
            title: extractSlideTitle(content),
            location: {
              startLine,
              endLine,
              content,
              type: MarkdownPresentationFormat.HEADER,
            },
            chunks: parseMarkdownChunks(content, `slide-${slideCounter}`),
          });
        }
      }
    } else if (markdownContent.trim()) {
      // If no headers found, treat entire content as one slide
      slideCounter++;
      const trimmedContent = markdownContent.trim();
      slides.push({
        id: `slide-${slideCounter}-${hashMarkdownString(trimmedContent)}`,
        title: extractSlideTitle(trimmedContent),
        location: {
          startLine: 1,
          endLine: markdownContent.split('\n').length,
          content: trimmedContent,
          type: MarkdownPresentationFormat.FULL_CONTENT,
        },
        chunks: parseMarkdownChunks(trimmedContent, `slide-${slideCounter}`),
      });
    }

    return {
      slides,
      originalContent: markdownContent,
      format,
    };
  } catch (error) {
    console.error('Error parsing markdown presentation:', error);
    // Return single slide with full content in case of error
    const content = markdownContent.trim();
    return {
      slides: content
        ? [
            {
              id: `slide-error-${hashMarkdownString(content)}`,
              title: extractSlideTitle(content),
              location: {
                startLine: 1,
                endLine: content.split('\n').length,
                content,
                type: MarkdownPresentationFormat.FULL_CONTENT,
              },
              chunks: parseMarkdownChunks(content, 'slide-error'),
            },
          ]
        : [],
      originalContent: markdownContent,
      format: MarkdownPresentationFormat.FULL_CONTENT,
    };
  }
}

/**
 *
 * @param errorMessage Depricated
 * @returns
 */
export function createPresentationWithErrorMessage(errorMessage: string): MarkdownPresentation {
  const errorMessageMarkdown = `# Error Loading Markdown:\n\n${errorMessage}`;
  return {
    slides: [
      {
        id: 'error',
        title: extractSlideTitle(errorMessageMarkdown),
        location: {
          startLine: 0,
          endLine: 0,
          content: errorMessageMarkdown,
          type: MarkdownPresentationFormat.FULL_CONTENT,
        },
        chunks: parseMarkdownChunks(errorMessageMarkdown, 'slide-error'),
      },
    ],
    originalContent: errorMessageMarkdown,
    format: MarkdownPresentationFormat.FULL_CONTENT,
  };
}

/**
 * Helper function to reconstruct the original markdown content from a Presentation object
 */
export function reconstructMarkdownContent(presentation: MarkdownPresentation): string {
  switch (presentation.format) {
    case MarkdownPresentationFormat.HORIZONTAL_RULE:
      return presentation.slides.map(slide => slide.location.content).join('\n\n---\n\n');

    case MarkdownPresentationFormat.HEADER:
      return presentation.slides
        .map((slide, index) => {
          // First slide might not have ## if it was content before first header
          if (index === 0 && !slide.location.content.startsWith('##')) {
            return slide.location.content;
          }
          // Ensure header slides start with ##
          return slide.location.content.startsWith('##')
            ? slide.location.content
            : `## ${slide.location.content}`;
        })
        .join('\n\n');

    case MarkdownPresentationFormat.FULL_CONTENT:
    default:
      // For full content, just return the first slide's content or empty string
      return presentation.slides[0]?.location.content || '';
  }
}

/**
 * Get all slide titles from a presentation
 */
export function getAllSlideTitles(presentation: MarkdownPresentation): string[] {
  return presentation.slides.map(slide => slide.title);
}

/**
 * Find a slide by title (returns first match)
 */
export function findSlideByTitle(
  presentation: MarkdownPresentation,
  title: string,
): MarkdownSlide | undefined {
  return presentation.slides.find(slide => slide.title === title);
}

/**
 * Find slide index by title (returns first match)
 */
export function findSlideIndexByTitle(presentation: MarkdownPresentation, title: string): number {
  return presentation.slides.findIndex(slide => slide.title === title);
}

/**
 * Update a slide's title (creates a new slide object)
 */
export function updateSlideTitle(slide: MarkdownSlide, newTitle: string): MarkdownSlide {
  return {
    ...slide,
    title: newTitle,
  };
}

/**
 * Serialize a MarkdownPresentation back to markdown string
 * This is an alias for reconstructMarkdownContent for clearer API
 */
export function serializePresentationToMarkdown(presentation: MarkdownPresentation): string {
  return reconstructMarkdownContent(presentation);
}

/**
 * Update a slide's content and regenerate its metadata
 */
export function updateSlideContent(slide: MarkdownSlide, newContent: string): MarkdownSlide {
  return {
    ...slide,
    location: {
      ...slide.location,
      content: newContent,
    },
    title: extractSlideTitle(newContent),
    chunks: parseMarkdownChunks(newContent, slide.id.split('-')[1] || 'slide'),
  };
}

/**
 * Create a new presentation with updated slide at the specified index
 */
export function updatePresentationSlide(
  presentation: MarkdownPresentation,
  index: number,
  newContent: string,
): MarkdownPresentation {
  const updatedSlides = [...presentation.slides];
  if (index >= 0 && index < updatedSlides.length) {
    updatedSlides[index] = updateSlideContent(updatedSlides[index], newContent);
  }

  return {
    ...presentation,
    slides: updatedSlides,
    originalContent: reconstructMarkdownContent({
      ...presentation,
      slides: updatedSlides,
    }),
  };
}
