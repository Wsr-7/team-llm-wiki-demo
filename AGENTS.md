# Team LLM Wiki Agent Protocol

## Schema Pack

This repo uses `AGENTS.md` + `schemas/` + `templates/` + `prompts/` as its Schema Pack.

Read these files before creating or changing knowledge:

1. `AGENTS.md`
2. `schemas/README.md`
3. `schemas/frontmatter.md`
4. `schemas/confidence-rules.md`
5. Relevant files under `templates/`
6. Relevant files under `prompts/`
7. `indexes/INDEX.md`

## Authority Layer

The GitHub repository is the authority layer. Formal team knowledge lives under `wiki/`.

Layer boundaries:

- `raw/`: immutable source evidence written by humans or import tools.
- `personal/<staff-id>/`: personal profile and personal knowledge space, not team truth.
- `inbox/candidates/`: AI-generated or human-proposed candidate knowledge.
- `inbox/reviews/`: review queues for conflicts, stale pages, missing owner, low confidence, and broken links.
- `wiki/`: curated formal team knowledge.
- `confluence-mirror/`: one-way Confluence mirror snapshots, not formal knowledge.
- `indexes/`: human-readable navigation and review queue summaries.
- `graph/`: rebuildable graph sidecars in later phases.
- `logs/`: append-only operation logs.

Do not create `site/` or `exports/` in Phase 0.

## Identity Rules

All employee references must use `staff:########`.

Do not use names, email addresses, GitHub usernames, aliases, or pinyin as canonical employee identifiers.

## Write Rules

1. Do not rewrite original source content under `raw/`.
2. New source material uses `raw/<category>/<yyyy-mm-dd>-<slug>/manifest.md` and `source.md`.
3. AI-generated material starts in `inbox/candidates/`.
4. `personal/<staff-id>/raw/` and `personal/<staff-id>/wiki/` are not formal team knowledge.
5. Personal knowledge must move through `inbox/candidates/` before it can become formal wiki knowledge.
6. Formal `wiki/` changes must be prepared by `prompts/prepare-wiki-patch.md`, then reviewed in a PR.
7. Every formal wiki page requires `source_refs`.
8. Confluence mirror snapshots must be written to `confluence-mirror/`.
9. Mirror, raw, personal, and inbox content must not be treated as formal wiki knowledge.

## Prompt Registry

- `prompts/ingest-source.md`: source -> Source Understanding.
- `prompts/compile-wiki.md`: Source Understanding -> Wiki Proposal.
- `prompts/prepare-wiki-patch.md`: Wiki Proposal -> PR-ready patch.
- `prompts/query-wiki.md`: question -> cited answer.
- `prompts/lint-wiki.md`: wiki health audit.
- `prompts/sync-confluence.md`: one-way Confluence mirror.

## Candidate Contract

Candidates live in `inbox/candidates/` and must include:

```yaml
candidate_origin: raw | personal | mirror | query | manual
candidate_intent: ingest | compile | promotion | sync
candidate_status: proposed | in_review | promoted | rejected | superseded
```

Recommended candidate sections:

```md
## Source Understanding
## Wiki Proposal
## Review Notes
## Decision Log
```

## Query Rules

1. Read `indexes/INDEX.md` first.
2. Search `wiki/`, `personal/*/profile.md`, and `indexes/`.
3. Do not answer from snippets alone.
4. Cite page paths or knowledge IDs.
5. Explicitly call out stale, superseded, disputed, or low-confidence pages.
6. If there is no answer, return `unknown` and suggest a source or candidate to add.

## Related Rules

Phase 0/1 related-page discovery is limited to explainable signals:

- direct wiki links written as double-bracket page paths
- backlink
- shared `source_refs`
- explicit frontmatter `related`

Each related result must include its reason.

