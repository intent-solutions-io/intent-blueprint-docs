/**
 * Template Loader
 * Load and validate YAML template definitions
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join, basename, extname } from 'path';
import yaml from 'js-yaml';
import type {
  CustomTemplate,
  TemplateMeta,
  TemplateVariable,
  TemplateSection,
  TemplateLibrary,
} from './types.js';

export class TemplateLoader {
  private basePath: string;

  constructor(basePath?: string) {
    this.basePath = basePath || process.cwd();
  }

  /**
   * Load a template from a YAML file
   */
  loadFile(filePath: string): CustomTemplate {
    const fullPath = this.resolvePath(filePath);

    if (!existsSync(fullPath)) {
      throw new Error(`Template file not found: ${fullPath}`);
    }

    const content = readFileSync(fullPath, 'utf-8');
    return this.parse(content, filePath);
  }

  /**
   * Load all templates from a directory
   */
  loadDirectory(dirPath: string): CustomTemplate[] {
    const fullPath = this.resolvePath(dirPath);

    if (!existsSync(fullPath)) {
      throw new Error(`Template directory not found: ${fullPath}`);
    }

    const templates: CustomTemplate[] = [];
    const files = readdirSync(fullPath);

    for (const file of files) {
      const filePath = join(fullPath, file);
      const stat = statSync(filePath);

      if (stat.isFile() && this.isTemplateFile(file)) {
        try {
          templates.push(this.loadFile(filePath));
        } catch (error) {
          console.warn(`Failed to load template ${file}:`, error);
        }
      } else if (stat.isDirectory()) {
        // Recursively load subdirectories
        templates.push(...this.loadDirectory(filePath));
      }
    }

    return templates;
  }

  /**
   * Load a template library
   */
  loadLibrary(libraryPath: string): { library: TemplateLibrary; templates: CustomTemplate[] } {
    const fullPath = this.resolvePath(libraryPath);
    const libraryFile = join(fullPath, 'library.yaml');

    if (!existsSync(libraryFile)) {
      throw new Error(`Library file not found: ${libraryFile}`);
    }

    const content = readFileSync(libraryFile, 'utf-8');
    const library = yaml.load(content) as TemplateLibrary;

    const templates: CustomTemplate[] = [];

    for (const templatePath of library.templates) {
      const templateFullPath = join(fullPath, templatePath);
      templates.push(this.loadFile(templateFullPath));
    }

    return { library, templates };
  }

  /**
   * Parse YAML content into a template
   */
  parse(content: string, source?: string): CustomTemplate {
    const data = yaml.load(content) as Record<string, unknown>;
    return this.validate(data, source);
  }

  /**
   * Validate and normalize template data
   */
  validate(data: Record<string, unknown>, source?: string): CustomTemplate {
    // Validate meta
    if (!data.meta || typeof data.meta !== 'object') {
      throw new Error(`Invalid template: missing meta section${source ? ` in ${source}` : ''}`);
    }

    const meta = this.validateMeta(data.meta as Record<string, unknown>, source);

    // Validate variables
    const variables = this.validateVariables(
      (data.variables as Record<string, unknown>[]) || [],
      source
    );

    // Validate sections
    const sections = this.validateSections(
      (data.sections as Record<string, unknown>[]) || [],
      source
    );

    const template: CustomTemplate = {
      meta,
      variables,
      sections,
    };

    // Optional fields
    if (data.extends) {
      template.extends = String(data.extends);
    }

    if (data.prompts) {
      template.prompts = (data.prompts as Record<string, unknown>[]).map(p => ({
        id: String(p.id),
        section: String(p.section),
        system: p.system ? String(p.system) : undefined,
        user: String(p.user),
        model: p.model as 'claude' | 'gpt-4' | 'gemini' | 'ollama' | 'auto',
        temperature: p.temperature as number,
        maxTokens: p.maxTokens as number,
      }));
    }

    return template;
  }

  /**
   * Validate template meta
   */
  private validateMeta(data: Record<string, unknown>, source?: string): TemplateMeta {
    const required = ['id', 'name', 'description', 'version', 'category', 'scope'];
    for (const field of required) {
      if (!data[field]) {
        throw new Error(`Invalid template meta: missing ${field}${source ? ` in ${source}` : ''}`);
      }
    }

    return {
      id: String(data.id),
      name: String(data.name),
      description: String(data.description),
      version: String(data.version),
      category: String(data.category),
      scope: data.scope as 'mvp' | 'standard' | 'comprehensive' | 'enterprise',
      author: data.author ? String(data.author) : undefined,
      audience: data.audience as 'startup' | 'business' | 'enterprise',
      tags: data.tags as string[],
      license: data.license ? String(data.license) : undefined,
    };
  }

  /**
   * Validate template variables
   */
  private validateVariables(data: Record<string, unknown>[], source?: string): TemplateVariable[] {
    return data.map((v, index) => {
      if (!v.name) {
        throw new Error(`Invalid variable at index ${index}: missing name${source ? ` in ${source}` : ''}`);
      }

      return {
        name: String(v.name),
        label: String(v.label || v.name),
        type: (v.type as TemplateVariable['type']) || 'string',
        default: v.default,
        required: Boolean(v.required),
        description: v.description ? String(v.description) : undefined,
        options: v.options as Array<{ label: string; value: string }>,
        pattern: v.pattern ? String(v.pattern) : undefined,
        min: v.min as number,
        max: v.max as number,
      };
    });
  }

  /**
   * Validate template sections
   */
  private validateSections(data: Record<string, unknown>[], source?: string): TemplateSection[] {
    return data.map((s, index) => {
      if (!s.id) {
        throw new Error(`Invalid section at index ${index}: missing id${source ? ` in ${source}` : ''}`);
      }
      if (!s.title) {
        throw new Error(`Invalid section at index ${index}: missing title${source ? ` in ${source}` : ''}`);
      }

      const section: TemplateSection = {
        id: String(s.id),
        title: String(s.title),
        content: String(s.content || ''),
        order: s.order as number,
        collapsible: s.collapsible as boolean,
        prompt: s.prompt ? String(s.prompt) : undefined,
      };

      // Validate condition
      if (s.condition) {
        const cond = s.condition as Record<string, unknown>;
        section.condition = {
          variable: String(cond.variable),
          operator: cond.operator as 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'exists' | 'not_exists',
          value: cond.value,
        };
      }

      // Validate nested sections
      if (s.sections) {
        section.sections = this.validateSections(s.sections as Record<string, unknown>[], source);
      }

      return section;
    });
  }

  /**
   * Check if file is a template file
   */
  private isTemplateFile(filename: string): boolean {
    const ext = extname(filename).toLowerCase();
    return ext === '.yaml' || ext === '.yml';
  }

  /**
   * Resolve file path
   */
  private resolvePath(filePath: string): string {
    if (filePath.startsWith('/')) {
      return filePath;
    }
    return join(this.basePath, filePath);
  }

  /**
   * Create a blank template scaffold
   */
  static createBlankTemplate(id: string, name: string): CustomTemplate {
    return {
      meta: {
        id,
        name,
        description: 'A custom template',
        version: '1.0.0',
        category: 'custom',
        scope: 'standard',
      },
      variables: [
        {
          name: 'projectName',
          label: 'Project Name',
          type: 'string',
          required: true,
        },
        {
          name: 'projectDescription',
          label: 'Project Description',
          type: 'text',
          required: true,
        },
      ],
      sections: [
        {
          id: 'overview',
          title: 'Overview',
          content: '{{projectDescription}}',
          order: 1,
        },
        {
          id: 'details',
          title: 'Details',
          content: 'Add your content here.',
          order: 2,
        },
      ],
    };
  }

  /**
   * Export template to YAML
   */
  static toYaml(template: CustomTemplate): string {
    return yaml.dump(template, {
      indent: 2,
      lineWidth: 120,
      noRefs: true,
      sortKeys: false,
    });
  }
}

/**
 * Create a template loader instance
 */
export function createTemplateLoader(basePath?: string): TemplateLoader {
  return new TemplateLoader(basePath);
}
