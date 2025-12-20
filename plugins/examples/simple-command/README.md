# Deployment Tools Plugin — Simple Command Example

**Plugin Type:** Commands (Slash Commands)
**Difficulty:** Beginner
**Source:** Based on [official Claude Code plugin documentation](https://docs.claude.com/en/docs/claude-code/plugins)

---

## What This Plugin Does

Provides two deployment commands for staging and production environments with built-in safety checks and automation.

---

## Installation

```bash
# Local installation for testing
cd /path/to/this/plugin
/plugin install .

# From marketplace
/plugin marketplace add jeremylongshore/ai-devops-intent-solutions
/plugin install deployment-tools
```

---

## Commands Provided

### `/deploy-staging`

Deploy to staging environment with automated testing and health checks.

**Features:**
- Pre-deployment validation
- Automated build and test
- Health check verification
- Slack notifications

**Usage:**
```bash
/deploy-staging
/deploy-staging --verbose
/deploy-staging --skip-tests  # Not recommended
```

### `/deploy-production`

Deploy to production with multiple safety gates and approval steps.

**Features:**
- Multi-step confirmation
- Branch restrictions (main only)
- Automatic rollback on failure
- Database backup before deployment
- Deployment window enforcement
- Comprehensive monitoring

**Usage:**
```bash
/deploy-production
/deploy-production --canary     # Gradual rollout
/deploy-production --dry-run    # Test without deploying
```

---

## Configuration

Set these environment variables:

```bash
# Staging
export STAGING_DEPLOY_URL="https://staging-api.example.com/deploy"
export STAGING_API_KEY="your-staging-key"

# Production
export PRODUCTION_DEPLOY_URL="https://api.example.com/deploy"
export PRODUCTION_API_KEY="your-production-key"

# Optional integrations
export SLACK_WEBHOOK_URL="https://hooks.slack.com/..."
export DATABASE_BACKUP_URL="https://backup.example.com"
```

---

## File Structure

```
deployment-tools/
├── .claude-plugin/
│   └── plugin.json          # Plugin metadata
├── commands/
│   ├── deploy-staging.md    # Staging deployment command
│   └── deploy-production.md # Production deployment command
├── README.md                # This file
└── LICENSE                  # MIT License
```

---

## Customization

### Modify Deployment Steps

Edit the command markdown files:
- `commands/deploy-staging.md`
- `commands/deploy-production.md`

### Add New Deployment Targets

Create new command files:
```bash
cd commands/
cp deploy-staging.md deploy-qa.md
# Edit deploy-qa.md for QA environment
```

Update `plugin.json`:
```json
{
  "name": "deployment-tools",
  "version": "1.1.0",
  "commands": ["./commands/"]
}
```

---

## Best Practices

### Deployment Safety

✅ **Always:**
- Test in staging first
- Verify health checks pass
- Deploy during low-traffic windows
- Have rollback plan ready
- Monitor for 5+ minutes post-deployment

❌ **Never:**
- Deploy on Friday afternoon
- Skip tests to save time
- Deploy without backup
- Ignore failed health checks

### Environment Variables

✅ **Use:**
- Environment-specific configs
- Secrets management tools (Vault, AWS Secrets Manager)
- Encrypted API keys

❌ **Avoid:**
- Hardcoding credentials
- Committing secrets to git
- Using same keys for staging/production

---

## Troubleshooting

### Command Not Found

```bash
# Verify plugin is installed
/plugin

# Reinstall if needed
cd /path/to/deployment-tools
/plugin install . --force
```

### Deployment Fails

```bash
# Check environment variables
echo $STAGING_DEPLOY_URL
echo $PRODUCTION_DEPLOY_URL

# Run in dry-run mode
/deploy-production --dry-run

# Check Claude Code debug output
claude --debug
```

### Permission Denied

```bash
# Verify API keys are set
# Check deployment endpoint is accessible
curl $STAGING_DEPLOY_URL
```

---

## Contributing

This is an example plugin for learning. To modify:

1. Fork this repository
2. Make changes to command files
3. Test locally: `/plugin install .`
4. Update version in `plugin.json`
5. Update CHANGELOG
6. Submit pull request

---

## License

MIT License - See LICENSE file

---

## Credits

**Based on official documentation:**
- [Claude Code Plugins](https://docs.claude.com/en/docs/claude-code/plugins)
- [Claude Code Plugins Reference](https://docs.claude.com/en/docs/claude-code/plugins-reference)

**Author:** Jeremy Longshore
**Repository:** https://github.com/jeremylongshore/ai-devops-intent-solutions
**Last Updated:** 2025-10-09
