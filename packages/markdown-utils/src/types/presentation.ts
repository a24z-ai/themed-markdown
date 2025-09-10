import { BaseChunk } from './chunks';

export enum MarkdownPresentationFormat {
  HORIZONTAL_RULE = 'horizontal_rule',
  HEADER = 'header',
  FULL_CONTENT = 'full_content',
}

export enum MarkdownSourceType {
  WORKSPACE_FILE = 'workspace_file',
  REMOTE_FILE = 'remote_file',
  GITHUB_FILE = 'github_file',
  DRAFT = 'draft',
  GITHUB_ISSUE = 'github_issue',
  GITHUB_PULL_REQUEST = 'github_pull_request',
  GITHUB_GIST = 'github_gist',
}

export interface MarkdownSource {
  type: MarkdownSourceType;
  content: string;
  filePath?: string;
  workspaceRoot?: string;
  editable?: boolean;
  deletable?: boolean;
  repositoryInfo?: RepositoryInfo;
}

export interface MarkdownSlideLocation {
  startLine: number;
  endLine: number;
  content: string;
  type: MarkdownPresentationFormat;
}

export interface MarkdownSlide<T extends BaseChunk = BaseChunk> {
  id: string;
  title: string;
  location: MarkdownSlideLocation;
  chunks: T[];
}

// Repository information for resolving relative URLs
export interface RepositoryInfo {
  /** GitHub repository owner/organization */
  owner: string;
  /** Repository name */
  repo: string;
  /** Branch/ref to use for raw URLs (defaults to 'main' if not specified) */
  branch?: string;
  /** Base path within the repository (for files in subdirectories) */
  basePath?: string;
}

export interface MarkdownPresentation<T extends BaseChunk = BaseChunk> {
  source?: MarkdownSource;
  slides: MarkdownSlide<T>[];
  originalContent: string;
  format: MarkdownPresentationFormat;
  /** Optional repository information for resolving relative URLs to GitHub raw URLs */
  repositoryInfo?: RepositoryInfo;
}