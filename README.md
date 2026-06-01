# Team LLM Wiki Demo

This repository is a demo implementation of the team LLM Wiki design.

The GitHub repository is the authority layer. Formal knowledge lives under `wiki/`. Staff ownership and responsibility mapping lives under `personal/<staff-id>/profile.md`. AI agents may help ingest, compile, check, and propose changes, but formal knowledge must go through PR review before it is accepted.

## Quick Links

- Knowledge index: [indexes/INDEX.md](indexes/INDEX.md)
- Agent protocol: [AGENTS.md](AGENTS.md)
- Schema Pack: [schemas/README.md](schemas/README.md)
- Templates: [templates/](templates/)
- Prompts: [prompts/](prompts/)
- Staff profiles: [personal/](personal/)
- Demo raw source: [raw/runbooks/2026-06-01-demo-payment-runbook/](raw/runbooks/2026-06-01-demo-payment-runbook/)
- Demo candidate: [inbox/candidates/demo-payment-runbook.md](inbox/candidates/demo-payment-runbook.md)
- Demo formal wiki page: [wiki/runbooks/payment/demo-payment-runbook.md](wiki/runbooks/payment/demo-payment-runbook.md)

## Phase 0 Contribution Flow

1. Put source material under `raw/<category>/<date>-<slug>/`.
2. Use `prompts/ingest-source.md` to create or update a candidate under `inbox/candidates/`.
3. Use `prompts/compile-wiki.md` to update the candidate's `Wiki Proposal`.
4. Use `prompts/prepare-wiki-patch.md` to prepare a PR-ready patch.
5. Formal knowledge enters `wiki/` only after PR review.

## Phase 0 Scope

Implemented:

- Repository skeleton
- Staff-id identity rules
- Schema Pack baseline
- Source manifest template
- Core prompt protocols
- Minimal demo raw source, candidate, and formal wiki page
- Index, operation log, and TypeScript check scripts

Not in Phase 0:

- Embedding or vector search
- QMD integration
- Remote Confluence sync
- Automatic ingest daemon
- Graph database or automatic graph extraction
- `site/`
- `exports/`

## Identity

All employee references must use an 8-digit staff-id:

```yaml
owners:
  - staff:12345678
```

`staff:00000000` is a system placeholder only. Real knowledge should use real staff IDs.

## Local Checks

```text
npm run check
npm run check:staff-id
npm run check:frontmatter
npm run check:source-refs
npm run check:candidates
npm run check:links
```
