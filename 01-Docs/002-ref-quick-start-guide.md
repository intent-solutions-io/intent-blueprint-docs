# ⚡ Quick Start Guide

**Get professional documentation in 30 seconds. No setup required.**

## 🚀 For Claude Code CLI Users (Recommended)

### 1. Clone & Verify (10 seconds)
```bash
git clone https://github.com/jeremylongshore/vibe-prd.git ~/ai-dev
cd ~/ai-dev
make verify  # ✅ Confirms all 22 templates ready
```

### 2. Generate Documentation (20 seconds)
```bash
# Open Claude Code and paste this one-liner:
Create a new folder in completed-docs/ named after my project, then generate all 22 docs using the templates in professional-templates/. Ask me for a single free-form project summary (I can paste as much as I want). Use deductive reasoning to fill gaps. Output all final docs into completed-docs/<my-project>/ and include an index.md summarizing what was generated and any assumptions.
```

### 3. Provide Your Project Details
When Claude asks, paste your project description. Examples:
- "Building a SaaS tool for team collaboration"
- "Mobile app for fitness tracking with AI coaching"
- "Enterprise API for data analytics"

**Done! 22 professional documents generated in your project folder.**

---

## 🎯 For Cursor IDE Users

### 1. Open Project
```bash
git clone https://github.com/jeremylongshore/vibe-prd.git ~/ai-dev
cd ~/ai-dev
cursor .  # Open in Cursor IDE
```

### 2. Use Cursor Rules
```bash
# In Cursor IDE chat, type:
@.cursorrules/01-create-prd.mdc
Here's my feature: [describe your project]
```

### 3. Follow Guided Process
Cursor will guide you through structured questions and generate documents step-by-step.

---

## 📋 What You Get

### 22 Professional Documents:
- **01_prd.md** - Product Requirements Document
- **02_adr.md** - Architecture Decision Record
- **03_generate_tasks.md** - Implementation Tasks
- **04_process_task_list.md** - Task Management
- **05_market_research.md** - Market Analysis
- **And 17 more enterprise-grade templates...**

### All Documents Include:
- ✅ Professional formatting
- ✅ Cross-references between docs
- ✅ Current date stamps
- ✅ Enterprise-ready structure
- ✅ Ready for stakeholder review

---

## 🔧 Common Use Cases

### Startup Founders
**"I have an idea, need investor docs"**
- Gets: PRD, market research, risk register, operational readiness

### Product Managers
**"New feature needs documentation"**
- Gets: PRD, user stories, acceptance criteria, test plan

### Enterprise Teams
**"Compliance requires full documentation"**
- Gets: All 22 templates for audit-ready documentation

### Developers
**"Need to document architecture decisions"**
- Gets: ADR, technical specs, architecture docs

---

## ❓ Troubleshooting

### "Templates not found"
```bash
# Check templates exist
ls professional-templates/ | wc -l  # Should return 22
make verify  # Confirms all templates ready
```

### "Generation failed"
- Ensure you're in the ai-dev directory
- Check internet connection for AI assistant
- Try breaking large projects into smaller features

### "Want different templates"
- Browse `professional-templates/` to see all 22 options
- Modify your project description to emphasize needed docs
- Create custom templates following existing patterns

---

## 🚀 Next Steps

1. **Review generated docs** in `completed-docs/your-project/`
2. **Customize as needed** - docs are starting points
3. **Share with team** - all docs are stakeholder-ready
4. **Iterate quickly** - regenerate as project evolves

---

**🎯 Goal: From idea to enterprise documentation in 30 seconds.**

**Need help?** [Open an issue](https://github.com/jeremylongshore/vibe-prd/issues) or check our [examples](EXAMPLES.md).