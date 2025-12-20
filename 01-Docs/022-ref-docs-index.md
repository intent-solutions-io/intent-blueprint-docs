# vibe-prd — AI Documentation Generator

Generate 22 enterprise-grade project documents using AI assistants. Works with Claude Code CLI and Cursor IDE with no dependencies or complex setup required.

## Quick Start

### Claude One-Paste Installation
Zero setup required for Claude Code users:

```bash
mkdir -p ~/ai-dev && cd ~/ai-dev
if [ -d vibe-prd/.git ]; then cd vibe-prd && git pull; else git clone https://github.com/jeremylongshore/vibe-prd.git && cd vibe-prd; fi
mkdir -p ~/.claude/commands
cp commands/new-project.md ~/.claude/commands/
echo "Setup complete. Type /new-project to start."
```

### Generate Documentation
Type `/new-project` in Claude Code and answer 3 questions:
1. **Starting Point:** greenfield vs brownfield
2. **Audience:** startup vs business vs enterprise
3. **Scope:** mvp (4 docs) vs standard (12 docs) vs comprehensive (22 docs)

Your professional documentation will be generated in `~/ai-dev/vibe-prd/completed-docs/<project-name>/`

## Features

- **22 Professional Templates** covering product strategy through deployment
- **Multiple Workflows** supporting Claude Code CLI and Cursor IDE
- **Zero Dependencies** with no Docker, complex installs, or vendor lock-in
- **Proven Patterns** using enterprise-grade documentation structure
- **AI-Assisted** intelligent questioning flows and template population

## Documentation Tiers

| Tier | Documents | Best For | Generation Time |
|------|-----------|----------|-----------------|
| **MVP** | 4 docs | Startups, rapid prototyping | ~15 seconds |
| **Standard** | 12 docs | Established businesses | ~30 seconds |
| **Comprehensive** | 22 docs | Enterprise, compliance | ~45 seconds |

## Examples

See real-world usage demonstrations:
- [Customer Support SaaS Platform](examples.html#saas-webapp) (Standard tier)
- [IoT Agricultural Sensors](examples.html#iot-hardware) (Comprehensive tier)
- [Mobile AI Chat App](examples.html#mobile-app) (Standard tier)

## Documentation

- **[README](../README.md)** - Complete setup and usage guide
- **[Examples](examples.html)** - Real project demonstrations
- **[Export Guide](../EXPORT_GUIDE.md)** - PDF generation and export options
- **[Quick Start](../QUICK_START.md)** - 30-second setup guide
- **[Claude CLI Guide](../CLAUDE_CLI_GUIDE.md)** - Command-line usage
- **[Cursor IDE Guide](../CURSOR_IDE_GUIDE.md)** - IDE integration

## Repository

- **GitHub:** [jeremylongshore/vibe-prd](https://github.com/jeremylongshore/vibe-prd)
- **License:** Apache 2.0
- **CI Status:** [![CI](https://github.com/jeremylongshore/vibe-prd/actions/workflows/ci.yml/badge.svg)](https://github.com/jeremylongshore/vibe-prd/actions/workflows/ci.yml)
- **Latest Release:** [![Release](https://img.shields.io/github/v/release/jeremylongshore/vibe-prd?display_name=tag)](https://github.com/jeremylongshore/vibe-prd/releases)