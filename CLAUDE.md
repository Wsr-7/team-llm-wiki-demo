# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

A demo implementation of a team LLM-powered Wiki. GitHub is the authority layer. Formal knowledge lives under `wiki/`; everything else is a staging area or reference. AI agents help ingest and propose knowledge, but formal knowledge must reach `wiki/` only via PR review.

## Local Checks

```bash
npm run check                  # run all checks
npm run check:staff-id         # staff-id format
npm run check:persons          # person profile files
npm run check:frontmatter      # required frontmatter fields
npm run check:source-refs      # source reference integrity
npm run check:candidates       # candidate file contract
npm run check:links            # internal link validity
```

Scripts are TypeScript run directly with `node` (ESM, no build step).

## Directory Contract

| Directory | Purpose |
|---|---|
| `raw/` | Immutable source evidence — never rewrite |
| `inbox/candidates/` | AI-generated or proposed candidates, not formal truth |
| `inbox/reviews/` | Review queues (conflicts, stale, low-confidence, broken links) |
| `wiki/` | Curated formal team knowledge — changes via PR only |
| `confluence-mirror/` | One-way Confluence snapshots, not formal knowledge |
| `personal/<staff-id>/` | Personal space, not team truth |
| `indexes/` | Human-readable navigation (`indexes/INDEX.md` is the main entry) |
| `schemas/` | Schema definitions — read before writing candidates or wiki patches |
| `prompts/` | Prompt registry for agent workflows |
| `templates/` | Document templates |
| `logs/` | Append-only operation logs |
| `graph/` | Rebuildable graph sidecars (future phases) |
| `docs/` | Architecture and design documents |

Do **not** create `site/` or `exports/` directories.

## Knowledge Contribution Flow

```
raw/<category>/<yyyy-mm-dd>-<slug>/
  → inbox/candidates/   (prompts/ingest-source.md → prompts/compile-wiki.md)
  → wiki/               (prompts/prepare-wiki-patch.md + PR review)
```

New raw source uses `raw/<category>/<yyyy-mm-dd>-<slug>/manifest.md` and `source.md`.

## Prompt Registry

| Prompt | Purpose |
|---|---|
| `prompts/ingest-source.md` | raw source → Source Understanding |
| `prompts/compile-wiki.md` | Source Understanding → Wiki Proposal |
| `prompts/prepare-wiki-patch.md` | Wiki Proposal → PR-ready patch |
| `prompts/query-wiki.md` | question → cited answer |
| `prompts/lint-wiki.md` | wiki health audit |
| `prompts/sync-confluence.md` | one-way Confluence mirror |

## Identity Rule

All employee references must use `staff:########` (8-digit staff-id). Never use names, emails, GitHub usernames, aliases, or pinyin. `staff:00000000` is a system placeholder only.

## Write Rules

1. Do not rewrite content under `raw/`.
2. AI-generated material starts in `inbox/candidates/`.
3. `personal/<staff-id>/raw/` and `personal/<staff-id>/wiki/` are not formal team knowledge; personal knowledge must move through `inbox/candidates/` before becoming formal wiki knowledge.
4. Formal `wiki/` changes must go through `prompts/prepare-wiki-patch.md` then PR review.
5. Every formal wiki page requires `source_refs`.
6. Confluence mirror snapshots go to `confluence-mirror/`.
7. Mirror, raw, personal, and inbox content must not be treated as formal wiki knowledge.

## Formal Wiki Page Frontmatter

Required fields for all `wiki/` pages:

```yaml
id: kb:<type>:<slug>
title: ...
type: <see table below>
status: active | draft | superseded | archived
review_state: current | needs_review | disputed | stale
confidence: 0.00–1.00
visibility: team | restricted | public
owners:
  - staff:########
source_refs:
  - <raw path or external url>
related: []
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
```

Page type → directory mapping:

| Type | Directory |
|---|---|
| `overview` | `wiki/overview/` |
| `glossary` | `wiki/glossary/` |
| `concept` | `wiki/concepts/` |
| `team` | `wiki/teams/` |
| `project` | `wiki/projects/` |
| `system` | `wiki/systems/` |
| `practice` | `wiki/practices/` |
| `runbook` | `wiki/runbooks/` |
| `decision` | `wiki/decisions/` |
| `learning` | `wiki/learning/` |
| `mirrored` | `wiki/mirrored/` |

## Confidence Rules

- `0.30–0.50`: weak source or unreviewed candidate
- `0.50–0.75`: source-backed and admin-triaged
- `0.75–0.90`: owner-reviewed active page
- `0.90–1.00`: ADR, production validation, audit, or multi-source support

Hard gates: `status: active` requires source-backed evidence; `review_state: disputed` must not exceed `0.60`; `status: superseded` must not be used as current guidance.

## Candidate Contract

Candidates in `inbox/candidates/` must include:

```yaml
candidate_origin: raw | personal | mirror | query | manual
candidate_intent: ingest | compile | promotion | sync
candidate_status: proposed | in_review | promoted | rejected | superseded
```

Recommended sections: `## Source Understanding`, `## Wiki Proposal`, `## Review Notes`, `## Decision Log`.

## Query Rules

1. Read `indexes/INDEX.md` first.
2. Search `wiki/`, `personal/*/profile.md`, and `indexes/`.
3. Do not answer from snippets alone — read full pages.
4. Cite page paths or knowledge IDs (`kb:<type>:<slug>`).
5. Explicitly flag stale, superseded, disputed, or low-confidence pages.
6. If no answer exists, return `unknown` and suggest a source or candidate to add.

## Related-Page Discovery (Phase 0/1)

Only these signals are valid for linking related pages:
- Direct wiki links written as double-bracket page paths
- Backlinks
- Shared `source_refs`
- Explicit frontmatter `related`

Each related result must include its reason.
