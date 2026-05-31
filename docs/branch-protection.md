# Branch Protection Recommendation

Phase 0 cannot enforce GitHub branch protection from the repo files alone, but the recommended rule for `main` is:

- Require pull request before merging.
- Require at least one approval.
- Require CODEOWNERS review.
- Require status checks once Phase 2 CI exists.
- Block force pushes.
- Block direct pushes to `main`.
- Require conversation resolution before merge.

Until Phase 2 CI exists, reviewers should manually run:

```powershell
./scripts/kb-check-staff-id.ps1
./scripts/kb-check-person-files.ps1
./scripts/kb-check-frontmatter.ps1
./scripts/kb-check-source-refs.ps1
./scripts/kb-related.ps1 kb:runbook:payment-failover
```
