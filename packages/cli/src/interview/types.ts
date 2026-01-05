/**
 * Interview Engine Types
 */

export type ProjectType =
  | 'saas-web'
  | 'mobile-app'
  | 'api-backend'
  | 'cli-tool'
  | 'library-sdk'
  | 'desktop-app'
  | 'ecommerce'
  | 'marketplace'
  | 'ai-ml'
  | 'iot'
  | 'blockchain'
  | 'gaming'
  | 'other';

export type Complexity = 'simple' | 'moderate' | 'complex' | 'enterprise';

export type Audience = 'startup' | 'business' | 'enterprise';

export type Scope = 'mvp' | 'standard' | 'comprehensive';

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'select' | 'multiselect' | 'number' | 'confirm' | 'editor';
  required: boolean;
  options?: string[];
  default?: string | string[] | number | boolean;
  hint?: string;
  /** Show this question only if condition returns true */
  condition?: (answers: InterviewAnswers) => boolean;
  /** Validate the answer */
  validate?: (value: unknown, answers: InterviewAnswers) => boolean | string;
  /** Transform the answer before storing */
  transform?: (value: unknown) => unknown;
}

export interface QuestionGroup {
  id: string;
  name: string;
  description: string;
  questions: Question[];
  /** Show this group only if condition returns true */
  condition?: (answers: InterviewAnswers) => boolean;
}

export interface InterviewAnswers {
  // Core
  projectName?: string;
  projectDescription?: string;
  projectType?: ProjectType;

  // Technical
  techStack?: string[];
  hasBackend?: boolean;
  hasDatabase?: boolean;
  hasFrontend?: boolean;
  hasAuth?: boolean;
  hasPayments?: boolean;
  deploymentTarget?: string;

  // Business
  audience?: Audience;
  teamSize?: string;
  timeline?: string;
  budget?: string;
  hasCompetitors?: boolean;
  competitorNames?: string[];
  monetization?: string;

  // Scope
  scope?: Scope;
  priorityFeatures?: string[];
  mvpFeatures?: string[];

  // Compliance
  needsCompliance?: boolean;
  complianceTypes?: string[];

  // Additional
  [key: string]: unknown;
}

export interface DetectedContext {
  projectType: ProjectType;
  complexity: Complexity;
  suggestedScope: Scope;
  suggestedAudience: Audience;
  detectedTechnologies: string[];
  detectedFeatures: string[];
  confidence: number;
  reasoning: string[];
}

export interface GapAnalysis {
  missingRequired: string[];
  missingRecommended: string[];
  assumptions: Array<{ field: string; assumption: string; confidence: number }>;
  suggestions: string[];
  completenessScore: number;
}

export interface InterviewResult {
  answers: InterviewAnswers;
  detected: DetectedContext;
  gaps: GapAnalysis;
  templateContext: Record<string, unknown>;
  summary: string;
}
