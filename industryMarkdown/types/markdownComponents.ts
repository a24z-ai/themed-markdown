import { ReactNode, HTMLAttributes, ImgHTMLAttributes, AnchorHTMLAttributes } from 'react';

// Base props for markdown components
export interface MarkdownComponentProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  node?: unknown;
  sourcePosition?: {
    start?: { line?: number; column?: number };
    end?: { line?: number; column?: number };
  };
}

// Heading component props
export interface HeadingProps extends MarkdownComponentProps {
  level?: number;
}

// List item props with checkbox support
export interface ListItemProps extends MarkdownComponentProps {
  ordered?: boolean;
  index?: number;
  checked?: boolean;
}

// Type for checkbox element props in task lists
export interface CheckboxElementProps {
  type?: string;
  checked?: boolean;
}

// Link component props
export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  href?: string;
  children?: ReactNode;
  node?: unknown;
}

// Image component props
export interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'children'> {
  src?: string;
  alt?: string;
}

// Code component props
export interface CodeProps extends MarkdownComponentProps {
  inline?: boolean;
  className?: string;
  children?: ReactNode;
}

// Source element props for picture tag
export interface SourceProps extends HTMLAttributes<HTMLSourceElement> {
  srcset?: string;
  srcSet?: string;
  media?: string;
  type?: string;
}
