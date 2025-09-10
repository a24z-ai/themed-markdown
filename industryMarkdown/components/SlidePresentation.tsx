import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Menu, X } from 'lucide-react';
import React, { useState, useCallback, useRef, useEffect } from 'react';

import { useTheme } from '../../industryTheme';
import { BashCommandOptions, BashCommandResult } from '@a24z/markdown-utils';
import { extractAllSlideTitles } from '../utils/extractSlideTitles';

import { IndustryMarkdownSlide } from './IndustryMarkdownSlide';

export interface SlidePresentationProps {
  // Core content
  slides: string[];
  initialSlide?: number;

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
  fontSizeScale?: number;
}

export const SlidePresentation: React.FC<SlidePresentationProps> = ({
  slides,
  initialSlide = 0,
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
  fontSizeScale,
}) => {
  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTOC, setShowTOC] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  // Extract slide titles for TOC
  const slideTitles = extractAllSlideTitles(slides);

  // Handle slide navigation
  const navigateToSlide = useCallback(
    (slideIndex: number) => {
      if (slideIndex >= 0 && slideIndex < slides.length) {
        setCurrentSlide(slideIndex);
        onSlideChange?.(slideIndex);
        // Close TOC when navigating to a slide
        setShowTOC(false);
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

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't interfere with typing in inputs
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          // Support both with and without modifier keys
          event.preventDefault();
          goToPreviousSlide();
          break;
        case 'ArrowRight':
          // Support both with and without modifier keys
          event.preventDefault();
          goToNextSlide();
          break;
        case ' ': // Spacebar
          // Spacebar goes to next slide (common in presentations)
          event.preventDefault();
          goToNextSlide();
          break;
        case 'Enter':
          // Enter also goes to next slide
          event.preventDefault();
          goToNextSlide();
          break;
        case 'Backspace':
          // Backspace goes to previous slide
          event.preventDefault();
          goToPreviousSlide();
          break;
        case 'Home':
          // Home goes to first slide
          event.preventDefault();
          navigateToSlide(0);
          break;
        case 'End':
          // End goes to last slide
          event.preventDefault();
          navigateToSlide(slides.length - 1);
          break;
        case 'f':
        case 'F':
          // F key toggles fullscreen
          if (!event.ctrlKey && !event.metaKey && !event.altKey) {
            event.preventDefault();
            toggleFullscreen();
          }
          break;
        case 'Escape':
          // Escape closes TOC if open
          if (showTOC) {
            event.preventDefault();
            setShowTOC(false);
          }
          break;
        case 't':
        case 'T':
          // T key toggles TOC
          if (!event.ctrlKey && !event.metaKey && !event.altKey) {
            event.preventDefault();
            setShowTOC(prev => !prev);
          }
          break;
      }
      
      // Number keys 1-9 jump to specific slides
      if (!event.ctrlKey && !event.metaKey && !event.altKey) {
        const num = parseInt(event.key);
        if (num >= 1 && num <= 9 && num <= slides.length) {
          event.preventDefault();
          navigateToSlide(num - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPreviousSlide, goToNextSlide, navigateToSlide, slides.length, toggleFullscreen, showTOC]);

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
          {/* Left: TOC button and Previous button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.space[2],
            }}
          >
            {/* Table of Contents button */}
            <button
              onClick={() => setShowTOC(prev => !prev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                backgroundColor: showTOC ? theme.colors.primary : 'transparent',
                border: `1px solid ${showTOC ? theme.colors.primary : theme.colors.border}`,
                borderRadius: theme.radii[1],
                color: showTOC ? theme.colors.background : theme.colors.text,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={e => {
                if (!showTOC) {
                  e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                }
              }}
              onMouseOut={e => {
                if (!showTOC) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
              title={showTOC ? 'Close table of contents (Esc)' : 'Open table of contents (T)'}
            >
              {showTOC ? <X size={18} /> : <Menu size={18} />}
            </button>
            
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
          </div>

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

      {/* Main Content Area with TOC Sidebar */}
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
        }}
      >
        {/* Table of Contents Sidebar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '300px',
            backgroundColor: theme.colors.backgroundSecondary,
            borderRight: `1px solid ${theme.colors.border}`,
            transform: showTOC ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease',
            zIndex: 10,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {/* TOC Header */}
          <div
            style={{
              padding: theme.space[3],
              borderBottom: `1px solid ${theme.colors.border}`,
              backgroundColor: theme.colors.background,
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: theme.fontSizes[3],
                fontFamily: theme.fonts.heading,
                color: theme.colors.text,
                fontWeight: 600,
              }}
            >
              Table of Contents
            </h3>
            <p
              style={{
                margin: `${theme.space[1]}px 0 0 0`,
                fontSize: theme.fontSizes[0],
                color: theme.colors.textSecondary,
                fontFamily: theme.fonts.body,
              }}
            >
              {slides.length} {slides.length === 1 ? 'slide' : 'slides'}
            </p>
          </div>
          
          {/* TOC Items */}
          <div style={{ padding: theme.space[2] }}>
            {slideTitles.map((title, index) => (
              <button
                key={index}
                onClick={() => navigateToSlide(index)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: `${theme.space[2]}px ${theme.space[3]}px`,
                  marginBottom: theme.space[1],
                  backgroundColor: currentSlide === index ? theme.colors.primary : 'transparent',
                  border: 'none',
                  borderRadius: theme.radii[1],
                  color: currentSlide === index ? theme.colors.background : theme.colors.text,
                  fontSize: theme.fontSizes[1],
                  fontFamily: theme.fonts.body,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
                onMouseOver={e => {
                  if (currentSlide !== index) {
                    e.currentTarget.style.backgroundColor = theme.colors.backgroundHover;
                  }
                }}
                onMouseOut={e => {
                  if (currentSlide !== index) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.space[2] }}>
                  <span
                    style={{
                      display: 'inline-block',
                      minWidth: '24px',
                      fontSize: theme.fontSizes[0],
                      fontFamily: theme.fonts.monospace,
                      opacity: 0.6,
                    }}
                  >
                    {index + 1}.
                  </span>
                  <span
                    style={{
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {title}
                  </span>
                </div>
                {currentSlide === index && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '3px',
                      height: '60%',
                      backgroundColor: currentSlide === index ? theme.colors.background : theme.colors.primary,
                      borderRadius: '0 2px 2px 0',
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Overlay to close TOC when clicking outside */}
        {showTOC && (
          <div
            onClick={() => setShowTOC(false)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              zIndex: 9,
              cursor: 'pointer',
            }}
          />
        )}
        
        {/* Slide Content */}
        <div
          style={{
            flex: 1,
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
            fontSizeScale={fontSizeScale}
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
