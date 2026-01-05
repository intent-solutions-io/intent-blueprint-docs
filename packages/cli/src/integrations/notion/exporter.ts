/**
 * Notion Exporter
 * High-level export operations for Blueprint documents to Notion
 */

import { NotionClient } from './client.js';
import type {
  NotionConfig,
  NotionPage,
  NotionDatabase,
  NotionBlock,
  NotionExportResult,
  NotionExportOptions,
  NotionPropertySchema,
} from './types.js';
import { CATEGORY_ICONS, CATEGORY_OPTIONS, STATUS_OPTIONS } from './types.js';

export class NotionExporter {
  private client: NotionClient;
  private parentPageId?: string;
  private databaseId?: string;

  constructor(config: NotionConfig) {
    this.client = new NotionClient(config);
    this.parentPageId = config.parentPageId;
    this.databaseId = config.databaseId;
  }

  /**
   * Export Blueprint documents to Notion
   */
  async export(
    documents: Array<{ name: string; content: string; category?: string }>,
    options: NotionExportOptions = {}
  ): Promise<NotionExportResult> {
    const result: NotionExportResult = {
      pages: [],
      errors: [],
    };

    // Dry run - just preview
    if (options.dryRun) {
      return this.preview(documents, options);
    }

    try {
      // Verify connection
      await this.client.verify();

      let targetDatabaseId = this.databaseId;

      // Create database if requested
      if (options.createDatabase && options.parentPageId) {
        const database = await this.createDocumentsDatabase(
          options.parentPageId,
          options.databaseTitle || 'Blueprint Documents',
          {
            addCategory: options.addCategory !== false,
            addStatus: options.addStatus !== false,
          }
        );
        result.database = database;
        targetDatabaseId = database.id;
      }

      // Create pages for each document
      for (const doc of documents) {
        try {
          const page = await this.createDocumentPage(doc, {
            databaseId: targetDatabaseId,
            parentPageId: options.parentPageId,
            convertContent: options.convertContent !== false,
            addCategory: options.addCategory !== false,
          });
          result.pages.push(page);
        } catch (error) {
          result.errors.push(`Failed to create page "${doc.name}": ${error}`);
        }
      }

    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : String(error));
    }

    return result;
  }

  /**
   * Preview what would be created (dry run)
   */
  async preview(
    documents: Array<{ name: string; content: string; category?: string }>,
    options: NotionExportOptions = {}
  ): Promise<NotionExportResult> {
    const result: NotionExportResult = {
      pages: [],
      errors: [],
    };

    // Preview database
    if (options.createDatabase) {
      result.database = {
        id: 'preview-database',
        object: 'database',
        created_time: new Date().toISOString(),
        last_edited_time: new Date().toISOString(),
        title: [{ type: 'text', text: { content: options.databaseTitle || 'Blueprint Documents' } }],
        properties: {
          Name: { id: 'title', name: 'Name', type: 'title' },
          Category: { id: 'category', name: 'Category', type: 'select' },
          Status: { id: 'status', name: 'Status', type: 'status' },
        },
        parent: { type: 'page_id', page_id: options.parentPageId || 'preview-parent' },
        url: '#',
        archived: false,
      };
    }

    // Preview pages
    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      const category = this.detectCategory(doc.name, doc.content);
      const icon = CATEGORY_ICONS[category] || CATEGORY_ICONS.default;

      result.pages.push({
        id: `preview-page-${i}`,
        object: 'page',
        created_time: new Date().toISOString(),
        last_edited_time: new Date().toISOString(),
        parent: options.createDatabase
          ? { type: 'database_id', database_id: 'preview-database' }
          : { type: 'page_id', page_id: options.parentPageId || 'preview-parent' },
        properties: {
          Name: { type: 'title', title: [{ type: 'text', text: { content: doc.name } }] },
          Category: { type: 'select', select: { name: this.formatCategory(category) } },
          Status: { type: 'status', status: { name: 'Draft' } },
        },
        url: '#',
        archived: false,
      });
    }

    return result;
  }

  /**
   * Create a database for documents
   */
  private async createDocumentsDatabase(
    parentPageId: string,
    title: string,
    options: { addCategory?: boolean; addStatus?: boolean }
  ): Promise<NotionDatabase> {
    const properties: Record<string, Omit<NotionPropertySchema, 'id'>> = {
      Name: { name: 'Name', type: 'title' },
    };

    if (options.addCategory) {
      properties.Category = {
        name: 'Category',
        type: 'select',
        select: {
          options: CATEGORY_OPTIONS,
        },
      } as Omit<NotionPropertySchema, 'id'>;
    }

    if (options.addStatus) {
      properties.Status = {
        name: 'Status',
        type: 'status',
        status: {
          options: STATUS_OPTIONS,
        },
      } as Omit<NotionPropertySchema, 'id'>;
    }

    // Add description property
    properties.Description = {
      name: 'Description',
      type: 'rich_text',
    };

    // Add created date
    properties['Created'] = {
      name: 'Created',
      type: 'created_time',
    };

    // Add last edited date
    properties['Last Edited'] = {
      name: 'Last Edited',
      type: 'last_edited_time',
    };

    return this.client.createDatabase({
      parentPageId,
      title,
      properties,
      icon: { type: 'emoji', emoji: '📚' },
    });
  }

  /**
   * Create a page for a document
   */
  private async createDocumentPage(
    doc: { name: string; content: string; category?: string },
    options: {
      databaseId?: string;
      parentPageId?: string;
      convertContent?: boolean;
      addCategory?: boolean;
    }
  ): Promise<NotionPage> {
    const category = doc.category || this.detectCategory(doc.name, doc.content);
    const icon = CATEGORY_ICONS[category] || CATEGORY_ICONS.default;
    const description = this.extractDescription(doc.content);

    // Build properties based on whether we're adding to a database or page
    let properties: Record<string, unknown>;

    if (options.databaseId) {
      properties = {
        Name: { title: [this.client.createRichText(doc.name)] },
      };

      if (options.addCategory) {
        properties.Category = {
          select: { name: this.formatCategory(category) },
        };
      }

      // Add description
      if (description) {
        properties.Description = {
          rich_text: [this.client.createRichText(description)],
        };
      }
    } else {
      properties = {
        title: { title: [this.client.createRichText(doc.name)] },
      };
    }

    // Convert content to blocks
    let content: NotionBlock[] = [];
    if (options.convertContent !== false) {
      // Add table of contents at the start
      content.push(this.client.createTableOfContents());
      content.push(this.client.createDivider());

      // Convert markdown content
      const contentBlocks = this.client.markdownToBlocks(doc.content);
      content = content.concat(contentBlocks);
    }

    return this.client.createPage({
      databaseId: options.databaseId,
      parentPageId: options.parentPageId,
      title: doc.name,
      properties: properties as Record<string, never>,
      content: content.length > 0 ? content : undefined,
      icon: { type: 'emoji', emoji: icon },
    });
  }

  /**
   * Detect category from document name and content
   */
  private detectCategory(name: string, content: string): string {
    const lower = (name + ' ' + content.slice(0, 500)).toLowerCase();

    if (lower.includes('prd') || lower.includes('product requirement')) return 'prd';
    if (lower.includes('architecture') || lower.includes('system design')) return 'architecture';
    if (lower.includes('technical spec') || lower.includes('tech spec')) return 'technical-spec';
    if (lower.includes('api') || lower.includes('endpoint')) return 'api-design';
    if (lower.includes('security') || lower.includes('authentication')) return 'security';
    if (lower.includes('infrastructure') || lower.includes('deployment')) return 'infrastructure';
    if (lower.includes('test') || lower.includes('qa')) return 'testing';
    if (lower.includes('research') || lower.includes('analysis')) return 'research';
    if (lower.includes('design') || lower.includes('ui') || lower.includes('ux')) return 'design';

    return 'documentation';
  }

  /**
   * Format category for display
   */
  private formatCategory(category: string): string {
    const mapping: Record<string, string> = {
      'prd': 'PRD',
      'architecture': 'Architecture',
      'technical-spec': 'Technical Spec',
      'api-design': 'API Design',
      'security': 'Security',
      'infrastructure': 'Infrastructure',
      'testing': 'Testing',
      'documentation': 'Documentation',
      'research': 'Research',
      'design': 'Design',
    };
    return mapping[category] || 'Documentation';
  }

  /**
   * Extract description from content
   */
  private extractDescription(content: string): string {
    const lines = content.split('\n');

    // Skip title lines and find first substantial paragraph
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('#')) continue;
      if (!trimmed) continue;
      if (trimmed.length < 20) continue;

      // Return first 200 characters of the paragraph
      return trimmed.slice(0, 200) + (trimmed.length > 200 ? '...' : '');
    }

    return '';
  }
}

/**
 * Export documents to Notion (convenience function)
 */
export async function exportToNotion(
  config: NotionConfig,
  documents: Array<{ name: string; content: string; category?: string }>,
  options: NotionExportOptions = {}
): Promise<NotionExportResult> {
  const exporter = new NotionExporter(config);
  return exporter.export(documents, options);
}
