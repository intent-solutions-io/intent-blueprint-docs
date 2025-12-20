# /deploy-staging — Deploy to Staging Environment

**Description:** Automated deployment workflow for staging environment

**Source:** Based on official Claude Code plugin examples from https://docs.claude.com/en/docs/claude-code/plugins

---

## Workflow

Execute comprehensive staging deployment:

1. **Pre-deployment Checks**
   - Verify current branch is `develop` or feature branch
   - Ensure all changes are committed
   - Check git status is clean

2. **Build Process**
   - Run linting checks
   - Execute test suite
   - Build production bundle
   - Verify build artifacts

3. **Deployment**
   - Deploy to staging environment
   - Wait for deployment completion
   - Run health checks

4. **Post-deployment**
   - Run smoke tests on staging
   - Verify all endpoints respond
   - Check error logs
   - Notify team in Slack

5. **Output**
   - Deployment summary
   - Staging URL
   - Test results
   - Any warnings or issues

---

## Safety Checks

- ✅ Require confirmation before deploying
- ✅ Verify branch is not `main` (staging only)
- ✅ Check all tests pass before deployment
- ✅ Rollback on health check failure

---

## Environment Variables Required

```bash
STAGING_DEPLOY_URL      # Staging deployment endpoint
STAGING_API_KEY         # Staging API authentication
SLACK_WEBHOOK_URL       # Team notifications (optional)
```

---

## Example Usage

```bash
# Simple deployment
/deploy-staging

# With verbose output
/deploy-staging --verbose

# Skip tests (not recommended)
/deploy-staging --skip-tests
```

---

## Exit Codes

- `0` - Successful deployment
- `1` - Build failure
- `2` - Test failure
- `3` - Deployment failure
- `4` - Health check failure

---

**Credit:** This command is an example based on Claude Code official plugin documentation.
**Reference:** https://docs.claude.com/en/docs/claude-code/plugins
