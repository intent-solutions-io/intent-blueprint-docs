# Standard Operating Procedures - AI Development Tasks System

**Created:** 2025-09-15
**Version:** v0.2.0 (AI-Assisted)
**System:** Professional Documentation CLI with AI Integration

## SOP-001: Template Usage Workflow

### Note: AI Assistant Available
For users unfamiliar with command line tools, **use AI assistance first**:
- Copy repository URL: `https://github.com/jeremylongshore/vibe-prd`
- Use beginner prompt from README.md or AI_ASSISTANT_PROMPTS.md
- Get guided step-by-step help from Claude/ChatGPT

## SOP-002: Standard Document Creation

### Purpose
Standardized process for creating project documentation using the master template system.

### Scope
All development projects requiring structured documentation.

### Procedure

#### Step 1: Navigate to Project
```bash
cd ~/projects/my-project
# Or any directory where you want documentation
```

#### Step 2: Create Document
```bash
# Using ai-dev command (recommended)
ai-dev make create T=[template].md N=[document-name].md

# Or direct container usage
docker run --rm -v "$PWD":/workspace -w /workspace \
  ghcr.io/jeremylongshore/vibe-prd:v0.1.1 \
  make create T=[template].md N=[document-name].md

# Example: Create PRD
ai-dev make create T=create-prd.md N=feature-dashboard-prd.md
```

#### Step 3: Document Editing
- Edit the created file in your project directory
- Follow template structure and prompts
- Fill in all required sections
- Commit to your project's git repository

#### Step 4: Review and Approval
- Technical review by appropriate team member
- Business review if required
- Update document status to approved
- Archive in project documentation

## SOP-002: New Project Setup

### Purpose
Standardized process for setting up ai-dev pipeline in new projects.

### Prerequisites
- Project must be a git repository
- Project should NOT have comprehensive CLAUDE.md
- Project requires structured documentation workflow

### Procedure

#### Option A: Single Project Setup
```bash
cd [project-directory]
~/ai-dev-tasks-master/setup-scripts/setup-project.sh
# Choose template method (symlink recommended)
```

#### Option B: Workspace-Wide Setup
```bash
cd ~/ai-dev-tasks-master
./setup-scripts/setup-workspace.sh
# Processes all git repos in ~/projects/
```

### Post-Setup Verification
```bash
cd [project-directory]
make status  # Should show pipeline status
ls -la ai-dev/templates  # Should link to master templates
```

## SOP-003: Template Maintenance

### Purpose
Keep master template system updated and clean.

### Responsibilities
- **Jeremy:** Template updates, system maintenance
- **AI Assistants:** Follow templates, never modify

### Monthly Tasks
1. Review template usage metrics
2. Update templates based on feedback
3. Clean up documentation
4. Update examples

### Template Modification Rules
- **NEVER** modify templates during document creation
- **ALWAYS** modify templates in `~/ai-dev-tasks-master/professional-templates/`
- **ALWAYS** test changes with example projects
- **ALWAYS** commit template changes to GitHub

## SOP-004: System Integration

### Purpose
Proper integration with existing project systems.

### Integration Rules

#### Projects WITH Comprehensive CLAUDE.md
- **Bob's Brain:** No ai-dev pipeline (has complete system)
- **DiagnosticPro Platform:** No ai-dev pipeline (has complete system)
- **Intent Solutions Landing:** No ai-dev pipeline (has complete system)

#### Projects NEEDING ai-dev Pipeline
- New projects without documentation systems
- Projects requiring structured documentation workflow
- Prototype projects becoming production systems

### Decision Matrix
| Project Has | CLAUDE.md | Documentation System | AI-Dev Pipeline |
|-------------|-----------|---------------------|-----------------|
| Comprehensive CLAUDE.md | Yes | Complete | ❌ No |
| Basic README only | No | Minimal | ✅ Yes |
| No documentation | No | None | ✅ Yes |

## SOP-005: File Management

### Purpose
Maintain clean and organized foundational system.

### Directory Rules
```
ai-dev-tasks-master/
├── professional-templates/  # Templates ONLY
├── setup-scripts/          # Automation ONLY
├── examples/               # Examples ONLY
├── docs/                   # System documentation ONLY
├── CLAUDE.md              # AI assistant guidance
├── SOP.md                 # This file
├── README.md              # User manual
└── USER_MANUAL.md         # Comprehensive guide
```

### File Restrictions
- **NO** working documents in master system
- **NO** project-specific content
- **NO** temporary or test files
- **NO** user data or credentials

### Cleanup Schedule
- **Weekly:** Remove any stray files
- **Monthly:** Update documentation
- **Quarterly:** Review and optimize structure

## SOP-006: Troubleshooting

### Common Issues

#### Template Not Found
```bash
# Check template exists
ls -la ~/ai-dev-tasks-master/professional-templates/[template-name].md

# Verify project setup
cd [project] && ls -la ai-dev/templates
```

#### Symlink Broken
```bash
# Re-run project setup
~/ai-dev-tasks-master/setup-scripts/setup-project.sh
```

#### Make Commands Not Working
```bash
# Check Makefile exists
ls -la Makefile

# Re-run setup if missing
~/ai-dev-tasks-master/setup-scripts/setup-project.sh
```

### Escalation
- File GitHub issue for system bugs
- Contact Jeremy for template improvements
- Document solutions in this SOP

### BMAD Pin Policy
- `.bmad-version` pins image tag.
- `.bmad-lock` stores the pulled digest.
- Any change to `.bmad-version` must update `.bmad-lock` in the same PR.

---

**These SOPs ensure consistent, reliable operation of the foundational development system.**