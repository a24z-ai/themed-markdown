import { Theme } from '@a24z/industry-theme';
import React, { useEffect, useRef } from 'react';

import { hasReactDOMSupport } from '../utils/platformDetection';
import { IndustryZoomableMermaidDiagram } from './IndustryZoomableMermaidDiagram';

// Lazy load ReactDOM only on web platforms
let ReactDOM: typeof import('react-dom') | null = null;
if (hasReactDOMSupport()) {
  try {
    ReactDOM = require('react-dom');
  } catch (error) {
    console.warn('ReactDOM is not available. Modal features will be disabled.');
  }
}

interface IndustryMermaidModalProps {
  isOpen: boolean;
  onClose: () => void;
  mermaidCode: string;
  theme: Theme;
}

export function IndustryMermaidModal({
  isOpen,
  onClose,
  mermaidCode,
  theme,
}: IndustryMermaidModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking directly on the backdrop, not its children
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  // Check if we're in a supported environment
  if (!ReactDOM || !hasReactDOMSupport()) {
    // Fallback for React Native or environments without DOM support
    return (
      <div
        style={{
          padding: theme.space[4],
          backgroundColor: theme.colors.background,
          border: `2px solid ${theme.colors.warning || theme.colors.primary}`,
          borderRadius: theme.radii[2],
          margin: theme.space[4],
        }}
      >
        <div
          style={{
            color: theme.colors.warning || theme.colors.text,
            fontFamily: theme.fonts.body,
            fontSize: theme.fontSizes[2],
            marginBottom: theme.space[2],
            fontWeight: theme.fontWeights.bold,
          }}
        >
          ⚠️ Mermaid diagrams are not supported in React Native
        </div>
        <div
          style={{
            color: theme.colors.textSecondary || theme.colors.text,
            fontFamily: theme.fonts.body,
            fontSize: theme.fontSizes[1],
            opacity: 0.8,
          }}
        >
          Mermaid diagrams require browser DOM APIs and are only available in web environments.
          Consider using a WebView component or alternative visualization library for React Native.
        </div>
      </div>
    );
  }

  const modalContent = (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',  // Darker backdrop overlay
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: theme.space[4],
      }}
    >
      <div
        ref={modalRef}
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          backgroundColor: theme.colors.background,  // Keep theme background
          borderRadius: theme.radii[3],
          padding: 0,  // No padding to maximize diagram space
          width: '95vw',
          height: '95vh',  // Use more screen space
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: theme.shadows[4],
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{
            position: 'absolute',
            top: theme.space[2],
            right: theme.space[2],
            zIndex: 100,  // Ensure button is above diagram
            background: theme.colors.background,
            border: `1px solid ${theme.colors.border}`,
            fontSize: theme.fontSizes[4],
            color: theme.colors.text,
            cursor: 'pointer',
            lineHeight: 1,
            padding: `${theme.space[1]}px`,
            borderRadius: theme.radii[1],
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
            e.currentTarget.style.color = theme.colors.text;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = theme.colors.background;
            e.currentTarget.style.color = theme.colors.text;
          }}
          aria-label="Close"
        >
          ×
        </button>
        <div style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: theme.colors.background,
          padding: `${theme.space[5]}px ${theme.space[2]}px ${theme.space[2]}px ${theme.space[2]}px`  // Add top padding to avoid X button
        }}>
          <IndustryZoomableMermaidDiagram
            id="mermaid-modal-diagram"
            code={mermaidCode}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );

  // TypeScript guard - this should never happen due to check above
  if (!ReactDOM) return null;

  return ReactDOM.createPortal(modalContent, document.body);
}
