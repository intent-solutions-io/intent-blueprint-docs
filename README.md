# vibe-prd — AI Documentation Generator

*Last Updated: September 19, 2025*

[![Enterprise E2E](https://github.com/jeremylongshore/vibe-prd/actions/workflows/enterprise-e2e.yml/badge.svg)](https://github.com/jeremylongshore/vibe-prd/actions/workflows/enterprise-e2e.yml)
[![CI](https://github.com/jeremylongshore/vibe-prd/actions/workflows/ci.yml/badge.svg)](https://github.com/jeremylongshore/vibe-prd/actions/workflows/ci.yml)
[![Template Validation](https://github.com/jeremylongshore/vibe-prd/actions/workflows/template-validation.yml/badge.svg)](https://github.com/jeremylongshore/vibe-prd/actions/workflows/template-validation.yml)
[![Release](https://img.shields.io/github/v/release/jeremylongshore/vibe-prd?display_name=tag)](https://github.com/jeremylongshore/vibe-prd/releases)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Issues](https://img.shields.io/github/issues/jeremylongshore/vibe-prd)](https://github.com/jeremylongshore/vibe-prd/issues)
[![PRs](https://img.shields.io/github/issues-pr/jeremylongshore/vibe-prd)](https://github.com/jeremylongshore/vibe-prd/pulls)
[![Last Commit](https://img.shields.io/github/last-commit/jeremylongshore/vibe-prd)](https://github.com/jeremylongshore/vibe-prd/commits/main)
[![Template Count](https://img.shields.io/badge/Templates-22-green.svg)](professional-templates/)
[![Contributors](https://img.shields.io/github/contributors/jeremylongshore/vibe-prd)](https://github.com/jeremylongshore/vibe-prd/graphs/contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Stars](https://img.shields.io/github/stars/jeremylongshore/vibe-prd?style=social)](https://github.com/jeremylongshore/vibe-prd/stargazers)

Generate 22 enterprise-grade project documents using AI assistants. Works with Claude Code CLI and Cursor IDE with no dependencies or complex setup required.

## Quick Start

### Claude One-Paste Quickstart
For Claude Code users. Zero setup required.

1. Open Claude Code and paste the contents of **CLAUDE_ONE_PASTE.md**
2. Type `/new-project` and answer 3 questions
3. Documentation generates under `~/ai-dev/completed-docs/<project-name>/`

### /new-project Command
**Intelligent conversation-based documentation generator for Claude Code users.**

#### Setup (One-time)
1. Copy the command file to your Claude commands directory:
   ```bash
   cp ~/ai-dev/commands/new-project.md ~/.claude/commands/
   ```

#### Usage
1. **In any Claude Code conversation**, type: `/new-project`
2. **Answer 3 questions:**
   - **Starting Point:** `greenfield` (new project) or `brownfield` (existing project)
   - **Audience:** `startup`, `business`, or `enterprise`
   - **Scope:** `mvp` (4 docs), `standard` (12 docs), or `comprehensive` (22 docs)
3. **Claude automatically generates** the appropriate documentation set
4. **Files created** in `completed-docs/<your-project-name>/` with index and metadata

#### What You Get
- **MVP (4 docs):** PRD, Tasks, Project Brief, Brainstorming
- **Standard (12 docs):** Core product, technical, and UX documentation
- **Comprehensive (22 docs):** Complete enterprise documentation suite

### Cursor IDE Quickstart
For Cursor IDE users. Structured workflow integration.

1. Copy `.cursorrules/new-project.mdc` to your project's `.cursorrules/` directory
2. Use command: `@new-project "my-app" mvp`
3. Documentation generates under `completed-docs/`

### Enterprise Pipeline
For organizations requiring structured intake and governance.

```bash
make enterprise PROJECT="my-project"                    # Interactive 17-question intake
make enterprise-ci PROJECT="my-project" ANSWERS="..."   # CI/automation with fixture data
```

✅ **Enterprise Features:**
- **17-question structured intake** with multi-input modes (interactive, file, stdin)
- **Automated header injection** with project metadata and cross-references
- **CI/CD integration** via GitHub Actions workflow
- **Governance controls** with CODEOWNERS and PR templates

### Manual Setup
Traditional clone and configure approach.

```bash
git clone https://github.com/jeremylongshore/vibe-prd.git ~/ai-dev
cd ~/ai-dev
make verify  # Confirms all 22 templates are ready
```

#### Claude Code CLI
```
Create a new folder in completed-docs/ named after my project, then generate all 22 docs using the templates in professional-templates/. Ask me for a single free-form project summary (I can paste as much as I want). Use deductive reasoning to fill gaps. Output all final docs into completed-docs/<my-project>/ and include an index.md summarizing what was generated and any assumptions.
```

#### Cursor IDE
```
Use @.cursorrules/01-create-prd.mdc
Here's my feature: [describe your feature]
```
Then follow the guided workflow in `.cursorrules/` for structured documentation.

## Features

| Feature | vibe-prd | Traditional Tools | Manual Documentation |
|---------|----------|-------------------|---------------------|
| **Speed** | 22 docs in minutes | Hours per document | Days/weeks |
| **AI Integration** | Claude + Cursor native | Limited AI support | No AI assistance |
| **Enterprise Quality** | Professional templates | Basic formats | Inconsistent quality |
| **Setup Complexity** | Zero dependencies | Docker/complex setup | N/A |
| **Template Coverage** | 22 comprehensive docs | 5-10 basic templates | Start from scratch |
| **Workflow Options** | 4 methods (One-Paste, /new-project, Cursor, Enterprise) | 1-2 basic options | Start from scratch |

## Documentation Suite (22 Templates)

### Product & Strategy (5 docs)
- **PRD** - Product Requirements Document
- **Market Research** - Competitive analysis & market sizing
- **Competitor Analysis** - SWOT analysis & positioning
- **User Personas** - Target audience profiling
- **Project Brief** - Executive summary & charter

### Technical Architecture (4 docs)
- **Architecture Decision Records (ADR)** - Technical decisions & rationale
- **System Architecture** - Technical design & infrastructure
- **Frontend Specification** - UI/UX technical requirements
- **Operational Readiness** - Production deployment checklist

### User Experience (3 docs)
- **User Stories** - Feature requirements from user perspective
- **User Journeys** - End-to-end user experience mapping
- **Acceptance Criteria** - Definition of done for features

### Development Workflow (5 docs)
- **Task Generation** - Implementation breakdown
- **Task Processing** - Development workflow management
- **Risk Register** - Risk identification & mitigation
- **Brainstorming** - Ideation & concept development
- **Metrics Dashboard** - KPI tracking & analytics

### Quality Assurance (5 docs)
- **Test Plan** - Comprehensive testing strategy
- **QA Gates** - Quality checkpoints & criteria
- **Release Plan** - Deployment strategy & rollout
- **Post-Mortem** - Issue analysis & lessons learned
- **Usability Testing** - User testing protocols & playbooks


## Use Cases

- **Startup Teams** - Rapid documentation without sacrificing quality
- **Enterprise Organizations** - Standardize documentation across teams
- **Solo Developers** - Professional docs without enterprise overhead
- **Product Managers** - Comprehensive requirements gathering
- **UX Teams** - User research and journey documentation
- **DevOps Teams** - Operational readiness and deployment planning

## Directory Standards

This project follows the MASTER DIRECTORY STANDARDS.
See `.directory-standards.md` for details.
All documentation is stored in `01-Docs/` using the `NNN-abv-description.ext` format.

## Repository Structure

```
~/ai-dev/                         # 🎯 Clean, organized AI development workspace
├── 01-Docs/                     # All documentation (23 files, NNN-abv-description.ext format)
├── 02-Src/                      # Source code (future use)
├── 03-Tests/                    # Test suites (future use)
├── 04-Assets/                   # Static assets (future use)
├── 05-Scripts/                  # Automation scripts
├── 06-Infrastructure/           # Infrastructure as Code (future use)
├── 07-Releases/                 # Release artifacts (future use)
├── 99-Archive/                  # Archived items (stus-og-ai-dev)
├── professional-templates/      # 22 master templates (read-only)
│   ├── 01_prd.md                # Product Requirements Document
│   ├── 02_adr.md                # Architecture Decision Record
│   ├── 03_generate_tasks.md     # Task breakdown templates
│   └── ... (19 more)            # Complete enterprise suite
├── .cursorrules/                # Cursor IDE integration workflows
├── commands/                    # Slash commands
├── form-system/                 # Interactive form interface
├── .directory-standards.md      # MASTER directory standards reference
├── README.md                    # This file - project overview
├── CLAUDE.md                    # AI assistant guidance
├── CHANGELOG.md                 # Version history
└── LICENSE                      # Apache 2.0 License
```

## Key Features

### AI Questioning
Asks targeted follow-up questions to extract information needed for comprehensive documentation.

### Dynamic Date Management
All templates include `{{DATE}}` placeholders for automatic timestamp insertion.

### Dual AI Workflow
- **Claude Code CLI**: Free-form input with AI deductive reasoning
- **Cursor IDE**: Structured workflows with guided prompts

### Enterprise Integration
- No vendor lock-in
- Works with existing development workflows
- Scales from solo projects to enterprise teams

## Verification & Quality

```bash
make verify      # Verify all 22 templates exist
make tree        # Show complete repository structure
ls -la professional-templates/ | wc -l  # Should show 22 templates
```

## Examples

### SaaS Product Documentation
```bash
# Input: "Building a customer support chatbot with Slack integration"
# Output: 22 comprehensive documents including PRD, architecture, test plans, and deployment strategies
```

### Mobile App Documentation
```bash
# Input: "iOS fitness tracking app with social features"
# Output: Complete documentation suite from user personas to technical architecture
```

## Contributing

Contributions welcome:

- Report issues and bugs
- Suggest new template types
- Submit documentation improvements
- Propose feature enhancements

### Contribution Guidelines
- Keep the 22 core templates canonical
- New template additions belong in separate folders
- Follow our documentation standards

## Roadmap

- [ ] **VS Code Extension** - Native IDE integration
- [ ] **Team Collaboration** - Multi-user project documentation
- [ ] **Custom Template Builder** - Create your own template sets
- [ ] **API Integration** - Programmatic documentation generation
- [ ] **More AI Providers** - Gemini, GPT-4, and Anthropic Claude support

## Documentation Links

- **Detailed Workflow**: See `UNIFIED_AI_WORKFLOW.md`
- **Cursor Setup**: See `.cursorrules/vibe-basics.md`
- **Template Reference**: All 22 templates in `professional-templates/`
- **AI Integration**: See `CLAUDE.md` for AI assistant guidance

## Optional Audits

[![Accessibility](https://github.com/jeremylongshore/vibe-prd/actions/workflows/accessibility.yml/badge.svg)](https://github.com/jeremylongshore/vibe-prd/actions/workflows/accessibility.yml)
[![Performance](https://github.com/jeremylongshore/vibe-prd/actions/workflows/performance.yml/badge.svg)](https://github.com/jeremylongshore/vibe-prd/actions/workflows/performance.yml)

**Advisory-only workflows that do not block PRs:**

### Accessibility Audit
- **Runs:** Weekly (Mondays 05:00 UTC) or manually via "Run workflow"
- **Purpose:** Checks for accessibility issues and markdown link validation
- **Note:** Safe fallback to basic link checking if pa11y tools not configured

### Performance Audit
- **Runs:** Weekly (Mondays 04:00 UTC) or manually via "Run workflow"
- **Purpose:** Lighthouse CI performance analysis of public site
- **Usage:** Provide `site_url` input when running manually, or configure `SITE_URL` repo variable/secret
- **Note:** Skips gracefully if no URL provided

Both audits upload artifacts when available and never gate merges.

## Governance (Enterprise)

**🏢 Enterprise Pipeline Protection:**
- Enterprise-critical paths require **@jeremylongshore** review via [CODEOWNERS](.github/CODEOWNERS)
- All changes must pass **Enterprise E2E** workflow before merge
- Branch protection enforces linear history and conversation resolution
- See [Branch Protection Guide](docs/branch-protection-enterprise.md) for complete governance details

**🔒 Protected Paths:**
```
/.github/workflows/enterprise-e2e.yml
/scripts/run-enterprise.mjs
/scripts/generate-enterprise.mjs
/form-system/enterprise-cli.js
/form-system/enterprise-questions.yaml
/completed-docs/
```

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=jeremylongshore/vibe-prd&type=Timeline)](https://star-history.com/#jeremylongshore/vibe-prd&Timeline)

## 👥 Contributors
[![Contributors](https://contrib.rocks/image?repo=jeremylongshore/vibe-prd)](https://github.com/jeremylongshore/vibe-prd/graphs/contributors)

- **[Stuology](https://github.com/stulogy)** — Core Contributor ⚡

Contributions of any size are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Support & Contact

- **Issues**: [GitHub Issues](https://github.com/jeremylongshore/vibe-prd/issues)
- **Discussions**: [GitHub Discussions](https://github.com/jeremylongshore/vibe-prd/discussions)
- **Email**: [jeremy@intentionsolutions.com](mailto:jeremy@intentionsolutions.com)

## Why This Repo?

- **22 professional templates** covering product strategy through deployment
- **Multiple workflows** - Claude One-Paste, manual setup, or Cursor IDE integration
- **Zero dependencies** - no Docker, complex installs, or vendor lock-in
- **Proven patterns** - enterprise-grade documentation structure
- **AI-assisted** - intelligent questioning flows and template population

## Extend & Customize

- **Templates**: Add or adjust in `professional-templates/` (keep originals canonical; add variants under a new folder).
- **Claude Command**: Edit `commands/new-project.md` for new intake logic or tiers.
- **Cursor**: Explore `.cursorrules/` to guide IDE-first users.
- **Form System**: Change questions in `form-system/questions.yaml` to fit your org.

> PRs welcome. Keep changes scoped and tested. See CONTRIBUTING.md.

## Status & Support

- **Issues**: [GitHub Issues](https://github.com/jeremylongshore/vibe-prd/issues)
- **Discussions**: [GitHub Discussions](https://github.com/jeremylongshore/vibe-prd/discussions)
- **Email**: [jeremy@intentionsolutions.com](mailto:jeremy@intentionsolutions.com)

---

[![GitHub stars](https://img.shields.io/github/stars/jeremylongshore/vibe-prd?style=social&label=Star)](https://github.com/jeremylongshore/vibe-prd/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/jeremylongshore/vibe-prd?style=social&label=Fork)](https://github.com/jeremylongshore/vibe-prd/network/members)
[![Follow on GitHub](https://img.shields.io/github/followers/jeremylongshore?style=social&label=Follow)](https://github.com/jeremylongshore/vibe-prd)