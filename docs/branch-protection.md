# Branch Protection Recommendation

Phase 0 cannot enforce GitHub branch protection from repository files alone, but the recommended rule for `main` is:

- Require a pull request before merging.
- Require at least one approval.
- Require CODEOWNERS review.
- Require status checks once Phase 2 CI exists.
- Block force pushes.
- Block direct pushes to `main`.
- Require conversation resolution before merge.

Until Phase 2 CI exists, reviewers should manually run:

```powershell
npm run kb:check
node scripts/kb-related.ts kb:runbook:payment-failover
```
