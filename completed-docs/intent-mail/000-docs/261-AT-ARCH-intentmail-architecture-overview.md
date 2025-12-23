# IntentMail Architecture Overview

**Project ID:** 261
**Document Type:** Architecture Reference
**Status:** Draft - Phase 1
**Date:** 2025-12-23
**Version:** 0.1.0

---

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        IntentMail System                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐                              ┌──────────────┐
│   Inbound    │                              │   Outbound   │
│     Mail     │◄─────────────────────────────┤     Mail     │
│   Pipeline   │                              │   Pipeline   │
└──────────────┘                              └──────────────┘
       │                                              ▲
       │                                              │
       ▼                                              │
┌──────────────────────────────────────────────────────────────┐
│                    Storage & Indexing Layer                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Message    │  │    Search    │  │  Attachment  │       │
│  │    Store     │  │    Index     │  │    Store     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└──────────────────────────────────────────────────────────────┘
       ▲                                              ▲
       │                                              │
       │         ┌──────────────────────┐            │
       └─────────┤   API Gateway        │────────────┘
                 │  (REST + GraphQL)    │
                 └──────────────────────┘
                            ▲
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
    ┌──────────┐      ┌──────────┐     ┌──────────┐
    │   MCP    │      │  Web UI  │     │  Mobile  │
    │  Server  │      │  Client  │     │   App    │
    │ (Claude) │      │ (React)  │     │ (Future) │
    └──────────┘      └──────────┘     └──────────┘
```

---

## Core Components

### 1. Inbound Mail Pipeline

**Purpose:** Receive, parse, validate, and store incoming email messages.

**Components:**
- **MX Records**: DNS configuration pointing to our mail receivers
- **SMTP Receiver**: Accepts incoming SMTP connections (port 25/587)
  - Technology: Postfix, Haraka, or custom Node.js SMTP server
- **Message Parser**: Parses MIME, extracts headers, body, attachments
  - Library: mailparser, node-imap, or custom parser
- **Spam Filter**: SpamAssassin, rspamd, or ML-based classifier
- **Virus Scanner**: ClamAV integration for attachment scanning
- **Queue**: Message queue for async processing (RabbitMQ, Redis, SQS)
- **Storage Writer**: Persists messages to database and object storage

**Data Flow:**
```
External MTA → Our SMTP Receiver → Parser → Spam/Virus Check → Queue → Storage
```

**Key Decisions:**
- Start with managed service (AWS SES Receiving, GCP Email Relay) vs self-hosted SMTP
- Use existing libraries (Haraka, Postfix) vs custom SMTP implementation
- Synchronous vs async processing (queue-based recommended)

---

### 2. Outbound Mail Pipeline

**Purpose:** Send outgoing email with proper authentication and deliverability.

**Components:**
- **Send API**: REST/GraphQL endpoint to queue outbound messages
- **Composition Queue**: Buffer outgoing messages for batch processing
- **DKIM Signer**: Signs messages with domain-specific DKIM keys
- **SMTP Sender**: Delivers messages to recipient MX servers
  - Technology: Nodemailer, Postfix relay, or managed service (SendGrid, AWS SES)
- **Bounce Handler**: Processes delivery failures and bounces
- **Reputation Monitor**: Tracks IP/domain reputation scores

**Data Flow:**
```
API/UI → Validation → Queue → DKIM Sign → SMTP Send → Bounce Handling
```

**Key Decisions:**
- Dedicated IP vs shared IP pools
- Warm-up strategy for new IPs/domains
- Managed service (AWS SES) vs self-hosted for sending
- Rate limiting per user/domain

---

### 3. Storage & Indexing Layer

**Purpose:** Efficiently store, retrieve, and search email messages.

**Components:**

#### Message Store
- **Database**: Postgres or MongoDB for message metadata
  - Schema: users, domains, mailboxes, messages, labels, filters
- **Object Storage**: S3 or GCS for message bodies and attachments
  - Path: `s3://intent-mail/{user_id}/messages/{message_id}/`
- **Caching**: Redis for frequently accessed messages

#### Search Index
- **Technology**: Elasticsearch, Meilisearch, or Postgres full-text search
- **Indexed Fields**: from, to, subject, body (truncated), date, labels
- **Query Features**: Boolean search, fuzzy matching, date ranges, label filters

#### Attachment Store
- **Storage**: S3/GCS with content-type detection
- **Virus Scanning**: On upload and on download
- **CDN**: CloudFront or CloudFlare for fast delivery

**Data Model (Core Entities):**
```
users
  - id, email, created_at, settings

domains
  - id, domain_name, owner_user_id, verification_status, dkim_keys

mailboxes
  - id, user_id, domain_id, email_address, quota

messages
  - id, mailbox_id, message_id (RFC), from, to, subject, date
  - body_text_path (S3), body_html_path (S3), size, labels[]

attachments
  - id, message_id, filename, content_type, size, storage_path
```

---

### 4. MCP Server (Claude Code Integration)

**Purpose:** Expose email operations to Claude Code via Model Context Protocol.

**Exposed Tools:**
1. `email_list_messages`: List inbox/folder messages with filters
2. `email_read_message`: Read full message content including attachments
3. `email_send_message`: Compose and send new email
4. `email_search`: Search messages by query
5. `email_label_message`: Add/remove labels (inbox, archive, spam, etc.)
6. `email_create_filter`: Create email filter rules
7. `email_get_stats`: Get mailbox statistics (unread count, storage used)

**MCP Implementation:**
- Server: Node.js or Python MCP server
- Transport: Stdio or HTTP (stdio for local Claude Code)
- Authentication: API key or OAuth2 token
- Rate Limiting: Per-user and per-tool limits

**Example MCP Tool Definition:**
```json
{
  "name": "email_read_message",
  "description": "Read full email message including headers, body, and attachments",
  "parameters": {
    "type": "object",
    "properties": {
      "message_id": {"type": "string", "description": "Unique message ID"},
      "include_attachments": {"type": "boolean", "default": false}
    },
    "required": ["message_id"]
  }
}
```

---

### 5. API Gateway

**Purpose:** REST and GraphQL API for programmatic access.

**Endpoints (Core):**

#### REST API
```
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/mailboxes
GET    /api/v1/mailboxes/{id}/messages
GET    /api/v1/messages/{id}
POST   /api/v1/messages
PATCH  /api/v1/messages/{id}
DELETE /api/v1/messages/{id}
POST   /api/v1/domains/verify
GET    /api/v1/domains/{id}/dkim
```

#### GraphQL Schema (Core Types)
```graphql
type Mailbox {
  id: ID!
  emailAddress: String!
  unreadCount: Int!
  messages(limit: Int, offset: Int): [Message!]!
}

type Message {
  id: ID!
  from: EmailAddress!
  to: [EmailAddress!]!
  subject: String!
  date: DateTime!
  bodyText: String
  bodyHtml: String
  attachments: [Attachment!]!
  labels: [String!]!
}

type Mutation {
  sendMessage(input: SendMessageInput!): Message!
  labelMessage(messageId: ID!, labels: [String!]!): Message!
}
```

**Authentication:**
- OAuth2 (recommended for third-party integrations)
- API Keys (for server-to-server)
- JWT tokens (for web UI sessions)

---

### 6. Web UI Client

**Purpose:** User-facing interface for reading, composing, and managing email.

**Technology Stack:**
- **Framework**: React 18 with TypeScript
- **State Management**: Tanstack Query (React Query) + Zustand
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Build**: Vite
- **Deployment**: Vercel, Netlify, or CloudFlare Pages

**Core Views:**
1. **Inbox**: Message list with filters (unread, starred, labels)
2. **Message Reader**: Full message view with attachments
3. **Compose**: Rich text editor (TipTap or Quill)
4. **Settings**: Account settings, filters, signatures
5. **Domains**: Custom domain management and DNS verification

**Performance Targets:**
- Initial load: < 2s
- Message list: < 500ms
- Message open: < 300ms
- Search: < 1s

---

### 7. Authentication & Authorization Service

**Purpose:** User authentication and domain ownership verification.

**Features:**
- **User Registration**: Email + password, OAuth (Google, GitHub)
- **Multi-Factor Auth**: TOTP (Google Authenticator)
- **API Key Management**: Generate, rotate, revoke API keys
- **Domain Verification**: DNS TXT record verification
- **Permissions**: User-level and domain-level access control

**Domain Verification Flow:**
```
1. User adds custom domain (example.com)
2. System generates unique verification token
3. User adds TXT record: _intentmail-verify.example.com = {token}
4. System polls DNS for verification
5. Once verified, generate DKIM keys and provide DNS records
6. User adds MX, SPF, DKIM, DMARC records
7. System validates mail flow with test message
```

---

## Data Flow: Receiving Email

```
1. External MTA connects to our SMTP server (MX: mail.intentmail.io)
2. SMTP server receives message, performs initial validation
3. Message queued for async processing
4. Parser extracts headers, body, attachments
5. Spam filter scores message (accept, quarantine, reject)
6. Virus scanner checks attachments
7. Message metadata written to Postgres
8. Message body/attachments written to S3
9. Search index updated (Elasticsearch)
10. Real-time notification sent to user (WebSocket)
11. User sees new message in UI or via MCP tool
```

---

## Data Flow: Sending Email

```
1. User composes message in UI or via API/MCP
2. API validates recipients, subject, body
3. Message queued in outbound queue (Redis/SQS)
4. DKIM signer adds signature using domain's private key
5. SMTP sender delivers to recipient MX servers
6. Delivery status tracked (sent, deferred, bounced, failed)
7. Message copy saved to "Sent" folder
8. Bounce notifications handled and surfaced to user
```

---

## Security Considerations

### Inbound Security
- **SPF Validation**: Check sender IP against SPF records
- **DKIM Verification**: Validate DKIM signatures on incoming mail
- **DMARC Policy**: Enforce sender domain's DMARC policy
- **Rate Limiting**: Per-IP and per-domain rate limits
- **Spam/Virus Scanning**: Multi-layer filtering

### Outbound Security
- **DKIM Signing**: All outbound mail signed with domain keys
- **SPF Records**: Publish SPF records for our sending IPs
- **DMARC Policy**: Publish DMARC policy for our domains
- **Rate Limiting**: Per-user send limits (burst and daily)
- **Abuse Detection**: Automated detection of compromised accounts

### Data Security
- **Encryption at Rest**: S3 encryption, database encryption
- **Encryption in Transit**: TLS for SMTP, HTTPS for API/UI
- **Access Control**: Row-level security in database
- **Audit Logging**: All access and modifications logged

---

## Scalability & Performance

### Horizontal Scaling
- **Stateless Services**: All services designed for horizontal scaling
- **Database Sharding**: Shard by user_id or domain_id for large deployments
- **Object Storage**: S3/GCS scales automatically
- **Search Index**: Elasticsearch cluster with replica shards

### Performance Optimizations
- **Caching**: Redis for message metadata, user sessions
- **CDN**: Serve static UI assets and attachments via CDN
- **Database Indexing**: Proper indexes on message queries
- **Lazy Loading**: Load message bodies on-demand, not in list views

### Cost Optimization
- **S3 Lifecycle**: Archive old messages to Glacier after 1 year
- **Database Cleanup**: Purge deleted messages after 30 days
- **Managed Services**: Use managed services to reduce operational overhead

---

## Deployment Architecture

**Initial Deployment (Phase 2):**
- **Cloud Provider**: GCP or AWS
- **Compute**: Cloud Run (GCP) or ECS Fargate (AWS)
- **Database**: Cloud SQL (Postgres) or RDS
- **Storage**: GCS or S3
- **Search**: Elasticsearch on Compute Engine or managed OpenSearch
- **Queue**: Cloud Pub/Sub or SQS
- **Monitoring**: Cloud Logging, Prometheus, Grafana

**Production Architecture (Later):**
- Multi-region deployment for high availability
- Read replicas for database scaling
- Disaster recovery with cross-region backups

---

## Technology Stack Summary

| Component | Technology Options | Recommended |
|-----------|-------------------|-------------|
| Inbound SMTP | Postfix, Haraka, AWS SES | AWS SES Receiving + Lambda |
| Outbound SMTP | Nodemailer, Postfix, AWS SES | AWS SES Sending |
| Database | Postgres, MongoDB | Postgres (Cloud SQL/RDS) |
| Object Storage | S3, GCS | S3 or GCS |
| Search | Elasticsearch, Meilisearch | Meilisearch (simpler) |
| Queue | RabbitMQ, Redis, SQS | SQS or Cloud Pub/Sub |
| API | Express, Fastify, NestJS | NestJS (TypeScript) |
| MCP Server | Node.js, Python | Node.js (matches API) |
| Web UI | React, Vue, Svelte | React + TypeScript |
| Deployment | Cloud Run, ECS, Kubernetes | Cloud Run (GCP) or ECS (AWS) |

---

## Open Questions & Design Decisions

1. **SMTP Receiving**: Managed service (AWS SES) vs self-hosted (Postfix)?
   - **Recommendation**: Start with AWS SES for receiving, adds reliability and spam filtering

2. **Search Technology**: Elasticsearch (powerful) vs Meilisearch (simpler)?
   - **Recommendation**: Meilisearch for MVP, migrate to Elasticsearch if needed

3. **Monorepo vs Multi-Repo**: Single repo for all services vs separate repos?
   - **Recommendation**: Monorepo with clear service boundaries (Nx or Turborepo)

4. **Real-time Updates**: WebSockets vs Server-Sent Events vs Polling?
   - **Recommendation**: Server-Sent Events for simplicity, WebSockets if needed later

5. **Database Sharding**: Shard by user or by domain?
   - **Recommendation**: Defer sharding until 100k+ users, optimize indexes first

---

## Related Documents

- `261-PP-PROD-intentmail-project-brief.md` - Project goals and requirements
- `261-PP-PLAN-phase-1-setup-completion.md` - Phase 1 completion record
- `261-MS-INDX-intentmail-doc-index.md` - Master documentation index

---

**Document Status:** Draft - Phase 1
**Next Review:** After technology stack selection in Phase 2
**Owner:** Jeremy Longshore
