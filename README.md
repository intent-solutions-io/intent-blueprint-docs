# Intent Blueprint Docs

*Enterprise-grade AI documentation generator*

[![npm version](https://img.shields.io/npm/v/@intentsolutions/blueprint)](https://www.npmjs.com/package/@intentsolutions/blueprint)
[![CI](https://github.com/intent-solutions-io/intent-blueprint-docs/actions/workflows/ci.yml/badge.svg)](https://github.com/intent-solutions-io/intent-blueprint-docs/actions/workflows/ci.yml)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-purple.svg)](https://modelcontextprotocol.io)
[![Beta](https://img.shields.io/badge/Status-Beta-yellow.svg)](#status)

Transform project ideas into 22 professional documents in minutes. Works with Claude, Cursor, VS Code, and any MCP-compatible tool.

> **Beta Notice:** This project is in active development. Core features are functional but APIs may change. We welcome feedback and contributions.

## What It Does

You describe your project. Blueprint generates up to 22 professional documents covering product strategy, technical architecture, user experience, development workflow, and quality assurance.

**Key differentiators:**
- **MCP-native** - First-class integration with Claude, Cursor, and any MCP-compatible AI tool
- **Scope tiers** - Generate 4 docs (MVP), 12 (Standard), or all 22 (Comprehensive)
- **Enterprise pipeline** - Structured 17-question intake with governance controls
- **Extensible** - Plugin system for custom formatters, validators, and integrations

## Installation

```bash
# Install CLI globally
npm install -g @intentsolutions/blueprint

# Or use directly with npx
npx @intentsolutions/blueprint init
```

**Requirements:** Node.js 18+

## Quick Start

### CLI Usage

```bash
# Interactive project setup
blueprint init

# Generate with options
blueprint generate -n "My Project" -d "A cool app" -s standard -a business

# AI-guided interview mode
blueprint interview

# List available templates
blueprint list
```

### MCP Server (Claude / Cursor)

Add to your Claude or Cursor MCP config:

```json
{
  "mcpServers": {
    "blueprint": {
      "command": "npx",
      "args": ["@intentsolutions/blueprint-mcp"]
    }
  }
}
```

**Available MCP Tools:**

| Tool | Description |
|------|------------|
| `blueprint_generate` | Generate docs from project description |
| `blueprint_interview` | Start AI-guided intake session |
| `blueprint_list_templates` | Show available templates |
| `blueprint_customize` | Customize a single template |
| `blueprint_export` | Export to GitHub / Linear / Jira / Notion |

### IDE Integration

Works with any IDE that supports MCP:
- **Claude Code** - Native via MCP config
- **Cursor** - MCP server auto-discovery
- **VS Code** - Via MCP extension
- **Google Antigravity** - Gemini agent integration
- **Amp (Sourcegraph)** - VS Code extension compatible

## Documentation Scopes

| Scope | Documents | Best For |
|-------|-----------|----------|
| **MVP** | 4 docs | Quick starts, prototypes |
| **Standard** | 12 docs | Most projects |
| **Comprehensive** | 22 docs | Enterprise, compliance |

### Template Categories

| Category | Count | Includes |
|----------|-------|----------|
| Product & Strategy | 5 | PRD, Market Research, Competitor Analysis, User Personas, Project Brief |
| Technical Architecture | 4 | ADRs, System Architecture, Frontend Spec, Operational Readiness |
| User Experience | 3 | User Stories, User Journeys, Acceptance Criteria |
| Development Workflow | 5 | Task Generation, Task Processing, Risk Register, Brainstorming, Metrics |
| Quality Assurance | 5 | Test Plan, QA Gates, Release Plan, Post-Mortem, Usability Testing |

## Template Marketplace

Install curated template packs for your industry or framework:

```bash
# Search and install packs
blueprint pack search fintech
blueprint pack install blueprint-fintech
blueprint pack list
```

| Category | Packs | Description |
|----------|-------|-------------|
| **Verticals** | fintech, healthtech, saas | Industry-specific templates |
| **Compliance** | soc2, hipaa, gdpr | Regulatory documentation |
| **Frameworks** | nextjs, fastapi, rails | Framework-optimized templates |

## Packages

| Package | Description | npm |
|---------|-------------|-----|
| `@intentsolutions/blueprint` | CLI tool | [![npm](https://img.shields.io/npm/v/@intentsolutions/blueprint)](https://www.npmjs.com/package/@intentsolutions/blueprint) |
| `@intentsolutions/blueprint-mcp` | MCP server | [![npm](https://img.shields.io/npm/v/@intentsolutions/blueprint-mcp)](https://www.npmjs.com/package/@intentsolutions/blueprint-mcp) |
| `@intentsolutions/blueprint-core` | Core engine | [![npm](https://img.shields.io/npm/v/@intentsolutions/blueprint-core)](https://www.npmjs.com/package/@intentsolutions/blueprint-core) |

## Plugin System

Extend Blueprint with custom plugins:

```typescript
import { createPluginManager } from '@intentsolutions/blueprint';

const manager = createPluginManager();

manager.register({
  name: 'my-formatter',
  version: '1.0.0',
  type: 'formatter',
  format: async (content, options) => {
    return { content: transformedContent, format: 'custom' };
  }
});
```

**Plugin Types:** Formatter, Validator, Processor, Integration, Hook

See [Plugin Development Guide](000-docs/008-DR-GUID-plugin-development.md) for details.

## Programmatic Usage

```typescript
import {
  generateAllDocuments,
  writeDocuments,
  listTemplates
} from '@intentsolutions/blueprint-core';

const docs = generateAllDocuments({
  projectName: 'My Project',
  projectDescription: 'A revolutionary app',
  scope: 'standard',
  audience: 'business'
});

writeDocuments(docs, './docs/my-project');
```

## Status

**Current Version:** 2.0.0 (Beta)

| Feature | Status |
|---------|--------|
| 22 Professional Templates | Stable |
| CLI Tool | Stable |
| MCP Server | Stable |
| Core Engine | Stable |
| Enterprise Pipeline | Stable |
| Template Marketplace | Beta |
| Plugin System | Beta |
| Export Integrations | Beta |
| Analytics Dashboard | Beta |
| Web UI | Planned |
| Team Collaboration | Planned |

## Development

```bash
# Clone and setup
git clone https://github.com/intent-solutions-io/intent-blueprint-docs.git
cd intent-blueprint-docs
npm install
npm run build

# Development mode
npm run dev

# Run tests
npm run test

# Lint
npm run lint

# Verify templates
make verify
```

## Documentation

All project documentation lives in `000-docs/` using the doc-filing system:

| Doc | Title |
|-----|-------|
| [000](000-docs/000-DR-INDEX-standards-catalog.md) | Standards Catalog |
| [001](000-docs/001-PP-VISN-product-vision-and-roadmap.md) | Product Vision & Roadmap |
| [002](000-docs/002-AT-ARCH-system-architecture.md) | System Architecture |
| [003](000-docs/003-DR-SPEC-template-specification.md) | Template Specification |
| [004](000-docs/004-DR-SPEC-mcp-server-integration.md) | MCP Server Integration |
| [005](000-docs/005-DR-GUID-contributing-guide.md) | Contributing Guide |
| [006](000-docs/006-AT-SECR-security-policy.md) | Security Policy |
| [007](000-docs/007-OD-OPER-release-and-publishing.md) | Release & Publishing |
| [008](000-docs/008-DR-GUID-plugin-development.md) | Plugin Development |
| [009](000-docs/009-TQ-TEST-testing-and-quality.md) | Testing & QA |

## Contributing

Contributions welcome! See the [Contributing Guide](000-docs/005-DR-GUID-contributing-guide.md).

## License

Apache 2.0 - See [LICENSE](LICENSE)

---

**By [Intent Solutions](https://intentsolutions.io)**

[![GitHub stars](https://img.shields.io/github/stars/intent-solutions-io/intent-blueprint-docs?style=social)](https://github.com/intent-solutions-io/intent-blueprint-docs/stargazers)
