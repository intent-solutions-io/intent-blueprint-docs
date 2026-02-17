# 002 - System Architecture

## Overview

Intent Blueprint Docs is a monorepo with three publishable packages, a template engine, and supporting infrastructure.

## Architecture Diagram

```
                    ┌─────────────────────────────┐
                    │        User Interfaces       │
                    ├──────────┬──────────┬────────┤
                    │  CLI     │  MCP     │  IDE   │
                    │ (npx)   │ Server   │ Plugin │
                    └────┬─────┴────┬─────┴───┬────┘
                         │          │         │
                    ┌────▼──────────▼─────────▼────┐
                    │     @intentsolutions/        │
                    │      blueprint-core          │
                    │                              │
                    │  ┌──────────┐ ┌───────────┐  │
                    │  │ Template │ │  Plugin   │  │
                    │  │ Engine   │ │  Manager  │  │
                    │  └────┬─────┘ └─────┬─────┘  │
                    │       │             │        │
                    │  ┌────▼─────────────▼─────┐  │
                    │  │   Document Generator    │  │
                    │  └────────────┬────────────┘  │
                    └──────────────┼────────────────┘
                                   │
                    ┌──────────────▼────────────────┐
                    │         Output Layer          │
                    ├──────┬───────┬────────┬───────┤
                    │ Files│GitHub │ Linear │ Notion │
                    └──────┴───────┴────────┴───────┘
```

## Package Structure

```
intent-blueprint-docs/
├── packages/
│   ├── cli/                   # @intentsolutions/blueprint
│   │   ├── src/
│   │   │   ├── commands/      # CLI command handlers
│   │   │   ├── interview/     # AI-guided interview engine
│   │   │   └── index.ts       # CLI entrypoint
│   │   └── package.json
│   │
│   └── chatbots/              # MCP server + chatbot integrations
│       ├── src/
│       │   ├── mcp/           # MCP tool definitions
│       │   └── index.ts
│       └── package.json
│
├── professional-templates/    # 22 master templates (READ-ONLY)
├── form-system/               # Interactive CLI form tools
├── 000-docs/                  # Project documentation (doc-filing system)
├── 01-Docs/                   # Legacy docs (migrating to 000-docs/)
└── .github/workflows/         # CI/CD pipelines
```

## Key Components

### Template Engine
- Reads templates from `professional-templates/`
- Replaces `{{DATE}}` and other placeholders
- Validates template completeness
- Supports scope filtering (MVP/Standard/Comprehensive)

### Plugin System
- Five plugin types: Formatter, Validator, Processor, Integration, Hook
- Lifecycle hooks: before/after generation
- Built-in plugins: markdown-formatter, html-formatter, quality-validator

### MCP Server
- Exposes 5 tools: generate, interview, list_templates, customize, export
- Stateless design - each call is independent
- Works with Claude, Cursor, VS Code, and any MCP client

### Enterprise Pipeline
- 17-question structured intake (`scripts/run-enterprise.mjs`)
- Governance controls and CODEOWNERS protection
- CI/CD integration via GitHub Actions
- Automated E2E validation

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Language | TypeScript 5.3+ |
| Runtime | Node.js 18+ |
| Build | Turbo (monorepo) |
| Package Manager | npm (workspaces) |
| CI/CD | GitHub Actions |
| Templates | Markdown with placeholders |
| MCP | Model Context Protocol SDK |

## Build System

Turborepo manages the monorepo with these pipelines:

```json
{
  "build": { "dependsOn": ["^build"] },
  "dev": { "persistent": true },
  "lint": {},
  "test": { "dependsOn": ["build"] }
}
```
