# IntentMail Rules-as-Code Specification

**Project ID:** 261 | **Doc ID:** 262 | **Type:** Design (DSGN) | **Date:** 2025-12-23
**Epic:** E6 (`ai-devops-intent-solutions-b76.6`)

---

## Overview
Safer automation than traditional email filters through versioned YAML rules, dry-run plans, and audit logs.

---

## Rule Format (YAML)

```yaml
version: 1
name: archive-newsletters
description: Auto-archive newsletters after 7 days
enabled: true

conditions:
  - field: from
    operator: matches
    value: "*@substack.com"
  - field: age_days
    operator: greater_than
    value: 7

actions:
  - type: apply_label
    label: archived
  - type: remove_label
    label: inbox

safety:
  dry_run_required: false
  audit: true
  max_actions_per_run: 100
```

---

## Dry-Run Plan Output

```json
{
  "rule_id": "rule_abc123",
  "plan_id": "plan_xyz789",
  "timestamp": "2025-12-23T10:00:00Z",
  "matched_messages": [
    {
      "message_id": "msg_001",
      "subject": "Newsletter: AI Updates",
      "from": "news@substack.com",
      "age_days": 9,
      "actions": [
        {"type": "apply_label", "label": "archived"},
        {"type": "remove_label", "label": "inbox"}
      ]
    }
  ],
  "total_matches": 12,
  "estimated_execution_time_ms": 450
}
```

---

## Audit Log Schema

```typescript
interface AuditLog {
  id: string;
  rule_id: string;
  message_id: string;
  action_type: ActionType;
  status: "success" | "failed" | "skipped";
  error?: string;
  timestamp: DateTime;
  execution_time_ms: number;
}
```

---

## Rollback Mechanism

```typescript
interface RollbackPlan {
  rule_execution_id: string;
  actions_to_undo: RollbackAction[];
  estimated_time_ms: number;
}

interface RollbackAction {
  message_id: string;
  undo_action: Action; // Reverse of original
}
```

Example: If rule added label "archived", rollback removes "archived".

---

## Safety Guarantees
1. **Dry-run first** - Preview before execution
2. **Audit every action** - Full transparency
3. **Rate limiting** - Max 100 actions per run
4. **Rollback support** - Undo bulk operations
5. **Versioning** - Track rule changes over time

---

**Status:** Draft | **Beads:** `ai-devops-intent-solutions-b76.6`
