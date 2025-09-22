import React from 'react';

import { Theme } from './index';

export interface ThemeShowcaseProps {
  theme: Theme;
  /**
   * Optional title for the showcase
   */
  title?: string;
  /**
   * Show raw theme values alongside visual representations
   */
  showValues?: boolean;
  /**
   * Sections to display - by default shows all
   */
  sections?: ('colors' | 'typography' | 'spacing' | 'shadows' | 'radii')[];
}

/**
 * A comprehensive theme showcase component that visually displays all theme properties.
 * Useful for theme editors, documentation, and theme development.
 */
export const ThemeShowcase: React.FC<ThemeShowcaseProps> = ({
  theme,
  title,
  showValues = true,
  sections = ['colors', 'typography', 'spacing', 'shadows', 'radii']
}) => {
  const containerStyle: React.CSSProperties = {
    fontFamily: theme.fonts.body,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
    padding: theme.space[4],
    minHeight: '100vh',
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: theme.space[5],
    padding: theme.space[4],
    backgroundColor: theme.colors.surface || theme.colors.backgroundSecondary,
    borderRadius: theme.radii[2],
    border: `1px solid ${theme.colors.border}`,
  };

  const headingStyle: React.CSSProperties = {
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes[5],
    fontWeight: theme.fontWeights.heading,
    marginBottom: theme.space[3],
    color: theme.colors.primary,
  };

  const subheadingStyle: React.CSSProperties = {
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes[3],
    fontWeight: theme.fontWeights.medium,
    marginBottom: theme.space[2],
    marginTop: theme.space[3],
    color: theme.colors.text,
  };

  return (
    <div style={containerStyle}>
      {title && (
        <h1 style={{
          ...headingStyle,
          fontSize: theme.fontSizes[6],
          marginBottom: theme.space[4],
        }}>
          {title}
        </h1>
      )}

      {sections.includes('colors') && (
        <div style={sectionStyle}>
          <h2 style={headingStyle}>Colors</h2>

          {/* Primary Colors */}
          <h3 style={subheadingStyle}>Primary Colors</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: theme.space[3],
            marginBottom: theme.space[3],
          }}>
            {['text', 'background', 'primary', 'secondary', 'accent', 'muted'].map(key => {
              const color = theme.colors[key as keyof typeof theme.colors];
              if (!color) return null;
              return (
                <div key={key} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: theme.space[2],
                  backgroundColor: theme.colors.backgroundLight || theme.colors.backgroundTertiary,
                  borderRadius: theme.radii[1],
                }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    backgroundColor: color,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.radii[1],
                    marginRight: theme.space[2],
                  }} />
                  <div>
                    <div style={{
                      fontFamily: theme.fonts.monospace,
                      fontSize: theme.fontSizes[1],
                      fontWeight: theme.fontWeights.medium,
                    }}>
                      {key}
                    </div>
                    {showValues && (
                      <div style={{
                        fontFamily: theme.fonts.monospace,
                        fontSize: theme.fontSizes[0],
                        color: theme.colors.textSecondary,
                      }}>
                        {color}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Status Colors */}
          <h3 style={subheadingStyle}>Status Colors</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: theme.space[3],
            marginBottom: theme.space[3],
          }}>
            {['success', 'warning', 'error', 'info'].map(key => {
              const color = theme.colors[key as keyof typeof theme.colors];
              if (!color) return null;
              return (
                <div key={key} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: theme.space[2],
                  backgroundColor: theme.colors.backgroundLight || theme.colors.backgroundTertiary,
                  borderRadius: theme.radii[1],
                }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    backgroundColor: color,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.radii[1],
                    marginRight: theme.space[2],
                  }} />
                  <div>
                    <div style={{
                      fontFamily: theme.fonts.monospace,
                      fontSize: theme.fontSizes[1],
                      fontWeight: theme.fontWeights.medium,
                    }}>
                      {key}
                    </div>
                    {showValues && (
                      <div style={{
                        fontFamily: theme.fonts.monospace,
                        fontSize: theme.fontSizes[0],
                        color: theme.colors.textSecondary,
                      }}>
                        {color}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Background Colors */}
          <h3 style={subheadingStyle}>Background Colors</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: theme.space[3],
          }}>
            {['backgroundSecondary', 'backgroundTertiary', 'backgroundLight', 'backgroundHover', 'surface'].map(key => {
              const color = theme.colors[key as keyof typeof theme.colors];
              if (!color) return null;
              return (
                <div key={key} style={{
                  padding: theme.space[3],
                  backgroundColor: color,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.radii[1],
                }}>
                  <div style={{
                    fontFamily: theme.fonts.monospace,
                    fontSize: theme.fontSizes[1],
                    fontWeight: theme.fontWeights.medium,
                  }}>
                    {key}
                  </div>
                  {showValues && (
                    <div style={{
                      fontFamily: theme.fonts.monospace,
                      fontSize: theme.fontSizes[0],
                      color: theme.colors.textSecondary,
                      marginTop: theme.space[1],
                    }}>
                      {color}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {sections.includes('typography') && (
        <div style={sectionStyle}>
          <h2 style={headingStyle}>Typography</h2>

          {/* Font Families */}
          <h3 style={subheadingStyle}>Font Families</h3>
          <div style={{ marginBottom: theme.space[4] }}>
            <div style={{
              fontFamily: theme.fonts.heading,
              fontSize: theme.fontSizes[4],
              marginBottom: theme.space[2],
            }}>
              Heading Font: {showValues && <span style={{
                fontFamily: theme.fonts.monospace,
                fontSize: theme.fontSizes[1],
                color: theme.colors.textSecondary,
              }}> {theme.fonts.heading}</span>}
            </div>
            <div style={{
              fontFamily: theme.fonts.body,
              fontSize: theme.fontSizes[2],
              marginBottom: theme.space[2],
            }}>
              Body Font: {showValues && <span style={{
                fontFamily: theme.fonts.monospace,
                fontSize: theme.fontSizes[1],
                color: theme.colors.textSecondary,
              }}> {theme.fonts.body}</span>}
            </div>
            <div style={{
              fontFamily: theme.fonts.monospace,
              fontSize: theme.fontSizes[2],
            }}>
              Monospace Font: {showValues && <span style={{
                fontSize: theme.fontSizes[1],
                color: theme.colors.textSecondary,
              }}> {theme.fonts.monospace}</span>}
            </div>
          </div>

          {/* Font Sizes */}
          <h3 style={subheadingStyle}>Font Sizes</h3>
          <div style={{ marginBottom: theme.space[4] }}>
            {theme.fontSizes.map((size, index) => (
              <div key={index} style={{
                fontSize: size,
                lineHeight: theme.lineHeights.body,
                marginBottom: theme.space[1],
              }}>
                Size {index}: Sample Text {showValues && `(${size}px)`}
              </div>
            ))}
          </div>

          {/* Font Weights */}
          <h3 style={subheadingStyle}>Font Weights</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: theme.space[2],
          }}>
            {Object.entries(theme.fontWeights).map(([name, weight]) => (
              <div key={name} style={{
                fontWeight: weight,
                fontSize: theme.fontSizes[2],
              }}>
                {name} {showValues && `(${weight})`}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.includes('spacing') && (
        <div style={sectionStyle}>
          <h2 style={headingStyle}>Spacing</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.space[2] }}>
            {theme.space.map((space, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: 60,
                  fontFamily: theme.fonts.monospace,
                  fontSize: theme.fontSizes[1],
                  color: theme.colors.textSecondary,
                }}>
                  [{index}]
                </div>
                <div style={{
                  height: 24,
                  width: space,
                  backgroundColor: theme.colors.primary,
                  borderRadius: theme.radii[1],
                }} />
                {showValues && (
                  <div style={{
                    marginLeft: theme.space[2],
                    fontFamily: theme.fonts.monospace,
                    fontSize: theme.fontSizes[1],
                    color: theme.colors.textSecondary,
                  }}>
                    {space}px
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.includes('radii') && (
        <div style={sectionStyle}>
          <h2 style={headingStyle}>Border Radii</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: theme.space[3],
          }}>
            {theme.radii.map((radius, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 80,
                  height: 80,
                  backgroundColor: theme.colors.primary,
                  borderRadius: radius,
                  marginBottom: theme.space[1],
                  margin: '0 auto',
                }} />
                <div style={{
                  fontFamily: theme.fonts.monospace,
                  fontSize: theme.fontSizes[0],
                  color: theme.colors.textSecondary,
                }}>
                  [{index}] {showValues && `${radius}px`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.includes('shadows') && (
        <div style={sectionStyle}>
          <h2 style={headingStyle}>Shadows</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: theme.space[4],
          }}>
            {theme.shadows.map((shadow, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 100,
                  height: 100,
                  backgroundColor: theme.colors.background,
                  boxShadow: shadow,
                  borderRadius: theme.radii[2],
                  margin: '0 auto',
                  marginBottom: theme.space[2],
                  border: `1px solid ${theme.colors.border}`,
                }} />
                <div style={{
                  fontFamily: theme.fonts.monospace,
                  fontSize: theme.fontSizes[0],
                  color: theme.colors.textSecondary,
                }}>
                  Shadow [{index}]
                </div>
                {showValues && (
                  <div style={{
                    fontFamily: theme.fonts.monospace,
                    fontSize: theme.fontSizes[0],
                    color: theme.colors.textMuted,
                    marginTop: theme.space[1],
                  }}>
                    {shadow === 'none' ? 'none' : '...'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Theme Modes */}
      {theme.modes && Object.keys(theme.modes).length > 0 && (
        <div style={sectionStyle}>
          <h2 style={headingStyle}>Available Modes</h2>
          <div style={{
            display: 'flex',
            gap: theme.space[2],
            flexWrap: 'wrap',
          }}>
            <div style={{
              padding: `${theme.space[2]}px ${theme.space[3]}px`,
              backgroundColor: theme.colors.primary,
              color: '#ffffff',
              borderRadius: theme.radii[2],
              fontFamily: theme.fonts.body,
              fontSize: theme.fontSizes[1],
            }}>
              default
            </div>
            {Object.keys(theme.modes).map(modeName => (
              <div key={modeName} style={{
                padding: `${theme.space[2]}px ${theme.space[3]}px`,
                backgroundColor: theme.colors.secondary,
                color: theme.colors.text,
                borderRadius: theme.radii[2],
                fontFamily: theme.fonts.body,
                fontSize: theme.fontSizes[1],
              }}>
                {modeName}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeShowcase;