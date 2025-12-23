# IntentMail MCP Tool Contract

**Project ID:** 261
**Document ID:** 262
**Document Type:** API Specification (APIS)
**Status:** Draft - Phase 2
**Date:** 2025-12-23
**Epic:** E7 (`ai-devops-intent-solutions-b76.7`)

---

## Overview

MCP server exposing 10+ email tools to Claude Code. Unified interface regardless of backend provider (Gmail/Outlook/Fastmail/IMAP).

---

## Core Tools

### 1. search_messages
```json
{
  "name": "search_messages",
  "description": "Search messages across all mailboxes with filters",
  "parameters": {
    "query": "string (search query)",
    "labels": "string[] (optional filter)",
    "from": "string (optional filter)",
    "to": "string (optional filter)",
    "has_attachment": "boolean (optional)",
    "after_date": "ISO8601 (optional)",
    "before_date": "ISO8601 (optional)",
    "limit": "number (default: 50, max: 100)",
    "offset": "number (default: 0)"
  },
  "returns": "MessageList"
}
```

### 2. get_message
```json
{
  "name": "get_message",
  "description": "Fetch full message with headers/body/attachments",
  "parameters": {
    "message_id": "string (required)",
    "include_attachments": "boolean (default: false)"
  },
  "returns": "Message"
}
```

### 3. get_thread
```json
{
  "name": "get_thread",
  "description": "Fetch conversation thread with all messages",
  "parameters": {
    "thread_id": "string (required)",
    "limit": "number (default: 50)"
  },
  "returns": "Thread"
}
```

### 4. apply_label
```json
{
  "name": "apply_label",
  "description": "Add label to message(s)",
  "parameters": {
    "message_ids": "string[] (required)",
    "label": "string (label name or ID)"
  },
  "returns": "ActionResult"
}
```

### 5. move_message
```json
{
  "name": "move_message",
  "description": "Move message to folder/label",
  "parameters": {
    "message_id": "string (required)",
    "destination": "string (label/folder name)"
  },
  "returns": "ActionResult"
}
```

### 6. create_rule
```json
{
  "name": "create_rule",
  "description": "Define automation rule (YAML format)",
  "parameters": {
    "rule_yaml": "string (YAML rule definition)",
    "dry_run": "boolean (default: true)"
  },
  "returns": "Rule | DryRunPlan"
}
```

### 7. run_rule_plan
```json
{
  "name": "run_rule_plan",
  "description": "Dry-run a rule without executing",
  "parameters": {
    "rule_id": "string (required)"
  },
  "returns": "DryRunPlan"
}
```

### 8. send_message
```json
{
  "name": "send_message",
  "description": "Send email with optional attachments",
  "parameters": {
    "to": "string[] (required)",
    "subject": "string (required)",
    "body_text": "string",
    "body_html": "string",
    "cc": "string[]",
    "bcc": "string[]",
    "in_reply_to": "string (message_id for replies)",
    "attachments": "Attachment[]"
  },
  "returns": "SentMessage"
}
```

### 9. list_identities
```json
{
  "name": "list_identities",
  "description": "List sender identities/aliases",
  "parameters": {},
  "returns": "Identity[]"
}
```

### 10. create_alias
```json
{
  "name": "create_alias",
  "description": "Create new email alias",
  "parameters": {
    "email": "string (required)",
    "name": "string (display name)",
    "signature": "string (HTML)"
  },
  "returns": "Identity"
}
```

---

## Error Model

```typescript
interface MCPError {
  code: ErrorCode;
  message: string;
  details?: Record<string, any>;
  provider_error?: any;
  retry_after?: number; // seconds
}

enum ErrorCode {
  INVALID_REQUEST = "INVALID_REQUEST",
  NOT_FOUND = "NOT_FOUND",
  PERMISSION_DENIED = "PERMISSION_DENIED",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  PROVIDER_ERROR = "PROVIDER_ERROR",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}
```

---

## Pagination

All list-returning tools support:
```typescript
{
  results: T[];
  total_count: number;
  limit: number;
  offset: number;
  has_more: boolean;
}
```

---

## Capability Reporting

```typescript
{
  "name": "get_capabilities",
  "description": "Report provider-specific capabilities",
  "returns": {
    "provider": "gmail|outlook|fastmail|imap",
    "has_threading": true,
    "has_server_side_rules": false,
    "max_attachment_size_mb": 25,
    "rate_limits": {
      "requests_per_second": 10,
      "burst": 50
    }
  }
}
```

---

**Status:** Draft
**Beads Epic:** `ai-devops-intent-solutions-b76.7`
