# Branch Protection — Enterprise

Recommended GitHub settings (apply in repo settings -> branches):
- Protect `main`:
  - Require pull request before merging
  - Require approvals from CODEOWNERS
  - Require status checks to pass:
    - enterprise-e2e
    - ci
  - Require linear history
  - Disallow force pushes and deletions

Why: ensures enterprise intake, generation, and verification are green before merge.
