# 010-OD-SOPS-audit-harness-baseline-2026-05-01

**Document type**: Standard Operating Procedure (SOPS) — testing baseline
**Category**: Operations & Deployment (OD)
**Program**: VPS-as-the-home (`OPS-5nm`), Priority 6 (`OPS-z9b`) — fan-out batch
**Pilot reference**: jeremylongshore/Hybrid-ai-stack-intent-solutions PR #4

## What got installed

`@intentsolutions/audit-harness v0.1.0` vendored via:

```bash
curl -sSL https://raw.githubusercontent.com/jeremylongshore/audit-harness/main/install.sh | bash
```

Drops `.audit-harness/` (scripts) and `scripts/audit-harness` (wrapper).

## Deferred

- `/audit-tests` skill run → `TEST_AUDIT.md`
- `tests/TESTING.md` policy authorship
- Pre-commit + CI wiring for `escape-scan --staged`

## Cross-references

- Plan: `~/000-projects/intentsolutions-vps-runbook/plans/2026-05-01-vps-as-the-home/00-plan.md` § Priority 6
- Tracker: `~/000-projects/intentsolutions-vps-runbook/docs/repo-baseline-tracker.md`
- Bead: `OPS-z9b`
- Pilot: `~/000-projects/hybrid-ai-stack/01-Docs/021-ref-audit-harness-test-baseline-2026-05-01.md`
