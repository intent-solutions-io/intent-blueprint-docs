/**
 * Custom Template Engine Types
 * YAML-based template definitions with advanced features
 */

export interface CustomTemplate {
  /** Template metadata */
  meta: TemplateMeta;
  /** Template variables with defaults */
  variables: TemplateVariable[];
  /** Template sections */
  sections: TemplateSection[];
  /** Template inheritance */
  extends?: string;
  /** Custom prompts for AI generation */
  prompts?: TemplatePrompt[];
}

export interface TemplateMeta {
  /** Unique template ID */
  id: string;
  /** Display name */
  name: string;
  /** Template description */
  description: string;
  /** Template version */
  version: string;
  /** Template author */
  author?: string;
  /** Template category */
  category: string;
  /** Required scope level */
  scope: 'mvp' | 'standard' | 'comprehensive' | 'enterprise';
  /** Target audience */
  audience?: 'startup' | 'business' | 'enterprise';
  /** Tags for discovery */
  tags?: string[];
  /** License */
  license?: string;
}

export interface TemplateVariable {
  /** Variable name (used in interpolation) */
  name: string;
  /** Display label */
  label: string;
  /** Variable type */
  type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect' | 'text' | 'date';
  /** Default value */
  default?: unknown;
  /** Whether variable is required */
  required?: boolean;
  /** Help text */
  description?: string;
  /** Options for select/multiselect */
  options?: Array<{ label: string; value: string }>;
  /** Validation pattern (regex) */
  pattern?: string;
  /** Minimum value (for numbers) */
  min?: number;
  /** Maximum value (for numbers) */
  max?: number;
}

export interface TemplateSection {
  /** Section ID */
  id: string;
  /** Section title */
  title: string;
  /** Section content (markdown with variable interpolation) */
  content: string;
  /** Condition for including section */
  condition?: SectionCondition;
  /** Nested sections */
  sections?: TemplateSection[];
  /** Whether section is collapsible */
  collapsible?: boolean;
  /** Section order weight */
  order?: number;
  /** AI prompt for generating this section */
  prompt?: string;
}

export interface SectionCondition {
  /** Variable to check */
  variable: string;
  /** Operator */
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'exists' | 'not_exists';
  /** Value to compare */
  value?: unknown;
}

export interface TemplatePrompt {
  /** Prompt ID */
  id: string;
  /** Which section this prompt generates */
  section: string;
  /** System prompt */
  system?: string;
  /** User prompt template */
  user: string;
  /** Model preference */
  model?: 'claude' | 'gpt-4' | 'gemini' | 'ollama' | 'auto';
  /** Temperature */
  temperature?: number;
  /** Max tokens */
  maxTokens?: number;
}

export interface TemplateContext {
  /** All variable values */
  variables: Record<string, unknown>;
  /** Parent template context (for inheritance) */
  parent?: TemplateContext;
  /** Additional metadata */
  meta?: Record<string, unknown>;
}

export interface CompiledTemplate {
  /** Original template */
  template: CustomTemplate;
  /** Compiled sections (with conditions evaluated) */
  sections: CompiledSection[];
  /** Resolved variables */
  variables: Record<string, unknown>;
}

export interface CompiledSection {
  /** Section ID */
  id: string;
  /** Section title (interpolated) */
  title: string;
  /** Section content (interpolated) */
  content: string;
  /** Nested sections */
  sections?: CompiledSection[];
  /** Whether section was AI-generated */
  aiGenerated?: boolean;
}

export interface TemplateLibrary {
  /** Library name */
  name: string;
  /** Library description */
  description?: string;
  /** Library version */
  version: string;
  /** Template files in library */
  templates: string[];
  /** Base path for templates */
  basePath?: string;
  /** Remote URL for syncing */
  remote?: string;
}

export interface TeamConfig {
  /** Team ID */
  id: string;
  /** Team name */
  name: string;
  /** Team members */
  members?: TeamMember[];
  /** Template libraries */
  libraries?: TemplateLibrary[];
  /** Default template settings */
  defaults?: {
    scope?: 'mvp' | 'standard' | 'comprehensive' | 'enterprise';
    audience?: 'startup' | 'business' | 'enterprise';
    model?: string;
  };
  /** Audit settings */
  audit?: {
    enabled?: boolean;
    retention?: number; // days
    destination?: string; // file path or URL
  };
}

export interface TeamMember {
  /** Member ID */
  id: string;
  /** Member name */
  name: string;
  /** Member email */
  email?: string;
  /** Member role */
  role: 'owner' | 'admin' | 'member' | 'viewer';
  /** Allowed template categories */
  allowedCategories?: string[];
}

export interface AuditEntry {
  /** Entry ID */
  id: string;
  /** Timestamp */
  timestamp: string;
  /** User who generated */
  user?: string;
  /** Action type */
  action: 'generate' | 'export' | 'customize' | 'create';
  /** Template used */
  template: string;
  /** Variables used */
  variables: Record<string, unknown>;
  /** Output location */
  output?: string;
  /** Duration in ms */
  duration?: number;
  /** Success status */
  success: boolean;
  /** Error message if failed */
  error?: string;
}

/**
 * Built-in template categories
 */
export const TEMPLATE_CATEGORIES = [
  'product',
  'technical',
  'design',
  'testing',
  'operations',
  'compliance',
  'business',
  'custom',
] as const;

/**
 * Default variable types with their configurations
 */
export const DEFAULT_VARIABLE_CONFIGS: Record<string, Partial<TemplateVariable>> = {
  projectName: {
    label: 'Project Name',
    type: 'string',
    required: true,
    description: 'The name of your project',
  },
  projectDescription: {
    label: 'Project Description',
    type: 'text',
    required: true,
    description: 'A detailed description of your project',
  },
  scope: {
    label: 'Documentation Scope',
    type: 'select',
    options: [
      { label: 'MVP (4 docs)', value: 'mvp' },
      { label: 'Standard (12 docs)', value: 'standard' },
      { label: 'Comprehensive (22 docs)', value: 'comprehensive' },
    ],
    default: 'standard',
  },
  audience: {
    label: 'Target Audience',
    type: 'select',
    options: [
      { label: 'Startup', value: 'startup' },
      { label: 'Business', value: 'business' },
      { label: 'Enterprise', value: 'enterprise' },
    ],
    default: 'business',
  },
};
