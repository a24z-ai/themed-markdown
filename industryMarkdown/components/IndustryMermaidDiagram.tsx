/**
 * IndustryMermaidDiagram Component
 *
 * A theme-aware Mermaid diagram renderer that uses the industry theme
 * This is a replacement for ConfigurableMermaidDiagram that doesn't depend on the old theme system
 */

import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { Theme, theme as defaultTheme } from '../../industryTheme';

interface IndustryMermaidDiagramProps {
  code: string;
  id: string;
  theme?: Theme;
  onCopyError?: (mermaidCode: string, errorMessage: string) => void;
  onError?: (hasError: boolean) => void;
  rootMargin?: string;
  isModalMode?: boolean;
}

// Define mermaid type
interface MermaidAPI {
  initialize: (config: object) => void;
  run: (options: { nodes: HTMLElement[] }) => Promise<void>;
}

// Get mermaid instance
const getMermaidSync = (): MermaidAPI | null => {
  if (typeof window !== 'undefined') {
    const mermaid = (window as Window & { mermaid?: MermaidAPI }).mermaid;
    if (mermaid) {
      return mermaid;
    }
  }
  return null;
};

export function IndustryMermaidDiagram({
  code,
  id,
  theme: themeOverride,
  onCopyError,
  onError,
  rootMargin = '200px',
  isModalMode = false,
}: IndustryMermaidDiagramProps) {
  const theme = themeOverride || defaultTheme;
  const [errorDetails, setErrorDetails] = useState<{ code: string; message: string } | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasRendered, setHasRendered] = useState(false);
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1.0); // Individual zoom state for this diagram
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Callback ref to set up intersection observer when element is attached
  const containerRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      setContainerElement(node);

      // Clean up previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      // Set up new observer if conditions are met
      if (node && !hasRendered) {
        // Skip intersection observer in modal mode or if not available
        if (isModalMode || typeof IntersectionObserver === 'undefined') {
          setIsIntersecting(true);
          setHasRendered(true);
          return;
        }

        observerRef.current = new IntersectionObserver(
          ([entry]) => {
            setIsIntersecting(entry.isIntersecting);
            if (entry.isIntersecting && !hasRendered) {
              setHasRendered(true);
            }
          },
          {
            rootMargin,
            threshold: 0.01,
          },
        );

        observerRef.current.observe(node);
      }
    },
    [rootMargin, hasRendered, isModalMode],
  );

  // Clean up observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!hasRendered) return;

    const renderDiagram = async () => {
      const mermaid = getMermaidSync();
      if (!mermaid || !containerElement) return;

      try {
        // Configure mermaid with theme colors
        // Create a slightly contrasted background for better visibility
        const diagramBackground = theme.colors.backgroundSecondary || theme.colors.muted || theme.colors.background;
        const nodeBackground = theme.colors.backgroundTertiary || theme.colors.backgroundSecondary || theme.colors.primary + '22';
        
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: {
            primaryColor: nodeBackground,
            primaryTextColor: theme.colors.text,
            primaryBorderColor: theme.colors.border,
            lineColor: theme.colors.border,
            secondaryColor: theme.colors.secondary + '44', // Add some transparency
            tertiaryColor: theme.colors.accent + '44',
            background: diagramBackground,
            mainBkg: nodeBackground,
            secondBkg: theme.colors.backgroundSecondary || theme.colors.muted,
            tertiaryBkg: theme.colors.backgroundTertiary || theme.colors.accent + '22',
            secondaryBorderColor: theme.colors.border,
            tertiaryBorderColor: theme.colors.accent,
            textColor: theme.colors.text,
            labelTextColor: theme.colors.text,
            altBackground: theme.colors.muted,
            errorBkgColor: theme.colors.error + '33',
            errorTextColor: theme.colors.error,
          },
          securityLevel: 'loose',
          logLevel: 'error',
        });

        // Clear any previous content
        containerElement.innerHTML = '';

        // Create a unique element ID
        const elementId = `mermaid-${id}-${Date.now()}`;
        const graphDiv = document.createElement('div');
        graphDiv.id = elementId;
        graphDiv.textContent = code;
        containerElement.appendChild(graphDiv);

        // Render the diagram
        await mermaid.run({
          nodes: [graphDiv],
        });

        // Override mermaid's max-width constraint to allow full container usage
        const svgElement = graphDiv.querySelector('svg');
        if (svgElement) {
          
          // Remove mermaid's default constraints
          svgElement.style.maxWidth = 'none';
          svgElement.style.maxHeight = 'none';
          svgElement.style.width = 'auto';
          svgElement.style.height = 'auto';
          svgElement.style.display = 'block';
          svgElement.style.margin = '0 auto';
          
          // Smart sizing: ensure diagrams initially fit within height limit
          // Note: Zoom is applied separately in its own useEffect to avoid re-rendering
          if (isModalMode) {
            // Modal mode always uses full width
            svgElement.style.width = '100%';
            svgElement.style.height = 'auto';
          } else {
            // Default sizing to fit within the 400px container height
            svgElement.style.maxHeight = '360px'; // Leave room for padding
            svgElement.style.width = 'auto';
            svgElement.style.maxWidth = '100%';
          }
        } else {
          console.warn('No SVG element found after mermaid render');
        }

        setErrorDetails(null);
        if (onError) onError(false);
      } catch (err: unknown) {
        console.error('Mermaid rendering error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to render diagram';
        setErrorDetails({ code, message: errorMessage });
        if (onError) onError(true);

        // Show error in container
        if (containerElement) {
          containerElement.innerHTML = `
            <div style="
              padding: ${theme.space[4]}px;
              background: ${theme.colors.error}22;
              border: 1px solid ${theme.colors.error};
              border-radius: ${theme.radii[2]}px;
              color: ${theme.colors.text};
              font-family: ${theme.fonts.monospace};
              font-size: ${theme.fontSizes[1]}px;
            ">
              <div style="font-weight: ${theme.fontWeights.bold}; margin-bottom: ${theme.space[2]}px;">
                Failed to render Mermaid diagram
              </div>
              <div style="font-size: ${theme.fontSizes[0]}px; opacity: 0.8;">
                ${errorMessage}
              </div>
            </div>
          `;
        }
      }
    };

    renderDiagram();
  }, [hasRendered, code, id, theme, containerElement, onError, isModalMode]); // Remove zoomLevel from dependencies

  // Apply zoom transformation separately without re-rendering
  useEffect(() => {
    if (!containerElement || !hasRendered) return;
    
    const svgElement = containerElement.querySelector('svg');
    if (svgElement) {
      if (zoomLevel !== 1.0) {
        // Get original dimensions before scaling
        const originalWidth = svgElement.scrollWidth || svgElement.clientWidth;
        const originalHeight = svgElement.scrollHeight || svgElement.clientHeight;
        
        // Apply transform scaling
        svgElement.style.transform = `scale(${zoomLevel})`;
        svgElement.style.transformOrigin = 'top left';
        
        // Adjust SVG dimensions to create proper scroll area
        svgElement.style.width = `${originalWidth * zoomLevel}px`;
        svgElement.style.height = `${originalHeight * zoomLevel}px`;
      } else {
        // Reset to normal
        svgElement.style.transform = '';
        svgElement.style.transformOrigin = '';
        svgElement.style.width = 'auto';
        svgElement.style.height = 'auto';
        svgElement.style.maxHeight = '360px';
        svgElement.style.maxWidth = '100%';
      }
    }
  }, [zoomLevel, containerElement, hasRendered]);

  // Handle copy error action
  useEffect(() => {
    if (errorDetails && onCopyError) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'c' && window.getSelection()?.toString()) {
          onCopyError(errorDetails.code, errorDetails.message);
        }
      };

      if (containerElement) {
        containerElement.addEventListener('keydown', handleKeyDown);
        return () => {
          containerElement.removeEventListener('keydown', handleKeyDown);
        };
      }
    }
    return undefined;
  }, [errorDetails, onCopyError, containerElement]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    minHeight: '200px',
    maxHeight: '400px', // Smart height limit - diagrams initially fit within 400px
    display: 'block',
    backgroundColor: hasRendered ? 'transparent' : theme.colors.backgroundSecondary,
    border: hasRendered ? `1px solid ${theme.colors.border}` : `1px solid ${theme.colors.border}`,
    borderRadius: theme.radii[2],
    padding: hasRendered ? theme.space[3] : theme.space[4],
    margin: `${theme.space[4]}px 0`,
    overflow: hasRendered ? 'auto' : 'visible', // Enable scrolling for scaled/zoomed content
  };

  const placeholderStyle: React.CSSProperties = {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes[2],
    fontFamily: theme.fonts.body,
  };

  return (
    <div style={{ position: 'relative' }}>
      {hasRendered && !isModalMode && (
        <div style={{
          position: 'absolute',
          top: theme.space[2],
          right: theme.space[2],
          zIndex: 10,
          display: 'flex',
          gap: theme.space[1],
        }}>
          <button
            onClick={() => setZoomLevel(Math.min(3.0, zoomLevel + 0.25))}
            disabled={zoomLevel >= 3.0}
            style={{
              padding: theme.space[1],
              backgroundColor: theme.colors.backgroundSecondary,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radii[1],
              color: theme.colors.text,
              cursor: zoomLevel >= 3.0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              opacity: zoomLevel >= 3.0 ? 0.5 : 1,
            }}
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
            disabled={zoomLevel <= 0.5}
            style={{
              padding: theme.space[1],
              backgroundColor: theme.colors.backgroundSecondary,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radii[1],
              color: theme.colors.text,
              cursor: zoomLevel <= 0.5 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              opacity: zoomLevel <= 0.5 ? 0.5 : 1,
            }}
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={() => setZoomLevel(1.0)}
            disabled={zoomLevel === 1.0}
            style={{
              padding: theme.space[1],
              backgroundColor: theme.colors.backgroundSecondary,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radii[1],
              color: theme.colors.text,
              cursor: zoomLevel === 1.0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              opacity: zoomLevel === 1.0 ? 0.5 : 1,
            }}
            title="Reset Zoom"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      )}
      <div ref={containerRef} style={containerStyle} className="mermaid-container">
        {!hasRendered && (
          <div style={placeholderStyle}>
            <div>📊 Mermaid Diagram</div>
            <div style={{ fontSize: theme.fontSizes[1], marginTop: theme.space[2], opacity: 0.7 }}>
              {isIntersecting ? 'Loading...' : 'Scroll to view'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
