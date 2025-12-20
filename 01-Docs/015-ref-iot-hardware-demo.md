# Example: /new-project Demo - IoT Hardware Device

**Demo:** Smart environmental monitoring system for agriculture
**Tier:** Comprehensive (22 documents)
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

User: enterprise

Claude: **3. Scope:** How comprehensive should the documentation be?
- mvp (4 core docs: PRD, tasks, brief, brainstorming)
- standard (12 docs: adds research, personas, journeys, stories, criteria, frontend, tests)
- comprehensive (all 22 docs: complete enterprise suite)

User: comprehensive

Claude: Perfect! What's your project name? (I'll use kebab-case for the folder)

User: agri-sensor-network

Claude: Excellent! Since this is an enterprise-comprehensive project, I'll need detailed information across all business dimensions. Let me gather the key details:

**Project Overview:** Describe your smart environmental monitoring system - what specific problem does it solve?

User: We're developing an IoT sensor network that continuously monitors soil moisture, temperature, humidity, light levels, and nutrient content across large agricultural operations. Current solutions require manual sampling and provide delayed feedback, leading to crop losses and inefficient resource usage. Our system provides real-time alerts and predictive analytics to optimize irrigation, fertilization, and pest management.

**Target Market:** Who are your primary customers and what's the market opportunity?

User: Primary customers are large-scale commercial farms (1000+ acres), agricultural cooperatives, and precision agriculture service providers. Secondary market includes research institutions and government agricultural departments. The precision agriculture market is $12B globally with 15% annual growth. Our addressable market is approximately $2.8B.

**Technical Architecture:** Describe your hardware and software components.

User: Hardware: Solar-powered sensor nodes with LoRaWAN connectivity, weather stations, and edge gateway devices. Each node contains multiple sensors (soil moisture, pH, temperature, NPK levels). Software: Cloud platform built on AWS IoT Core, real-time data processing with Apache Kafka, machine learning models for predictive analytics, mobile and web dashboards for farmers.

**Regulatory Requirements:** What compliance and certification requirements apply?

User: FCC certification for wireless devices, IP67 weatherproofing standards, GDPR compliance for data handling, agricultural data privacy regulations (varies by region), and FDA guidelines for soil sensors that may contact food crops. Environmental sustainability certifications for solar components.

**Business Model:** How will you monetize this and what are the key metrics?

User: Hardware sales ($500-1500 per sensor node) plus SaaS platform subscription ($5-15 per sensor per month). Revenue streams include installation services, data analytics licensing, and API access for third-party agricultural software. Key metrics: sensor deployment count, subscription retention, crop yield improvement percentage, and customer acquisition cost.

Claude: Outstanding! I'm generating all 22 comprehensive enterprise documents for your IoT agriculture project. This will include full compliance documentation, technical specifications, and business analysis.

[Generates 22 professional documents in ~/ai-dev/completed-docs/agri-sensor-network/]

Documentation generated successfully!
📁 Output: ~/ai-dev/completed-docs/agri-sensor-network/
📋 Files: Complete 22-document enterprise suite
🔗 Index: Start with index.md for executive overview
⏱️ Generation time: 47 seconds
🎯 Enterprise-ready: Full compliance and technical specifications included
```

---

## Generated Files Summary

**Project Classification:**
- Starting Point: Greenfield
- Audience: Enterprise
- Scope: Comprehensive (22 documents)

**Complete Document Suite:**

### **Product & Strategy (5 docs)**
1. **01_prd.md** - Product Requirements Document
   - Hardware specifications for sensor nodes and gateways
   - Software platform requirements with real-time processing
   - Integration requirements for agricultural equipment

2. **05_market_research.md** - Market Research & Analysis
   - $12B precision agriculture market analysis
   - Competitor evaluation (John Deere, Climate Corporation, CropX)
   - Customer segments and addressable market sizing

3. **07_competitor_analysis.md** - Competitor Analysis
   - SWOT analysis against established agricultural IoT providers
   - Competitive positioning and differentiation strategy
   - Pricing comparison and value proposition

4. **08_personas.md** - User Personas & Profiles
   - Farm Operations Manager: Needs operational efficiency
   - Precision Agriculture Consultant: Needs data insights
   - Sustainability Director: Needs environmental compliance

5. **14_project_brief.md** - Project Brief & Charter
   - Executive summary for board approval
   - Resource requirements and ROI projections
   - Strategic objectives and success criteria

### **Technical Architecture (4 docs)**
6. **02_adr.md** - Architecture Decision Records
   - LoRaWAN vs. cellular connectivity decision rationale
   - AWS IoT Core platform selection reasoning
   - Solar power vs. battery-only power management

7. **06_architecture.md** - System Architecture
   - IoT device network topology
   - Cloud infrastructure design with edge computing
   - Data pipeline architecture and security protocols

8. **16_frontend_spec.md** - Frontend Specification
   - Mobile app requirements for field technicians
   - Web dashboard specifications for farm managers
   - Real-time alerting and notification systems

9. **19_operational_readiness.md** - Operational Readiness
   - Deployment procedures for sensor networks
   - Field maintenance protocols and schedules
   - Customer support and troubleshooting guides

### **User Experience (3 docs)**
10. **09_user_journeys.md** - User Journey Mapping
    - Initial sensor deployment and calibration process
    - Daily monitoring and alert response workflows
    - Seasonal analysis and planning cycles

11. **10_user_stories.md** - User Story Templates
    - Epic: Automated irrigation trigger system
    - Epic: Predictive pest outbreak detection
    - Epic: Crop yield optimization recommendations

12. **11_acceptance_criteria.md** - Acceptance Criteria
    - Sensor accuracy requirements (±2% for moisture, ±0.1°C temperature)
    - Network uptime SLA (99.7% excluding weather events)
    - Data transmission latency (<5 minutes for critical alerts)

### **Development Workflow (5 docs)**
13. **03_generate_tasks.md** - Implementation Task Breakdown
    - Hardware development phases and testing protocols
    - Software development sprints with IoT-specific requirements
    - Field trial planning and certification timelines

14. **04_process_task_list.md** - Task Processing & Management
    - Cross-functional team coordination (hardware, software, field ops)
    - Regulatory approval workflows and documentation
    - Manufacturing and supply chain management

15. **13_risk_register.md** - Risk Management Registry
    - Weather-related equipment failure risks
    - Regulatory compliance and certification delays
    - Supply chain disruptions for specialized sensors

16. **15_brainstorming.md** - Brainstorming & Ideation
    - Future sensor capabilities (drone integration, satellite imagery)
    - AI/ML enhancement opportunities
    - Expansion into livestock and greenhouse monitoring

17. **20_metrics_dashboard.md** - Metrics & KPI Dashboard
    - Sensor network health monitoring
    - Customer success metrics (yield improvement, resource savings)
    - Business performance tracking (ARR, deployment scale)

### **Quality Assurance (5 docs)**
18. **12_qa_gate.md** - Quality Assurance Gates
    - Hardware testing protocols (environmental chamber testing)
    - Software quality gates (performance, security, reliability)
    - Field trial validation requirements

19. **17_test_plan.md** - Testing Strategy & Plan
    - Environmental stress testing for agricultural conditions
    - Network reliability testing across various terrains
    - Data accuracy validation against laboratory standards

20. **18_release_plan.md** - Release Planning & Strategy
    - Phased rollout strategy starting with pilot farms
    - Manufacturing scale-up timeline
    - Market launch coordination across regions

21. **21_postmortem.md** - Post-Mortem Analysis Template
    - Field deployment lessons learned framework
    - Hardware failure analysis protocols
    - Customer feedback integration process

22. **22_playtest_usability.md** - Usability Testing Protocols
    - Farmer workflow usability testing procedures
    - Mobile app field testing in agricultural environments
    - Dashboard effectiveness evaluation with farm managers

---

## Enterprise Features Demonstrated

### **Regulatory Compliance Coverage**
- FCC certification requirements and testing protocols
- Environmental and safety compliance documentation
- Data privacy and agricultural data handling regulations
- International market certification requirements

### **Technical Depth**
- Hardware specifications with environmental durability requirements
- IoT network architecture with edge computing capabilities
- Real-time data processing and machine learning integration
- Scalable cloud infrastructure for thousands of sensors

### **Business Analysis**
- Comprehensive market research with $12B market opportunity
- Detailed competitive analysis against established players
- Multiple revenue streams and business model validation
- Enterprise sales cycle and customer success planning

### **Risk Management**
- Weather and environmental risk assessment
- Supply chain and manufacturing risk mitigation
- Regulatory approval timeline risks
- Technology obsolescence planning

**Total Generation Time:** 47 seconds for complete 22-document enterprise suite

---

## Enterprise Value Delivered

**Documentation Scope:** Complete enterprise-grade specifications including:
- Board presentation materials
- Technical architecture for engineering teams
- Regulatory compliance roadmap for legal review
- Market analysis for business development
- Risk assessment for operations planning
- Quality assurance protocols for manufacturing

**Compliance Ready:** All major regulatory requirements addressed:
- FCC wireless device certification
- Agricultural data privacy regulations
- Environmental sustainability standards
- International market requirements

**Time to Market:** Reduced comprehensive documentation creation from 3-6 months to 47 seconds while maintaining enterprise quality standards and regulatory compliance coverage.