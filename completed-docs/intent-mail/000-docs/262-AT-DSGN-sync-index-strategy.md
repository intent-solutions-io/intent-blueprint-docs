# IntentMail Sync + Index Strategy

**Project ID:** 261 | **Doc ID:** 262 | **Type:** Design (DSGN) | **Date:** 2025-12-23
**Epic:** E5 (`ai-devops-intent-solutions-b76.5`)

---

## Overview
Fast, consistent search + automation through delta sync and local indexing.

---

## Delta Sync Strategies

### Gmail
- **Method:** History API + Push Notifications (Pub/Sub)
- **Polling:** Every 60s fallback
- **State:** History ID tracking
- **Latency:** < 5 seconds (push)

### Outlook
- **Method:** Delta Query with skip tokens + Webhooks
- **Polling:** Every 90s fallback
- **State:** Delta link + change token
- **Latency:** < 10 seconds

### Fastmail
- **Method:** JMAP Push + State Strings
- **Polling:** Every 30s fallback
- **State:** JMAP state string
- **Latency:** < 3 seconds (push)

### IMAP
- **Method:** IDLE + UID polling
- **Polling:** IDLE keepalive every 29 min
- **State:** UIDVALIDITY + UID high water mark
- **Latency:** < 60 seconds

---

## Storage Choice: SQLite (libsql)

**Decision:** Use libsql (SQLite fork with replication) for local index.

**Rationale:**
- ✅ Fast local queries (< 10ms)
- ✅ Full-text search (FTS5)
- ✅ ACID transactions
- ✅ Offline-first capable
- ✅ Simple deployment (single file)
- ❌ Firestore: Network latency, cost at scale

**Schema:**
```sql
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  thread_id TEXT,
  subject TEXT,
  body_text TEXT,
  labels JSON,
  date DATETIME,
  version INTEGER,
  UNIQUE(provider, provider_id)
);

CREATE VIRTUAL TABLE messages_fts USING fts5(
  subject, body_text, content=messages
);
```

---

## Reconciliation Strategy

### Conflict Resolution
1. **Last-write-wins** (based on `updated_at`)
2. **Version vectors** (future)

### Idempotency Keys
- Format: `{provider}:{provider_id}:{action}:{timestamp}`
- TTL: 24 hours
- Storage: Redis or SQLite temp table

### Sync Algorithm
```
1. Fetch delta from provider (since last_sync_token)
2. Apply changes to local index (upsert/delete)
3. Detect conflicts (compare versions)
4. Resolve conflicts (last-write-wins)
5. Update last_sync_token
6. Emit change events to UI/MCP
```

---

## Performance Targets
- **Sync latency:** < 30 seconds
- **Search latency:** < 500ms
- **Index size:** ~100MB per 10k messages
- **Throughput:** 1000 messages/sec indexed

---

**Status:** Draft | **Beads:** `ai-devops-intent-solutions-b76.5`
