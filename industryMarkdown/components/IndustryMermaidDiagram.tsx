/**
 * IndustryMermaidDiagram Component
 *
 * A theme-aware Mermaid diagram renderer that uses the industry theme
 * This is a replacement for ConfigurableMermaidDiagram that doesn't depend on the old theme system
 */

import React, { useEffect, useRef, useState } from 'react';

import { Theme, theme as defaultTheme } from '../../industryTheme';

interface IndustryMermaidDiagramProps {
  code: string;
  id: string;
  theme?: Theme;
  themeMode?: 'light' | 'dark';
  onCopyError?: (mermaidCode: string, errorMessage: string) => void;
  onError?: (hasError: boolean) => void;
  rootMargin?: string;
  isModalMode?: boolean;
  fitMode?: 'height' | 'width'; // Control whether to fit to parent height or width
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
  themeMode = 'dark',
  onCopyError,
  onError,
  rootMargin = '200px',
  isModalMode = false,
  fitMode = 'height', // Default to fitting parent height
}: IndustryMermaidDiagramProps) {
  const theme = themeOverride || defaultTheme;
  const [errorDetails, setErrorDetails] = useState<{ code: string; message: string } | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasRendered, setHasRendered] = useState(false);
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const darkMode = themeMode === 'dark';

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
        // Configure mermaid
        mermaid.initialize({
          startOnLoad: false,
          theme: darkMode ? 'dark' : 'default',
          themeVariables: darkMode
            ? {
                primaryColor: '#1e1e1e',
                primaryTextColor: '#e0e0e0',
                primaryBorderColor: '#444',
                lineColor: '#666',
                secondaryColor: '#2a2a2a',
                tertiaryColor: '#333',
                background: '#1e1e1e',
                mainBkg: '#1e1e1e',
                secondBkg: '#2a2a2a',
                tertiaryBkg: '#333',
                secondaryBorderColor: '#555',
                tertiaryBorderColor: '#666',
                textColor: '#e0e0e0',
                labelTextColor: '#e0e0e0',
                altBackground: '#252525',
                errorBkgColor: '#552222',
                errorTextColor: '#ff6666',
              }
            : {},
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
          
          // Remove mermaid's default constraints but set reasonable limits
          svgElement.style.maxWidth = '100%';
          svgElement.style.maxHeight = '80vh';
          svgElement.style.width = 'auto';
          svgElement.style.height = 'auto';
          svgElement.style.display = 'block';
          svgElement.style.margin = '0 auto';
          
          if (isModalMode) {
            // Modal mode always uses full width
            svgElement.style.width = '100%';
            svgElement.style.height = 'auto';
          } else if (fitMode === 'width') {
            // Fit to parent width
            svgElement.style.width = '100%';
            svgElement.style.maxHeight = 'none';
          } else if (fitMode === 'height') {
            // Fit to viewport height
            svgElement.style.maxHeight = '60vh';
            svgElement.style.width = 'auto';
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
  }, [hasRendered, code, id, darkMode, theme, containerElement, onError, fitMode, isModalMode]);

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
    display: 'block',
    backgroundColor: hasRendered ? 'transparent' : theme.colors.backgroundSecondary,
    border: hasRendered ? 'none' : `1px solid ${theme.colors.border}`,
    borderRadius: theme.radii[2],
    padding: hasRendered ? 0 : theme.space[4],
    margin: `${theme.space[4]}px 0`,
  };

  const placeholderStyle: React.CSSProperties = {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes[2],
    fontFamily: theme.fonts.body,
  };

  return (
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
  );
}
