# 🎯 Cursor IDE Guide

**Complete guide for using vibe-prd with Cursor IDE - structured documentation generation with IDE integration.**

---

## 🚀 Quick Start (60 seconds)

### 1. Setup Project
```bash
# Clone and open in Cursor
git clone https://github.com/jeremylongshore/vibe-prd.git ~/ai-dev
cd ~/ai-dev
cursor .  # Opens project in Cursor IDE
```

### 2. Generate Documentation
```bash
# In Cursor IDE chat panel, type:
@.cursorrules/new-project.mdc
Here's my feature: [describe your project in 1-2 sentences]
```

### 3. Follow Guided Process
Cursor will guide you through intelligent questions and generate professional documentation step-by-step.

**Done!** Professional docs generated with IDE-integrated workflow.

---

## 🎮 Interactive Workflow

### Example Cursor IDE Session:

```
👤 @.cursorrules/new-project.mdc
Here's my feature: SaaS platform for small business inventory management

🤖 I'll help you create comprehensive documentation for your SaaS inventory platform!

Let me start with project classification:

**Project Type**: Are you working on:
- Greenfield: Starting something completely new
- Brownfield: Enhancing/expanding an existing system

👤 Greenfield - completely new platform

🤖 **Team Context**: What describes your situation best:
- Solo/Startup (1-5 people)
- Business Team (6-50 people)
- Enterprise (50+ people)
- Open Source (community-driven)

👤 Business team - we're a 15-person company

🤖 **Documentation Goal**: What's your primary objective:
- Quick Validation: MVP planning, rapid iteration
- Business Alignment: Stakeholder communication, planning
- Comprehensive Planning: Compliance, audit requirements, full documentation

👤 Business alignment - need docs for our development team and investors

🤖 Perfect! Based on your responses, I recommend **Standard Tier**:
- Time: ~10 minutes
- Documents: 12 strategic templates
- Best for: Business teams needing stakeholder alignment

Proceed with Standard tier?

👤 Yes, that sounds perfect

🤖 Excellent! Now let me gather details about your inventory platform:

**Problem Statement**: What problem are you solving, and who has this problem?

👤 Small businesses (10-100 employees) struggle with inventory tracking across multiple locations and sales channels. They're using spreadsheets or basic systems that don't sync properly.

🤖 **Solution Overview**: Describe your SaaS platform approach in 2-3 sentences

👤 Cloud-based inventory management with real-time sync across all locations and sales channels (online, retail, wholesale). Features automated reordering, analytics dashboard, and integrations with popular POS and e-commerce systems.

🤖 **Key Stakeholders**: Who are the key stakeholders for approval on this project?

👤 Our CTO for technical decisions, VP of Product for feature prioritization, and potential Series A investors for funding

[... continues with adaptive questions based on SaaS/business context ...]

🤖 **Target Users**: Who is your primary user/customer?

👤 Small business owners and inventory managers who currently use manual processes or outdated systems

🤖 **Success Metrics**: How will you measure success for this platform?

👤 Monthly recurring revenue growth, customer churn reduction, and time-to-value for new customers

🤖 **Technical Preferences**: Any preferred tech stack or integration requirements?

👤 Cloud-native (AWS), React frontend, Node.js backend, needs to integrate with Shopify, Square, and QuickBooks

🤖 ✅ **Documentation Generation Complete!**

I've generated your Standard tier documentation suite:

📁 **Created**: ~/ai-dev/completed-docs/inventory-saas-platform/
📋 **Documents**: 12 professional templates
🎯 **Tier**: Standard (Business Team)

**Generated Documents:**
- 01_prd.md - Product Requirements Document
- 02_adr.md - Architecture Decision Record (cloud-native, integrations)
- 03_generate_tasks.md - Implementation Task Breakdown
- 05_market_research.md - Market Research & Analysis
- 08_personas.md - User Personas (business owners, inventory managers)
- 09_user_journeys.md - User Journey Mapping
- 10_user_stories.md - User Story Templates
- 11_acceptance_criteria.md - Acceptance Criteria Definition
- 14_project_brief.md - Project Brief & Charter
- 15_brainstorming.md - Brainstorming & Future Features
- 16_frontend_spec.md - Frontend Technical Specification (React)
- 17_test_plan.md - Testing Strategy & Plan

**Next Steps:**
1. Review generated documents in the completed-docs folder
2. Customize sections marked with [CUSTOMIZE] tags
3. Share with CTO and VP of Product for technical review
4. Use for investor presentations and team alignment

Ready for development planning and stakeholder review!
```

---

## 📊 Cursor-Specific Features

### IDE Integration Benefits

**File Navigation**
- Generated docs appear in Cursor file explorer
- Quick access to all templates and generated content
- Integrated search across all documentation

**Live Editing**
- Edit generated docs directly in Cursor
- Syntax highlighting for markdown
- Real-time preview of documentation

**Version Control**
- Git integration shows new documentation files
- Easy to commit and share with team
- Track documentation changes over time

### Cursor Rules Overview

**Available Rules:**
```bash
# Primary documentation generator
@.cursorrules/new-project.mdc

# Individual template generators (legacy support)
@.cursorrules/01-create-prd.mdc
@.cursorrules/02-create-adr.mdc
@.cursorrules/03-generate-tasks.mdc
@.cursorrules/04-process-task-list.mdc
```

**Recommended**: Use `@.cursorrules/new-project.mdc` for complete workflow

---

## 🎯 Tier Selection in Cursor

### MVP Tier (3-5 minutes)
**Cursor automatically recommends when you mention:**
- "startup", "solo founder", "prototype"
- "quick validation", "test idea"
- "limited resources", "bootstrapping"

**Perfect for:**
- Early-stage validation
- Resource-constrained projects
- Rapid prototyping

### Standard Tier (8-12 minutes)
**Cursor automatically recommends when you mention:**
- "business team", "stakeholders"
- "company", "department", "team"
- "market research", "competitive analysis"

**Perfect for:**
- Established businesses
- Feature launches
- Investor presentations

### Enterprise Tier (15-20 minutes)
**Cursor automatically recommends when you mention:**
- "enterprise", "compliance", "audit"
- "50+ employees", "large organization"
- "regulatory", "governance", "security"

**Perfect for:**
- Large organizations
- Compliance requirements
- Comprehensive planning

---

## 🛠️ Advanced Cursor Techniques

### Multi-Step Documentation

**Step 1: Generate Core Docs**
```bash
@.cursorrules/new-project.mdc
Here's my feature: [your project]
```

**Step 2: Expand Specific Areas**
```bash
# Focus on technical architecture
@.cursorrules/02-create-adr.mdc
Based on my project in completed-docs/[project-name], expand the technical architecture decisions

# Add comprehensive user research
@.cursorrules/08-personas.mdc
Create detailed user personas for my inventory management platform
```

### Template Customization

**Industry-Specific Adaptations**
```bash
# FinTech project
@.cursorrules/new-project.mdc
Here's my feature: FinTech app for peer-to-peer payments with regulatory compliance

# HealthTech project
@.cursorrules/new-project.mdc
Here's my feature: HIPAA-compliant patient data management system
```

**Team Size Adaptations**
```bash
# Solo founder
@.cursorrules/new-project.mdc
Here's my feature: [project] - I'm a solo founder bootstrapping this

# Enterprise team
@.cursorrules/new-project.mdc
Here's my feature: [project] - enterprise team with 200+ engineers
```

### Workflow Integration

**Development Planning**
```bash
# After documentation generation
1. Use generated task breakdown for sprint planning
2. Reference user stories for feature development
3. Follow architecture decisions for technical implementation
```

**Stakeholder Communication**
```bash
# Share specific documents
- PRD → Product stakeholders
- ADR → Technical team
- Market Research → Business stakeholders
- Test Plan → QA team
```

---

## 🔧 Troubleshooting in Cursor

### Common Issues

**"Cursor rules not found"**
```bash
# Ensure you're in the ai-dev directory
File → Open Folder → Select ~/ai-dev

# Verify .cursorrules directory exists
ls .cursorrules/  # Should show .mdc files
```

**"No response from rule"**
```bash
# Try this format exactly:
@.cursorrules/new-project.mdc
Here's my feature: [one sentence description]

# Don't include extra text before the rule call
```

**"Generated docs not showing"**
```bash
# Refresh Cursor file explorer
View → Toggle Explorer

# Check the correct location
completed-docs/[your-project-name]/
```

### Getting Better Results

**Be Specific in Your Description**
- ❌ "Mobile app"
- ✅ "Mobile fitness app with AI personal training for busy professionals"

**Include Context**
- ❌ "New feature"
- ✅ "New analytics dashboard for our SaaS platform's enterprise customers"

**Mention Constraints**
- ✅ "Healthcare app requiring HIPAA compliance"
- ✅ "Open source project targeting developer community"
- ✅ "Internal tool for 50-person engineering team"

---

## 📈 Productivity Tips

### Efficient Documentation Workflows

**Morning Documentation Sprint**
```bash
1. Open Cursor with ai-dev project
2. Run @.cursorrules/new-project.mdc for 2-3 project ideas
3. Review and customize generated docs
4. Share with team for feedback
```

**Team Collaboration**
```bash
1. Generate docs in Cursor
2. Commit to version control
3. Team reviews via pull requests
4. Iterate based on feedback
```

**Investor Preparation**
```bash
1. Use Standard/Enterprise tier for comprehensive docs
2. Customize financial projections and market analysis
3. Export key documents for presentation
4. Update as business model evolves
```

### Integration with Development

**Sprint Planning**
- Use generated task breakdown for story pointing
- Reference acceptance criteria for definition of done
- Follow architecture decisions for technical planning

**Code Development**
- Keep documentation open in Cursor while coding
- Update docs as features evolve
- Use user stories to guide implementation

**QA and Testing**
- Follow generated test plan for comprehensive coverage
- Use acceptance criteria for test case creation
- Reference operational readiness for deployment

---

## 🎯 Success Stories

### Startup Success
*"Used Cursor IDE integration to generate MVP documentation in 5 minutes. Helped us align on features before building and saved 2 weeks of back-and-forth discussions."*

### Enterprise Adoption
*"Generated comprehensive compliance documentation for our healthcare platform. Cursor's IDE integration made it easy to customize and maintain as requirements evolved."*

### Team Productivity
*"Our 25-person product team now generates consistent, professional documentation for every feature. Cursor integration means developers actually use and update the docs."*

---

## 🚀 Ready to Start?

### Quick Setup Checklist
- [ ] Clone repo: `git clone https://github.com/jeremylongshore/vibe-prd.git ~/ai-dev`
- [ ] Open in Cursor: `cd ~/ai-dev && cursor .`
- [ ] Test the integration: `@.cursorrules/new-project.mdc`
- [ ] Generate your first project documentation

### Pro Setup
- [ ] Add ai-dev to Cursor workspace favorites
- [ ] Set up git integration for documentation versioning
- [ ] Configure team sharing workflows
- [ ] Customize templates for your industry/company

**Transform your development workflow with intelligent documentation generation!**

---

**Next:** [Compare with Claude CLI →](CLAUDE_CLI_GUIDE.md) | [See real examples →](EXAMPLES.md) | [Advanced features →](TIERED_TEMPLATES.md)