import { ContentChunk } from './customMarkdownChunks';

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
}

export interface MarkdownSlide {
  id: string;
  title: string;
  location: MarkdownSlideLocation;
  chunks: ContentChunk[];
}

// Options for bash command execution
export interface BashCommandOptions {
  /** Unique identifier for the command execution */
  id?: string;
  /** Whether to show output in terminal */
  showInTerminal?: boolean;
  /** Current working directory for command execution */
  cwd?: string;
  /** Whether to run command in background */
  background?: boolean;
}

// Result from bash command execution
export type BashCommandResult = unknown;

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

export interface MarkdownPresentation {
  // Optional For Backward Compatibility
  // Will Be Required in the future
  source?: MarkdownSource;
  slides: MarkdownSlide[];
  originalContent: string;
  /** Optional repository information for resolving relative URLs to GitHub raw URLs */
  repositoryInfo?: RepositoryInfo;
}
