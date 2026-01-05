/**
 * Notion Integration Types
 * Types for Notion API integration
 */

export interface NotionConfig {
  /** Notion integration token (from https://www.notion.so/my-integrations) */
  apiKey: string;
  /** Parent page ID to create content under */
  parentPageId?: string;
  /** Database ID to add pages to */
  databaseId?: string;
}

export interface NotionUser {
  id: string;
  type: 'person' | 'bot';
  name?: string;
  avatar_url?: string;
}

export interface NotionPage {
  id: string;
  object: 'page';
  created_time: string;
  last_edited_time: string;
  parent: NotionParent;
  properties: Record<string, NotionProperty>;
  url: string;
  archived: boolean;
}

export interface NotionDatabase {
  id: string;
  object: 'database';
  created_time: string;
  last_edited_time: string;
  title: NotionRichText[];
  properties: Record<string, NotionPropertySchema>;
  parent: NotionParent;
  url: string;
  archived: boolean;
}

export type NotionParent =
  | { type: 'page_id'; page_id: string }
  | { type: 'database_id'; database_id: string }
  | { type: 'workspace'; workspace: true };

export interface NotionRichText {
  type: 'text';
  text: {
    content: string;
    link?: { url: string } | null;
  };
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: string;
  };
  plain_text?: string;
}

export type NotionProperty =
  | { type: 'title'; title: NotionRichText[] }
  | { type: 'rich_text'; rich_text: NotionRichText[] }
  | { type: 'select'; select: { name: string; color?: string } | null }
  | { type: 'multi_select'; multi_select: Array<{ name: string; color?: string }> }
  | { type: 'status'; status: { name: string; color?: string } | null }
  | { type: 'date'; date: { start: string; end?: string } | null }
  | { type: 'checkbox'; checkbox: boolean }
  | { type: 'url'; url: string | null }
  | { type: 'number'; number: number | null }
  | { type: 'relation'; relation: Array<{ id: string }> };

export interface NotionPropertySchema {
  id: string;
  name: string;
  type: string;
  [key: string]: unknown;
}

export type NotionBlock =
  | NotionParagraphBlock
  | NotionHeadingBlock
  | NotionBulletedListBlock
  | NotionNumberedListBlock
  | NotionToDoBlock
  | NotionToggleBlock
  | NotionCodeBlock
  | NotionQuoteBlock
  | NotionCalloutBlock
  | NotionDividerBlock
  | NotionTableOfContentsBlock;

export interface NotionParagraphBlock {
  object: 'block';
  type: 'paragraph';
  paragraph: {
    rich_text: NotionRichText[];
  };
}

export interface NotionHeadingBlock {
  object: 'block';
  type: 'heading_1' | 'heading_2' | 'heading_3';
  heading_1?: { rich_text: NotionRichText[] };
  heading_2?: { rich_text: NotionRichText[] };
  heading_3?: { rich_text: NotionRichText[] };
}

export interface NotionBulletedListBlock {
  object: 'block';
  type: 'bulleted_list_item';
  bulleted_list_item: {
    rich_text: NotionRichText[];
  };
}

export interface NotionNumberedListBlock {
  object: 'block';
  type: 'numbered_list_item';
  numbered_list_item: {
    rich_text: NotionRichText[];
  };
}

export interface NotionToDoBlock {
  object: 'block';
  type: 'to_do';
  to_do: {
    rich_text: NotionRichText[];
    checked: boolean;
  };
}

export interface NotionToggleBlock {
  object: 'block';
  type: 'toggle';
  toggle: {
    rich_text: NotionRichText[];
  };
}

export interface NotionCodeBlock {
  object: 'block';
  type: 'code';
  code: {
    rich_text: NotionRichText[];
    language: string;
  };
}

export interface NotionQuoteBlock {
  object: 'block';
  type: 'quote';
  quote: {
    rich_text: NotionRichText[];
  };
}

export interface NotionCalloutBlock {
  object: 'block';
  type: 'callout';
  callout: {
    rich_text: NotionRichText[];
    icon?: { type: 'emoji'; emoji: string };
  };
}

export interface NotionDividerBlock {
  object: 'block';
  type: 'divider';
  divider: Record<string, never>;
}

export interface NotionTableOfContentsBlock {
  object: 'block';
  type: 'table_of_contents';
  table_of_contents: Record<string, never>;
}

export interface CreatePageInput {
  parentPageId?: string;
  databaseId?: string;
  title: string;
  properties?: Record<string, NotionProperty>;
  content?: NotionBlock[];
  icon?: { type: 'emoji'; emoji: string };
  cover?: { type: 'external'; external: { url: string } };
}

export interface CreateDatabaseInput {
  parentPageId: string;
  title: string;
  properties: Record<string, Omit<NotionPropertySchema, 'id'>>;
  icon?: { type: 'emoji'; emoji: string };
}

export interface NotionDocumentPage {
  title: string;
  category: string;
  content: string;
  properties?: Record<string, unknown>;
}

export interface NotionExportResult {
  database?: NotionDatabase;
  pages: NotionPage[];
  errors: string[];
}

export interface NotionExportOptions {
  /** Create a database for documents */
  createDatabase?: boolean;
  /** Database title */
  databaseTitle?: string;
  /** Create pages under a parent page instead of database */
  parentPageId?: string;
  /** Add category property to pages */
  addCategory?: boolean;
  /** Add status property to pages */
  addStatus?: boolean;
  /** Convert markdown content to Notion blocks */
  convertContent?: boolean;
  /** Dry run - preview without creating */
  dryRun?: boolean;
}

/**
 * Category to emoji mapping
 */
export const CATEGORY_ICONS: Record<string, string> = {
  prd: '📋',
  architecture: '🏗️',
  'technical-spec': '⚙️',
  'api-design': '🔌',
  security: '🔒',
  infrastructure: '☁️',
  testing: '🧪',
  documentation: '📚',
  research: '🔬',
  design: '🎨',
  default: '📄',
};

/**
 * Status options for documents
 */
export const STATUS_OPTIONS = [
  { name: 'Draft', color: 'gray' },
  { name: 'In Review', color: 'yellow' },
  { name: 'Approved', color: 'green' },
  { name: 'Archived', color: 'red' },
];

/**
 * Category options for documents
 */
export const CATEGORY_OPTIONS = [
  { name: 'PRD', color: 'purple' },
  { name: 'Architecture', color: 'blue' },
  { name: 'Technical Spec', color: 'green' },
  { name: 'API Design', color: 'orange' },
  { name: 'Security', color: 'red' },
  { name: 'Infrastructure', color: 'gray' },
  { name: 'Testing', color: 'yellow' },
  { name: 'Documentation', color: 'pink' },
  { name: 'Research', color: 'brown' },
  { name: 'Design', color: 'default' },
];
