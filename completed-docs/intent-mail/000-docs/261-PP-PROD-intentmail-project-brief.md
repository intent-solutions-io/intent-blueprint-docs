# IntentMail Project Brief

**Project ID:** 261
**Project Name:** IntentMail
**Status:** Phase 1 - Initial Setup
**Date:** 2025-12-23
**Owner:** Jeremy Longshore / Intent Solutions

---

## Purpose / Problem Statement

IntentMail addresses the need for a modern, developer-friendly email infrastructure that combines:

1. **Programmatic Access**: Full API-first design for automation and integration
2. **Custom Domain Support**: Professional email addresses on custom domains without vendor lock-in
3. **MCP Interface Layer**: Claude Code integration via Model Context Protocol for intelligent email management
4. **Modern UI**: Clean, functional interface that prioritizes usability over feature bloat
5. **Deliverability & Compliance**: Built-in best practices for SPF, DKIM, DMARC, and anti-abuse

**The Problem:** Existing email solutions force trade-offs between power (API access), customization (custom domains), and usability (decent UI). Gmail/Outlook lack API-first design. Sendgrid/Mailgun lack receive/UI. Self-hosted solutions lack deliverability and ease of use.

---

## Goals

### Primary Goals
1. **Email Infrastructure**: Set up reliable inbound and outbound mail handling
2. **Storage & Indexing**: Efficient message storage with fast search capabilities
3. **MCP Server**: Expose email operations via Claude Code MCP protocol
4. **Custom Domain Support**: Enable users to send/receive from their own domains
5. **Web UI Client**: Basic functional interface for reading, composing, and organizing email
6. **Authentication & Security**: Secure multi-user auth with proper isolation
7. **Deliverability**: Implement SPF, DKIM, DMARC, and reputation monitoring
8. **Anti-Abuse**: Rate limiting, spam filtering, and abuse prevention

### Non-Goals (Phase 1)
- Advanced calendar/contacts/tasks integration
- Mobile native apps (web-first, progressive web app later)
- Legacy protocol support (IMAP/POP3 beyond initial compatibility layer)
- Email client features like templates, canned responses (later phases)
- Team collaboration features
- Enterprise SSO/SAML integration

---

## Target Users

1. **Developers**: Need programmatic email access for automation, notifications, and workflows
2. **Small Businesses**: Want professional custom domain email without Google Workspace pricing
3. **Privacy-Conscious Users**: Prefer self-hosted or transparent email solutions
4. **Claude Code Power Users**: Want intelligent email management via AI assistant
5. **Agencies**: Manage multiple client domains from one interface

---

## Constraints & Requirements

### Technical Constraints
- **Custom Domains**: Must support BYOD (Bring Your Own Domain) with DNS configuration
- **API-First**: Every UI action must have a corresponding API endpoint
- **MCP Protocol**: Must implement Claude Code MCP spec for tool use
- **Deliverability**: Cannot compromise on SPF/DKIM/DMARC - reputation is critical
- **Scalability**: Architecture must handle growth from 10 to 10,000 users
- **Standards Compliance**: RFC-compliant SMTP, MIME, and email standards

### Security & Anti-Abuse
- **Rate Limiting**: Per-user, per-domain, and per-IP rate limits
- **Spam Filtering**: Inbound spam detection and filtering
- **Authentication**: OAuth2, JWT, and API key support
- **Abuse Prevention**: Automated detection of compromised accounts
- **Data Isolation**: Complete separation between user accounts and domains

### Operational Constraints
- **Cost**: Infrastructure costs must scale linearly with usage
- **Monitoring**: Full observability into deliverability and system health
- **Backup & Recovery**: Automated backups with point-in-time recovery
- **Compliance**: GDPR, CAN-SPAM, and other email regulations

---

## Success Metrics

### Phase 1 (Setup & MVP)
- [ ] Inbound mail pipeline receives and stores messages
- [ ] Outbound mail pipeline sends with proper DKIM signatures
- [ ] MCP server exposes 5+ core email operations
- [ ] Web UI displays inbox and message content
- [ ] Custom domain DNS verification works end-to-end
- [ ] SPF/DKIM/DMARC configuration documented and tested

### Long-Term Metrics (Post-MVP)
- **Deliverability**: > 99% delivery rate to Gmail/Outlook
- **Reputation**: IP and domain reputation scores > 95/100
- **Reliability**: 99.9% uptime for message receipt and send
- **Performance**: < 500ms API response times for read operations
- **User Satisfaction**: NPS > 40 for ease of setup and use

---

## High-Level Architecture (Summary)

**Core Components:**
1. **Inbound Pipeline**: MX records → SMTP receiver → Parser → Storage
2. **Outbound Pipeline**: API/UI → Queue → DKIM signer → SMTP sender
3. **Storage & Index**: Message store (S3/Postgres) + search index (ElasticSearch/Meilisearch)
4. **MCP Server**: Claude Code integration layer for intelligent operations
5. **API Gateway**: REST/GraphQL API for programmatic access
6. **Web UI**: React/Vue frontend for human interaction
7. **Auth Service**: User authentication and domain ownership verification

**See**: `261-AT-ARCH-intentmail-architecture-overview.md` for detailed architecture.

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Deliverability issues | High | Start with transactional email, build reputation slowly |
| Spam abuse | Critical | Strict rate limits, verified domains only, automated abuse detection |
| Scaling costs | Medium | Design for horizontal scaling, use managed services where appropriate |
| MCP protocol changes | Low | Abstract MCP interface, version API endpoints |
| DNS configuration complexity | Medium | Automated DNS verification, clear setup docs, UI guides |

---

## Timeline & Phases

**Phase 1 - Setup** (CURRENT)
- Scaffold project structure, docs, and repository setup
- Document filing system compliance

**Phase 2 - Infrastructure**
- Set up cloud infrastructure (GCP/AWS)
- Inbound/outbound mail pipelines
- Storage and database setup

**Phase 3 - MCP Integration**
- Implement MCP server
- Core email operations (list, read, send, search)
- Claude Code plugin

**Phase 4 - Web UI**
- Basic inbox view
- Message reader
- Compose/send interface

**Phase 5 - Custom Domains**
- DNS verification flow
- SPF/DKIM/DMARC setup automation
- Multi-domain support

---

## Related Documents

- `261-AT-ARCH-intentmail-architecture-overview.md` - Detailed architecture
- `261-PP-PLAN-phase-1-setup-completion.md` - Phase 1 completion record
- `261-MS-INDX-intentmail-doc-index.md` - Master documentation index

---

**Document Status:** Draft
**Next Review:** After Phase 2 infrastructure setup
**Owner:** Jeremy Longshore
