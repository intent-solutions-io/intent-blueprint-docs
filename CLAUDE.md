## Task Tracking (Beads / bd)
- Use `bd` for ALL tasks/issues (no markdown TODO lists).
- Start of session: `bd ready`
- Create work: `bd create "Title" -p 1 --description "Context + acceptance criteria"`
- Update status: `bd update <id> --status in_progress`
- Finish: `bd close <id> --reason "Done"`
- End of session: `bd sync` (flush/import/export + git sync)
- Manual testing safety:
  - Prefer `BEADS_DIR` to isolate a workspace if needed. (`BEADS_DB` exists but is deprecated.)


# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Last Updated:** 2025-09-18
**System Status:** ✅ Production Ready - Enterprise Pipeline Deployed

## Current Status
- **Release:** v1.0.9 - Enterprise Documentation Pipeline
- **Enterprise E2E:** ✅ Operational with CI/CD integration
- **Template Count:** 22 verified templates with {{DATE}} placeholders
- **Enterprise Pipeline:** ✅ 17-question intake CLI with governance controls

## System Overview

This is an **AI development workflow system with dual AI assistant integration**. It provides 22 professional templates with guided prompts for users of all skill levels - from complete beginners to experienced developers. Works with both Claude Code CLI and Cursor IDE.

## Directory Standards

Follow `.directory-standards.md` for structure and file naming.
- Store all docs in `01-Docs/`
- Use `NNN-abv-description.ext` format with approved abbreviations
- Maintain strict chronological order

## Directory Structure

```
~/ai-dev/                         # 🎯 AI DEVELOPMENT WORKFLOW SYSTEM
├── 01-Docs/                     # All documentation (23 files, NNN-abv-description.ext format)
├── 02-Src/                      # Source code (future use)
├── 03-Tests/                    # Test suites (future use)
├── 04-Assets/                   # Static assets (future use)
├── 05-Scripts/                  # Automation scripts (export.js, test-export.js, build/deploy/maintenance)
├── 06-Infrastructure/           # Infrastructure as Code (future use)
├── 07-Releases/                 # Release artifacts (future use)
├── 99-Archive/                  # Archived items (stus-og-ai-dev)
├── professional-templates/      # Master template library (22 templates)
├── form-system/                 # Interactive form tools (Node.js CLI)
├── .cursorrules/                # Cursor IDE integration (4 rule files)
├── commands/                    # Slash commands (new-project.md)
├── .github/workflows/           # CI/CD workflows (template verification)
├── .directory-standards.md      # MASTER directory standards reference
├── CLAUDE.md                    # This file - AI assistant guidance
├── README.md                    # Quick start guide
├── CHANGELOG.md                 # Version history
├── Makefile                     # Basic utilities (verify, tree, clean)
└── templates -> professional-templates/  # Symlink for compatibility
```

## Templates Available (22 Professional Documents)

**All templates include `{{DATE}}` placeholders for dynamic date insertion.**

### Complete Template List (22 Documents)

1. **01_prd.md** - Product Requirements Document
2. **02_adr.md** - Architecture Decision Record
3. **03_generate_tasks.md** - Implementation Task Breakdown
4. **04_process_task_list.md** - Task Processing & Management
5. **05_market_research.md** - Market Research & Analysis
6. **06_architecture.md** - System Architecture Documentation
7. **07_competitor_analysis.md** - Competitive Analysis
8. **08_personas.md** - User Personas & Profiles
9. **09_user_journeys.md** - User Journey Mapping
10. **10_user_stories.md** - User Story Templates
11. **11_acceptance_criteria.md** - Acceptance Criteria Definition
12. **12_qa_gate.md** - Quality Assurance Gates
13. **13_risk_register.md** - Risk Management Registry
14. **14_project_brief.md** - Project Brief & Charter
15. **15_brainstorming.md** - Brainstorming & Ideation
16. **16_frontend_spec.md** - Frontend Technical Specification
17. **17_test_plan.md** - Testing Strategy & Plan
18. **18_release_plan.md** - Release Planning & Strategy
19. **19_operational_readiness.md** - Operational Readiness
20. **20_metrics_dashboard.md** - Metrics & KPI Dashboard
21. **21_postmortem.md** - Post-Mortem Analysis
22. **22_playtest_usability.md** - Usability & Playtest Documentation

**Template Features:**
- All templates include standardized **Metadata** blocks
- Dynamic `{{DATE}}` placeholders for automatic date insertion
- Cross-references to related documents
- Professional formatting with consistent structure

## Usage Commands

### Primary Workflows

#### Claude Code CLI (Simple One-Paste)
```
Create a new folder in completed-docs/ named after my project, then generate all 22 docs using the templates in professional-templates/. Ask me for a single free-form project summary (I can paste as much as I want). Use deductive reasoning to fill gaps. Output all final docs into completed-docs/<my-project>/ and include an index.md summarizing what was generated and any assumptions.
```

#### Cursor IDE (Structured)
```
Use @.cursorrules/01-create-prd.mdc
Here's my feature: [describe it]
```
Then follow steps 2-4 in `.cursorrules/` (PRD creation follows junior developer-friendly format)

#### Enterprise Pipeline (Governance & CI/CD)
```bash
make enterprise PROJECT="my-project"                    # Interactive 17-question intake
make enterprise-ci PROJECT="my-project" ANSWERS="..."   # CI/automation mode
```

**Enterprise Features:**
- **17-question structured intake** with multi-input modes (interactive, file, stdin)
- **Automated header injection** with project metadata and cross-references
- **CI/CD integration** via `.github/workflows/enterprise-e2e.yml`
- **Governance controls** with CODEOWNERS protection and PR templates
- **Output validation** with `scripts/verify-enterprise-output.mjs`

### System Management
```bash
make verify      # Verify 22 templates exist
make tree        # Show repository layout
make clean       # Clean build artifacts (none in this system)
```

### Form System (Interactive)
```bash
node form-system/cli.js           # Interactive form interface for structured input
# Note: Requires questions.yaml and CLAUDE.template.md in vibe-prd directory
```

## AI Assistant Guidelines

### When Working with This System
1. **Templates are READ-ONLY** - Never modify professional-templates/ files
2. **Dual AI workflow** - Supports both Claude Code CLI and Cursor IDE
3. **AI Assistant Integration** - Use AI_ASSISTANT_PROMPTS.md for user guidance
4. **Multiple user types supported** - Beginners to expert developers

### AI Assistant User Support
When users need help with this system:
1. **Complete Beginners**: Direct them to the README one-paste Claude workflow
2. **Developers**: Use the structured Cursor IDE workflow
3. **Interactive Setup**: Guide them to use form-system/cli.js for structured input
4. **Template Reference**: All 22 templates in professional-templates/ directory

### Template Usage Patterns

#### For Claude Code CLI Users
```bash
# User requests: "Create comprehensive project documentation"
cd ~/ai-dev
# Paste the one-liner prompt from README.md
# Provide project description when asked
# All 22 docs generated in completed-docs/<project-name>/
```

#### For Cursor IDE Users
```bash
# User requests: structured development workflow
cd ~/ai-dev
# Use @.cursorrules/01-create-prd.mdc
# Follow structured steps 1-4
# Generated docs appear in appropriate directories
```

### Project Integration
- **All AI development work happens in ~/ai-dev/**
- Projects get Makefiles that route commands to ~/ai-dev
- Projects with comprehensive CLAUDE.md files are left untouched
- Never create project-level ai-dev directories

## File Management Rules

### NEVER Create
- Files without explicit permission
- Documentation in project root directories
- Duplicate functionality
- Test/temp files in this foundational system

### ALWAYS Maintain
- Clean directory structure
- Updated documentation
- Working automation scripts
- Template integrity

## GitHub Integration

- **Origin:** https://github.com/jeremylongshore/vibe-prd.git
- **Branch:** chore/normalize-template-metadata
- **Purpose:** Public methodology sharing (templates can be public, working docs stay private)

## Architecture & Key Features

### Template System Architecture
- **22 professional templates** in `professional-templates/` directory with `{{DATE}}` placeholders
- **Read-only templates** that generate working documents in `completed-docs/`
- **Dual AI support** - Works with both Claude Code CLI and Cursor IDE
- **Simple workflow** - No complex dependencies or containerization required

### Key Components
1. **Template library** - 22 professional document templates in `professional-templates/`
2. **form-system/cli.js** - Interactive form interface for structured input
3. **Dual AI integration** - Claude one-paste workflow and Cursor structured workflow
4. **Makefile** - Basic utilities (verify, tree, clean)
5. **CI/CD pipeline** - Automated template verification via GitHub Actions (ci.yml)
6. **Date placeholders** - All templates use `{{DATE}}` for dynamic date insertion
7. **Legacy cleanup** - Recent archival of confusing directories, normalized structure

### System Health Checks

```bash
# Verify templates (should show 22 templates)
make verify

# Check template count
ls -1 professional-templates/ | wc -l  # Should return 22

# Check for {{DATE}} placeholders in templates
grep -r "{{DATE}}" professional-templates/ | wc -l  # Should be > 0

# Verify no BMAD references outside archive
grep -r "BMAD" . --exclude-dir=archive 2>/dev/null | grep -v INIT_FOR_NEXT_SESSION.md

# Check form system (requires vibe-prd directory structure)
node form-system/cli.js

# View repository structure
make tree
```

## Integration Rules & Project Ecosystem

### Projects Using AI-Dev Pipeline
This system is designed for projects that need structured documentation workflows but don't have comprehensive development systems.

### Projects with Independent Systems (DO NOT USE AI-DEV)
- **Bob's Brain:** `~/projects/bobs-brain/` (has comprehensive CLAUDE.md)
- **DiagnosticPro:** `~/projects/diagnostic-platform/` (has comprehensive CLAUDE.md)
- **Waygate MCP:** `~/projects/waygate-mcp/` (security-focused MCP server)

### Decision Matrix for AI-Dev Usage
- ✅ **Use for:** New projects, prototypes becoming production, projects needing documentation structure
- ❌ **Don't use for:** Projects with existing comprehensive CLAUDE.md files and established workflows

---

**This is a foundational development system. Treat it as infrastructure, not a playground.**