/**
 * REST API Types
 * Types for the programmatic API interface
 */

import type { CustomTemplate, CompiledTemplate, TeamConfig, AuditEntry } from '../templates/types.js';

/**
 * API Configuration
 */
export interface ApiConfig {
  /** Port to listen on */
  port?: number;
  /** Host to bind to */
  host?: string;
  /** API key for authentication */
  apiKey?: string;
  /** Enable CORS */
  cors?: boolean;
  /** Allowed origins for CORS */
  allowedOrigins?: string[];
  /** Rate limit (requests per minute) */
  rateLimit?: number;
  /** Enable request logging */
  logging?: boolean;
}

/**
 * API Request context
 */
export interface ApiContext {
  /** Request ID */
  requestId: string;
  /** Authenticated user/client */
  clientId?: string;
  /** Request timestamp */
  timestamp: Date;
}

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: {
    requestId: string;
    timestamp: string;
    duration?: number;
  };
}

/**
 * API Error
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Generate request
 */
export interface GenerateRequest {
  /** Template ID to use */
  templateId: string;
  /** Variables for template */
  variables: Record<string, unknown>;
  /** Output format */
  format?: 'markdown' | 'html' | 'json';
  /** Whether to include metadata */
  includeMeta?: boolean;
}

/**
 * Generate response
 */
export interface GenerateResponse {
  /** Generated content */
  content: string;
  /** Template metadata */
  template: {
    id: string;
    name: string;
    version: string;
  };
  /** Variables used */
  variables: Record<string, unknown>;
  /** Generation timestamp */
  generatedAt: string;
}

/**
 * Template list response
 */
export interface TemplateListResponse {
  templates: TemplateInfo[];
  total: number;
}

/**
 * Template info
 */
export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;
  scope: string;
  author?: string;
  tags?: string[];
}

/**
 * Template detail response
 */
export interface TemplateDetailResponse {
  template: CustomTemplate;
}

/**
 * Interview start request
 */
export interface InterviewStartRequest {
  /** Project type hint */
  projectType?: string;
  /** Partial answers to pre-fill */
  prefill?: Record<string, unknown>;
}

/**
 * Interview state
 */
export interface InterviewState {
  /** Session ID */
  sessionId: string;
  /** Current question index */
  currentIndex: number;
  /** Total questions */
  totalQuestions: number;
  /** Current question */
  currentQuestion: InterviewQuestion;
  /** Collected answers */
  answers: Record<string, unknown>;
  /** Whether interview is complete */
  complete: boolean;
}

/**
 * Interview question
 */
export interface InterviewQuestion {
  id: string;
  text: string;
  type: 'text' | 'select' | 'multiselect' | 'number' | 'boolean';
  options?: Array<{ label: string; value: string }>;
  required?: boolean;
  default?: unknown;
}

/**
 * Interview answer request
 */
export interface InterviewAnswerRequest {
  /** Session ID */
  sessionId: string;
  /** Answer value */
  answer: unknown;
}

/**
 * Export request
 */
export interface ExportRequest {
  /** Content to export */
  content: string;
  /** Target platform */
  target: 'github' | 'linear' | 'jira' | 'notion';
  /** Platform-specific options */
  options: Record<string, unknown>;
}

/**
 * Export response
 */
export interface ExportResponse {
  /** Export success */
  success: boolean;
  /** Created resources */
  resources: ExportedResource[];
  /** Export URL */
  url?: string;
}

/**
 * Exported resource
 */
export interface ExportedResource {
  type: string;
  id: string;
  title: string;
  url?: string;
}

/**
 * Audit list request
 */
export interface AuditListRequest {
  /** Filter by user */
  user?: string;
  /** Filter by template */
  template?: string;
  /** Filter by action */
  action?: AuditEntry['action'];
  /** Start date */
  startDate?: string;
  /** End date */
  endDate?: string;
  /** Page number */
  page?: number;
  /** Page size */
  pageSize?: number;
}

/**
 * Audit list response
 */
export interface AuditListResponse {
  entries: AuditEntry[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Audit stats response
 */
export interface AuditStatsResponse {
  totalGenerations: number;
  successfulGenerations: number;
  failedGenerations: number;
  averageDuration: number;
  byTemplate: Record<string, number>;
  byUser: Record<string, number>;
  byAction: Record<string, number>;
}

/**
 * Health check response
 */
export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  uptime: number;
  checks: {
    templates: boolean;
    audit: boolean;
  };
}

/**
 * API route handler
 */
export type RouteHandler = (
  req: ApiRequest,
  res: ApiResponseWriter
) => Promise<void> | void;

/**
 * API request
 */
export interface ApiRequest {
  method: string;
  path: string;
  params: Record<string, string>;
  query: Record<string, string>;
  body: unknown;
  headers: Record<string, string>;
  context: ApiContext;
}

/**
 * API response writer
 */
export interface ApiResponseWriter {
  status(code: number): ApiResponseWriter;
  json<T>(data: ApiResponse<T>): void;
  send(body: string): void;
}
