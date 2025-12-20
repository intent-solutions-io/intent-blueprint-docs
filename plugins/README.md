# Claude Code Plugins Repository

**Official Documentation:** https://docs.claude.com/en/docs/claude-code/plugins
**Plugin Reference:** https://docs.claude.com/en/docs/claude-code/plugins-reference
**Model Context Protocol:** https://modelcontextprotocol.io/

> All content in this repository is based on official Anthropic Claude Code documentation and community best practices.

---

## 🎯 What This Repository Contains

This is a comprehensive collection of Claude Code plugins, examples, templates, and documentation to help you:

- ✅ **Get Started** with Claude Code plugins quickly
- ✅ **Create Custom Plugins** for your workflows
- ✅ **Share Plugins** with your team or community
- ✅ **Learn Best Practices** from official examples

---

## 📦 Repository Structure

```
plugins/
├── README.md                           # This file
├── .claude-plugin/
│   └── marketplace.json                # Marketplace catalog
├── docs/
│   ├── anthropic-plugin-features-2025.md  # Comprehensive plugin research
│   ├── quickstart.md                   # Quick start guide
│   └── best-practices.md               # Plugin development best practices
├── examples/
│   ├── simple-command/                 # Basic slash command plugin
│   ├── custom-agent/                   # Custom agent example
│   ├── mcp-server/                     # MCP server integration
│   └── full-featured/                  # Complete plugin with all components
└── templates/
    ├── command-template/               # Template for command plugins
    ├── agent-template/                 # Template for agent plugins
    └── enterprise-template/            # Full enterprise plugin template
```

---

## 🚀 Quick Start

### Install From This Marketplace

```bash
# Add this marketplace to Claude Code
/plugin marketplace add jeremylongshore/ai-devops-intent-solutions

# Browse available plugins
/plugin

# Install a plugin
/plugin install <plugin-name>
```

### Create Your First Plugin

```bash
# 1. Copy a template
cp -r plugins/templates/command-template my-first-plugin

# 2. Edit plugin.json
cd my-first-plugin/.claude-plugin/
# Update name, version, description

# 3. Add your command
# Edit commands/my-command.md

# 4. Test locally
cd /path/to/my-first-plugin
/plugin install .

# 5. Verify it works
/my-command
```

---

## 📚 Available Plugins

<!-- Plugins will be listed here as they're developed -->

### Core Workflow Plugins

*Coming soon...*

### Development Tools

*Coming soon...*

### Integration Plugins

*Coming soon...*

---

## 🛠️ Plugin Components

Claude Code plugins can include four types of components:

### 1. **Commands** (Slash Commands)
Custom shortcuts for frequently-used operations.

**Example:**
```bash
/deploy-staging   # Deploy to staging environment
/run-tests        # Execute test suite
/generate-docs    # Auto-generate documentation
```

### 2. **Agents** (Subagents)
Specialized AI workers for specific tasks.

**Example:**
```bash
# Security audit agent
/security-audit src/

# Code review agent
/review-pr 123
```

### 3. **Hooks** (Event Handlers)
Automate actions at specific workflow points.

**Events:**
- `PreToolUse` — Before Claude uses a tool
- `PostToolUse` — After Claude uses a tool
- `SessionStart` — When Claude Code session starts
- `SessionEnd` — When session ends

### 4. **MCP Servers** (Model Context Protocol)
Connect Claude to external tools and data sources.

**Official MCP Servers:**
- Google Drive
- Slack
- GitHub
- Postgres
- Puppeteer
- Stripe

---

## 📖 Documentation

### Essential Reading

1. **[Comprehensive Plugin Features Guide](docs/anthropic-plugin-features-2025.md)**
   Complete research document covering:
   - Plugin system overview
   - MCP deep dive
   - Step-by-step creation guides
   - Real-world examples
   - Best practices

2. **[Official Claude Code Plugin Docs](https://docs.claude.com/en/docs/claude-code/plugins)**
   Anthropic's official documentation

3. **[Plugin Reference](https://docs.claude.com/en/docs/claude-code/plugins-reference)**
   Complete API reference

### Quick Guides

- [Creating Your First Plugin](docs/quickstart.md) *(coming soon)*
- [Plugin Best Practices](docs/best-practices.md) *(coming soon)*
- [MCP Server Development](docs/mcp-servers.md) *(coming soon)*
- [Publishing to Marketplaces](docs/publishing.md) *(coming soon)*

---

## 🎓 Learning Resources

### Official Resources

- **Claude Code Docs:** https://docs.claude.com/en/docs/claude-code
- **MCP Documentation:** https://modelcontextprotocol.io/
- **Anthropic Academy:** Free courses on MCP and plugin development
- **GitHub - MCP:** https://github.com/modelcontextprotocol

### Community Resources

- **Awesome Claude Code:** https://github.com/hesreallyhim/awesome-claude-code
- **MCP Servers Registry:** Community MCP server collection
- **Plugin Marketplaces:**
  - Dan Ávila's DevOps plugins
  - Seth Hobson's 80+ sub-agents

---

## 🏗️ Creating Plugins

### Basic Plugin Structure

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json         # Required: Plugin metadata
├── commands/               # Optional: Slash commands
│   └── my-command.md
├── agents/                 # Optional: Custom agents
│   └── my-agent.md
├── hooks/                  # Optional: Event hooks
│   └── hooks.json
├── .mcp.json              # Optional: MCP server config
├── README.md              # Recommended: Documentation
└── LICENSE                # Recommended: License file
```

### Minimal plugin.json

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "My awesome Claude Code plugin",
  "author": "Your Name"
}
```

### Full plugin.json Example

```json
{
  "name": "enterprise-tools",
  "version": "2.1.0",
  "description": "Enterprise development workflow automation",
  "author": "Your Organization",
  "homepage": "https://github.com/yourorg/enterprise-tools",
  "repository": "https://github.com/yourorg/enterprise-tools",
  "license": "MIT",
  "keywords": ["enterprise", "automation", "workflow"],
  "commands": ["./commands/"],
  "agents": ["./agents/"],
  "hooks": "./config/hooks.json"
}
```

---

## 🌐 Model Context Protocol (MCP)

### What is MCP?

MCP is an open standard that allows Claude Code to connect to external tools and data sources. Think of it as "USB-C for AI applications."

### Pre-Built MCP Servers

**Official Anthropic Servers:**
- `google-drive` — Access Google Docs, Sheets, Slides
- `slack` — Send messages, manage channels
- `github` — Repository operations, PRs, issues
- `postgres` — Database queries and operations
- `puppeteer` — Browser automation
- `stripe` — Payment processing integration

### Example MCP Configuration

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

---

## 🔧 Plugin Development Workflow

### 1. Plan Your Plugin

```bash
# Identify repetitive workflows
# Examples:
# - Deployment processes
# - Testing routines
# - Code review checklists
# - Documentation generation
```

### 2. Choose Components

**Use Commands for:**
- Simple, frequently-used operations
- Quick shortcuts
- Single-step actions

**Use Agents for:**
- Complex, multi-step tasks
- Domain-specific expertise
- Iterative workflows

**Use Hooks for:**
- Automatic triggers
- Validation steps
- Post-processing

**Use MCP Servers for:**
- External tool integrations
- Database connections
- API interactions

### 3. Implement

```bash
# Copy template
cp -r templates/command-template my-plugin

# Edit manifest
vim my-plugin/.claude-plugin/plugin.json

# Add components
# - Create commands in commands/
# - Create agents in agents/
# - Configure hooks in hooks/
# - Set up MCP in .mcp.json
```

### 4. Test Locally

```bash
cd my-plugin
/plugin install .

# Test each component
/help           # Verify commands appear
/my-command     # Test command execution
```

### 5. Version and Document

```bash
# Follow semantic versioning
# Update CHANGELOG.md
# Write comprehensive README.md
# Add LICENSE file
```

### 6. Publish

```bash
# Create GitHub repository
git init
git add .
git commit -m "Initial plugin release"
git remote add origin git@github.com:username/my-plugin.git
git push -u origin main

# Create marketplace.json in separate marketplace repo
# Add plugin entry to marketplace
```

---

## 🤝 Contributing

We welcome contributions! Here's how:

### Adding New Plugins

1. Fork this repository
2. Create plugin in appropriate category
3. Add entry to `.claude-plugin/marketplace.json`
4. Test thoroughly
5. Submit pull request

### Improving Documentation

1. Create/edit files in `docs/`
2. Follow existing formatting
3. Include examples
4. Submit pull request

### Reporting Issues

- Use GitHub Issues
- Provide reproduction steps
- Include Claude Code version
- Tag with appropriate labels

---

## 📋 Best Practices

### Plugin Development

✅ **DO:**
- Use semantic versioning (1.2.3)
- Include comprehensive README
- Test all components individually
- Document all commands and agents
- Provide usage examples
- Handle errors gracefully
- Use relative paths with `./`

❌ **DON'T:**
- Bundle unrelated functionality
- Skip version numbers
- Ignore backward compatibility
- Hardcode paths or secrets
- Create dependencies on other plugins

### Security

✅ **Always:**
- Validate all inputs
- Use environment variables for secrets
- Follow least-privilege principle
- Log security events
- Rate limit API calls

❌ **Never:**
- Expose secrets in code
- Trust user input without validation
- Run with elevated privileges unnecessarily
- Skip authentication checks

---

## 🎯 Use Cases

### For Individual Developers
- Automate repetitive workflows
- Create personal productivity shortcuts
- Connect to favorite tools
- Customize development environment

### For Teams
- Enforce coding standards
- Standardize deployment processes
- Share common workflows
- Integrate internal tools

### For Organizations
- Company-wide development standards
- Compliance and security checks
- Tool integration across departments
- Onboarding automation

---

## 📜 License

This repository follows the licenses of individual plugins:
- Example plugins: MIT License
- Documentation: CC BY 4.0
- Official Anthropic content: See https://www.anthropic.com/legal

---

## 🙏 Credits & Attribution

**All plugin documentation is based on:**
- [Anthropic Claude Code Official Documentation](https://docs.claude.com/en/docs/claude-code)
- [Model Context Protocol (MCP) Official Docs](https://modelcontextprotocol.io/)
- [Anthropic GitHub Repositories](https://github.com/anthropics)

**Special Thanks:**
- Anthropic team for Claude Code and MCP
- Community plugin developers
- Contributors to this repository

---

## 📞 Support & Resources

**Official Support:**
- [Claude Help Center](https://support.claude.com/)
- [Anthropic Discord](https://discord.gg/anthropic)
- [GitHub Discussions](https://github.com/anthropics/claude-code/discussions)

**Community:**
- Reddit: r/ClaudeAI
- Twitter: @AnthropicAI
- GitHub: Awesome Claude Code

---

## 🗺️ Roadmap

### Phase 1: Foundation (Current)
- ✅ Repository structure
- ✅ Comprehensive documentation
- 🔄 Template plugins
- 🔄 Example plugins

### Phase 2: Core Plugins
- ⏳ Deployment automation plugins
- ⏳ Testing framework plugins
- ⏳ Documentation generators
- ⏳ Code quality tools

### Phase 3: Integrations
- ⏳ Popular MCP servers
- ⏳ CI/CD integrations
- ⏳ IDE-specific plugins
- ⏳ Team collaboration tools

### Phase 4: Community
- ⏳ Plugin submission process
- ⏳ Community voting
- ⏳ Featured plugins
- ⏳ Plugin analytics

---

## 🚀 Get Started Now

```bash
# Add this marketplace
/plugin marketplace add jeremylongshore/ai-devops-intent-solutions

# Explore available plugins
/plugin

# Create your own
cp -r plugins/templates/command-template my-plugin
```

**Happy plugin development!** 🎉

---

**Last Updated:** 2025-10-09
**Claude Code Version:** 2.0+
**Repository:** https://github.com/jeremylongshore/ai-devops-intent-solutions/tree/main/plugins
