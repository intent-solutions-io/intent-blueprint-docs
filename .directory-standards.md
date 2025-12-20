# MASTER DIRECTORY STANDARDS
## Single Source of Truth for All Project Directories

**Last Updated:** 2025-10-05
**Version:** 1.0.6
**Status:** AUTHORITATIVE – All projects must sync from this file

---

## PURPOSE

This is the universal MASTER directory standards file.
All projects, regardless of type or domain, must sync from this single source of truth.
No exceptions. Use this file to create order in disorganized projects.

**Note:** This is a REFERENCE document. For AI execution prompts, see `DIRECTORY-001-professional-directory-system-100525.md`.

---

## UNIVERSAL NAMING RULES

### Files
- **kebab-case only** (all lowercase, hyphens)
- **Dates** = `YYYY-MM-DD`
- **Versions** = `name-YYYY-MM-DD-v1.ext` or `name-v1.2.3.ext`
- **No spaces, underscores, or special characters**

**Examples:**
```
✅ user-authentication.service.ts
✅ api-integration-guide-2024-10-05.md
✅ deployment-config-v2.json

❌ User Authentication.service.ts
❌ API_integration_guide.md
❌ deployment config v2.json
```

### Directories
- **Main** = PascalCase (e.g., `01-Docs`)
- **Sub** = kebab-case (e.g., `api-docs`)
- **Ordered prefixes** = `01-`, `02-`, etc.

---

## STANDARD DIRECTORY STRUCTURE

```
[PROJECT-ROOT]/
├── .github/                    # GitHub workflows, templates, configs
├── .vscode/                    # VS Code settings (optional)
├── claudes-docs/               # Claude-created documentation
│   ├── reports/                # AAR, after-action reports
│   ├── audits/                 # Audit, review files
│   ├── analysis/               # Analysis, diagnostics
│   ├── plans/                  # PRD, ARD, planning docs
│   ├── tasks/                  # Task exports, Taskwarrior
│   ├── logs/                   # Log files
│   └── misc/                   # Everything else
├── 01-Docs/                    # All documentation here, NO subdirectories
├── 02-Src/                     # Source code
│   ├── core/                   # Core business logic
│   ├── features/               # Feature modules
│   ├── shared/                 # Shared utilities
│   └── vendor/                 # Third-party code
├── 03-Tests/                   # Test suites
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   └── e2e/                    # End-to-end tests
├── 04-Assets/                  # Static assets
│   ├── images/                 # Image resources
│   ├── data/                   # Data files
│   └── configs/                # Configuration files
├── 05-Scripts/                 # Automation scripts
│   ├── build/                  # Build scripts
│   ├── deploy/                 # Deployment scripts
│   └── maintenance/            # Maintenance scripts
├── 06-Infrastructure/          # Infrastructure as Code
│   ├── docker/                 # Container definitions
│   ├── kubernetes/             # Orchestration configs
│   └── terraform/              # Infrastructure definitions
├── 07-Releases/                # Release artifacts
│   ├── current/                # Current production
│   └── archive/                # Historical releases
├── 99-Archive/                 # Archived items
│   ├── deprecated/             # Deprecated but preserved
│   └── legacy/                 # Legacy reference
├── .gitignore                  # Git ignore rules
├── README.md                   # Project overview
├── CLAUDE.md                   # Claude Code instructions
├── CHANGELOG.md                # Version history
└── LICENSE                     # License file
```

---

## DOCS FILE NAMING STANDARD

### Format

```
NNN-abv-short-description.ext
```

- **NNN** = Zero-padded sequence number (chronology enforced)
- **abv** = Approved abbreviation from table below
- **short-description** = 1–4 words, kebab-case
- **ext** = File extension

### Sub-Tasks

When a document has multiple related sub-documents:

```
005-tsk-api-endpoints.md
005a-tsk-auth-endpoints.md
005b-tsk-payment-endpoints.md

006-rsk-security-audit.md
006-1-rsk-encryption-review.md
006-2-rsk-access-controls.md
```

---

## UNIVERSAL ABBREVIATION TABLE

| Abv  | Meaning                                    |
|------|--------------------------------------------|
| adr  | Architecture Decision Record               |
| prd  | Product Requirements Document              |
| mtg  | Meeting Notes                              |
| aar  | After Action Report                        |
| log  | Log / Journal entry                        |
| tsk  | Task breakdown / Task export               |
| rsk  | Risk Register                              |
| chg  | Change Log supplement                      |
| pln  | Planning document / Roadmap                |
| rev  | Review / Retrospective                     |
| ref  | Reference material                         |
| pol  | Policy / Governance doc                    |
| sop  | Standard Operating Procedure               |
| run  | Runbook / Operational guide                |
| des  | Design specification                       |
| api  | API documentation                          |
| sec  | Security audit or findings                 |
| bug  | Bug report                                 |
| test | Test plan / results                        |
| fin  | Financial / cost doc                       |
| trn  | Training / onboarding material             |
| dpl  | Deployment instructions                    |

---

## EXAMPLE CHRONOLOGY

```
01-Docs/
├── 001-adr-initial-architecture.md
├── 002-prd-core-features.md
├── 003-mtg-kickoff-notes.md
├── 004-pln-sprint-1-roadmap.pdf
├── 005-tsk-api-endpoints.md
├── 005a-tsk-auth-endpoints.md
├── 005b-tsk-payment-endpoints.md
├── 006-rsk-data-security.md
├── 007-adr-database-choice.md
├── 008-mtg-client-feedback.md
├── 009-aar-sprint-1-review.md
└── 010-log-error-analysis.txt
```

---

## README.md REQUIREMENTS

Every `README.md` must contain:

```markdown
## Directory Standards

This project follows the MASTER DIRECTORY STANDARDS.
See `.directory-standards.md` for details.
All documentation is stored in `01-Docs/` using the `NNN-abv-description.ext` format.
```

---

## CLAUDE.md REQUIREMENTS

Every `CLAUDE.md` must contain:

```markdown
## Directory Standards

Follow `.directory-standards.md` for structure and file naming.
- Store all docs in `01-Docs/`
- Use `NNN-abv-description.ext` format with approved abbreviations
- Maintain strict chronological order
```

---

## COMPLIANCE CHECKLIST

```
□ .directory-standards.md exists and is current
□ All files follow kebab-case naming
□ All directories follow PascalCase/kebab-case rules
□ Docs files follow NNN-abv-description format
□ README.md references directory standards and docs filing
□ CLAUDE.md references directory standards and docs filing
□ Required root files present (README, CLAUDE, LICENSE, .gitignore, CHANGELOG)
□ No forbidden patterns (spaces, underscores, ALLCAPS)
□ No secrets exposed (.env, API keys)
□ Max depth ≤ 4 levels
□ claudes-docs/ properly organized
```

---

## FORBIDDEN PATTERNS

**NEVER allow these:**

### File Naming
```
❌ spaces in names.txt
❌ ALLCAPS.TXT
❌ mixed_Case-names.md
❌ special!characters@#$.pdf
❌ version_final_FINAL_v2.doc
```

### Directory Structure
```
❌ Files loose in root (except approved list)
❌ Depth > 4 levels
❌ Mixed content types in one folder
❌ Duplicate directories (docs/ and documentation/)
❌ Temp files (.tmp, .cache, .bak)
❌ Subdirectories in 01-Docs/ (keep flat)
```

### Security
```
❌ .env files committed
❌ API keys in code
❌ Passwords in configs
❌ Private keys anywhere
❌ Secrets in git history
```

---

## SYNC PROTOCOL

### For AI Assistants

When asked to sync or apply these standards to a project:

1. **Copy this standards file** to project as `.directory-standards.md`
2. **Create standard structure** (see directory tree above)
3. **Move files** to correct locations
4. **Rename files** to follow naming conventions
5. **Update README.md and CLAUDE.md** with required sections
6. **Validate** against compliance checklist
7. **Report** what was changed

### For Humans

Use the AI execution prompt: `DIRECTORY-001-professional-directory-system-100525.md`

---

## VERSION HISTORY

- **1.0.6** (2025-10-05) – Removed bash scripts, converted to AI reference doc
- **1.0.5** (2025-10-05) – Added triage command, remediation protocol, README/CLAUDE references
- **1.0.4** (2025-10-05) – Required README/CLAUDE references to standards
- **1.0.3** (2025-10-05) – Added Docs file naming + abbreviation table
- **1.0.2** (2025-10-05) – Removed Docs subdirectories, flat structure only
- **1.0.1** (2025-10-05) – Universalized version, no project-specific ties
- **1.0.0** (2025-10-04) – Initial master standards

---

## AUTHORITY

This file is the **SINGLE SOURCE OF TRUTH** for all directory organization across all Jeremy Longshore projects.

**No project-specific variations allowed without explicit approval.**

Sync this file to every project. When this file updates, all projects must re-sync.

---

**Questions or proposed changes:** Open issue in prompts-intent-solutions repo

**Master Location:** `~/projects/prompts-intent-solutions/000-master-systems/directory/MASTER-DIRECTORY-STANDARDS.md`

**AI Execution Prompt:** `~/projects/prompts-intent-solutions/000-master-systems/directory/DIRECTORY-001-professional-directory-system-100525.md`

---

*MASTER DIRECTORY STANDARDS – Universal Truth for All Projects*
