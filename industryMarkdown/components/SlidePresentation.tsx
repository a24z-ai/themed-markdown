import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import React, { useState, useCallback, useRef, useEffect } from 'react';

import { Theme } from '../../industryTheme';
import { BashCommandOptions, BashCommandResult } from '../types/presentation';

import { IndustryMarkdownSlide } from './IndustryMarkdownSlide';

export interface SlidePresentationProps {
  // Core content
  slides: string[];
  initialSlide?: number;

  // Theme
  theme: Theme;

  // Event handlers
  onSlideChange?: (slideIndex: number) => void;
  onCheckboxChange?: (slideIndex: number, lineNumber: number, checked: boolean) => void;

  // Layout options
  showNavigation?: boolean;
  showSlideCounter?: boolean;
  showFullscreenButton?: boolean;
  containerHeight?: string;

  // IndustryMarkdownSlide props pass-through
  slideIdPrefix?: string;
  enableHtmlPopout?: boolean;
  enableKeyboardScrolling?: boolean;
  onLinkClick?: (href: string, event?: MouseEvent) => void;
  handleRunBashCommand?: (command: string, options?: BashCommandOptions) => Promise<BashCommandResult>;
  handlePromptCopy?: (filledPrompt: string) => void;
}

export const SlidePresentation: React.FC<SlidePresentationProps> = ({
  slides,
  initialSlide = 0,
  theme,
  onSlideChange,
  onCheckboxChange,
  showNavigation = true,
  showSlideCounter = true,
  showFullscreenButton = false,
  containerHeight = '100%',
  slideIdPrefix = 'slide',
  enableHtmlPopout = true,
  enableKeyboardScrolling = true,
  onLinkClick,
  handleRunBashCommand,
  handlePromptCopy,
}) => {
  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle slide navigation
  const navigateToSlide = useCallback(
    (slideIndex: number) => {
      if (slideIndex >= 0 && slideIndex < slides.length) {
        setCurrentSlide(slideIndex);
        onSlideChange?.(slideIndex);
      }
    },
    [slides.length, onSlideChange],
  );

  const goToPreviousSlide = useCallback(() => {
    navigateToSlide(currentSlide - 1);
  }, [currentSlide, navigateToSlide]);

  const goToNextSlide = useCallback(() => {
    navigateToSlide(currentSlide + 1);
  }, [currentSlide, navigateToSlide]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't interfere with typing in inputs
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            goToPreviousSlide();
          }
          break;
        case 'ArrowRight':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            goToNextSlide();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPreviousSlide, goToNextSlide]);

  // Handle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, [isFullscreen]);

  // Update state when slides change externally
  useEffect(() => {
    if (currentSlide >= slides.length && slides.length > 0) {
      setCurrentSlide(slides.length - 1);
    }
  }, [slides.length, currentSlide]);

  const navigationHeight = showNavigation ? '48px' : '0px';

  return (
    <div
      ref={containerRef}
      style={{
        height: containerHeight,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.colors.background,
        position: 'relative',
      }}
    >
      {/* Navigation Bar */}
      {showNavigation && (
        <div
          style={{
            height: navigationHeight,
            minHeight: navigationHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `0 ${theme.space[3]}px`,
            borderBottom: `1px solid ${theme.colors.border}`,
            backgroundColor: theme.colors.background,
            flexShrink: 0,
          }}
        >
          {/* Left: Previous button */}
          <button
            onClick={goToPreviousSlide}
            disabled={currentSlide === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.space[1],
              padding: `${theme.space[1]}px ${theme.space[2]}px`,
              backgroundColor: 'transparent',
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radii[1],
              color: currentSlide === 0 ? theme.colors.muted : theme.colors.text,
              cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
              fontSize: theme.fontSizes[1],
              fontFamily: theme.fonts.body,
              opacity: currentSlide === 0 ? 0.5 : 1,
              transition: 'all 0.2s ease',
            }}
            onMouseOver={e => {
              if (currentSlide !== 0) {
                e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
              }
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          {/* Center: Slide counter */}
          {showSlideCounter && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.space[2],
                color: theme.colors.textSecondary,
                fontSize: theme.fontSizes[1],
                fontFamily: theme.fonts.monospace,
              }}
            >
              <span style={{ fontWeight: 600 }}>Slide {currentSlide + 1}</span>
              <span style={{ opacity: 0.7 }}>of {slides.length}</span>

              {/* Quick navigation dropdown */}
              <select
                value={currentSlide}
                onChange={e => navigateToSlide(Number(e.target.value))}
                style={{
                  marginLeft: theme.space[2],
                  padding: `${theme.space[0]}px ${theme.space[1]}px`,
                  backgroundColor: theme.colors.backgroundSecondary,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.radii[0],
                  color: theme.colors.text,
                  fontSize: theme.fontSizes[0],
                  fontFamily: theme.fonts.monospace,
                  cursor: 'pointer',
                }}
              >
                {slides.map((_, index) => (
                  <option key={index} value={index}>
                    {index + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Right: Next button and fullscreen */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.space[2],
            }}
          >
            {showFullscreenButton && (
              <button
                onClick={toggleFullscreen}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.radii[1],
                  color: theme.colors.textSecondary,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                }}
                onMouseOut={e => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            )}

            <button
              onClick={goToNextSlide}
              disabled={currentSlide === slides.length - 1}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.space[1],
                padding: `${theme.space[1]}px ${theme.space[2]}px`,
                backgroundColor: 'transparent',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radii[1],
                color: currentSlide === slides.length - 1 ? theme.colors.muted : theme.colors.text,
                cursor: currentSlide === slides.length - 1 ? 'not-allowed' : 'pointer',
                fontSize: theme.fontSizes[1],
                fontFamily: theme.fonts.body,
                opacity: currentSlide === slides.length - 1 ? 0.5 : 1,
                transition: 'all 0.2s ease',
              }}
              onMouseOver={e => {
                if (currentSlide !== slides.length - 1) {
                  e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                }
              }}
              onMouseOut={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Slide Content */}
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {slides.length > 0 ? (
          <IndustryMarkdownSlide
            content={slides[currentSlide] || ''}
            slideIdPrefix={`${slideIdPrefix}-${currentSlide}`}
            slideIndex={currentSlide}
            isVisible={true}
            theme={theme}
            onCheckboxChange={onCheckboxChange}
            enableHtmlPopout={enableHtmlPopout}
            enableKeyboardScrolling={enableKeyboardScrolling}
            onLinkClick={onLinkClick}
            handleRunBashCommand={handleRunBashCommand}
            handlePromptCopy={handlePromptCopy}
          />
        ) : (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.colors.muted,
              fontSize: theme.fontSizes[2],
              fontFamily: theme.fonts.body,
            }}
          >
            No slides available
          </div>
        )}
      </div>

      {/* Progress bar */}
      {showNavigation && slides.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            backgroundColor: theme.colors.border,
            opacity: 0.3,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${((currentSlide + 1) / slides.length) * 100}%`,
              backgroundColor: theme.colors.primary,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      )}
    </div>
  );
};
