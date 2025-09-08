import React, { useEffect, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import { Theme, useTheme } from '../../industryTheme';

import { IndustryMermaidDiagram } from './IndustryMermaidDiagram';

interface IndustryZoomableMermaidDiagramProps {
  code: string;
  id: string;
  theme?: Theme;
  fitStrategy?: 'contain' | 'width' | 'height';
  padding?: number;
}

export function IndustryZoomableMermaidDiagram({
  code,
  id,
  theme: themeOverride,
  fitStrategy = 'contain',
  padding = 0.85,
}: IndustryZoomableMermaidDiagramProps) {
  // Get theme from context or use override
  const { theme: contextTheme } = useTheme();
  const theme = themeOverride || contextTheme;

  const [calculatedScale, setCalculatedScale] = useState(0.8); // Start with reasonable default
  const containerRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const [isCalculating, setIsCalculating] = useState(true);

  useEffect(() => {
    if (!containerRef.current || !diagramRef.current) return;

    // Function to calculate optimal scale
    const calculateOptimalScale = () => {
      const container = containerRef.current;
      const diagram = diagramRef.current;

      if (!container || !diagram) return;

      // Find the SVG element that mermaid creates
      const svg = diagram.querySelector('svg');
      if (!svg) {
        // If no SVG yet, try again shortly
        setTimeout(calculateOptimalScale, 100);
        return;
      }

      // Get the SVG's intrinsic size
      let svgWidth: number, svgHeight: number;

      // Try to get dimensions from viewBox first
      const viewBox = svg.getAttribute('viewBox');
      if (viewBox) {
        const [, , width, height] = viewBox.split(' ').map(Number);
        svgWidth = width;
        svgHeight = height;
      } else {
        // Fallback to actual rendered size
        const svgRect = svg.getBoundingClientRect();
        // Since we might already be scaled, we need to account for that
        svgWidth = svgRect.width / calculatedScale;
        svgHeight = svgRect.height / calculatedScale;
      }

      // Get container dimensions
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      if (svgWidth <= 0 || svgHeight <= 0 || containerWidth <= 0 || containerHeight <= 0) {
        return; // Invalid dimensions, skip
      }

      // Calculate optimal scale based on fit strategy
      let scale = 1;
      switch (fitStrategy) {
        case 'width':
          scale = (containerWidth * padding) / svgWidth;
          break;
        case 'height':
          scale = (containerHeight * padding) / svgHeight;
          break;
        case 'contain':
        default:
          // Fit entire diagram in view
          scale = Math.min(
            (containerWidth * padding) / svgWidth,
            (containerHeight * padding) / svgHeight,
          );
          break;
      }

      // Cap the scale to reasonable bounds
      scale = Math.min(Math.max(scale, 0.3), 2); // Between 30% and 200%

      setCalculatedScale(scale);
      setIsCalculating(false);
    };

    // Set up ResizeObserver to recalculate when container size changes
    const resizeObserver = new ResizeObserver(() => {
      calculateOptimalScale();
    });

    resizeObserver.observe(containerRef.current);

    // Initial calculation after a short delay to ensure mermaid has rendered
    setTimeout(calculateOptimalScale, 200);

    return () => {
      resizeObserver.disconnect();
    };
  }, [code, fitStrategy, padding]); // Recalculate when these change
  const buttonStyle: React.CSSProperties = {
    padding: `${theme.space[1]}px ${theme.space[2]}px`,
    marginRight: theme.space[2],
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radii[1],
    fontSize: theme.fontSizes[2],
    fontWeight: theme.fontWeights.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: theme.fonts.body,
  };

  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
  };

  const handleButtonLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = theme.colors.background;
  };

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <TransformWrapper
        limitToBounds={true}
        doubleClick={{ disabled: true }}
        minScale={0.3}
        maxScale={10}
        initialScale={calculatedScale}
        initialPositionX={0}
        initialPositionY={0}
        centerOnInit={true}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div
              style={{
                position: 'absolute',
                top: theme.space[3],
                right: theme.space[3],
                zIndex: 10,
                display: 'flex',
                gap: theme.space[2],
              }}
            >
              <button
                onClick={() => zoomIn()}
                style={buttonStyle}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
                title="Zoom in"
              >
                +
              </button>
              <button
                onClick={() => zoomOut()}
                style={buttonStyle}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
                title="Zoom out"
              >
                −
              </button>
              <button
                onClick={() => resetTransform()}
                style={buttonStyle}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
                title="Reset zoom"
              >
                ⟲
              </button>
              {isCalculating && (
                <span
                  style={{
                    padding: `${theme.space[1]}px ${theme.space[2]}px`,
                    fontSize: theme.fontSizes[1],
                    color: theme.colors.textMuted,
                    fontFamily: theme.fonts.body,
                  }}
                >
                  Optimizing view...
                </span>
              )}
            </div>
            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%' }}
              contentStyle={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                ref={diagramRef}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'visible', // Allow SVG to be visible even when scaled
                  }}
                >
                  <IndustryMermaidDiagram code={code} id={id} themeMode="dark" isModalMode={true} />
                </div>
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
