# Example: /new-project Demo - SaaS Web App

**Demo:** Customer support ticket management SaaS platform
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

User: customer-support-saas

Claude: Great! Now I'll gather some key information to generate your documentation. Let me ask a few targeted questions:

**Project Overview:** In 2-3 sentences, what are you building and why now?

User: We're building a modern customer support ticket management platform that integrates with popular communication channels like email, chat, and social media. Current solutions are either too expensive for growing businesses or lack modern features like AI-powered ticket routing and sentiment analysis. The market timing is perfect as businesses are prioritizing customer experience post-pandemic.

Claude: **Target Users:** Who are your primary users and what pain points does this solve?

User: Our primary users are customer support managers and agents at growing SaaS companies (50-500 employees). Their main pain points are: 1) Juggling multiple support channels manually, 2) Inconsistent response times leading to unhappy customers, 3) No visibility into team performance and customer satisfaction trends.

Claude: **Technical Approach:** What's your planned technology stack and key integrations?

User: React/TypeScript frontend, Node.js/Express backend, PostgreSQL database, Redis for caching. Key integrations include Slack, Microsoft Teams, Gmail API, Zendesk migration API, Stripe for billing, and OpenAI for AI features. We'll deploy on AWS with Docker containers.

Claude: **Business Model:** How will this generate revenue and what are your key success metrics?

User: Tiered SaaS subscription model: Starter ($29/month), Professional ($79/month), Enterprise (custom pricing). Key metrics: MRR growth, customer acquisition cost, support ticket resolution time improvement, and customer satisfaction scores. Target is 100 paying customers by month 6.

Claude: Excellent! I'm generating 12 comprehensive documents for your business-focused, standard-scope project.

[Generates 12 professional documents in ~/ai-dev/completed-docs/customer-support-saas/]

Documentation generated successfully!
📁 Output: ~/ai-dev/completed-docs/customer-support-saas/
📋 Files: 12 documents including PRD, market research, personas, technical architecture
🔗 Index: Start with index.md for navigation and project overview
⏱️ Generation time: 28 seconds
```

---

## Generated Files Summary

**Project Classification:**
- Starting Point: Greenfield
- Audience: Business
- Scope: Standard (12 documents)

**Documents Created:**

1. **01_prd.md** - Product Requirements Document
   - Complete feature specifications for ticket management platform
   - Integration requirements for email, chat, social media channels
   - AI-powered routing and sentiment analysis features

2. **02_adr.md** - Architecture Decision Record
   - Technology stack decisions (React, Node.js, PostgreSQL)
   - Integration architecture for third-party APIs
   - Deployment strategy using AWS and Docker

3. **03_generate_tasks.md** - Implementation Task Breakdown
   - Development phases: MVP → Beta → Production
   - Sprint planning with 2-week cycles
   - Team assignments and dependencies

4. **05_market_research.md** - Market Research & Analysis
   - Competitor analysis (Zendesk, Freshdesk, Intercom)
   - Market size ($4.2B customer support software market)
   - Pricing strategy and positioning

5. **08_personas.md** - User Personas & Profiles
   - Support Manager Sarah: Needs dashboards and team oversight
   - Support Agent Mike: Needs efficient ticket handling tools
   - Customer Success Director Lisa: Needs integration and analytics

6. **09_user_journeys.md** - User Journey Mapping
   - Onboarding flow for new teams
   - Daily ticket management workflow
   - Customer escalation handling process

7. **10_user_stories.md** - User Story Templates
   - Epic: Multi-channel ticket aggregation
   - Epic: AI-powered ticket routing
   - Epic: Performance analytics dashboard

8. **11_acceptance_criteria.md** - Acceptance Criteria Definition
   - Ticket routing accuracy >85%
   - Response time SLA compliance tracking
   - Integration uptime requirements >99.5%

9. **14_project_brief.md** - Project Brief & Charter
   - Executive summary and business case
   - Resource requirements and timeline
   - Success criteria and risk factors

10. **15_brainstorming.md** - Brainstorming & Ideation
    - Feature prioritization matrix
    - Innovation opportunities (AI, automation)
    - Future enhancement roadmap

11. **16_frontend_spec.md** - Frontend Technical Specification
    - React component architecture
    - State management with Redux Toolkit
    - UI/UX specifications and design system

12. **17_test_plan.md** - Testing Strategy & Plan
    - Unit testing with Jest and React Testing Library
    - Integration testing for API endpoints
    - End-to-end testing with Cypress

13. **index.md** - Project Navigation & Summary
    - Complete project overview
    - Documentation roadmap
    - Quick start guide for development team

---

## Key Features Demonstrated

- **Business-Focused Questions:** Tailored for established company context
- **Standard Tier Coverage:** 12 strategic documents for comprehensive planning
- **SaaS-Specific Content:** Subscription model, integrations, scalability planning
- **Technical Depth:** Full stack architecture with modern technologies
- **Market Analysis:** Competitive positioning and pricing strategy
- **Team Coordination:** Clear user stories and acceptance criteria

**Total Generation Time:** 28 seconds from initial /new-project to complete 12-document suite

---

## Business Value Delivered

**Documentation Quality:** Enterprise-grade specifications ready for:
- Development team kickoff
- Stakeholder alignment meetings
- Investor presentations
- Technical architecture reviews

**Time Savings:** Reduced documentation creation from 2-3 weeks to 28 seconds while maintaining professional quality and comprehensive coverage.