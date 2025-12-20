# 🎯 Tiered Template System

**Intelligent documentation generation based on project context and user needs.**

## Overview

The `/new-project` command automatically recommends one of three documentation tiers based on user responses during project classification. Each tier provides the optimal balance of comprehensiveness and time investment.

---

## 🚀 MVP Tier (3-5 minutes)

### **Best For:**
- Solo founders and early-stage startups
- Quick validation and rapid iteration
- Proof of concept documentation
- Limited time/resources for documentation

### **Documents Generated (4 total):**

1. **01_prd.md** - Simplified Product Requirements Document
   - Essential problem/solution definition
   - Core user stories and acceptance criteria
   - Basic feature prioritization

2. **03_generate_tasks.md** - Implementation Task Breakdown
   - Development phases and milestones
   - Resource requirements
   - Quick wins and MVP features

3. **14_project_brief.md** - Project Brief & Charter
   - Mission and vision statements
   - Success criteria and constraints
   - Stakeholder identification

4. **15_brainstorming.md** - Brainstorming & Ideation
   - Feature ideas and future enhancements
   - Market opportunities
   - Creative solutions exploration

### **Time Investment:** 3-5 minutes
### **Output:** Essential foundation documents for immediate action

---

## 🏢 Standard Tier (8-12 minutes)

### **Best For:**
- Established businesses launching new features
- Teams needing stakeholder alignment
- Products requiring market validation
- Companies with formal planning processes

### **Documents Generated (12 total):**

**All MVP Tier documents plus:**

5. **02_adr.md** - Architecture Decision Record
   - Technical architecture choices
   - Technology stack rationale
   - Design patterns and principles

6. **05_market_research.md** - Market Research & Analysis
   - Competitive landscape analysis
   - Market size and opportunity
   - Customer segment validation

7. **08_personas.md** - User Personas & Profiles
   - Detailed user archetypes
   - Pain points and motivations
   - Behavioral patterns

8. **09_user_journeys.md** - User Journey Mapping
   - End-to-end user experience flows
   - Touchpoint identification
   - Friction point analysis

9. **10_user_stories.md** - User Story Templates
   - Comprehensive user story collection
   - Acceptance criteria definitions
   - Story prioritization framework

10. **11_acceptance_criteria.md** - Acceptance Criteria Definition
    - Detailed feature specifications
    - Quality gates and testing criteria
    - Definition of done standards

11. **16_frontend_spec.md** - Frontend Technical Specification
    - UI/UX requirements
    - Component architecture
    - Integration specifications

12. **17_test_plan.md** - Testing Strategy & Plan
    - Testing methodologies
    - Quality assurance processes
    - Performance benchmarks

### **Time Investment:** 8-12 minutes
### **Output:** Comprehensive business and technical documentation for stakeholder review

---

## 🏛️ Enterprise Tier (15-20 minutes)

### **Best For:**
- Large organizations with compliance requirements
- Projects requiring audit readiness
- Complex system integrations
- Regulatory or security-sensitive industries

### **Documents Generated (22 total):**

**All Standard Tier documents plus:**

13. **04_process_task_list.md** - Task Processing & Management
14. **06_architecture.md** - System Architecture Documentation
15. **07_competitor_analysis.md** - Competitive Analysis
16. **12_qa_gate.md** - Quality Assurance Gates
17. **13_risk_register.md** - Risk Management Registry
18. **18_release_plan.md** - Release Planning & Strategy
19. **19_operational_readiness.md** - Operational Readiness
20. **20_metrics_dashboard.md** - Metrics & KPI Dashboard
21. **21_postmortem.md** - Post-Mortem Analysis
22. **22_playtest_usability.md** - Usability & Playtest Documentation

### **Time Investment:** 15-20 minutes
### **Output:** Complete enterprise-grade documentation suite ready for compliance, audit, and formal review processes

---

## 🤖 Intelligent Tier Detection

The system automatically recommends the optimal tier based on:

### **Classification Factors:**

#### **Project Type**
- **Greenfield** (new project) → Often MVP or Standard
- **Brownfield** (existing system) → Often Standard or Enterprise

#### **Team Context**
- **Solo/Startup** (1-5 people) → MVP Tier
- **Business Team** (6-50 people) → Standard Tier
- **Enterprise** (50+ people) → Enterprise Tier

#### **Documentation Goal**
- **Quick Validation** → MVP Tier
- **Business Alignment** → Standard Tier
- **Comprehensive Planning** → Enterprise Tier

### **Override Options**
Users can always choose a different tier than recommended:
- "I need more comprehensive docs" → Upgrade to higher tier
- "Just the essentials please" → Downgrade to lower tier
- "Let me see all options" → Review all three tiers

---

## 📊 Tier Comparison Matrix

| Feature | MVP Tier | Standard Tier | Enterprise Tier |
|---------|----------|---------------|-----------------|
| **Time Required** | 3-5 min | 8-12 min | 15-20 min |
| **Documents** | 4 essential | 12 strategic | 22 comprehensive |
| **Best For** | Startups | Business teams | Enterprise orgs |
| **Compliance Ready** | No | Partial | Full |
| **Stakeholder Ready** | Basic | Yes | Executive-level |
| **Technical Depth** | Light | Moderate | Comprehensive |
| **Risk Management** | Minimal | Standard | Complete |
| **Audit Ready** | No | Partial | Yes |

---

## 🎯 Usage Examples

### **MVP Tier Example:**
*"I'm a solo founder with a mobile app idea for fitness tracking. Need basic docs to validate the concept with potential users."*

**→ Generates:** PRD, task breakdown, project brief, brainstorming session
**→ Result:** Ready to start prototyping and user interviews

### **Standard Tier Example:**
*"We're a 20-person SaaS company adding a new analytics dashboard feature. Need docs for engineering team and stakeholder approval."*

**→ Generates:** All MVP docs plus architecture, market research, user personas, journeys, stories, acceptance criteria, frontend specs, test plan
**→ Result:** Complete feature specification ready for development and stakeholder review

### **Enterprise Tier Example:**
*"Fortune 500 company implementing new customer data platform. Must comply with SOC2, handle 100k+ users, integrate with existing SAP systems."*

**→ Generates:** Complete 22-document suite including risk register, operational readiness, QA gates, release planning, metrics dashboard
**→ Result:** Audit-ready, compliance-focused documentation for enterprise deployment

---

## 🔄 Tier Flexibility

### **Upgrading Tiers**
- Run `/new-project` again with same project
- System detects existing documentation
- Generates additional templates for higher tier
- Maintains existing content and cross-references

### **Customizing Tiers**
- Users can request specific template combinations
- Mix and match documents from different tiers
- System maintains cross-reference integrity
- All templates remain available in `professional-templates/`

### **Template Relationships**
Each tier builds logically on previous tiers:
- **MVP** → Core foundation for immediate action
- **Standard** → Business context and stakeholder alignment
- **Enterprise** → Compliance, risk management, and audit readiness

---

**The tiered system ensures every user gets exactly the right amount of documentation for their context, from rapid startup validation to enterprise-grade compliance requirements.**