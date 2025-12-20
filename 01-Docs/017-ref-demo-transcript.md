# Example: /new-project Demo Session

**Demo:** Chat AI mobile app for customer support
**Tier:** Standard (12 documents)
**Generated:** 2025-09-18

---

## User Session Transcript

```
User: /new-project

Claude: I'll help you generate professional project documentation. Let me ask a few questions to understand your project:

**1. Starting Point:** Are you building something completely new (greenfield) or improving/extending an existing system (brownfield)?

User: greenfield

Claude: **2. Audience:** Who is this primarily for?
- startup (small team, rapid iteration)
- business (established company, proven processes)
- enterprise (large organization, compliance requirements)

User: business

Claude: **3. Scope:** How comprehensive should the documentation be?
- mvp (4 core docs: PRD, tasks, brief, brainstorming)
- standard (12 docs: adds research, personas, journeys, stories, criteria, frontend, tests)
- comprehensive (all 22 docs: complete enterprise suite)

User: standard

Claude: Perfect! What's your project name? (I'll use kebab-case for the folder)

User: chat-ai-customer-support

Claude: Great! I'm generating documentation for your business-focused, standard-scope project.

[generates 12 professional documents in ~/ai-dev/completed-docs/chat-ai-customer-support/]

Documentation generated successfully!
📁 Output: ~/ai-dev/completed-docs/chat-ai-customer-support/
📋 Files: 12 documents including PRD, architecture, personas, user stories, and test plan
🔗 Index: Start with index.md for navigation and project overview
```

---

## Generated Files

The session created these documents:

1. **01_prd.md** - Product Requirements Document
2. **02_adr.md** - Architecture Decision Record
3. **03_generate_tasks.md** - Implementation Task Breakdown
4. **05_market_research.md** - Market Research & Analysis
5. **08_personas.md** - User Personas & Profiles
6. **09_user_journeys.md** - User Journey Mapping
7. **10_user_stories.md** - User Story Templates
8. **11_acceptance_criteria.md** - Acceptance Criteria Definition
9. **14_project_brief.md** - Project Brief & Charter
10. **15_brainstorming.md** - Brainstorming & Ideation
11. **16_frontend_spec.md** - Frontend Technical Specification
12. **17_test_plan.md** - Testing Strategy & Plan
13. **index.md** - Project navigation and metadata

---

## Key Features Demonstrated

- **3-question classification** determines appropriate documentation tier
- **Smart project naming** converts to kebab-case automatically
- **Date stamping** replaces {{DATE}} placeholders with current date
- **Professional structure** creates organized folder with index
- **Metadata tracking** includes generation details in .metadata/generation.json

**Total time:** ~30 seconds from `/new-project` to complete documentation suite