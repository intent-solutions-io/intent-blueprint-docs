# IntentMail Canonical Mail Model Specification

**Project ID:** 261
**Document ID:** 262
**Document Type:** Design (DSGN)
**Status:** Draft - Phase 2 Planning
**Date:** 2025-12-23
**Epic:** E2 (`ai-devops-intent-solutions-b76.2`)

---

## Overview

This document defines the canonical data models that abstract across Gmail, Outlook, Fastmail, and generic IMAP/SMTP providers. Every provider connector must map their native format to these canonical entities.

**Design Principle:** Provider-agnostic, RFC-compliant, extensible.

---

## Core Entities

### 1. Message

The fundamental email message unit (RFC 5322 compliant).

```typescript
interface Message {
  // Identity
  id: MessageId;              // Canonical ID
  provider_id: string;        // Provider-specific ID
  provider: Provider;         // gmail|outlook|fastmail|imap

  // RFC 5322 Headers
  message_id: string;         // Message-ID header
  in_reply_to?: string;       // In-Reply-To header
  references?: string[];      // References header chain

  // Participants
  from: EmailAddress;
  to: EmailAddress[];
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  reply_to?: EmailAddress;

  // Content
  subject: string;
  body_text?: string;         // Plain text body
  body_html?: string;         // HTML body
  attachments: Attachment[];

  // Metadata
  date: DateTime;             // RFC 5322 Date
  labels: Label[];            // Unified labels
  thread_id?: ThreadId;       // Parent thread
  flags: MessageFlags;        // \Seen, \Flagged, etc
  size_bytes: number;

  // Sync
  version: number;            // For conflict resolution
  synced_at: DateTime;
  updated_at: DateTime;
}

interface EmailAddress {
  email: string;              // RFC 5322 addr-spec
  name?: string;              // Display name
}

interface MessageFlags {
  seen: boolean;              // \Seen (read)
  flagged: boolean;           // \Flagged (starred)
  draft: boolean;             // \Draft
  answered: boolean;          // \Answered
}
```

---

### 2. Thread

Conversation grouping (similar to Gmail's threading model).

```typescript
interface Thread {
  id: ThreadId;
  provider: Provider;

  // Content
  subject: string;            // Normalized subject (Re:/Fwd: stripped)
  snippet: string;            // First 100 chars
  message_ids: MessageId[];   // Ordered by date
  message_count: number;

  // Participants
  participants: EmailAddress[];

  // Metadata
  labels: Label[];
  last_message_date: DateTime;
  has_attachments: boolean;
  unread_count: number;

  // Sync
  updated_at: DateTime;
}
```

---

### 3. Label / Folder

Organizational taxonomy (unified across provider-specific implementations).

```typescript
interface Label {
  id: LabelId;
  provider: Provider;
  provider_label_id: string;

  // Identity
  name: string;               // Display name
  path?: string;              // IMAP folder path (e.g., "INBOX/Work")
  type: LabelType;

  // Metadata
  message_count: number;
  unread_count: number;
  color?: string;             // Hex color

  // System
  system: boolean;            // true for INBOX, SENT, TRASH, etc
  readonly: boolean;          // Can't be deleted
}

enum LabelType {
  INBOX = "inbox",
  SENT = "sent",
  DRAFTS = "drafts",
  TRASH = "trash",
  SPAM = "spam",
  ARCHIVE = "archive",
  CUSTOM = "custom",          // User-created
}
```

**Provider Mapping:**
- **Gmail:** Native labels
- **Outlook:** Folders mapped to labels (path format)
- **Fastmail:** Mailboxes mapped to labels
- **IMAP:** Folders with hierarchy

---

### 4. Rule

Automation definition (rules-as-code).

```typescript
interface Rule {
  id: RuleId;
  version: number;            // For versioning

  // Identity
  name: string;
  description?: string;
  enabled: boolean;

  // Definition
  conditions: Condition[];    // AND logic
  actions: Action[];
  schedule?: Schedule;        // Optional cron-style

  // Safety
  dry_run_required: boolean;
  audit_enabled: boolean;     // Log every execution

  // Metadata
  created_at: DateTime;
  updated_at: DateTime;
  last_run_at?: DateTime;
  execution_count: number;
}

interface Condition {
  field: ConditionField;
  operator: Operator;
  value: string | number | boolean;
}

enum ConditionField {
  FROM = "from",
  TO = "to",
  SUBJECT = "subject",
  BODY = "body",
  HAS_ATTACHMENT = "has_attachment",
  AGE_DAYS = "age_days",
  LABEL = "label",
  SIZE_BYTES = "size_bytes",
}

enum Operator {
  EQUALS = "equals",
  NOT_EQUALS = "not_equals",
  CONTAINS = "contains",
  NOT_CONTAINS = "not_contains",
  MATCHES = "matches",            // Regex
  GREATER_THAN = "greater_than",
  LESS_THAN = "less_than",
}

interface Action {
  type: ActionType;
  params: Record<string, any>;
}

enum ActionType {
  APPLY_LABEL = "apply_label",
  REMOVE_LABEL = "remove_label",
  MOVE_TO_FOLDER = "move_to_folder",
  MARK_READ = "mark_read",
  MARK_UNREAD = "mark_unread",
  STAR = "star",
  ARCHIVE = "archive",
  TRASH = "trash",
  FORWARD = "forward",
}
```

---

### 5. Alias / Identity

Sender identity (from/reply-to addresses).

```typescript
interface Identity {
  id: IdentityId;
  provider: Provider;

  // Address
  email: string;              // Primary email
  name: string;               // Display name
  reply_to?: string;          // Reply-to override

  // Signature
  signature?: string;         // HTML or plain text
  signature_placement?: "top" | "bottom";

  // Settings
  default: boolean;           // Default identity
  enabled: boolean;

  // Metadata
  created_at: DateTime;
}
```

---

### 6. Attachment

File attachment metadata.

```typescript
interface Attachment {
  id: AttachmentId;
  message_id: MessageId;

  // File
  filename: string;
  mime_type: string;
  size_bytes: number;

  // Storage
  storage_path: string;       // S3/GCS path or inline
  inline: boolean;            // Is inline image
  content_id?: string;        // CID for inline

  // Security
  virus_scanned: boolean;
  virus_scan_result?: "clean" | "infected" | "unknown";

  // Metadata
  uploaded_at: DateTime;
}
```

---

### 7. Draft

Unsent message (work in progress).

```typescript
interface Draft {
  id: DraftId;
  provider: Provider;

  // Content (same as Message)
  to: EmailAddress[];
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  from: Identity;
  subject: string;
  body_text?: string;
  body_html?: string;
  attachments: Attachment[];

  // Context
  in_reply_to?: MessageId;
  thread_id?: ThreadId;

  // Metadata
  created_at: DateTime;
  updated_at: DateTime;
  auto_saved_at: DateTime;    // Last auto-save
}
```

---

## Provider Capability Matrix

| Feature | Gmail | Outlook | Fastmail | IMAP/SMTP |
|---------|-------|---------|----------|-----------|
| **Threading** | Native | Graph | JMAP | Manual |
| **Labels** | Native | Folders | Mailboxes | Folders |
| **Search** | Advanced | OData | JMAP Filter | IMAP SEARCH |
| **Delta Sync** | History API | Delta Query | JMAP Push | IDLE + UID |
| **Push Notifications** | Pub/Sub | Webhooks | JMAP Push | IDLE |
| **Send** | Send API | Send Mail | JMAP | SMTP |
| **Attachments** | Inline + API | Inline + API | Inline + API | MIME |
| **Rules** | Filters | Inbox Rules | Sieve | None (local) |
| **Aliases** | Send As | Send As | Identities | SMTP FROM |
| **OAuth** | OAuth 2.0 | OAuth 2.0 | OAuth 2.0 | Basic Auth |

**Capability Flags:**
```typescript
interface ProviderCapabilities {
  has_threading: boolean;
  has_labels: boolean;          // vs folders-only
  has_search_operators: boolean;
  has_delta_sync: boolean;
  has_push_notifications: boolean;
  has_server_side_rules: boolean;
  max_attachment_size_mb: number;
  rate_limit_per_second: number;
}
```

---

## Data Transformation Rules

### Gmail → Canonical
```typescript
function transformGmailMessage(gmailMsg: GmailMessage): Message {
  return {
    id: generateCanonicalId("gmail", gmailMsg.id),
    provider_id: gmailMsg.id,
    provider: "gmail",
    message_id: gmailMsg.payload.headers.find(h => h.name === "Message-ID").value,
    from: parseEmailAddress(getHeader("From")),
    to: parseEmailAddresses(getHeader("To")),
    subject: getHeader("Subject"),
    body_text: extractPlainTextBody(gmailMsg.payload),
    body_html: extractHtmlBody(gmailMsg.payload),
    labels: gmailMsg.labelIds.map(mapGmailLabel),
    thread_id: generateCanonicalThreadId("gmail", gmailMsg.threadId),
    // ... etc
  };
}
```

### Outlook → Canonical
```typescript
function transformOutlookMessage(outlookMsg: GraphMessage): Message {
  return {
    id: generateCanonicalId("outlook", outlookMsg.id),
    provider_id: outlookMsg.id,
    provider: "outlook",
    message_id: outlookMsg.internetMessageId,
    from: {email: outlookMsg.from.emailAddress.address, name: outlookMsg.from.emailAddress.name},
    labels: [{name: outlookMsg.parentFolderId, type: "custom"}], // Map folder to label
    thread_id: generateCanonicalThreadId("outlook", outlookMsg.conversationId),
    // ... etc
  };
}
```

### IMAP → Canonical
```typescript
function transformImapMessage(imapMsg: ImapEnvelope, body: string): Message {
  return {
    id: generateCanonicalId("imap", imapMsg.uid),
    provider_id: imapMsg.uid.toString(),
    provider: "imap",
    message_id: imapMsg.messageId,
    from: {email: imapMsg.from[0].address, name: imapMsg.from[0].name},
    labels: [{name: imapMsg.mailbox, type: "custom", path: imapMsg.mailbox}],
    thread_id: deriveThreadIdFromReferences(imapMsg.references), // Manual threading
    // ... etc
  };
}
```

---

## Conflict Resolution

When syncing across providers, conflicts may arise. Resolution strategy:

### Last-Write-Wins
```typescript
function resolveConflict(local: Message, remote: Message): Message {
  if (remote.updated_at > local.updated_at) {
    return remote;
  }
  return local;
}
```

### Vector Clocks (Future)
For advanced sync, use vector clocks to track causality.

---

## Indexing Strategy

### Primary Keys
- **Message:** `(provider, provider_id)` - Composite unique
- **Thread:** `(provider, thread_id)` - Composite unique
- **Label:** `(provider, provider_label_id)` - Composite unique

### Search Indexes
```sql
CREATE INDEX idx_messages_search ON messages
  USING GIN (to_tsvector('english', subject || ' ' || body_text));

CREATE INDEX idx_messages_date ON messages (date DESC);

CREATE INDEX idx_messages_labels ON messages USING GIN (labels);

CREATE INDEX idx_threads_last_message ON threads (last_message_date DESC);
```

---

## Related Documents

- `262-PP-RMAP-phase-2-epic-dependency-map.md` - Epic roadmap
- `262-AT-DSGN-sync-index-strategy.md` - Sync implementation
- `262-AT-APIS-mcp-tool-contract.md` - MCP tools using these models

---

**Document Status:** Draft - Phase 2 Planning
**Next Review:** After E2 completion
**Owner:** Jeremy Longshore
**Beads Epic:** `ai-devops-intent-solutions-b76.2`
