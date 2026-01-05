/**
 * Intent Blueprint Core
 * Template engine for enterprise documentation generation
 */

import Handlebars from 'handlebars';
import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Types
export interface TemplateContext {
  projectName: string;
  projectDescription: string;
  scope: 'mvp' | 'standard' | 'comprehensive';
  audience: 'startup' | 'business' | 'enterprise';
  projectType?: string;
  techStack?: string[];
  features?: string[];
  timeline?: string;
  team?: string;
  [key: string]: unknown;
}

export interface GeneratedDocument {
  name: string;
  filename: string;
  content: string;
  category: string;
}

export interface TemplateInfo {
  id: string;
  name: string;
  filename: string;
  category: string;
  description: string;
}

// Template categories
const TEMPLATE_CATEGORIES: Record<string, string[]> = {
  'Product & Strategy': ['01_prd.md', '05_market_research.md', '07_competitor_analysis.md', '08_personas.md', '14_project_brief.md'],
  'Technical Architecture': ['02_adr.md', '06_architecture.md', '16_frontend_spec.md', '19_operational_readiness.md'],
  'User Experience': ['09_user_journeys.md', '10_user_stories.md', '11_acceptance_criteria.md'],
  'Development Workflow': ['03_generate_tasks.md', '04_process_task_list.md', '13_risk_register.md', '15_brainstorming.md', '20_metrics_dashboard.md'],
  'Quality Assurance': ['17_test_plan.md', '12_qa_gate.md', '18_release_plan.md', '21_postmortem.md', '22_playtest_usability.md']
};

// Scope mappings
const SCOPE_TEMPLATES: Record<string, string[]> = {
  mvp: ['01_prd.md', '03_generate_tasks.md', '14_project_brief.md', '15_brainstorming.md'],
  standard: [
    '01_prd.md', '02_adr.md', '03_generate_tasks.md', '06_architecture.md',
    '08_personas.md', '09_user_journeys.md', '10_user_stories.md', '11_acceptance_criteria.md',
    '14_project_brief.md', '15_brainstorming.md', '17_test_plan.md', '18_release_plan.md'
  ],
  comprehensive: Object.values(TEMPLATE_CATEGORIES).flat()
};

/**
 * Get the templates directory path
 */
export function getTemplatesDir(): string {
  // Try multiple locations
  const possiblePaths = [
    join(process.cwd(), 'templates', 'core'),
    join(process.cwd(), 'professional-templates'),
    join(dirname(fileURLToPath(import.meta.url)), '..', 'templates'),
  ];

  for (const p of possiblePaths) {
    if (existsSync(p)) {
      return p;
    }
  }

  throw new Error('Templates directory not found');
}

/**
 * List all available templates
 */
export function listTemplates(): TemplateInfo[] {
  const templatesDir = getTemplatesDir();
  const files = readdirSync(templatesDir).filter(f => f.endsWith('.md'));

  return files.map(filename => {
    const id = filename.replace('.md', '');
    const name = id.replace(/^\d+_/, '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const category = Object.entries(TEMPLATE_CATEGORIES).find(([, templates]) =>
      templates.includes(filename)
    )?.[0] || 'Other';

    return {
      id,
      name,
      filename,
      category,
      description: `Generate ${name} documentation`
    };
  });
}

/**
 * Get templates for a specific scope
 */
export function getTemplatesForScope(scope: 'mvp' | 'standard' | 'comprehensive'): TemplateInfo[] {
  const scopeTemplates = SCOPE_TEMPLATES[scope];
  return listTemplates().filter(t => scopeTemplates.includes(t.filename));
}

/**
 * Read and compile a template
 */
export function compileTemplate(templateName: string): HandlebarsTemplateDelegate {
  const templatesDir = getTemplatesDir();
  const templatePath = join(templatesDir, templateName.endsWith('.md') ? templateName : `${templateName}.md`);

  if (!existsSync(templatePath)) {
    throw new Error(`Template not found: ${templateName}`);
  }

  const templateContent = readFileSync(templatePath, 'utf-8');

  // Replace {{DATE}} with current date
  const withDate = templateContent.replace(/\{\{DATE\}\}/g, new Date().toISOString().split('T')[0]);

  return Handlebars.compile(withDate);
}

/**
 * Generate a single document from a template
 */
export function generateDocument(templateName: string, context: TemplateContext): GeneratedDocument {
  const template = compileTemplate(templateName);
  const content = template(context);

  const info = listTemplates().find(t => t.filename === templateName || t.id === templateName);

  return {
    name: info?.name || templateName,
    filename: `${context.projectName.toLowerCase().replace(/\s+/g, '-')}-${templateName}`,
    content,
    category: info?.category || 'Other'
  };
}

/**
 * Generate all documents for a scope
 */
export function generateAllDocuments(context: TemplateContext): GeneratedDocument[] {
  const templates = getTemplatesForScope(context.scope);
  return templates.map(t => generateDocument(t.filename, context));
}

/**
 * Write generated documents to disk
 */
export function writeDocuments(documents: GeneratedDocument[], outputDir: string): string[] {
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const writtenFiles: string[] = [];

  for (const doc of documents) {
    const filePath = join(outputDir, doc.filename);
    writeFileSync(filePath, doc.content);
    writtenFiles.push(filePath);
  }

  // Generate index
  const indexContent = `# ${documents[0]?.filename.split('-')[0] || 'Project'} Documentation

Generated: ${new Date().toISOString()}

## Documents

${documents.map(d => `- [${d.name}](./${d.filename}) - ${d.category}`).join('\n')}
`;

  const indexPath = join(outputDir, 'index.md');
  writeFileSync(indexPath, indexContent);
  writtenFiles.push(indexPath);

  return writtenFiles;
}

// Export types and utilities
export { Handlebars };
export const SCOPES = ['mvp', 'standard', 'comprehensive'] as const;
export const AUDIENCES = ['startup', 'business', 'enterprise'] as const;
