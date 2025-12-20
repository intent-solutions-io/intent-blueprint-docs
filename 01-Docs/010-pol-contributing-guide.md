# Contributing to vibe-prd

Thank you for considering contributing to vibe-prd! This document outlines the process for contributing to our AI documentation generator.

## Ground Rules

- Keep the 22 core templates canonical
- New template additions belong in separate folders
- Follow our documentation standards
- Test all changes with the enterprise pipeline
- No breaking changes to existing workflows

## Getting Started

### Local Setup

```bash
git clone https://github.com/jeremylongshore/vibe-prd.git ~/ai-dev
cd ~/ai-dev
make verify  # Confirm all 22 templates are present
```

### Testing Your Changes

Before submitting a PR, run the full test suite:

```bash
# Verify templates
make verify

# Test enterprise pipeline
make enterprise-ci PROJECT="_test_contribution" ANSWERS=".github/fixtures/enterprise_answers.ci.txt"

# Confirm outputs
ls completed-docs/_test_contribution/  # Should show 22+ files
```

## Branch & Commit Guidelines

### Branch Naming
- `feat/<description>` - New features
- `fix/<description>` - Bug fixes
- `chore/<description>` - Maintenance tasks
- `docs/<description>` - Documentation updates

### Commit Messages
Follow [Conventional Commits](https://conventionalcommits.org/):

```
feat: add new user journey template
fix: correct date placeholder in PRD template
docs: update quick start instructions
chore: update dependencies
```

## Pull Request Process

### Before Submitting
1. ✅ `make verify` passes locally
2. ✅ Enterprise pipeline test succeeds
3. ✅ All CI workflows are green
4. ✅ Documentation updated if needed
5. ✅ PR template checklist completed

### PR Template Requirements
Your PR must include:
- Clear summary of changes
- Enterprise checklist completion
- Local test run outputs
- Screenshots/logs as evidence

### Review Process
1. All CI checks must pass
2. Enterprise E2E workflow must succeed
3. Code review by maintainers
4. Template integrity verification

## Types of Contributions

### 🎯 Most Wanted
- **Bug fixes** in existing templates
- **Documentation improvements**
- **Example additions** for new use cases
- **CI/CD enhancements**

### 📝 Template Contributions
- Keep core 22 templates unchanged
- New templates go in `additional-templates/` (create if needed)
- Include clear use case documentation
- Provide example outputs

### 🔧 Infrastructure
- GitHub Actions improvements
- Makefile enhancements
- Development tooling

## Code Standards

### Template Guidelines
- Use `{{DATE}}` for dynamic dates
- Include proper metadata blocks
- Follow existing formatting patterns
- Test with real project data

### Documentation
- Clear, concise language
- No marketing fluff
- Professional tone
- Include examples

## Testing Requirements

### Template Validation
```bash
# Template count and structure
make verify

# Enterprise pipeline end-to-end
node scripts/run-enterprise.mjs --project "_test" --answers ".github/fixtures/enterprise_answers.ci.txt"

# Verify outputs
ls completed-docs/_test/
cat completed-docs/_test/index.md
```

### CI Requirements
All PRs must pass:
- Enterprise E2E workflow
- Template validation workflow
- Repository CI checks

## Getting Help

- 📖 **Documentation**: Check [README.md](README.md) and [CLAUDE.md](CLAUDE.md)
- 🐛 **Issues**: [GitHub Issues](https://github.com/jeremylongshore/vibe-prd/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/jeremylongshore/vibe-prd/discussions)
- 📧 **Direct**: [jeremy@intentionsolutions.com](mailto:jeremy@intentionsolutions.com)

## Code of Conduct

This project follows our [Code of Conduct](CODE_OF_CONDUCT.md). Please read and follow it in all interactions.

## License

By contributing, you agree that your contributions will be licensed under the Apache 2.0 License.

---

**Thank you for contributing to vibe-prd!** 🎉