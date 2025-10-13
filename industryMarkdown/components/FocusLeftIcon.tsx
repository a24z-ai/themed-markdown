import React from 'react';

interface FocusIconProps {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

export const FocusLeftIcon: React.FC<FocusIconProps> = ({
  size = 18,
  color = 'currentColor',
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    {/* Square */}
    <rect x="3" y="3" width="18" height="18" rx="1" />
    {/* Arrow pointing right (to focus on left panel) */}
    <path d="M9 12L15 12M15 12L12 9M15 12L12 15" strokeWidth="1.5" />
  </svg>
);

export const FocusRightIcon: React.FC<FocusIconProps> = ({
  size = 18,
  color = 'currentColor',
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    {/* Square */}
    <rect x="3" y="3" width="18" height="18" rx="1" />
    {/* Arrow pointing left (to focus on right panel) */}
    <path d="M15 12L9 12M9 12L12 9M9 12L12 15" strokeWidth="1.5" />
  </svg>
);
