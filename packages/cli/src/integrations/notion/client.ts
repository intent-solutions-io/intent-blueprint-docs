/**
 * Notion API Client
 * REST client for Notion API
 */

import type {
  NotionConfig,
  NotionUser,
  NotionPage,
  NotionDatabase,
  NotionBlock,
  NotionRichText,
  NotionProperty,
  CreatePageInput,
  CreateDatabaseInput,
} from './types.js';

const NOTION_API_URL = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

export class NotionClient {
  private apiKey: string;
  private parentPageId?: string;
  private databaseId?: string;

  constructor(config: NotionConfig) {
    this.apiKey = config.apiKey;
    this.parentPageId = config.parentPageId;
    this.databaseId = config.databaseId;
  }

  /**
   * Make an API request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${NOTION_API_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Notion-Version': NOTION_VERSION,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      let errorMessage = `Notion API error: ${response.status} ${response.statusText}`;
      try {
        const errorJson = JSON.parse(errorBody);
        if (errorJson.message) {
          errorMessage += ` - ${errorJson.message}`;
        }
      } catch {
        if (errorBody) errorMessage += ` - ${errorBody}`;
      }
      throw new Error(errorMessage);
    }

    const text = await response.text();
    if (!text) return {} as T;

    return JSON.parse(text) as T;
  }

  /**
   * Verify credentials and get current user (bot)
   */
  async verify(): Promise<NotionUser> {
    const response = await this.request<{ bot: NotionUser }>('/users/me');
    return response.bot;
  }

  /**
   * Get a page by ID
   */
  async getPage(pageId: string): Promise<NotionPage> {
    return this.request<NotionPage>(`/pages/${pageId}`);
  }

  /**
   * Get a database by ID
   */
  async getDatabase(databaseId: string): Promise<NotionDatabase> {
    return this.request<NotionDatabase>(`/databases/${databaseId}`);
  }

  /**
   * Search for pages and databases
   */
  async search(query: string, filter?: { property: string; value: string }): Promise<{
    results: Array<NotionPage | NotionDatabase>;
  }> {
    return this.request<{ results: Array<NotionPage | NotionDatabase> }>('/search', {
      method: 'POST',
      body: JSON.stringify({
        query,
        filter: filter ? { property: filter.property, value: filter.value } : undefined,
      }),
    });
  }

  /**
   * List all pages the integration has access to
   */
  async listPages(): Promise<NotionPage[]> {
    const response = await this.search('', { property: 'object', value: 'page' });
    return response.results.filter((r): r is NotionPage => r.object === 'page');
  }

  /**
   * List all databases the integration has access to
   */
  async listDatabases(): Promise<NotionDatabase[]> {
    const response = await this.search('', { property: 'object', value: 'database' });
    return response.results.filter((r): r is NotionDatabase => r.object === 'database');
  }

  /**
   * Create a database
   */
  async createDatabase(input: CreateDatabaseInput): Promise<NotionDatabase> {
    const body: Record<string, unknown> = {
      parent: { type: 'page_id', page_id: input.parentPageId },
      title: [this.createRichText(input.title)],
      properties: input.properties,
    };

    if (input.icon) {
      body.icon = input.icon;
    }

    return this.request<NotionDatabase>('/databases', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * Create a page
   */
  async createPage(input: CreatePageInput): Promise<NotionPage> {
    const body: Record<string, unknown> = {};

    // Set parent
    if (input.databaseId) {
      body.parent = { type: 'database_id', database_id: input.databaseId };
    } else if (input.parentPageId) {
      body.parent = { type: 'page_id', page_id: input.parentPageId };
    } else if (this.databaseId) {
      body.parent = { type: 'database_id', database_id: this.databaseId };
    } else if (this.parentPageId) {
      body.parent = { type: 'page_id', page_id: this.parentPageId };
    } else {
      throw new Error('No parent page or database specified');
    }

    // Set properties
    if (input.databaseId || this.databaseId) {
      // Database page - use provided properties or default title
      const props = input.properties || {
        Name: { title: [this.createRichText(input.title)] },
      };

      // Ensure title is set
      const propsRecord = props as Record<string, unknown>;
      if (!propsRecord.Name && !propsRecord.title) {
        propsRecord.Name = {
          title: [this.createRichText(input.title)]
        };
      }
      body.properties = propsRecord;
    } else {
      // Page under another page - use title property
      body.properties = {
        title: { title: [this.createRichText(input.title)] },
      };
    }

    // Add icon
    if (input.icon) {
      body.icon = input.icon;
    }

    // Add cover
    if (input.cover) {
      body.cover = input.cover;
    }

    // Add content blocks (children)
    if (input.content && input.content.length > 0) {
      body.children = input.content;
    }

    return this.request<NotionPage>('/pages', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * Append blocks to a page
   */
  async appendBlocks(pageId: string, blocks: NotionBlock[]): Promise<void> {
    // Notion limits to 100 blocks per request
    const chunks = this.chunkArray(blocks, 100);

    for (const chunk of chunks) {
      await this.request(`/blocks/${pageId}/children`, {
        method: 'PATCH',
        body: JSON.stringify({ children: chunk }),
      });
    }
  }

  /**
   * Create rich text object
   */
  createRichText(content: string, options?: {
    bold?: boolean;
    italic?: boolean;
    code?: boolean;
    link?: string;
  }): NotionRichText {
    return {
      type: 'text',
      text: {
        content,
        link: options?.link ? { url: options.link } : null,
      },
      annotations: {
        bold: options?.bold || false,
        italic: options?.italic || false,
        code: options?.code || false,
      },
    };
  }

  /**
   * Create a paragraph block
   */
  createParagraph(text: string): NotionBlock {
    return {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [this.createRichText(text)],
      },
    };
  }

  /**
   * Create a heading block
   */
  createHeading(text: string, level: 1 | 2 | 3): NotionBlock {
    const type = `heading_${level}` as 'heading_1' | 'heading_2' | 'heading_3';
    return {
      object: 'block',
      type,
      [type]: {
        rich_text: [this.createRichText(text)],
      },
    } as NotionBlock;
  }

  /**
   * Create a bulleted list item block
   */
  createBulletItem(text: string): NotionBlock {
    return {
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [this.createRichText(text)],
      },
    };
  }

  /**
   * Create a numbered list item block
   */
  createNumberedItem(text: string): NotionBlock {
    return {
      object: 'block',
      type: 'numbered_list_item',
      numbered_list_item: {
        rich_text: [this.createRichText(text)],
      },
    };
  }

  /**
   * Create a to-do block
   */
  createToDo(text: string, checked: boolean = false): NotionBlock {
    return {
      object: 'block',
      type: 'to_do',
      to_do: {
        rich_text: [this.createRichText(text)],
        checked,
      },
    };
  }

  /**
   * Create a code block
   */
  createCode(code: string, language: string = 'plain text'): NotionBlock {
    return {
      object: 'block',
      type: 'code',
      code: {
        rich_text: [this.createRichText(code)],
        language,
      },
    };
  }

  /**
   * Create a quote block
   */
  createQuote(text: string): NotionBlock {
    return {
      object: 'block',
      type: 'quote',
      quote: {
        rich_text: [this.createRichText(text)],
      },
    };
  }

  /**
   * Create a callout block
   */
  createCallout(text: string, emoji: string = '💡'): NotionBlock {
    return {
      object: 'block',
      type: 'callout',
      callout: {
        rich_text: [this.createRichText(text)],
        icon: { type: 'emoji', emoji },
      },
    };
  }

  /**
   * Create a divider block
   */
  createDivider(): NotionBlock {
    return {
      object: 'block',
      type: 'divider',
      divider: {},
    };
  }

  /**
   * Create a table of contents block
   */
  createTableOfContents(): NotionBlock {
    return {
      object: 'block',
      type: 'table_of_contents',
      table_of_contents: {},
    };
  }

  /**
   * Convert markdown to Notion blocks
   */
  markdownToBlocks(markdown: string): NotionBlock[] {
    const blocks: NotionBlock[] = [];
    const lines = markdown.split('\n');
    let inCodeBlock = false;
    let codeContent: string[] = [];
    let codeLanguage = 'plain text';

    for (const line of lines) {
      // Handle code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End code block
          blocks.push(this.createCode(codeContent.join('\n'), codeLanguage));
          codeContent = [];
          inCodeBlock = false;
        } else {
          // Start code block
          inCodeBlock = true;
          codeLanguage = line.slice(3).trim() || 'plain text';
        }
        continue;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        continue;
      }

      // Skip empty lines
      if (!line.trim()) {
        continue;
      }

      // Headings
      if (line.startsWith('### ')) {
        blocks.push(this.createHeading(line.slice(4), 3));
      } else if (line.startsWith('## ')) {
        blocks.push(this.createHeading(line.slice(3), 2));
      } else if (line.startsWith('# ')) {
        blocks.push(this.createHeading(line.slice(2), 1));
      }
      // Bullet lists
      else if (line.match(/^[\s]*[-*]\s+/)) {
        const text = line.replace(/^[\s]*[-*]\s+/, '');
        // Check for checkbox
        if (text.startsWith('[ ] ')) {
          blocks.push(this.createToDo(text.slice(4), false));
        } else if (text.startsWith('[x] ') || text.startsWith('[X] ')) {
          blocks.push(this.createToDo(text.slice(4), true));
        } else {
          blocks.push(this.createBulletItem(text));
        }
      }
      // Numbered lists
      else if (line.match(/^\d+\.\s+/)) {
        const text = line.replace(/^\d+\.\s+/, '');
        blocks.push(this.createNumberedItem(text));
      }
      // Blockquotes
      else if (line.startsWith('> ')) {
        blocks.push(this.createQuote(line.slice(2)));
      }
      // Horizontal rules
      else if (line.match(/^[-*_]{3,}$/)) {
        blocks.push(this.createDivider());
      }
      // Regular paragraphs
      else {
        blocks.push(this.createParagraph(line));
      }
    }

    // Handle unclosed code block
    if (inCodeBlock && codeContent.length > 0) {
      blocks.push(this.createCode(codeContent.join('\n'), codeLanguage));
    }

    return blocks;
  }

  /**
   * Split array into chunks
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
