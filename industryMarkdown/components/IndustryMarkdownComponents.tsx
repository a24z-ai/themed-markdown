import { Copy, Monitor, FileText, Check } from 'lucide-react';
import React, { useMemo, useState, useRef } from 'react';

import { Theme } from '../../industryTheme';
import { RepositoryInfo } from '../types/presentation';
import { parseBashCommands } from '../utils/bashCommandParser';
import { extractTextFromChildren, LinkWithLoadingIndicator } from '../utils/componentUtils';
import { transformImageUrl } from '../utils/imageUrlUtils';

import { IndustryBashCommandDropdown } from './IndustryBashCommandDropdown';

interface IndustryMarkdownComponentsProps {
  theme: Theme; // Required industryTheme object
  slideIdPrefix: string;
  slideIndex: number;
  onLinkClick?: (href: string, event?: MouseEvent) => void;
  onCheckboxChange?: (slideIndex: number, lineNumber: number, checked: boolean) => void;
  checkedItems: Record<string, boolean>;
  setCheckedItems: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  openHtmlModal: (content: string) => void;
  openPlaceholderModal?: (placeholders: string[], promptContent: string) => void;
  handleRunBashCommand?: (
    command: string,
    options?: {
      id?: string;
      showInTerminal?: boolean;
      cwd?: string;
      background?: boolean;
    },
  ) => Promise<any>;
  enableHtmlPopout: boolean;
  slideHeaderMarginTopOverride?: number;
  index: number;
  repositoryInfo?: RepositoryInfo;
}

// Global cache to track failed images and prevent repeated requests
const failedImageCache = new Set<string>();

// Optimized image component using industryTheme
const OptimizedMarkdownImage = React.memo(
  ({
    src,
    alt,
    repositoryInfo,
    theme,
    ...props
  }: {
    src: string;
    alt: string;
    repositoryInfo?: RepositoryInfo;
    theme: Theme;
  }) => {
    const transformedSrc = useMemo(() => {
      return transformImageUrl(src, repositoryInfo);
    }, [src, repositoryInfo]);

    const [hasErrored, setHasErrored] = useState(() => failedImageCache.has(transformedSrc));
    const retryCount = useRef(0);

    const imageStyle = useMemo(
      () => ({
        maxWidth: '100%',
        height: 'auto',
        display: 'block',
        margin: `${theme.space[3]}px auto`,
        borderRadius: theme.radii[1],
        boxShadow: theme.shadows[2],
      }),
      [theme],
    );

    const handleLoad = () => {
      failedImageCache.delete(transformedSrc);
      setHasErrored(false);
      retryCount.current = 0;
    };

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      retryCount.current += 1;
      failedImageCache.add(transformedSrc);
      setHasErrored(true);
      e.stopPropagation();
    };

    if (hasErrored) {
      return (
        <span
          style={{
            ...imageStyle,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.backgroundSecondary,
            color: theme.colors.textSecondary,
            border: `1px solid ${theme.colors.border}`,
            minHeight: '50px',
            minWidth: '100px',
            fontSize: theme.fontSizes[0],
            textAlign: 'center',
            padding: `${theme.space[2]}px`,
          }}
          title={`Failed to load image: ${transformedSrc}`}
        >
          🖼️ Image unavailable{' '}
          {alt && <span style={{ fontSize: theme.fontSizes[0], opacity: 0.7 }}>({alt})</span>}
        </span>
      );
    }

    return (
      <img
        src={transformedSrc}
        alt={alt}
        style={imageStyle}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    );
  },
);

/**
 * Creates markdown components using industryTheme.
 * This directly uses Theme UI spec values from the industryTheme.
 */
export const createIndustryMarkdownComponents = ({
  theme,
  slideIdPrefix,
  slideIndex,
  onLinkClick,
  onCheckboxChange,
  checkedItems,
  setCheckedItems,
  openHtmlModal,
  openPlaceholderModal,
  handleRunBashCommand,
  enableHtmlPopout,
  slideHeaderMarginTopOverride,
  index,
  repositoryInfo,
}: IndustryMarkdownComponentsProps) => {
  // Determine if we're in dark mode by checking if background is dark
  // Convert hex to RGB and calculate luminance
  const getLuminance = (hex: string): number => {
    const rgb = hex.replace('#', '').match(/.{2}/g);
    if (!rgb) return 1; // Default to light if parsing fails
    const [r, g, b] = rgb.map(x => parseInt(x, 16) / 255);
    // Use relative luminance formula
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const darkMode = getLuminance(theme.colors.background) < 0.5;

  // Header styles with override support
  const headerStyles = {} as React.CSSProperties;
  if (index === 0 && slideHeaderMarginTopOverride) {
    headerStyles.marginTop = `${slideHeaderMarginTopOverride}px`;
  }

  return {
    // Headings using industryTheme
    h1: ({ children, ...props }: any) => (
      <h1
        style={{
          color: theme.colors.text,
          fontSize: theme.fontSizes[5],
          lineHeight: theme.lineHeights.heading,
          fontWeight: theme.fontWeights.bold,
          marginBottom: theme.space[4],
          fontFamily: theme.fonts.heading,
          ...headerStyles,
        }}
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: any) => (
      <h2
        style={{
          color: theme.colors.text,
          fontSize: theme.fontSizes[4],
          lineHeight: theme.lineHeights.heading,
          fontWeight: theme.fontWeights.bold,
          marginTop: theme.space[4],
          marginBottom: theme.space[3],
          fontFamily: theme.fonts.heading,
          ...headerStyles,
        }}
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: any) => (
      <h3
        style={{
          color: theme.colors.text,
          fontSize: theme.fontSizes[3],
          lineHeight: theme.lineHeights.heading,
          fontWeight: theme.fontWeights.semibold,
          marginTop: theme.space[4],
          marginBottom: theme.space[3],
          fontFamily: theme.fonts.heading,
        }}
        {...props}
      >
        {children}
      </h3>
    ),

    // Paragraphs
    p: ({ children, ...props }: any) => (
      <p
        style={{
          color: theme.colors.text,
          fontSize: theme.fontSizes[2],
          lineHeight: theme.lineHeights.body,
          marginBottom: theme.space[3],
          fontFamily: theme.fonts.body,
        }}
        {...props}
      >
        {children}
      </p>
    ),

    // Lists
    ul: ({ children, ...props }: any) => (
      <ul
        style={{
          color: theme.colors.text,
          fontSize: theme.fontSizes[2],
          lineHeight: theme.lineHeights.body,
          marginBottom: theme.space[3],
          paddingLeft: theme.space[5],
          listStyleType: 'disc',
          fontFamily: theme.fonts.body,
        }}
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol
        style={{
          color: theme.colors.text,
          fontSize: theme.fontSizes[2],
          lineHeight: theme.lineHeights.body,
          marginBottom: theme.space[3],
          paddingLeft: theme.space[5],
          listStyleType: 'decimal',
          fontFamily: theme.fonts.body,
        }}
        {...props}
      >
        {children}
      </ol>
    ),
    li: ({ children, ...props }: any) => {
      // Check if this is a task list item
      const isTaskListItem =
        Array.isArray(children) &&
        children.length > 0 &&
        React.isValidElement(children[0]) &&
        (children[0] as any)?.props?.type === 'checkbox';

      if (isTaskListItem) {
        const checkbox = children[0];
        const remainingChildren = children.slice(1);
        const labelContent: React.ReactNode[] = [];
        const nestedListElements: React.ReactNode[] = [];

        React.Children.forEach(remainingChildren, child => {
          if (React.isValidElement(child) && (child.type === 'ul' || child.type === 'ol')) {
            nestedListElements.push(child);
          } else {
            labelContent.push(child);
          }
        });

        const checked = (checkbox as any)?.props?.checked || false;
        const lineNumber =
          (props as any).sourcePosition?.start?.line ||
          (props as any).node?.position?.start?.line ||
          1;

        const id = `${slideIdPrefix}-checkbox-${lineNumber}`;
        const isChecked = checkedItems[id] ?? checked;

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          e.stopPropagation();
          const newChecked = e.target.checked;
          setCheckedItems(prev => ({
            ...prev,
            [id]: newChecked,
          }));
          onCheckboxChange?.(slideIndex, lineNumber, newChecked);
        };

        return (
          <li
            style={{
              listStyle: 'none',
              marginLeft: `-${theme.space[5]}px`,
              marginBottom: theme.space[3], // Increased spacing for task items
              paddingTop: theme.space[1], // Add padding for breathing room
              color: theme.colors.text,
              fontSize: theme.fontSizes[2],
            }}
            {...props}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleChange}
                onClick={e => e.stopPropagation()}
                style={{
                  marginRight: theme.space[2],
                  marginTop: theme.space[1],
                  width: '16px',
                  height: '16px',
                  cursor: 'pointer',
                }}
                id={id}
              />
              <label
                htmlFor={id}
                style={{
                  flex: 1,
                  cursor: 'pointer',
                  textDecoration: isChecked ? 'line-through' : 'none',
                  opacity: isChecked ? 0.6 : 1,
                  lineHeight: theme.lineHeights.relaxed, // More relaxed line height for readability
                }}
              >
                {labelContent.length > 0 ? labelContent : null}
              </label>
            </div>
            {nestedListElements.length > 0 ? nestedListElements : null}
          </li>
        );
      }

      // Regular list item
      return (
        <li
          style={{
            marginBottom: theme.space[2], // Increased from space[1] (4px) to space[2] (8px)
            paddingTop: theme.space[1], // Add small top padding for breathing room
            color: theme.colors.text,
            lineHeight: theme.lineHeights.relaxed, // Use relaxed line height (1.75) for better readability
          }}
          {...props}
        >
          {children}
        </li>
      );
    },

    // Tables
    table: ({ children, ...props }: any) => (
      <div
        style={{
          overflowX: 'auto',
          marginBottom: theme.space[4],
          borderRadius: theme.radii[2],
          border: `1px solid ${theme.colors.border}`,
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: theme.fontSizes[1],
            fontFamily: theme.fonts.body,
          }}
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: any) => (
      <thead
        style={{
          backgroundColor: theme.colors.backgroundSecondary,
        }}
        {...props}
      >
        {children}
      </thead>
    ),
    th: ({ children, ...props }: any) => (
      <th
        style={{
          padding: theme.space[3],
          textAlign: 'left',
          fontWeight: theme.fontWeights.semibold,
          borderBottom: `2px solid ${theme.colors.border}`,
          color: theme.colors.text,
        }}
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }: any) => (
      <td
        style={{
          padding: theme.space[3],
          borderBottom: `1px solid ${theme.colors.border}`,
          color: theme.colors.text,
        }}
        {...props}
      >
        {children}
      </td>
    ),

    // Links
    a: ({ children, href, ...props }: any) => (
      <LinkWithLoadingIndicator
        href={href}
        linkColor={theme.colors.primary}
        onLinkClick={onLinkClick}
        {...props}
      >
        {children}
      </LinkWithLoadingIndicator>
    ),

    // Images
    img: ({ src, alt, ...props }: any) => (
      <OptimizedMarkdownImage
        src={src}
        alt={alt}
        repositoryInfo={repositoryInfo}
        theme={theme}
        {...props}
      />
    ),

    // Picture elements
    picture: ({ children, ...props }: any) => <picture {...props}>{children}</picture>,

    // Source elements
    source: ({ srcset, srcSet, ...props }: any) => {
      // Handle both srcset and srcSet props (React might pass either)
      const srcsetValue = srcset || srcSet;

      const transformedSrcset = useMemo(() => {
        if (!srcsetValue || !repositoryInfo) return srcsetValue;

        return srcsetValue
          .split(',')
          .map((src: string) => {
            const trimmed = src.trim();
            const parts = trimmed.split(/\s+/);
            const url = parts[0];
            const descriptors = parts.slice(1).join(' ');

            const transformedUrl = transformImageUrl(url, repositoryInfo);
            return descriptors ? `${transformedUrl} ${descriptors}` : transformedUrl;
          })
          .join(', ');
      }, [srcsetValue, repositoryInfo]);

      return <source srcSet={transformedSrcset} {...props} />;
    },

    // Code blocks and inline code
    code: ({ node, className, children, ...props }: any) => {
      const hasLanguageClass =
        className && (className.includes('language-') || className.includes('hljs'));
      const codeString = extractTextFromChildren(children);
      const matchLang = /language-(\w+)/.exec(className || '');
      const language = matchLang ? matchLang[1] : null;
      const [copied, setCopied] = useState(false);

      let isInline: boolean;
      let isCodeBlock: boolean;

      // Check if this is a multi-line code block (with newlines)
      const hasNewlines = codeString.includes('\n');

      if (!className && !hasNewlines) {
        // No class and no newlines = inline code
        isInline = true;
        isCodeBlock = false;
      } else if (hasNewlines) {
        // Has newlines = definitely a code block
        isInline = false;
        isCodeBlock = true;
      } else if (language === 'text') {
        isInline = true;
        isCodeBlock = false;
      } else {
        isCodeBlock = hasLanguageClass || codeString.length > 50;
        const isInsideParagraph =
          node?.parent?.tagName === 'p' || node?.parent?.parent?.tagName === 'p';
        isInline = !isCodeBlock || isInsideParagraph;
      }

      if (!isInline) {
        const language = matchLang ? matchLang[1] : 'text';
        const isExecutable =
          (language === 'bash' || language === 'sh' || language === 'shell') &&
          handleRunBashCommand;
        const isHtml = (language === 'html' || language === 'htm') && enableHtmlPopout;
        const isPrompt = language === 'prompt';

        const placeholderRegex = /\{\{([^}]+)\}\}/g;
        const placeholders = isPrompt
          ? [...codeString.matchAll(placeholderRegex)].map(match => match[1].trim())
          : [];
        const hasPlaceholders = placeholders.length > 0;
        const bashCommands = isExecutable ? parseBashCommands(codeString) : [];

        const containerStyle = isPrompt
          ? {
              position: 'relative' as const,
              margin: `${theme.space[4]}px 0`,
              backgroundColor: darkMode ? theme.colors.backgroundTertiary : theme.colors.highlight,
              border: `2px solid ${theme.colors.accent}`,
              borderRadius: theme.radii[2],
              overflow: 'visible',
              boxShadow: theme.shadows[2],
            }
          : {
              position: 'relative' as const,
              margin: `${theme.space[4]}px 0`,
              backgroundColor: theme.colors.backgroundSecondary,
              borderRadius: theme.radii[2],
              overflow: 'hidden',
              border: `1px solid ${theme.colors.border}`,
            };

        const headerStyle = isPrompt
          ? {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: `${theme.space[3]}px ${theme.space[4]}px`,
              backgroundColor: theme.colors.muted,
              borderBottom: `2px solid ${theme.colors.accent}`,
              fontSize: theme.fontSizes[0],
              color: theme.colors.accent,
            }
          : {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: `${theme.space[2]}px ${theme.space[3]}px`,
              backgroundColor: theme.colors.backgroundTertiary,
              borderBottom: `1px solid ${theme.colors.border}`,
              fontSize: theme.fontSizes[0],
            };

        return (
          <div style={containerStyle}>
            <div style={headerStyle}>
              <span
                style={{
                  fontFamily: theme.fonts.monospace,
                  fontWeight: isPrompt ? theme.fontWeights.bold : theme.fontWeights.body,
                }}
              >
                {isPrompt ? '💡 Prompt' : language}
              </span>
              <div style={{ display: 'flex', gap: `${theme.space[2]}px` }}>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    navigator.clipboard
                      .writeText(codeString)
                      .then(() => {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      })
                      .catch(err => {
                        console.error('Failed to copy:', err);
                      });
                  }}
                  style={{
                    padding: `${theme.space[1]}px ${theme.space[2]}px`,
                    backgroundColor: copied
                      ? theme.colors.success + '22'
                      : darkMode
                        ? theme.colors.backgroundTertiary
                        : theme.colors.backgroundSecondary,
                    color: copied ? theme.colors.success : theme.colors.textSecondary,
                    border: `1px solid ${copied ? theme.colors.success : theme.colors.border}`,
                    borderRadius: theme.radii[1],
                    fontSize: theme.fontSizes[0],
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: `${theme.space[1]}px`,
                    transition: 'all 0.15s ease-in-out',
                  }}
                  title={copied ? 'Copied!' : 'Copy code to clipboard'}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>

                {isExecutable && (
                  <IndustryBashCommandDropdown
                    commands={bashCommands}
                    allCommands={codeString.trim()}
                    onRunCommand={async (command: string) => {
                      try {
                        await handleRunBashCommand(command, {
                          id: `${slideIdPrefix}-code-${Date.now()}`,
                          showInTerminal: true,
                        });
                      } catch (error) {
                        console.error('Error running bash command:', error);
                      }
                    }}
                    slideIdPrefix={slideIdPrefix}
                    theme={theme}
                  />
                )}

                {isHtml && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      openHtmlModal(codeString);
                    }}
                    style={{
                      padding: `${theme.space[1]}px ${theme.space[2]}px`,
                      backgroundColor: theme.colors.primary,
                      color: 'white',
                      border: 'none',
                      borderRadius: theme.radii[1],
                      fontSize: theme.fontSizes[0],
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: `${theme.space[1]}px`,
                    }}
                    title="Render HTML in modal"
                  >
                    <Monitor size={14} />
                    Render HTML
                  </button>
                )}

                {isPrompt && openPlaceholderModal && hasPlaceholders && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      openPlaceholderModal(placeholders, codeString);
                    }}
                    style={{
                      padding: `${theme.space[1]}px ${theme.space[2]}px`,
                      backgroundColor: theme.colors.accent,
                      color: 'white',
                      border: 'none',
                      borderRadius: theme.radii[1],
                      fontSize: theme.fontSizes[0],
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: `${theme.space[1]}px`,
                    }}
                    title="Fill placeholders and copy"
                  >
                    <FileText size={14} />
                    Fill & Copy ({placeholders.length})
                  </button>
                )}
              </div>
            </div>

            {isPrompt ? (
              <div
                style={{
                  margin: 0,
                  padding: theme.space[5],
                  backgroundColor: 'transparent',
                  fontSize: theme.fontSizes[1],
                  lineHeight: theme.lineHeights.body,
                  fontFamily: theme.fonts.body,
                  overflow: 'auto',
                  color: theme.colors.text,
                }}
              >
                {codeString.split(/(\{\{[^}]+\}\})/).map((part, index) => {
                  if (part.match(/^\{\{[^}]+\}\}$/)) {
                    return (
                      <span
                        key={index}
                        style={{
                          backgroundColor: theme.colors.highlight,
                          color: theme.colors.primary,
                          padding: `${theme.space[0]}px ${theme.space[1]}px`,
                          borderRadius: theme.radii[1],
                          fontWeight: theme.fontWeights.semibold,
                          fontFamily: theme.fonts.monospace,
                          fontSize: theme.fontSizes[1],
                        }}
                      >
                        {part}
                      </span>
                    );
                  }
                  return part;
                })}
              </div>
            ) : (
              <pre
                style={{
                  margin: 0,
                  padding: theme.space[4],
                  backgroundColor: 'transparent',
                  overflow: 'auto',
                  fontSize: theme.fontSizes[1],
                  lineHeight: 1.2,
                  fontFamily: theme.fonts.monospace,
                }}
              >
                <code
                  className={className}
                  style={{
                    lineHeight: 'inherit',
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                    display: 'block',
                  }}
                  {...props}
                >
                  {children}
                </code>
              </pre>
            )}
          </div>
        );
      }

      // Inline code
      return (
        <code
          style={
            {
              backgroundColor: theme.colors.backgroundSecondary,
              color: theme.colors.text,
              padding: `${theme.space[1]}px ${theme.space[2]}px`,
              borderRadius: theme.radii[1],
              fontSize: '0.875em',
              fontFamily: theme.fonts.monospace,
              border: `1px solid ${theme.colors.border}`,
              // Ensure text color overrides any highlight.js styles
              '--text-color': theme.colors.text,
            } as React.CSSProperties
          }
          className={`inline-code ${className || ''}`}
          {...props}
        >
          {children}
        </code>
      );
    },
  };
};
