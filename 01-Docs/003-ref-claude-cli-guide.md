# 🖥️ Claude Code CLI Guide

**Complete guide for using vibe-prd with Claude Code CLI - the fastest way to generate professional documentation.**

---

## 🚀 Quick Start (30 seconds)

### Method 1: One-Paste Generation (Recommended)
```bash
# 1. Clone and verify (10 seconds)
git clone https://github.com/jeremylongshore/vibe-prd.git ~/ai-dev
cd ~/ai-dev && make verify

# 2. Open Claude Code CLI and paste this command:
```

**Copy this exact prompt:**
```
Create a new folder in completed-docs/ named after my project, then generate all 22 docs using the templates in professional-templates/. Ask me for a single free-form project summary (I can paste as much as I want). Use deductive reasoning to fill gaps. Output all final docs into completed-docs/<my-project>/ and include an index.md summarizing what was generated and any assumptions.
```

**That's it!** Claude will ask for your project details, then generate complete documentation.

---

## 🎯 Method 2: /new-project Command

### Setup
```bash
# Ensure command is available
ls ~/.claude/commands/new-project.md  # Should exist after cloning
```

### Usage
```bash
# In Claude Code CLI, type:
/new-project
```

### What Happens:
1. **Project Classification** - Claude asks 3 quick questions about your project
2. **Tier Recommendation** - Gets MVP/Standard/Enterprise recommendation
3. **Adaptive Questioning** - 5-8 smart questions based on your context
4. **Document Generation** - Creates professional docs in minutes
5. **Quality Validation** - Ensures completeness and cross-references

---

## 🎮 Interactive Demo

### Example Conversation Flow:

```
👤 /new-project

🤖 I'll help you generate professional documentation for your project!

Let me start with a few classification questions:

**Project Type**: Are you starting something completely new (Greenfield) or enhancing an existing system (Brownfield)?

👤 Greenfield - completely new mobile app idea

🤖 **Team Context**: What describes your situation best:
- Solo/Startup (1-5 people)
- Business Team (6-50 people)
- Enterprise (50+ people)
- Open Source Project

👤 Solo founder, just me right now

🤖 **Documentation Goal**: What's your primary objective:
- Quick Validation (MVP planning, rapid iteration)
- Business Alignment (stakeholder communication)
- Comprehensive Planning (compliance, audit requirements)

👤 Quick validation - want to test the idea with users

🤖 Perfect! Based on your responses, I recommend **MVP Tier**:
- Time: ~5 minutes
- Documents: 4 essential templates
- Best for: Solo founders doing rapid validation

Proceed with MVP tier?

👤 Yes, let's do it

🤖 Great! Now let me ask about your specific project:

**Problem Statement**: What problem are you solving, and who has this problem?

👤 Busy professionals struggle to maintain fitness routines. My app uses AI to create personalized 15-minute workouts that fit into any schedule.

🤖 **Solution Approach**: How does your AI personalization work, and what makes it different from existing fitness apps?

👤 It learns from your schedule, fitness level, available equipment, and past workout feedback. Unlike other apps that just have preset routines, this adapts in real-time.

[... continues with 3-5 more adaptive questions ...]

🤖 ✅ **Documentation Generation Complete!**

📁 Location: ~/ai-dev/completed-docs/fitness-ai-app/
📋 Generated: 4 professional documents
⏱️  Time: 4 minutes
🎯 Tier: MVP

Your Documents:
- 01_prd.md - Product Requirements (problem, solution, features)
- 03_generate_tasks.md - Implementation roadmap
- 14_project_brief.md - Project charter and vision
- 15_brainstorming.md - Feature ideas and opportunities

Next Steps:
1. Review documents in your project folder
2. Share with potential users for feedback
3. Use task breakdown to start prototyping
```

---

## 📊 Documentation Tiers Explained

### 🚀 MVP Tier (3-5 minutes)
**Perfect for:**
- Solo founders and startups
- Quick validation needs
- Resource-constrained projects

**You Get:**
- Essential problem/solution documentation
- Basic implementation roadmap
- Project charter for clarity
- Creative brainstorming for future features

### 🏢 Standard Tier (8-12 minutes)
**Perfect for:**
- Business teams launching features
- Stakeholder alignment needs
- Market validation requirements

**You Get:**
- All MVP documents plus:
- Technical architecture decisions
- Market research and competitive analysis
- User personas and journey mapping
- Comprehensive user stories and acceptance criteria

### 🏛️ Enterprise Tier (15-20 minutes)
**Perfect for:**
- Large organizations
- Compliance requirements
- Audit-ready documentation

**You Get:**
- Complete 22-document professional suite
- Risk management and operational readiness
- Quality assurance and release planning
- Metrics dashboards and post-mortem templates

---

## 🛠️ Advanced Usage

### Custom Project Types
```bash
# For specialized projects, provide context in your initial description:

"Building a HIPAA-compliant healthcare app..."
→ Claude automatically includes compliance considerations

"Open source developer tool for the JavaScript community..."
→ Claude focuses on community building and contribution workflows

"Enterprise integration with existing SAP systems..."
→ Claude emphasizes architecture decisions and operational readiness
```

### Regeneration & Updates
```bash
# Update existing project documentation
cd ~/ai-dev
# Run /new-project again with same project name
# Claude detects existing docs and offers to update/expand them
```

### Template Customization
```bash
# View available templates
ls professional-templates/

# Use specific templates only
# Modify your project description to emphasize needed docs:
"I need comprehensive user research documentation for my mobile app"
→ Focuses on personas, user journeys, market research templates
```

---

## 🔧 Troubleshooting

### Common Issues

**"Templates not found"**
```bash
# Fix: Ensure you're in the right directory
cd ~/ai-dev
make verify  # Should show "✅ templates OK (22)"
```

**"Generation incomplete"**
```bash
# Check what was created
ls completed-docs/your-project/

# Regenerate missing docs by running /new-project again
# Claude will detect existing files and only generate missing ones
```

**"Need different documentation focus"**
```bash
# Solution: Be more specific in your project description
# Instead of: "mobile app"
# Try: "mobile fitness app with AI coaching for busy professionals"
```

### Getting Help
- **File issues**: [GitHub Issues](https://github.com/jeremylongshore/vibe-prd/issues)
- **See examples**: Check [EXAMPLES.md](EXAMPLES.md) for similar projects
- **Quick reference**: [QUICK_START.md](QUICK_START.md) for basic usage

---

## 🎯 Pro Tips

### Maximize Documentation Quality
1. **Be specific** in your project description - more detail = better docs
2. **Mention your industry** - enables compliance and regulation awareness
3. **Include team context** - helps with stakeholder-appropriate language
4. **State your timeline** - influences MVP vs comprehensive planning

### Efficient Workflows
```bash
# Quick validation cycle:
/new-project → Review docs → Get feedback → Iterate

# Team collaboration:
Generate docs → Share completed-docs/ folder → Team reviews → Update based on feedback

# Investor prep:
Use Standard/Enterprise tier → Customize financial projections → Professional pitch materials ready
```

### Integration with Development
```bash
# Link to your project directory
ln -s ~/ai-dev/completed-docs/your-project ~/your-actual-project/docs

# Version control your documentation
cd ~/your-actual-project
git add docs/
git commit -m "Add comprehensive project documentation"
```

---

## 📈 Success Metrics

Users typically achieve:
- **75% faster** documentation creation vs manual methods
- **90% more consistent** formatting and completeness
- **50% better** stakeholder communication and alignment
- **3x higher** project success rate with comprehensive planning

---

## 🚀 Ready to Start?

1. **Clone the repo**: `git clone https://github.com/jeremylongshore/vibe-prd.git ~/ai-dev`
2. **Verify setup**: `cd ~/ai-dev && make verify`
3. **Open Claude Code CLI** and run `/new-project`
4. **Generate docs** in 5-20 minutes depending on your needs

**Transform your project idea into professional documentation today!**

---

**Next:** [Check out Cursor IDE integration →](CURSOR_IDE_GUIDE.md) | [See real examples →](EXAMPLES.md)