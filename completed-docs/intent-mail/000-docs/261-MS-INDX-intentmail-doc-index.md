# IntentMail Documentation Index

**Project:** IntentMail - Modern email stack with MCP interface layer
**Project ID:** 261
**Repository:** intent-solutions-io/ai-devops-intent-solutions
**Location:** `completed-docs/intent-mail/000-docs/`
**Status:** Phase 2 - Epic Planning Complete
**Created:** 2025-12-23
**Updated:** 2025-12-23 (Phase 2 epics + planning docs added)
**Standard:** Document Filing System Standard v4.2

---

## Quick Navigation

- [Project Brief](#project-brief) - Purpose, goals, constraints
- [Architecture](#architecture) - System design and components
- [Planning Docs](#planning-docs) - Phase completion records
- [Reference Docs](#reference-docs) - Standards and guidelines

---

## Project Documents (NNN-261 series)

### Product & Planning (PP)

#### 261-PP-PROD-intentmail-project-brief.md
**Category:** Product & Planning
**Type:** Product Requirements
**Status:** Draft - Phase 1
**Description:** Comprehensive project brief covering:
- Purpose and problem statement
- Goals and non-goals
- Target users (developers, small businesses, privacy-conscious users, Claude Code users)
- Constraints (custom domains, API-first architecture, deliverability requirements)
- Success metrics (99% deliverability, 99.9% uptime)
- Risks and mitigations
- Timeline and phase breakdown

**Key Sections:**
- Problem Statement: Need for developer-friendly email with custom domains and MCP integration
- Primary Goals: Email infrastructure, MCP server, custom domain support, anti-abuse, deliverability
- Non-Goals: Mobile apps, legacy IMAP/POP3, enterprise SSO (Phase 1)
- Success Metrics: Deliverability > 99%, reputation > 95/100, uptime 99.9%

---

#### 261-PP-PLAN-phase-1-setup-completion.md
**Category:** Product & Planning
**Type:** Planning Document
**Status:** Complete
**Description:** Phase 1 completion record documenting:
- All tasks completed in Phase 1
- Project ID selection and validation (261)
- Folder structure evidence (000-projects and repo)
- Standard compliance checklist
- Git and beads tracking status
- Next steps for Phase 2 (infrastructure)

**Evidence Included:**
- File structure trees
- Git status output
- Project ID scanning methodology
- Document inventory (6 docs created)

---

### Architecture & Technical (AT)

#### 261-AT-ARCH-intentmail-architecture-overview.md
**Category:** Architecture & Technical
**Type:** Architecture Design
**Status:** Draft - Phase 1
**Description:** Detailed system architecture covering:

**Core Components:**
1. **Inbound Mail Pipeline** - SMTP receiving, parsing, spam/virus filtering
2. **Outbound Mail Pipeline** - Sending with DKIM, bounce handling, reputation monitoring
3. **Storage & Indexing** - Postgres, S3/GCS, Elasticsearch/Meilisearch
4. **MCP Server** - Claude Code integration (7+ email operations exposed)
5. **API Gateway** - REST and GraphQL endpoints
6. **Web UI Client** - React-based user interface
7. **Auth Service** - User authentication and domain verification

**Key Sections:**
- System architecture diagrams
- Data flow (inbound and outbound)
- Security considerations (SPF, DKIM, DMARC, encryption)
- Scalability strategies (horizontal scaling, sharding, caching)
- Technology stack recommendations
- Open design questions and decisions

**Technology Recommendations:**
- Cloud: GCP or AWS
- Database: Postgres (Cloud SQL/RDS)
- Storage: S3 or GCS
- Search: Meilisearch (MVP) → Elasticsearch (scale)
- API: NestJS (TypeScript)
- UI: React + TypeScript + Vite

---

### Phase 2 Planning Documents

#### 262-PP-RMAP-phase-2-epic-dependency-map.md
**Category:** Product & Planning
**Type:** Roadmap (RMAP)
**Status:** Draft - Phase 2
**Description:** Complete epic roadmap with 15 epics, dependency graph (Mermaid), acceptance criteria, milestones, and risk register. Maps E1-E11 with sub-epics under E4 (provider connectors).

#### 262-AT-DSGN-canonical-mail-model.md
**Category:** Architecture & Technical
**Type:** Design (DSGN)
**Status:** Draft - Phase 2
**Description:** Canonical data models (Message, Thread, Label, Rule, Identity, Attachment, Draft) with provider capability matrix and transformation rules for Gmail/Outlook/Fastmail/IMAP.

#### 262-AT-APIS-mcp-tool-contract.md
**Category:** Architecture & Technical
**Type:** API Specification (APIS)
**Status:** Draft - Phase 2
**Description:** MCP tool definitions (10+ tools), error model, pagination standards, and capability reporting for Claude Code integration.

#### 262-AT-DSGN-rules-as-code-spec.md
**Category:** Architecture & Technical
**Type:** Design (DSGN)
**Status:** Draft - Phase 2
**Description:** Rules engine specification with YAML format, dry-run plans, audit logging, and rollback mechanisms for safe email automation.

#### 262-AT-DSGN-sync-index-strategy.md
**Category:** Architecture & Technical
**Type:** Design (DSGN)
**Status:** Draft - Phase 2
**Description:** Delta sync strategies per provider, storage choice (SQLite/libsql), reconciliation algorithms, and idempotency keys.

#### 262-AT-DSGN-security-auth-baseline.md
**Category:** Architecture & Technical
**Type:** Design (DSGN)
**Status:** Draft - Phase 2
**Description:** OAuth flows per provider, secret storage policy, RBAC boundaries, threat model, compliance baseline (GDPR/CAN-SPAM), and security checklist.

---

### Documentation & Reference (DR)

**No DR documents yet in this repo** (see 000-projects folder for standard pointer)

---

### Miscellaneous (MS)

#### 261-MS-INDX-intentmail-doc-index.md
**Category:** Miscellaneous
**Type:** Index
**Status:** Living Document
**Description:** This file - master index for all IntentMail documentation

---

## Additional Documentation Locations

### Local 000-projects Folder
**Location:** `/home/jeremy/000-projects/mail/intent-mail/000-docs/`

**Documents:**
1. `261-DR-REFF-filing-system-standard-pointer.md` - Pointer to standard v4.2
2. `261-MS-INDX-intentmail-doc-index.md` - Local documentation index

**Purpose:** Long-term project documentation storage following filing standard

---

## Document Statistics

| Metric | Value |
|--------|-------|
| **Total Documents** | 12 (10 in repo, 2 in 000-projects) |
| **Phase 1 Docs** | 6 documents |
| **Phase 2 Docs** | 6 planning documents |
| **Total Word Count** | ~30,000 words |
| **Project ID** | 261 (validated unused) |
| **Standard Compliance** | 100% |
| **Categories Used** | PP, AT, DR, MS |
| **Types Used** | PROD, ARCH, PLAN, INDX, REFF, RMAP, DSGN, APIS |

---

## Filing System Quick Reference

**Project ID 261 Naming Pattern:**
```
261-CC-ABCD-short-description.md
```

**Categories (CC) Used:**
- **PP** - Product & Planning (PROD, PLAN)
- **AT** - Architecture & Technical (ARCH)
- **DR** - Documentation & Reference (REFF)
- **MS** - Miscellaneous (INDX)

**Types (ABCD) Used:**
- **PROD** - Product requirements/brief
- **ARCH** - Architecture design
- **PLAN** - Planning document
- **INDX** - Index file
- **REFF** - Reference/pointer document

**Standard Reference:**
- Canonical: `/home/jeremy/000-projects/resume/firebase-generator/000-docs/6767-a-DR-STND-document-filing-system-standard-v4.md`
- Version: v4.2
- Status: Production
- Last Updated: 2025-12-07

---

## Project Phases

### ✅ Phase 1 - Setup (COMPLETE)
**Status:** Complete - Awaiting commit/push
**Documents:**
- Project brief (PROD)
- Architecture overview (ARCH)
- Phase 1 completion (PLAN)
- Documentation indexes (INDX × 2)
- Standard pointer (REFF)

### ✅ Phase 2 - Epic Planning (COMPLETE)
**Status:** Epics + Planning Docs Complete
**Beads Epic:** `ai-devops-intent-solutions-b76` (15 epics total)
**Documents:**
- `262-PP-RMAP-phase-2-epic-dependency-map.md` - Epic roadmap with dependencies
- `262-AT-DSGN-canonical-mail-model.md` - Data model specification
- `262-AT-APIS-mcp-tool-contract.md` - MCP tool definitions
- `262-AT-DSGN-rules-as-code-spec.md` - Rules engine spec
- `262-AT-DSGN-sync-index-strategy.md` - Sync + index strategy
- `262-AT-DSGN-security-auth-baseline.md` - Security baseline

**Epics Created (11 main + 4 sub):**
1. E1: Product Definition + Scope Lock
2. E2: Canonical Mail Model + Provider Abstraction
3. E3: Connectors Framework (Connector SDK)
4. E4: Provider Connectors (4 sub-epics: Fastmail, Gmail, Outlook, IMAP)
5. E5: Sync + Index Layer (State + Deltas)
6. E6: Rules-as-Code Engine (Audit + Rollback)
7. E7: MCP Server Surface (Unified Tools)
8. E8: No-Claw Triage UI
9. E9: Auth + Security + Compliance Baseline
10. E10: Migration + Onboarding Wizard
11. E11: Observability + Ops + Release Packaging

### 🔜 Phase 3 - Implementation (NOT STARTED)
**Planned:** Infrastructure build-out per epic roadmap

### 🔜 Phase 3 - MCP Integration (NOT STARTED)
**Planned Documents:**
- MCP server implementation guide
- Email tool definitions
- Claude Code plugin documentation
- Phase 3 completion record (PLAN)

### 🔜 Phase 4 - Web UI (NOT STARTED)
**Planned Documents:**
- UI/UX design specifications
- Component documentation
- Frontend architecture
- Phase 4 completion record (PLAN)

### 🔜 Phase 5 - Custom Domains (NOT STARTED)
**Planned Documents:**
- DNS verification flow
- SPF/DKIM/DMARC setup automation
- Domain management API
- Phase 5 completion record (PLAN)

---

## Related Standards & References

### Document Filing System
- **Standard:** 6767-a-DR-STND-document-filing-system-standard-v4.md
- **Version:** v4.2
- **Status:** Production
- **Local Pointer:** `261-DR-REFF-filing-system-standard-pointer.md`

### Email Standards (Future Reference)
- RFC 5321 (SMTP)
- RFC 5322 (Internet Message Format)
- RFC 6376 (DKIM)
- RFC 7208 (SPF)
- RFC 7489 (DMARC)
- RFC 2045-2049 (MIME)

### MCP Protocol (Future Reference)
- Claude Code MCP specification
- Tool definition schema
- Authentication and rate limiting

---

## Change Log

| Date | Changes | Author |
|------|---------|--------|
| 2025-12-23 | Initial index created with Phase 1 docs | Claude Code |
| 2025-12-23 | Added project brief, architecture, phase 1 completion | Claude Code |
| 2025-12-23 | Added Phase 2 epic planning (6 docs, 15 epics in beads) | Claude Code |

---

## Document Maintenance

**Owner:** Jeremy Longshore
**Update Frequency:** After each phase completion
**Review Schedule:** Quarterly or when major changes occur
**Standard Compliance:** Verified against v4.2 (2025-12-23)

---

**Index Version:** 1.0
**Last Updated:** 2025-12-23
**Next Review:** After Phase 2 completion
