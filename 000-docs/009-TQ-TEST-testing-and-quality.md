# 009 - Testing and Quality Assurance

## Test Strategy

### Unit Tests
- Template placeholder replacement
- Scope tier filtering
- Plugin lifecycle execution
- CLI argument parsing

### Integration Tests
- MCP tool end-to-end flows
- Export integrations (GitHub, Linear, Jira, Notion)
- Enterprise pipeline E2E

### Template Verification
- All 22 templates exist and are non-empty
- All required placeholders present
- Template format consistency
- Cross-reference validity

## Running Tests

```bash
# All tests
npm run test

# Lint
npm run lint

# Template verification
make verify

# Enterprise E2E
# (Runs via GitHub Actions: enterprise-e2e.yml)
```

## CI Pipeline

### ci.yml
Runs on every push and PR:
1. Install dependencies
2. Build all packages
3. Lint (TypeScript + ESLint)
4. Unit tests
5. Template verification

### enterprise-e2e.yml
Runs on main branch:
1. Full enterprise pipeline execution
2. 17-question intake simulation
3. Document generation validation
4. Output structure verification

### template-validation.yml
Runs when templates change:
1. Template count check (must be 22)
2. Placeholder validation
3. Format consistency check

## Quality Gates

| Gate | Requirement | Blocking |
|------|-------------|----------|
| Lint | Zero errors | Yes |
| Build | All packages compile | Yes |
| Unit tests | All pass | Yes |
| Template count | Exactly 22 | Yes |
| Placeholder check | All `{{DATE}}` present | Yes |
| Enterprise E2E | Pipeline completes | Yes (on main) |

## Coverage

Target: 80% line coverage for core engine, 60% for CLI.

```bash
# Run with coverage
npm run test -- --coverage
```

## Adding Tests

- Place tests adjacent to source: `src/__tests__/`
- Use descriptive test names: `it('should generate PRD with all sections')`
- Mock file system for template tests
- Mock MCP transport for server tests
