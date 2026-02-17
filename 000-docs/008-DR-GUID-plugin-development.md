# 008 - Plugin Development Guide

## Overview

The Blueprint plugin system allows extending document generation with custom formatters, validators, processors, integrations, and lifecycle hooks.

## Plugin Types

| Type | Purpose | Example |
|------|---------|---------|
| **Formatter** | Transform output format | Markdown, HTML, PDF |
| **Validator** | Quality checks on content | Completeness, style, tone |
| **Processor** | Pre/post-process content | Variable injection, templating |
| **Integration** | External service export | Slack, email, webhooks |
| **Hook** | Lifecycle events | Before/after generation |

## Creating a Plugin

### Basic Structure

```typescript
import { BlueprintPlugin } from '@intentsolutions/blueprint-core';

const myPlugin: BlueprintPlugin = {
  name: 'my-custom-plugin',
  version: '1.0.0',
  type: 'formatter',

  // Called during document generation
  async process(content: string, options: PluginOptions): Promise<PluginResult> {
    const transformed = transformContent(content);
    return { content: transformed, format: 'custom' };
  }
};

export default myPlugin;
```

### Registration

```typescript
import { createPluginManager } from '@intentsolutions/blueprint-core';

const manager = createPluginManager();
manager.register(myPlugin);
```

## Built-in Plugins

### markdown-formatter
Default formatter. Outputs clean, standardized Markdown.

### html-formatter
Converts Markdown output to styled HTML with a professional theme.

### quality-validator
Checks generated documents for:
- Required sections present
- Minimum content length per section
- Placeholder replacement completeness
- Cross-reference validity

## Plugin Lifecycle

```
Document Generation Pipeline:

  [Input] → Hook:beforeGenerate
              │
              ▼
         [Template Engine]
              │
              ▼
         Processor:preProcess
              │
              ▼
         [Content Generation]
              │
              ▼
         Processor:postProcess
              │
              ▼
         Validator:validate
              │
              ▼
         Formatter:format
              │
              ▼
         Integration:export
              │
              ▼
         Hook:afterGenerate → [Output]
```

## Plugin API

### PluginOptions
```typescript
interface PluginOptions {
  projectName: string;
  scope: 'mvp' | 'standard' | 'comprehensive';
  audience: 'business' | 'technical' | 'mixed';
  outputDir: string;
  metadata: Record<string, unknown>;
}
```

### PluginResult
```typescript
interface PluginResult {
  content: string;
  format: string;
  metadata?: Record<string, unknown>;
  warnings?: string[];
}
```

## Publishing Plugins

Community plugins can be published to npm with the naming convention:
```
blueprint-plugin-{name}
```

Example: `blueprint-plugin-pdf-export`
