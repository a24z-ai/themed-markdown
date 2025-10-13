import { Theme } from '@a24z/industry-theme';
import { BashCommandOptions, BashCommandResult } from '@a24z/markdown-utils';
import { AnimatedResizableLayout } from '@a24z/panels';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { Save, Edit, Eye } from 'lucide-react';
import React, { useState, useCallback, useRef, useEffect } from 'react';

import { extractAllSlideTitles } from '../utils/extractSlideTitles';

import { IndustryMarkdownSlide } from './IndustryMarkdownSlide';
import { SlideNavigationHeader } from './SlideNavigationHeader';
import { SlideSearchBar, SearchResult } from './SlideSearchBar';

export interface EditableSlidePresentationBookProps {
  slides: string[];
  initialSlide?: number;
  onSlideChange?: (slideIndex: number) => void;
  onCheckboxChange?: (slideIndex: number, lineNumber: number, checked: boolean) => void;
  onSave?: (slides: string[]) => Promise<void>;
  onContentChange?: (slides: string[]) => void;
  showNavigation?: boolean;
  showSlideCounter?: boolean;
  showFullscreenButton?: boolean;
  containerHeight?: string;
  viewMode?: 'single' | 'book';
  slideIdPrefix?: string;
  enableHtmlPopout?: boolean;
  enableKeyboardScrolling?: boolean;
  onLinkClick?: (href: string, event?: MouseEvent) => void;
  handleRunBashCommand?: (
    command: string,
    options?: BashCommandOptions,
  ) => Promise<BashCommandResult>;
  handlePromptCopy?: (filledPrompt: string) => void;
  fontSizeScale?: number;
  editorFontSize?: number;
  editorTheme?: 'light' | 'dark' | 'auto';
  autoSaveDelay?: number;
  theme: Theme;
}

export const EditableSlidePresentationBook: React.FC<EditableSlidePresentationBookProps> = ({
  slides,
  initialSlide = 0,
  onSlideChange,
  onCheckboxChange,
  onSave,
  onContentChange,
  showNavigation = true,
  showSlideCounter = true,
  showFullscreenButton = false,
  containerHeight = '100%',
  viewMode = 'book',
  slideIdPrefix = 'slide',
  enableHtmlPopout = true,
  enableKeyboardScrolling = true,
  onLinkClick,
  handleRunBashCommand,
  handlePromptCopy,
  fontSizeScale,
  editorFontSize = 14,
  editorTheme = 'auto',
  autoSaveDelay = 1000,
  theme,
}) => {
  const adjustedInitialSlide =
    viewMode === 'book' ? Math.floor(initialSlide / 2) * 2 : initialSlide;
  const [currentSlide, setCurrentSlide] = useState(adjustedInitialSlide);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTOC, setShowTOC] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentSearchResult, setCurrentSearchResult] = useState(-1);
  const [searchStartSlide, setSearchStartSlide] = useState(0);
  const [collapsedSide, setCollapsedSide] = useState<'left' | 'right' | null>(null);
  const [lastInteractedSide, setLastInteractedSide] = useState<'left' | 'right'>('left');
  const [editingSlides, setEditingSlides] = useState<string[]>([...slides]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingSide, setEditingSide] = useState<'left' | 'right' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const slideTitles = extractAllSlideTitles(editingSlides);
  const stepSize = viewMode === 'book' ? 2 : 1;

  const getEditorTheme = useCallback(() => {
    if (editorTheme === 'auto') {
      return theme.colors.text === '#ffffff' || theme.colors.text === '#fff' ? 'dark' : 'light';
    }
    return editorTheme;
  }, [editorTheme, theme.colors.text]);

  useEffect(() => {
    setEditingSlides([...slides]);
    setHasUnsavedChanges(false);
  }, [slides]);

  useEffect(() => {
    if (hasUnsavedChanges && autoSaveDelay && onSave) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        handleSave();
      }, autoSaveDelay);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [editingSlides, hasUnsavedChanges, autoSaveDelay]);

  const handleEditorChange = useCallback(
    (value: string, slideIndex: number) => {
      const newSlides = [...editingSlides];
      newSlides[slideIndex] = value;
      setEditingSlides(newSlides);
      setHasUnsavedChanges(true);

      if (onContentChange) {
        onContentChange(newSlides);
      }
    },
    [editingSlides, onContentChange],
  );

  const handleSave = useCallback(async () => {
    if (!onSave) return;

    setIsSaving(true);
    try {
      await onSave(editingSlides);
      setHasUnsavedChanges(false);
      // Exit edit mode after successful save
      setEditingSide(null);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  }, [editingSlides, onSave]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (hasUnsavedChanges) {
          handleSave();
        }
      }
    },
    [hasUnsavedChanges, handleSave],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const navigateToSlide = useCallback(
    (slideIndex: number) => {
      const targetSlide = viewMode === 'book' ? Math.floor(slideIndex / 2) * 2 : slideIndex;

      if (targetSlide >= 0 && targetSlide < editingSlides.length) {
        setCurrentSlide(targetSlide);
        onSlideChange?.(targetSlide);
        setShowTOC(false);
      }
    },
    [editingSlides.length, onSlideChange, viewMode],
  );

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setCurrentSearchResult(-1);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    editingSlides.forEach((slide, slideIndex) => {
      const lines = slide.split('\n');
      let matchCount = 0;
      lines.forEach(line => {
        if (line.toLowerCase().includes(query)) {
          matchCount++;
        }
      });
      if (matchCount > 0) {
        results.push({
          slideIndex,
          count: matchCount,
        });
      }
    });

    setSearchResults(results);
    if (results.length > 0) {
      setCurrentSearchResult(0);
    } else {
      setCurrentSearchResult(-1);
    }
  }, [searchQuery, editingSlides]);

  const navigatePrevious = useCallback(() => {
    navigateToSlide(currentSlide - stepSize);
  }, [currentSlide, navigateToSlide, stepSize]);

  const navigateNext = useCallback(() => {
    navigateToSlide(currentSlide + stepSize);
  }, [currentSlide, navigateToSlide, stepSize]);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleArrowKeys = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        navigatePrevious();
      } else if (e.key === 'ArrowRight') {
        navigateNext();
      } else if (e.key === 'Escape') {
        if (showSearch) {
          setShowSearch(false);
          setSearchQuery('');
        } else if (showTOC) {
          setShowTOC(false);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setShowSearch(!showSearch);
        if (!showSearch) {
          setSearchStartSlide(currentSlide);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        setShowTOC(!showTOC);
      }
    },
    [navigatePrevious, navigateNext, showSearch, showTOC, currentSlide],
  );

  const renderEditor = (slideIndex: number) => (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.colors.backgroundSecondary,
        position: 'relative',
      }}
    >
      {/* Stop Editing Button */}
      <button
        style={{
          position: 'absolute',
          top: theme.space[3],
          right: theme.space[3],
          display: 'flex',
          alignItems: 'center',
          gap: theme.space[1],
          padding: `${theme.space[1]} ${theme.space[2]}`,
          backgroundColor: theme.colors.muted,
          color: theme.colors.text,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.radii[1],
          fontSize: theme.fontSizes[1],
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          zIndex: 10,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = theme.colors.background;
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = theme.colors.muted;
          e.currentTarget.style.transform = 'translateY(0)';
        }}
        onClick={() => setEditingSide(null)}
        title="Stop editing"
      >
        <Eye size={14} />
        Stop
      </button>
      <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        <CodeEditor
          value={editingSlides[slideIndex]}
          language="markdown"
          placeholder="Enter markdown here..."
          onChange={e => handleEditorChange(e.target.value, slideIndex)}
          padding={15}
          data-color-mode={getEditorTheme()}
          style={
            {
              fontSize: `${editorFontSize}px`,
              backgroundColor: theme.colors.backgroundSecondary,
              color: theme.colors.text,
              fontFamily:
                theme.fonts?.monospace ||
                'ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, Menlo, monospace',
              minHeight: '100%',
              // Additional theme-aware styles
              caretColor: theme.colors.primary,
              '::selection': {
                backgroundColor: theme.colors.primary,
                color: theme.colors.background,
              },
            } as React.CSSProperties
          }
        />
        <style>{`
          /* Override prettylights syntax highlighting colors */
          [data-color-mode],
          [data-color-mode="dark"],
          [data-color-mode="light"],
          .w-tc-editor {
            --color-prettylights-syntax-comment: ${theme.colors.textSecondary || theme.colors.muted};
            --color-prettylights-syntax-constant: ${theme.colors.accent};
            --color-prettylights-syntax-entity: ${theme.colors.primary};
            --color-prettylights-syntax-storage-modifier-import: ${theme.colors.text};
            --color-prettylights-syntax-entity-tag: ${theme.colors.primary};
            --color-prettylights-syntax-keyword: ${theme.colors.primary};
            --color-prettylights-syntax-string: ${theme.colors.success || theme.colors.accent};
            --color-prettylights-syntax-variable: ${theme.colors.warning || theme.colors.accent};
            --color-prettylights-syntax-markup-heading: ${theme.colors.primary} !important;
            --color-prettylights-syntax-markup-list: ${theme.colors.accent};
            --color-prettylights-syntax-markup-bold: ${theme.colors.primary} !important;
            --color-prettylights-syntax-markup-italic: ${theme.colors.accent};
            --color-prettylights-syntax-markup-quote: ${theme.colors.textSecondary || theme.colors.muted};
            --color-prettylights-syntax-markup-link: ${theme.colors.accent};
            --color-prettylights-syntax-markup-link-text: ${theme.colors.accent};
            --color-prettylights-syntax-markup-code: ${theme.colors.warning || theme.colors.accent};
          }

          /* Specific markdown syntax highlighting */
          .w-tc-editor .token.title {
            color: ${theme.colors.primary} !important;
            font-weight: bold;
          }
          .w-tc-editor .token.bold {
            color: ${theme.colors.primary} !important;
            font-weight: bold;
          }
          .w-tc-editor .token.italic {
            color: ${theme.colors.accent} !important;
            font-style: italic;
          }
          .w-tc-editor .token.code {
            color: ${theme.colors.warning || theme.colors.accent} !important;
          }
          .w-tc-editor .token.url,
          .w-tc-editor .token.link {
            color: ${theme.colors.accent} !important;
          }
          .w-tc-editor .token.list {
            color: ${theme.colors.accent} !important;
          }
          .w-tc-editor .token.quote {
            color: ${theme.colors.textSecondary || theme.colors.muted} !important;
          }

          /* Custom scrollbar styling for the editor */
          .w-tc-editor::-webkit-scrollbar {
            width: 12px;
            height: 12px;
          }
          .w-tc-editor::-webkit-scrollbar-track {
            background: ${theme.colors.muted};
            border-radius: ${theme.radii[1]};
          }
          .w-tc-editor::-webkit-scrollbar-thumb {
            background: ${theme.colors.border};
            border-radius: ${theme.radii[1]};
            border: 2px solid ${theme.colors.muted};
          }
          .w-tc-editor::-webkit-scrollbar-thumb:hover {
            background: ${theme.colors.textSecondary || theme.colors.text};
          }

          /* Editor textarea styling */
          .w-tc-editor textarea {
            caret-color: ${theme.colors.primary} !important;
          }
          .w-tc-editor textarea::selection {
            background-color: ${theme.colors.primary}44 !important;
          }

          /* Line numbers styling if visible */
          .w-tc-editor .w-tc-line-number {
            color: ${theme.colors.muted} !important;
            border-right: 1px solid ${theme.colors.border} !important;
          }
        `}</style>
      </div>
    </div>
  );

  const renderSlide = (slideIndex: number, side: 'left' | 'right') => {
    const isBeingEdited =
      (side === 'left' && editingSide === 'left' && slideIndex === currentSlide) ||
      (side === 'right' && editingSide === 'right' && slideIndex === currentSlide + 1);

    return (
      <div style={{ position: 'relative', height: '100%', width: '100%' }}>
        <IndustryMarkdownSlide
          content={editingSlides[slideIndex]}
          slideIndex={slideIndex}
          slideIdPrefix={`${slideIdPrefix}-${slideIndex}`}
          onCheckboxChange={
            onCheckboxChange
              ? (slideIdx: number, lineNumber: number, checked: boolean) =>
                  onCheckboxChange(slideIdx, lineNumber, checked)
              : undefined
          }
          searchQuery={searchQuery}
          enableHtmlPopout={enableHtmlPopout}
          enableKeyboardScrolling={enableKeyboardScrolling}
          onLinkClick={onLinkClick}
          handleRunBashCommand={handleRunBashCommand}
          handlePromptCopy={handlePromptCopy}
          fontSizeScale={fontSizeScale}
        />
        {/* Edit button overlay (when not editing) */}
        {editingSide === null && (
          <button
            style={{
              position: 'absolute',
              top: theme.space[3],
              right: theme.space[3],
              display: 'flex',
              alignItems: 'center',
              gap: theme.space[1],
              padding: `${theme.space[1]} ${theme.space[2]}`,
              backgroundColor: theme.colors.background,
              color: theme.colors.text,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radii[1],
              fontSize: theme.fontSizes[1],
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              opacity: 0.8,
              transition: 'opacity 0.2s ease',
              zIndex: 5,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '0.8';
            }}
            onClick={() => setEditingSide(side)}
            title={`Edit slide ${slideIndex + 1}`}
          >
            <Edit size={14} />
            Edit
          </button>
        )}
        {/* Save button overlay (when this slide is being edited) */}
        {isBeingEdited && hasUnsavedChanges && (
          <button
            style={{
              position: 'absolute',
              top: theme.space[3],
              right: theme.space[3],
              display: 'flex',
              alignItems: 'center',
              gap: theme.space[1],
              padding: `${theme.space[1]} ${theme.space[2]}`,
              backgroundColor: theme.colors.warning || theme.colors.accent,
              color: theme.colors.background,
              border: 'none',
              borderRadius: theme.radii[1],
              fontSize: theme.fontSizes[1],
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              zIndex: 5,
            }}
            onClick={handleSave}
            title="Save changes (⌘S)"
          >
            <Save size={14} />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        )}
      </div>
    );
  };

  const renderBookView = () => {
    const leftSlideIndex = currentSlide;
    const rightSlideIndex = currentSlide + 1;
    const hasRightSlide = rightSlideIndex < editingSlides.length;

    // Handle collapsed states
    if (collapsedSide === 'left') {
      if (editingSide === 'right' && hasRightSlide) {
        return renderEditor(rightSlideIndex);
      }
      return renderSlide(hasRightSlide ? rightSlideIndex : leftSlideIndex, 'right');
    } else if (collapsedSide === 'right') {
      if (editingSide === 'left') {
        return renderEditor(leftSlideIndex);
      }
      return renderSlide(leftSlideIndex, 'left');
    }

    // Determine what to show in each panel based on editing state
    let leftPanel, rightPanel;

    if (editingSide === 'left') {
      // Editing left slide: keep left slide visible, editor on right
      leftPanel = renderSlide(leftSlideIndex, 'left');
      rightPanel = renderEditor(leftSlideIndex);
    } else if (editingSide === 'right' && hasRightSlide) {
      // Editing right slide: editor on left, keep right slide visible
      leftPanel = renderEditor(rightSlideIndex);
      rightPanel = renderSlide(rightSlideIndex, 'right');
    } else {
      // View mode: show both slides with edit buttons
      leftPanel = renderSlide(leftSlideIndex, 'left');
      rightPanel = hasRightSlide ? renderSlide(rightSlideIndex, 'right') : <div />;
    }

    return (
      <AnimatedResizableLayout
        key={`${editingSide}-${lastInteractedSide}-${collapsedSide}`}
        collapsed={collapsedSide !== null}
        collapsibleSide={lastInteractedSide}
        defaultSize={50}
        minSize={20}
        leftPanel={leftPanel}
        rightPanel={rightPanel}
        showCollapseButton={false}
      />
    );
  };

  const handleCollapseLeft = useCallback(() => {
    if (collapsedSide === 'left') {
      setCollapsedSide(null);
    } else {
      setCollapsedSide('left');
      setLastInteractedSide('right');
    }
  }, [collapsedSide]);

  const handleCollapseRight = useCallback(() => {
    if (collapsedSide === 'right') {
      setCollapsedSide(null);
    } else {
      setCollapsedSide('right');
      setLastInteractedSide('left');
    }
  }, [collapsedSide]);

  return (
    <div
      ref={containerRef}
      style={{
        height: containerHeight,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        position: 'relative',
      }}
      onKeyDown={handleArrowKeys}
      tabIndex={-1}
    >
      {showNavigation && (
        <>
          <SlideNavigationHeader
            currentSlide={currentSlide}
            totalSlides={editingSlides.length}
            showTOC={showTOC}
            isFullscreen={isFullscreen}
            showSlideCounter={showSlideCounter}
            showFullscreenButton={showFullscreenButton}
            theme={theme}
            viewMode={viewMode}
            collapseLeft={collapsedSide === 'left'}
            collapseRight={collapsedSide === 'right'}
            onPrevious={navigatePrevious}
            onNext={navigateNext}
            onToggleTOC={() => setShowTOC(!showTOC)}
            onToggleFullscreen={toggleFullscreen}
            onCollapseLeft={handleCollapseLeft}
            onCollapseRight={handleCollapseRight}
          />
        </>
      )}

      {showSearch && (
        <SlideSearchBar
          showSearch={showSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          currentSearchResult={currentSearchResult}
          searchStartSlide={searchStartSlide}
          slideTitles={slideTitles}
          theme={theme}
          onResultClick={(index, slideIndex) => {
            setCurrentSearchResult(index);
            navigateToSlide(slideIndex);
          }}
          onClose={() => {
            setShowSearch(false);
            setSearchQuery('');
            navigateToSlide(searchStartSlide);
          }}
          onClear={() => {
            setSearchQuery('');
            setSearchResults([]);
            setCurrentSearchResult(-1);
          }}
        />
      )}

      {showTOC && (
        <div
          style={{
            position: 'absolute',
            top: showNavigation ? '60px' : '0',
            left: 0,
            width: '300px',
            height: showNavigation ? 'calc(100% - 60px)' : '100%',
            backgroundColor: theme.colors.muted,
            borderRight: `1px solid ${theme.colors.border}`,
            overflowY: 'auto',
            zIndex: 10,
            padding: theme.space[3],
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          }}
        >
          <h3 style={{ marginBottom: theme.space[3], fontSize: theme.fontSizes[3] }}>
            Table of Contents
          </h3>
          {slideTitles.map((title, index) => (
            <div
              key={index}
              onClick={() => navigateToSlide(index)}
              style={{
                padding: `${theme.space[2]} ${theme.space[3]}`,
                cursor: 'pointer',
                backgroundColor:
                  currentSlide === index || (viewMode === 'book' && currentSlide === index - 1)
                    ? theme.colors.accent
                    : 'transparent',
                color:
                  currentSlide === index || (viewMode === 'book' && currentSlide === index - 1)
                    ? theme.colors.background
                    : theme.colors.text,
                borderRadius: theme.radii[1],
                marginBottom: theme.space[1],
                transition: 'background-color 0.2s',
              }}
            >
              <span style={{ marginRight: theme.space[2], opacity: 0.6 }}>{index + 1}.</span>
              {title}
            </div>
          ))}
        </div>
      )}

      <div style={{ flex: 1, overflow: 'hidden' }}>{renderBookView()}</div>
    </div>
  );
};
