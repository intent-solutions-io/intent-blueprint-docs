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
  SCOPES,
  AUDIENCES,
} from '@intentsolutions/blueprint-core';

// Tool schemas
const GenerateSchema = z.object({
  projectName: z.string().describe('Name of the project'),
  projectDescription: z.string().describe('Brief description of what the project does'),
  scope: z.enum(['mvp', 'standard', 'comprehensive']).default('standard').describe('Documentation scope: mvp (4 docs), standard (12 docs), or comprehensive (22 docs)'),
  audience: z.enum(['startup', 'business', 'enterprise']).default('business').describe('Target audience type'),
  outputDir: z.string().optional().describe('Output directory for generated docs (defaults to ./docs)'),
  projectType: z.string().optional().describe('Type of project (e.g., SaaS, mobile app, API)'),
  techStack: z.array(z.string()).optional().describe('Technology stack being used'),
});

const InterviewSchema = z.object({
  currentAnswers: z.record(z.string()).optional().describe('Answers provided so far'),
  questionIndex: z.number().default(0).describe('Current question index'),
});

const ListTemplatesSchema = z.object({
  scope: z.enum(['mvp', 'standard', 'comprehensive']).optional().describe('Filter by scope'),
  category: z.string().optional().describe('Filter by category'),
});

const CustomizeSchema = z.object({
  templateId: z.string().describe('Template ID to customize'),
  projectName: z.string().describe('Project name'),
  customFields: z.record(z.string()).describe('Custom field values to inject'),
});

const ExportSchema = z.object({
  projectName: z.string().describe('Project name'),
  target: z.enum(['github', 'linear', 'jira', 'notion']).describe('Export target'),
  options: z.record(z.string()).optional().describe('Target-specific options'),
});

// Interview questions for dynamic intake
const INTERVIEW_QUESTIONS = [
  { key: 'projectName', question: 'What is the name of your project?', required: true },
  { key: 'projectDescription', question: 'In 2-3 sentences, what does your project do?', required: true },
  { key: 'projectType', question: 'What type of project is this? (e.g., SaaS web app, mobile app, API, CLI tool, library)', required: true },
  { key: 'audience', question: 'Who is your target audience? (startup, business, or enterprise)', required: true },
  { key: 'scope', question: 'How comprehensive should the documentation be? (mvp: 4 docs, standard: 12 docs, comprehensive: 22 docs)', required: true },
  { key: 'techStack', question: 'What technologies are you using? (comma-separated)', required: false },
  { key: 'team', question: 'How large is your team?', required: false },
  { key: 'timeline', question: 'What is your target launch timeline?', required: false },
];

// Define tools
const TOOLS: Tool[] = [
  {
    name: 'blueprint_generate',
    description: 'Generate enterprise documentation from a project description. Creates PRD, architecture docs, task breakdowns, and more based on the selected scope.',
    inputSchema: {
      type: 'object',
      properties: {
        projectName: { type: 'string', description: 'Name of the project' },
        projectDescription: { type: 'string', description: 'Brief description of what the project does' },
        scope: { type: 'string', enum: ['mvp', 'standard', 'comprehensive'], default: 'standard', description: 'Documentation scope' },
        audience: { type: 'string', enum: ['startup', 'business', 'enterprise'], default: 'business', description: 'Target audience' },
        outputDir: { type: 'string', description: 'Output directory (optional)' },
        projectType: { type: 'string', description: 'Type of project' },
        techStack: { type: 'array', items: { type: 'string' }, description: 'Technology stack' },
      },
      required: ['projectName', 'projectDescription'],
    },
  },
  {
    name: 'blueprint_interview',
    description: 'Start an interactive interview to gather project information. Returns the next question to ask based on previous answers.',
    inputSchema: {
      type: 'object',
      properties: {
        currentAnswers: { type: 'object', additionalProperties: { type: 'string' }, description: 'Answers provided so far' },
        questionIndex: { type: 'number', default: 0, description: 'Current question index' },
      },
    },
  },
  {
    name: 'blueprint_list_templates',
    description: 'List all available documentation templates with their categories and descriptions.',
    inputSchema: {
      type: 'object',
      properties: {
        scope: { type: 'string', enum: ['mvp', 'standard', 'comprehensive'], description: 'Filter by scope' },
        category: { type: 'string', description: 'Filter by category' },
      },
    },
  },
  {
    name: 'blueprint_customize',
    description: 'Generate a single customized document from a specific template with custom field values.',
    inputSchema: {
      type: 'object',
      properties: {
        templateId: { type: 'string', description: 'Template ID to customize' },
        projectName: { type: 'string', description: 'Project name' },
        customFields: { type: 'object', additionalProperties: { type: 'string' }, description: 'Custom field values' },
      },
      required: ['templateId', 'projectName', 'customFields'],
    },
  },
  {
    name: 'blueprint_export',
    description: 'Export generated documentation to external services like GitHub Issues, Linear, Jira, or Notion.',
    inputSchema: {
      type: 'object',
      properties: {
        projectName: { type: 'string', description: 'Project name' },
        target: { type: 'string', enum: ['github', 'linear', 'jira', 'notion'], description: 'Export target' },
        options: { type: 'object', additionalProperties: { type: 'string' }, description: 'Target-specific options' },
      },
      required: ['projectName', 'target'],
    },
  },
];

// Create server
const server = new Server(
  {
    name: 'intent-blueprint-mcp',
    version: '2.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle list tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

// Handle tool calls
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
        content: [
          {
            type: 'text',
            text: `✅ Generated ${docs.length} documents for "${input.projectName}"

**Scope:** ${input.scope} (${docs.length} documents)
**Output:** ${outputDir}

**Documents created:**
${docs.map(d => `- ${d.name} (${d.category})`).join('\n')}

**Files written:**
${files.join('\n')}`,
          },
        ],
      };
    }

    case 'blueprint_interview': {
      const input = InterviewSchema.parse(args);
      const answers = input.currentAnswers || {};
      const index = input.questionIndex;

      if (index >= INTERVIEW_QUESTIONS.length) {
        // All questions answered, ready to generate
        return {
          content: [
            {
              type: 'text',
              text: `✅ Interview complete! Ready to generate documentation.

**Collected information:**
${Object.entries(answers).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

Use \`blueprint_generate\` with these values to create your documentation.`,
            },
          ],
        };
      }

      const question = INTERVIEW_QUESTIONS[index];
      const answeredCount = Object.keys(answers).length;

      return {
        content: [
          {
            type: 'text',
            text: `**Question ${index + 1}/${INTERVIEW_QUESTIONS.length}** ${question.required ? '(required)' : '(optional)'}

${question.question}

${answeredCount > 0 ? `\n**Answers so far:**\n${Object.entries(answers).map(([k, v]) => `- ${k}: ${v}`).join('\n')}` : ''}`,
          },
        ],
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
        content: [
          {
            type: 'text',
            text: `📚 **Available Templates** ${input.scope ? `(${input.scope} scope)` : '(all)'}

${Object.entries(grouped).map(([category, temps]) => `
### ${category}
${temps.map(t => `- **${t.name}** (\`${t.id}\`) - ${t.description}`).join('\n')}`).join('\n')}

**Scopes:**
- \`mvp\`: 4 essential documents
- \`standard\`: 12 core documents
- \`comprehensive\`: All 22 documents`,
          },
        ],
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
        content: [
          {
            type: 'text',
            text: `📄 **Generated: ${doc.name}**

---

${doc.content}`,
          },
        ],
      };
    }

    case 'blueprint_export': {
      const input = ExportSchema.parse(args);

      // Export functionality will be implemented in integrations package
      return {
        content: [
          {
            type: 'text',
            text: `🚀 **Export to ${input.target}**

Export functionality for ${input.target} is coming soon!

For now, you can:
1. Use \`blueprint_generate\` to create local files
2. Manually import them to ${input.target}

**Planned features for ${input.target}:**
${input.target === 'github' ? '- Create issues from task breakdown\n- Generate PR templates\n- Wiki sync' : ''}
${input.target === 'linear' ? '- Project creation\n- Issue import\n- Cycle planning' : ''}
${input.target === 'jira' ? '- Epic/Story hierarchy\n- Sprint planning\n- Confluence sync' : ''}
${input.target === 'notion' ? '- Database creation\n- Page hierarchy\n- Template gallery' : ''}`,
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Intent Blueprint MCP Server running...');
}

main().catch(console.error);
