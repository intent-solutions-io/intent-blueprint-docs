# 004 - MCP Server Integration

## Overview

The Blueprint MCP server exposes document generation capabilities to any MCP-compatible AI tool (Claude, Cursor, VS Code, Google Antigravity, Amp).

## Installation

### Claude / Claude Code
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

### Cursor / VS Code
Add to MCP settings. The server auto-discovers when configured.

## MCP Tools

### `blueprint_generate`
Generate documentation from a project description.

**Input:**
```json
{
  "projectName": "string (required)",
  "projectDescription": "string (required)",
  "scope": "mvp | standard | comprehensive (default: standard)",
  "audience": "business | technical | mixed (default: business)",
  "outputDir": "string (default: ./docs)"
}
```

**Output:** Generated document paths and content summary.

### `blueprint_interview`
Start an AI-guided intake session with adaptive questioning.

**Input:**
```json
{
  "projectName": "string (optional - asked if missing)"
}
```

**Output:** Interview questions and collected answers, then generated docs.

### `blueprint_list_templates`
List available templates with metadata.

**Input:**
```json
{
  "scope": "mvp | standard | comprehensive (optional)",
  "category": "string (optional)"
}
```

**Output:** Template list with names, categories, and descriptions.

### `blueprint_customize`
Customize a single template with specific inputs.

**Input:**
```json
{
  "templateName": "string (required)",
  "projectName": "string (required)",
  "customFields": "object (optional)"
}
```

**Output:** Customized document content.

### `blueprint_export`
Export generated docs to external platforms.

**Input:**
```json
{
  "source": "string (path to generated docs)",
  "target": "github | linear | jira | notion",
  "config": "object (platform-specific settings)"
}
```

**Output:** Export status and links.

## Architecture

```
MCP Client (Claude/Cursor)
    │
    ▼
MCP Server (@intentsolutions/blueprint-mcp)
    │
    ▼
Core Engine (@intentsolutions/blueprint-core)
    │
    ▼
Template Engine → File System / Export
```

The MCP server is a thin adapter over the core engine. All business logic lives in `blueprint-core`.

## Error Handling

All tools return structured errors:
```json
{
  "error": {
    "code": "TEMPLATE_NOT_FOUND | INVALID_SCOPE | GENERATION_FAILED",
    "message": "Human-readable description"
  }
}
```
