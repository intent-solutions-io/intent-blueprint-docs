# IntentMail Security + Auth Baseline

**Project ID:** 261 | **Doc ID:** 262 | **Type:** Design (DSGN) | **Date:** 2025-12-23
**Epic:** E9 (`ai-devops-intent-solutions-b76.9`)

---

## Overview
Token handling, scopes, encryption, and audit posture for V1 release.

---

## Secret Storage Policy

### Storage
- **Production:** Encrypted at rest (KMS/Cloud Secret Manager)
- **Development:** Local keyring (system keychain)
- **Never:** Plain text files, environment variables

### Rotation
- **OAuth tokens:** Refresh every 30 days
- **API keys:** Rotate every 90 days
- **Encryption keys:** Rotate every 365 days

---

## OAuth Flows by Provider

### Gmail (Google OAuth 2.0)
- **Flow:** Device flow (headless) or local callback
- **Scopes:** `gmail.modify`, `gmail.send`
- **Token TTL:** Access 60 min, Refresh indefinite

### Outlook (Microsoft OAuth 2.0)
- **Flow:** Device flow or local callback
- **Scopes:** `Mail.ReadWrite`, `Mail.Send`
- **Token TTL:** Access 60 min, Refresh 90 days

### Fastmail (OAuth 2.0)
- **Flow:** Local callback (web-based)
- **Scopes:** `mail:read`, `mail:write`
- **Token TTL:** Access 60 min, Refresh indefinite

### IMAP/SMTP
- **Flow:** Basic auth (username + password or app password)
- **Storage:** Encrypted local storage
- **Security:** TLS required

---

## RBAC Boundaries

Even for single-user V1, design for multi-user:

```typescript
enum Permission {
  READ_MESSAGES = "messages:read",
  WRITE_MESSAGES = "messages:write",
  SEND_MESSAGES = "messages:send",
  MANAGE_RULES = "rules:manage",
  MANAGE_IDENTITIES = "identities:manage",
  ADMIN = "admin:all",
}

interface Role {
  name: string;
  permissions: Permission[];
}

const ROLES = {
  OWNER: [Permission.ADMIN],
  USER: [
    Permission.READ_MESSAGES,
    Permission.WRITE_MESSAGES,
    Permission.SEND_MESSAGES,
    Permission.MANAGE_RULES,
  ],
  READONLY: [Permission.READ_MESSAGES],
};
```

---

## Threat Model

### Threats
1. **Token theft** → Encrypted storage + short TTLs
2. **MITM attacks** → TLS everywhere, cert pinning
3. **XSS in UI** → CSP headers, input sanitization
4. **Rules abuse** → Dry-run required, audit logs, rate limits
5. **Provider API abuse** → Rate limiting, backoff strategies
6. **Local storage breach** → Encryption at rest, OS keychain

### Mitigations
| Threat | Mitigation | Priority |
|--------|-----------|----------|
| Token theft | Encrypted storage + OS keychain | P0 |
| MITM | TLS 1.3 + HSTS | P0 |
| XSS | CSP + input sanitization | P1 |
| Rules abuse | Audit + rate limits | P1 |
| API abuse | Exponential backoff | P2 |

---

## Compliance Baseline

### GDPR
- ✅ Right to access (export all data)
- ✅ Right to erasure (delete account + data)
- ✅ Data portability (export JSON)
- ✅ Consent (OAuth consent screens)

### CAN-SPAM
- ✅ Unsubscribe mechanism (in rules engine)
- ✅ Physical address in signatures
- ✅ No false headers (proper DKIM)

### Security Headers
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
```

---

## Encryption

### At Rest
- **Messages:** Optional (provider-dependent)
- **Tokens:** Always (AES-256-GCM)
- **Attachments:** Optional (future)

### In Transit
- **API calls:** TLS 1.3
- **Provider APIs:** TLS 1.2+ (enforced)
- **MCP server:** Local stdio (no network)

---

## Audit Logging

```typescript
interface AuditLog {
  timestamp: DateTime;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  result: "success" | "failure";
  ip_address?: string;
  user_agent?: string;
}
```

**Retention:** 90 days (configurable)
**Storage:** Append-only log (SQLite or S3)

---

## Security Checklist (V1 Release)
- [ ] All tokens encrypted at rest
- [ ] OAuth flows tested per provider
- [ ] RBAC implemented (even if single-user)
- [ ] Threat model reviewed
- [ ] Security headers configured
- [ ] Audit logging operational
- [ ] Penetration test (internal)
- [ ] Dependency scan (npm audit / Snyk)

---

**Status:** Draft | **Beads:** `ai-devops-intent-solutions-b76.9`
