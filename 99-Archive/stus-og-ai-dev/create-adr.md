# 📋 Architecture Decision Record (ADR) Template
**Template Type**: Architecture Decision Record (ADR)  
**Purpose**: Document important architectural decisions  
**Standard**: Simplified ADR format for quick decision documentation

---

## 🎯 Template Instructions

**Use this template to create ADR documents for architectural decisions.**

**Claude Instructions**: When user asks to "Create an ADR for [decision]", use this template to generate a properly formatted Architecture Decision Record.

---

## 📋 ADR Template Structure

```markdown
# ADR-[NUMBER]: [Title]

**Date**: [YYYY-MM-DD]  
**Status**: Proposed | Accepted | Deprecated | Superseded

## Context

[What is the issue that we're seeing that is motivating this decision?]

## Decision

[What is the change that we're proposing and/or doing?]

## Consequences

### Positive
- [Positive outcome 1]
- [Positive outcome 2]

### Negative
- [Drawback 1]
- [Drawback 2]

## Alternatives Considered

### Option 1: [Alternative]
- **Pros**: 
- **Cons**: 
- **Reason for rejection**: 

### Option 2: [Alternative]
- **Pros**: 
- **Cons**: 
- **Reason for rejection**: 

## Implementation

[How will this be implemented? Key steps or code examples]

## References

- [Link to relevant documentation]
- [Related ADRs]
- [External resources]
```

---

## 📝 Completion Checklist

When creating an ADR, ensure:

- [ ] **Clear Title**: Describes the decision being made
- [ ] **Context**: Problem statement is clearly articulated
- [ ] **Decision**: Clear choice with justification
- [ ] **Consequences**: Both positive and negative impacts identified
- [ ] **Alternatives**: Options considered and reasons for rejection
- [ ] **Implementation**: Clear implementation approach
- [ ] **References**: Supporting materials and related decisions

---

## 🎯 Usage Examples

### **For Technical Architecture**:
```markdown
# ADR-001: Multi-Agent Architecture Pattern

**Date**: 2025-09-12
**Status**: Proposed
```

### **For Technology Choices**:
```markdown
# ADR-002: Neo4j for Knowledge Graph Storage

**Date**: 2025-09-12
**Status**: Accepted
```

---

## 🔄 Integration with AI Dev Workflow

**Step 1**: Identify architectural decision need  
**Step 2**: Create ADR using this template  
**Step 3**: Review and update status  
**Step 4**: Archive in project documentation  

---

**Template Status**: ✅ Ready for architectural decision documentation  
**Format**: Simplified and streamlined for quick documentation