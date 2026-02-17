# 006 - Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 2.0.x | Yes |
| 1.0.x | Security fixes only |
| < 1.0 | No |

## Reporting Vulnerabilities

**Do NOT open a public issue for security vulnerabilities.**

Email: security@intentsolutions.io

Include:
- Description of the vulnerability
- Steps to reproduce
- Impact assessment
- Suggested fix (if any)

We will acknowledge receipt within 48 hours and provide a timeline for resolution.

## Security Considerations

### Template Generation
- Templates are read-only and verified via CI
- Generated content is written to user-specified directories only
- No network calls during template generation (air-gapped safe)

### MCP Server
- Stateless design - no persistent state between calls
- No credentials stored or transmitted
- Input validation on all tool parameters
- Output sanitization for file paths (no directory traversal)

### CLI Tool
- No telemetry without explicit opt-in
- No automatic updates without user consent
- File operations restricted to user-specified output directories

### Dependencies
- Regular dependency audits via `npm audit`
- Automated security scanning via GitHub Actions
- Minimum dependency policy - only what's necessary

## Security Checklist for Contributors

- [ ] No hardcoded secrets or API keys
- [ ] File paths validated against directory traversal
- [ ] User input sanitized before use
- [ ] Dependencies audited before adding
- [ ] No eval() or dynamic code execution
- [ ] Error messages don't leak internal paths or state
