#!/usr/bin/env node
/**
 * Intent Blueprint MCP Server
 * Exposes documentation generation tools to Claude/Cursor via MCP protocol
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import {
  listTemplates,
  generateDocument,
  generateAllDocuments,
  writeDocuments,
  getTemplatesForScope,
  type TemplateContext,
} from '../core/index.js';

// Tool schemas
const GenerateSchema = z.object({
  projectName: z.string().describe('Name of the project'),
  projectDescription: z.string().describe('Brief description of what the project does'),
  scope: z.enum(['mvp', 'standard', 'comprehensive']).default('standard'),
  audience: z.enum(['startup', 'business', 'enterprise']).default('business'),
  outputDir: z.string().optional(),
  projectType: z.string().optional(),
  techStack: z.array(z.string()).optional(),
});

const InterviewSchema = z.object({
  currentAnswers: z.record(z.string()).optional(),
  questionIndex: z.number().default(0),
});

const ListTemplatesSchema = z.object({
  scope: z.enum(['mvp', 'standard', 'comprehensive']).optional(),
  category: z.string().optional(),
});

const CustomizeSchema = z.object({
  templateId: z.string(),
  projectName: z.string(),
  customFields: z.record(z.string()),
});

const ExportSchema = z.object({
  projectName: z.string(),
  target: z.enum(['github', 'linear', 'jira', 'notion']),
  options: z.record(z.string()).optional(),
});

const INTERVIEW_QUESTIONS = [
  { key: 'projectName', question: 'What is the name of your project?', required: true },
  { key: 'projectDescription', question: 'In 2-3 sentences, what does your project do?', required: true },
  { key: 'projectType', question: 'What type of project is this? (e.g., SaaS web app, mobile app, API, CLI tool)', required: true },
  { key: 'audience', question: 'Who is your target audience? (startup, business, or enterprise)', required: true },
  { key: 'scope', question: 'How comprehensive should the documentation be? (mvp: 4 docs, standard: 12 docs, comprehensive: 22 docs)', required: true },
  { key: 'techStack', question: 'What technologies are you using? (comma-separated)', required: false },
  { key: 'team', question: 'How large is your team?', required: false },
  { key: 'timeline', question: 'What is your target launch timeline?', required: false },
];

const TOOLS: Tool[] = [
  {
    name: 'blueprint_generate',
    description: 'Generate enterprise documentation from a project description. Creates PRD, architecture docs, task breakdowns, and more.',
    inputSchema: {
      type: 'object',
      properties: {
        projectName: { type: 'string', description: 'Name of the project' },
        projectDescription: { type: 'string', description: 'Brief description' },
        scope: { type: 'string', enum: ['mvp', 'standard', 'comprehensive'], default: 'standard' },
        audience: { type: 'string', enum: ['startup', 'business', 'enterprise'], default: 'business' },
        outputDir: { type: 'string', description: 'Output directory (optional)' },
        projectType: { type: 'string' },
        techStack: { type: 'array', items: { type: 'string' } },
      },
      required: ['projectName', 'projectDescription'],
    },
  },
  {
    name: 'blueprint_interview',
    description: 'Start an interactive interview to gather project information.',
    inputSchema: {
      type: 'object',
      properties: {
        currentAnswers: { type: 'object', additionalProperties: { type: 'string' } },
        questionIndex: { type: 'number', default: 0 },
      },
    },
  },
  {
    name: 'blueprint_list_templates',
    description: 'List all available documentation templates.',
    inputSchema: {
      type: 'object',
      properties: {
        scope: { type: 'string', enum: ['mvp', 'standard', 'comprehensive'] },
        category: { type: 'string' },
      },
    },
  },
  {
    name: 'blueprint_customize',
    description: 'Generate a single customized document from a template.',
    inputSchema: {
      type: 'object',
      properties: {
        templateId: { type: 'string' },
        projectName: { type: 'string' },
        customFields: { type: 'object', additionalProperties: { type: 'string' } },
      },
      required: ['templateId', 'projectName', 'customFields'],
    },
  },
  {
    name: 'blueprint_export',
    description: 'Export documentation to GitHub, Linear, Jira, or Notion.',
    inputSchema: {
      type: 'object',
      properties: {
        projectName: { type: 'string' },
        target: { type: 'string', enum: ['github', 'linear', 'jira', 'notion'] },
        options: { type: 'object', additionalProperties: { type: 'string' } },
      },
      required: ['projectName', 'target'],
    },
  },
];

const server = new Server(
  { name: 'intent-blueprint', version: '2.1.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'blueprint_generate': {
      const input = GenerateSchema.parse(args);
      const context: TemplateContext = {
        projectName: input.projectName,
        projectDescription: input.projectDescription,
        scope: input.scope,
        audience: input.audience,
        projectType: input.projectType,
        techStack: input.techStack,
      };

      const docs = generateAllDocuments(context);
      const outputDir = input.outputDir || `./docs/${input.projectName.toLowerCase().replace(/\s+/g, '-')}`;
      const files = writeDocuments(docs, outputDir);

      return {
        content: [{
          type: 'text',
          text: `Generated ${docs.length} documents for "${input.projectName}"\n\nOutput: ${outputDir}\n\nDocuments:\n${docs.map(d => `- ${d.name}`).join('\n')}`,
        }],
      };
    }

    case 'blueprint_interview': {
      const input = InterviewSchema.parse(args);
      const answers = input.currentAnswers || {};
      const index = input.questionIndex;

      if (index >= INTERVIEW_QUESTIONS.length) {
        return {
          content: [{
            type: 'text',
            text: `Interview complete!\n\nCollected:\n${Object.entries(answers).map(([k, v]) => `- ${k}: ${v}`).join('\n')}\n\nUse blueprint_generate with these values.`,
          }],
        };
      }

      const q = INTERVIEW_QUESTIONS[index];
      return {
        content: [{
          type: 'text',
          text: `Question ${index + 1}/${INTERVIEW_QUESTIONS.length} ${q.required ? '(required)' : '(optional)'}\n\n${q.question}`,
        }],
      };
    }

    case 'blueprint_list_templates': {
      const input = ListTemplatesSchema.parse(args);
      let templates = input.scope ? getTemplatesForScope(input.scope) : listTemplates();
      if (input.category) {
        templates = templates.filter(t => t.category.toLowerCase().includes(input.category!.toLowerCase()));
      }

      const grouped = templates.reduce((acc, t) => {
        if (!acc[t.category]) acc[t.category] = [];
        acc[t.category].push(t);
        return acc;
      }, {} as Record<string, typeof templates>);

      return {
        content: [{
          type: 'text',
          text: `Available Templates:\n\n${Object.entries(grouped).map(([cat, temps]) =>
            `${cat}:\n${temps.map(t => `  - ${t.name} (${t.id})`).join('\n')}`
          ).join('\n\n')}`,
        }],
      };
    }

    case 'blueprint_customize': {
      const input = CustomizeSchema.parse(args);
      const context: TemplateContext = {
        projectName: input.projectName,
        projectDescription: input.customFields.projectDescription || '',
        scope: 'comprehensive',
        audience: 'business',
        ...input.customFields,
      };

      const doc = generateDocument(input.templateId, context);
      return {
        content: [{ type: 'text', text: `Generated: ${doc.name}\n\n---\n\n${doc.content}` }],
      };
    }

    case 'blueprint_export': {
      const input = ExportSchema.parse(args);
      return {
        content: [{
          type: 'text',
          text: `Export to ${input.target} coming soon!\n\nFor now, use blueprint_generate to create local files.`,
        }],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

export async function startMcpServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Intent Blueprint MCP Server running...');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startMcpServer().catch(console.error);
}
