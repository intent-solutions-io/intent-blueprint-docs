/**
 * Intent Blueprint
 * Enterprise documentation generator - CLI, MCP Server, and programmatic API
 *
 * @packageDocumentation
 */

// Core exports for programmatic use
export {
  listTemplates,
  generateDocument,
  generateAllDocuments,
  writeDocuments,
  getTemplatesForScope,
  compileTemplate,
  getTemplatesDir,
  Handlebars,
  SCOPES,
  AUDIENCES,
  type TemplateContext,
  type GeneratedDocument,
  type TemplateInfo,
} from './core/index.js';

// MCP server export
export { startMcpServer } from './mcp/index.js';
