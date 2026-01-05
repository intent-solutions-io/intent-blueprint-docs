/**
 * Custom Template Engine
 * Compiles YAML templates with variable interpolation and conditional logic
 */

import type {
  CustomTemplate,
  TemplateSection,
  TemplateVariable,
  TemplateContext,
  CompiledTemplate,
  CompiledSection,
  SectionCondition,
} from './types.js';

export class TemplateEngine {
  private templates: Map<string, CustomTemplate> = new Map();
  private helpers: Map<string, TemplateHelper> = new Map();

  constructor() {
    this.registerDefaultHelpers();
  }

  /**
   * Register a template
   */
  registerTemplate(template: CustomTemplate): void {
    this.templates.set(template.meta.id, template);
  }

  /**
   * Get a registered template
   */
  getTemplate(id: string): CustomTemplate | undefined {
    return this.templates.get(id);
  }

  /**
   * List all registered templates
   */
  listTemplates(): CustomTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Register a custom helper function
   */
  registerHelper(name: string, helper: TemplateHelper): void {
    this.helpers.set(name, helper);
  }

  /**
   * Compile a template with context
   */
  compile(template: CustomTemplate, context: TemplateContext): CompiledTemplate {
    // Resolve inheritance
    const resolvedTemplate = this.resolveInheritance(template);

    // Merge defaults with provided variables
    const variables = this.resolveVariables(resolvedTemplate.variables, context.variables);

    // Compile sections
    const sections = this.compileSections(resolvedTemplate.sections, variables);

    return {
      template: resolvedTemplate,
      sections,
      variables,
    };
  }

  /**
   * Render compiled template to markdown
   */
  render(compiled: CompiledTemplate): string {
    const lines: string[] = [];

    // Add title
    lines.push(`# ${this.interpolate(compiled.template.meta.name, compiled.variables)}`);
    lines.push('');

    // Render sections
    for (const section of compiled.sections) {
      lines.push(...this.renderSection(section, 2));
    }

    return lines.join('\n');
  }

  /**
   * Compile and render in one step
   */
  process(template: CustomTemplate, context: TemplateContext): string {
    const compiled = this.compile(template, context);
    return this.render(compiled);
  }

  /**
   * Resolve template inheritance
   */
  private resolveInheritance(template: CustomTemplate): CustomTemplate {
    if (!template.extends) {
      return template;
    }

    const parent = this.templates.get(template.extends);
    if (!parent) {
      throw new Error(`Parent template not found: ${template.extends}`);
    }

    // Resolve parent first (recursive)
    const resolvedParent = this.resolveInheritance(parent);

    // Merge templates (child overrides parent)
    return {
      meta: { ...resolvedParent.meta, ...template.meta },
      variables: this.mergeVariables(resolvedParent.variables, template.variables),
      sections: this.mergeSections(resolvedParent.sections, template.sections),
      prompts: [...(resolvedParent.prompts || []), ...(template.prompts || [])],
    };
  }

  /**
   * Merge variable definitions
   */
  private mergeVariables(parent: TemplateVariable[], child: TemplateVariable[]): TemplateVariable[] {
    const merged = new Map<string, TemplateVariable>();

    // Add parent variables
    for (const v of parent) {
      merged.set(v.name, v);
    }

    // Override/add child variables
    for (const v of child) {
      merged.set(v.name, { ...merged.get(v.name), ...v });
    }

    return Array.from(merged.values());
  }

  /**
   * Merge section definitions
   */
  private mergeSections(parent: TemplateSection[], child: TemplateSection[]): TemplateSection[] {
    const merged = new Map<string, TemplateSection>();

    // Add parent sections
    for (const s of parent) {
      merged.set(s.id, s);
    }

    // Override/add child sections
    for (const s of child) {
      const existing = merged.get(s.id);
      if (existing) {
        merged.set(s.id, {
          ...existing,
          ...s,
          sections: s.sections
            ? this.mergeSections(existing.sections || [], s.sections)
            : existing.sections,
        });
      } else {
        merged.set(s.id, s);
      }
    }

    // Sort by order
    return Array.from(merged.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  /**
   * Resolve variables with defaults
   */
  private resolveVariables(
    definitions: TemplateVariable[],
    provided: Record<string, unknown>
  ): Record<string, unknown> {
    const resolved: Record<string, unknown> = {};

    for (const def of definitions) {
      if (provided[def.name] !== undefined) {
        resolved[def.name] = provided[def.name];
      } else if (def.default !== undefined) {
        resolved[def.name] = def.default;
      } else if (def.required) {
        throw new Error(`Required variable missing: ${def.name}`);
      }
    }

    // Add any extra provided variables
    for (const [key, value] of Object.entries(provided)) {
      if (resolved[key] === undefined) {
        resolved[key] = value;
      }
    }

    return resolved;
  }

  /**
   * Compile sections with conditions and interpolation
   */
  private compileSections(
    sections: TemplateSection[],
    variables: Record<string, unknown>
  ): CompiledSection[] {
    const compiled: CompiledSection[] = [];

    for (const section of sections) {
      // Check condition
      if (section.condition && !this.evaluateCondition(section.condition, variables)) {
        continue;
      }

      // Compile section
      const compiledSection: CompiledSection = {
        id: section.id,
        title: this.interpolate(section.title, variables),
        content: this.interpolate(section.content, variables),
      };

      // Compile nested sections
      if (section.sections) {
        compiledSection.sections = this.compileSections(section.sections, variables);
      }

      compiled.push(compiledSection);
    }

    return compiled;
  }

  /**
   * Evaluate a condition
   */
  private evaluateCondition(condition: SectionCondition, variables: Record<string, unknown>): boolean {
    const value = variables[condition.variable];

    switch (condition.operator) {
      case 'equals':
        return value === condition.value;
      case 'not_equals':
        return value !== condition.value;
      case 'contains':
        if (Array.isArray(value)) {
          return value.includes(condition.value);
        }
        if (typeof value === 'string') {
          return value.includes(String(condition.value));
        }
        return false;
      case 'not_contains':
        if (Array.isArray(value)) {
          return !value.includes(condition.value);
        }
        if (typeof value === 'string') {
          return !value.includes(String(condition.value));
        }
        return true;
      case 'greater_than':
        return typeof value === 'number' && value > Number(condition.value);
      case 'less_than':
        return typeof value === 'number' && value < Number(condition.value);
      case 'exists':
        return value !== undefined && value !== null && value !== '';
      case 'not_exists':
        return value === undefined || value === null || value === '';
      default:
        return true;
    }
  }

  /**
   * Interpolate variables in a string
   */
  interpolate(text: string, variables: Record<string, unknown>): string {
    // Handle {{variable}} syntax
    let result = text.replace(/\{\{(\w+)\}\}/g, (_, name) => {
      const value = variables[name];
      if (value === undefined) return `{{${name}}}`;
      return String(value);
    });

    // Handle {{#if condition}}...{{/if}} blocks
    result = this.processConditionalBlocks(result, variables);

    // Handle {{#each array}}...{{/each}} blocks
    result = this.processLoopBlocks(result, variables);

    // Handle {{helper arg1 arg2}} calls
    result = this.processHelperCalls(result, variables);

    return result;
  }

  /**
   * Process conditional blocks
   */
  private processConditionalBlocks(text: string, variables: Record<string, unknown>): string {
    const ifPattern = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
    const ifElsePattern = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{else\}\}([\s\S]*?)\{\{\/if\}\}/g;

    // Handle if-else first
    let result = text.replace(ifElsePattern, (_, varName, ifContent, elseContent) => {
      const value = variables[varName];
      const isTruthy = value !== undefined && value !== null && value !== false && value !== '';
      return isTruthy ? ifContent : elseContent;
    });

    // Handle simple if
    result = result.replace(ifPattern, (_, varName, content) => {
      const value = variables[varName];
      const isTruthy = value !== undefined && value !== null && value !== false && value !== '';
      return isTruthy ? content : '';
    });

    // Handle {{#unless variable}}
    const unlessPattern = /\{\{#unless\s+(\w+)\}\}([\s\S]*?)\{\{\/unless\}\}/g;
    result = result.replace(unlessPattern, (_, varName, content) => {
      const value = variables[varName];
      const isFalsy = value === undefined || value === null || value === false || value === '';
      return isFalsy ? content : '';
    });

    return result;
  }

  /**
   * Process loop blocks
   */
  private processLoopBlocks(text: string, variables: Record<string, unknown>): string {
    const eachPattern = /\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g;

    return text.replace(eachPattern, (_, varName, content) => {
      const value = variables[varName];
      if (!Array.isArray(value)) return '';

      return value.map((item, index) => {
        // Replace {{this}} with item value
        let itemContent = content.replace(/\{\{this\}\}/g, String(item));
        // Replace {{@index}} with index
        itemContent = itemContent.replace(/\{\{@index\}\}/g, String(index));
        // Replace {{@first}} and {{@last}}
        itemContent = itemContent.replace(/\{\{@first\}\}/g, String(index === 0));
        itemContent = itemContent.replace(/\{\{@last\}\}/g, String(index === value.length - 1));

        // If item is object, allow {{property}} access
        if (typeof item === 'object' && item !== null) {
          for (const [key, val] of Object.entries(item)) {
            itemContent = itemContent.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(val));
          }
        }

        return itemContent;
      }).join('');
    });
  }

  /**
   * Process helper function calls
   */
  private processHelperCalls(text: string, variables: Record<string, unknown>): string {
    // Match {{helperName arg1 arg2 ...}}
    const helperPattern = /\{\{(\w+)(?:\s+([^}]+))?\}\}/g;

    return text.replace(helperPattern, (match, helperName, argsString) => {
      const helper = this.helpers.get(helperName);
      if (!helper) return match; // Not a helper, return unchanged

      // Parse arguments
      const args = argsString
        ? argsString.split(/\s+/).map((arg: string) => {
            // Check if arg is a variable reference
            if (variables[arg] !== undefined) {
              return variables[arg];
            }
            // Check if arg is a string literal
            if (arg.startsWith('"') && arg.endsWith('"')) {
              return arg.slice(1, -1);
            }
            if (arg.startsWith("'") && arg.endsWith("'")) {
              return arg.slice(1, -1);
            }
            // Check if arg is a number
            if (!isNaN(Number(arg))) {
              return Number(arg);
            }
            return arg;
          })
        : [];

      return String(helper(args, variables));
    });
  }

  /**
   * Render a section to markdown
   */
  private renderSection(section: CompiledSection, level: number): string[] {
    const lines: string[] = [];
    const prefix = '#'.repeat(Math.min(level, 6));

    lines.push(`${prefix} ${section.title}`);
    lines.push('');

    if (section.content.trim()) {
      lines.push(section.content.trim());
      lines.push('');
    }

    if (section.sections) {
      for (const child of section.sections) {
        lines.push(...this.renderSection(child, level + 1));
      }
    }

    return lines;
  }

  /**
   * Register default helper functions
   */
  private registerDefaultHelpers(): void {
    // Date formatting
    this.registerHelper('date', (args) => {
      const format = args[0] as string || 'YYYY-MM-DD';
      const date = new Date();
      return this.formatDate(date, format);
    });

    // Uppercase
    this.registerHelper('uppercase', (args) => {
      return String(args[0] || '').toUpperCase();
    });

    // Lowercase
    this.registerHelper('lowercase', (args) => {
      return String(args[0] || '').toLowerCase();
    });

    // Capitalize
    this.registerHelper('capitalize', (args) => {
      const str = String(args[0] || '');
      return str.charAt(0).toUpperCase() + str.slice(1);
    });

    // Join array
    this.registerHelper('join', (args) => {
      const arr = args[0];
      const separator = String(args[1] || ', ');
      if (Array.isArray(arr)) {
        return arr.join(separator);
      }
      return String(arr);
    });

    // Default value
    this.registerHelper('default', (args) => {
      return args[0] !== undefined && args[0] !== null && args[0] !== '' ? args[0] : args[1];
    });

    // Length
    this.registerHelper('length', (args) => {
      const val = args[0];
      if (Array.isArray(val)) return val.length;
      if (typeof val === 'string') return val.length;
      return 0;
    });

    // Truncate
    this.registerHelper('truncate', (args) => {
      const str = String(args[0] || '');
      const len = Number(args[1]) || 100;
      if (str.length <= len) return str;
      return str.slice(0, len) + '...';
    });

    // Slug
    this.registerHelper('slug', (args) => {
      return String(args[0] || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    });
  }

  /**
   * Format date helper
   */
  private formatDate(date: Date, format: string): string {
    const pad = (n: number) => String(n).padStart(2, '0');

    return format
      .replace('YYYY', String(date.getFullYear()))
      .replace('MM', pad(date.getMonth() + 1))
      .replace('DD', pad(date.getDate()))
      .replace('HH', pad(date.getHours()))
      .replace('mm', pad(date.getMinutes()))
      .replace('ss', pad(date.getSeconds()));
  }
}

/**
 * Helper function type
 */
type TemplateHelper = (args: unknown[], variables: Record<string, unknown>) => unknown;

/**
 * Create a template engine instance
 */
export function createTemplateEngine(): TemplateEngine {
  return new TemplateEngine();
}
