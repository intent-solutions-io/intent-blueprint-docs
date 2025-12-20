# 🤝 Unified AI Workflow — Claude Code + Cursor Compatible

This repository supports **both Claude Code CLI and Cursor IDE** for AI-assisted documentation generation.

## 🎯 Choose Your Tool

### Option A: Claude Code CLI (Simple, One-Paste)
Perfect for: Quick documentation generation, command-line users, no IDE setup needed

**Steps:**
1. Clone repo: `git clone https://github.com/jeremylongshore/vibe-prd.git ~/ai-dev`
2. Open Claude Code CLI
3. Paste this prompt:
```
Create a new folder in completed-docs/ named after my project, then generate all 22 docs using the templates in professional-templates/. Ask me for a single free-form project summary. Use deductive reasoning to fill gaps. Output all final docs into completed-docs/<my-project>/ and include an index.md.
```

### Option B: Cursor IDE (Structured, Step-by-Step)
Perfect for: Detailed PRDs, database integration, iterative development

**Steps:**
1. Clone repo: `git clone https://github.com/jeremylongshore/vibe-prd.git ~/ai-dev`
2. Open in Cursor IDE
3. Follow the structured workflow:

#### Step 1: Create PRD
```
Use @.cursorrules/01-create-prd.mdc
Here's my feature: [describe your feature]
```

#### Step 2: Database Assessment (Optional)
```
Use @.cursorrules/02-setup-postgres-mcp.mdc
Reference my PRD: @tasks/prd-MyFeature.md
```

#### Step 3: Generate Tasks
```
Take @tasks/prd-MyFeature.md and create tasks using @.cursorrules/03-generate-tasks.mdc
```

#### Step 4: Process Tasks
```
Use @.cursorrules/04-task-list.mdc to process tasks
```

## 📂 Output Locations

### Claude Code CLI:
- `completed-docs/<project-name>/` — All 22 generated documents
- Clean, organized by project

### Cursor IDE:
- `tasks/` — PRDs and task lists
- `src/` — Implementation code
- Project-specific structure

## 🔀 Compatibility Matrix

| Feature | Claude Code CLI | Cursor IDE |
|---------|----------------|------------|
| 22 Enterprise Templates | ✅ | ✅ |
| One-command generation | ✅ | ❌ |
| Structured PRD workflow | ❌ | ✅ |
| Database integration | ❌ | ✅ |
| Task breakdown | Auto | Manual |
| Best for | Quick docs | Full development |

## 🎨 Template Library (Both Tools)

All 22 templates in `professional-templates/`:
1. Product Requirements (PRD)
2. Architecture Decision Records (ADR)
3. Task Generation
4. Process Task Lists
5. Market Research
6. System Architecture
7. Competitor Analysis
8. User Personas
9. User Journeys
10. User Stories
11. Acceptance Criteria
12. QA Gates
13. Risk Register
14. Project Brief
15. Brainstorming
16. Frontend Specifications
17. Test Plans
18. Release Plans
19. Operational Readiness
20. Metrics Dashboard
21. Postmortem Templates
22. Playtest/Usability

## 🚀 Quick Decision Guide

**Use Claude Code CLI when:**
- You need documentation fast
- You prefer command-line workflows
- You want all 22 docs generated at once
- You don't need database integration

**Use Cursor IDE when:**
- You need detailed, iterative PRDs
- You're building a full application
- You need database/PostgreSQL integration
- You want granular control over each step

## 🔧 Advanced: Mixing Both Approaches

You can use both tools together:
1. Use Cursor for initial PRD and planning
2. Use Claude Code CLI for bulk documentation generation
3. Keep outputs in separate directories to avoid conflicts

## 📝 Notes

- **Templates are read-only** — Never modify files in `professional-templates/`
- **Outputs are separate** — Claude uses `completed-docs/`, Cursor uses `tasks/`
- **Both tools are maintained** — This repo supports both workflows equally

---

*Last updated: 2025-09-16*
*Compatibility: Claude Code CLI v1.0+ | Cursor IDE v0.42+*