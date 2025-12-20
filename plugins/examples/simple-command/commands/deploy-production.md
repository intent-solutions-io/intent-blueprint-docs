# /deploy-production — Deploy to Production Environment

**Description:** High-security production deployment workflow with multiple approval gates

**Source:** Based on official Claude Code plugin examples from https://docs.claude.com/en/docs/claude-code/plugins

---

## Workflow

Execute production deployment with safety checks:

1. **Critical Pre-flight Checks**
   - ⚠️ **REQUIRE EXPLICIT CONFIRMATION** (multiple steps)
   - Verify current branch is `main` only
   - Ensure all changes are merged and committed
   - Check staging deployment is healthy
   - Verify no failed tests in CI/CD
   - Confirm production database migrations ready

2. **Approval Gates**
   - Ask: "Are you sure you want to deploy to PRODUCTION?"
   - Ask: "Have you verified staging deployment?"
   - Ask: "Are database migrations backwards compatible?"
   - Require typed confirmation: "DEPLOY PRODUCTION"

3. **Build Process**
   - Run full linting suite
   - Execute comprehensive test suite (unit + integration + e2e)
   - Build optimized production bundle
   - Verify bundle size within limits
   - Generate source maps

4. **Pre-deployment**
   - Create database backup
   - Tag current production release
   - Store rollback snapshot
   - Notify team: "Production deployment starting"

5. **Deployment**
   - Deploy to production environment
   - Monitor deployment progress
   - Run health checks every 30 seconds
   - Watch error rate metrics

6. **Post-deployment Validation**
   - Run production smoke tests
   - Verify all critical endpoints
   - Check database connections
   - Monitor error logs (5 minutes)
   - Verify no spike in error rates

7. **Completion**
   - Tag release in git
   - Update deployment log
   - Notify team: "Production deployment successful"
   - Send summary to stakeholders

---

## Safety Features

- 🔒 **Multi-step confirmation** required
- 🔒 **Branch restriction** (main only)
- 🔒 **Automatic rollback** on health check failure
- 🔒 **Deployment window** check (block during peak hours)
- 🔒 **Database backup** before deployment
- 🔒 **Canary deployment** option (gradual rollout)

---

## Rollback Procedure

If deployment fails:

1. Automatically trigger rollback
2. Restore previous version
3. Restore database from backup (if migrations ran)
4. Notify team: "Production deployment failed, rolled back"
5. Generate incident report
6. Create post-mortem task

---

## Environment Variables Required

```bash
PRODUCTION_DEPLOY_URL   # Production deployment endpoint
PRODUCTION_API_KEY      # Production API authentication (encrypted)
DATABASE_BACKUP_URL     # Database backup service
SLACK_WEBHOOK_URL       # Critical alerts channel
PAGERDUTY_KEY          # Incident management (optional)
DATADOG_API_KEY        # Monitoring integration (optional)
```

---

## Example Usage

```bash
# Standard production deployment
/deploy-production

# With canary deployment (10% traffic first)
/deploy-production --canary

# Emergency hotfix deployment
/deploy-production --hotfix

# Dry run (no actual deployment)
/deploy-production --dry-run
```

---

## Deployment Schedule

**Recommended deployment windows:**
- Monday-Thursday: 10 AM - 4 PM (local time)
- Friday: 10 AM - 2 PM only
- **Avoid:** Fridays after 2 PM, weekends, holidays

**Emergency deployments:**
- Require additional approval
- Incident commander must be identified
- Rollback plan documented

---

## Monitoring

Post-deployment monitoring (automatic):

- Error rate (target: < 0.1%)
- Response time (target: < 200ms p95)
- Availability (target: 99.9%)
- Database connections (target: healthy)
- Memory usage (target: < 80%)
- CPU usage (target: < 70%)

**Alert thresholds:**
- Error rate > 1% → Automatic rollback
- Response time > 1s → Alert team
- Availability < 99% → Page on-call

---

## Exit Codes

- `0` - Successful deployment
- `1` - Pre-flight check failure
- `2` - Build failure
- `3` - Test failure
- `4` - Deployment failure
- `5` - Health check failure (rolled back)
- `6` - User cancelled deployment
- `7` - Deployment window violation

---

## Audit Log

All production deployments are logged with:
- Timestamp
- Deployer name
- Git commit SHA
- Pre-deployment checks results
- Deployment duration
- Health check results
- Rollback status (if applicable)

---

**⚠️ WARNING:** This deploys to PRODUCTION. Always verify thoroughly before proceeding.

**Credit:** This command is an example based on Claude Code official plugin documentation.
**Reference:** https://docs.claude.com/en/docs/claude-code/plugins
