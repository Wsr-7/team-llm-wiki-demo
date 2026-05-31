# Frontmatter Contract

All formal wiki pages under `wiki/` must use YAML frontmatter. The compiler must read this file, `page.schema.json`, and `confidence-rules.md` before creating or patching a page.

## Common Required Fields

Every wiki page must include:

- `id`: stable knowledge ID, for example `kb:runbook:payment-failover`
- `title`: human-readable title
- `type`: one of the supported page types
- `status`: `draft`, `candidate`, `active`, `stale`, `superseded`, or `archived`
- `review_state`: `unreviewed`, `reviewed`, `needs-review`, or `disputed`
- `confidence`: number from `0.00` to `1.00`
- `visibility`: `internal`, `restricted`, or `confidential`
- `owners`: one or more `staff:########` IDs
- `source_refs`: one or more source IDs
- `related`: related knowledge IDs
- `tags`: search and browsing tags
- `created_at`: `YYYY-MM-DD`
- `updated_at`: `YYYY-MM-DD`

## Common Optional Fields

Use these fields when applicable:

- `maintainers`: staff IDs that can update the page
- `reviewers`: staff IDs requested for review
- `knowledge_sources`: staff IDs that contributed durable knowledge
- `verified_at`: last operational verification date
- `review_after`: next review date
- `supersedes`: replaced knowledge IDs
- `superseded_by`: replacing knowledge IDs

## Type Directories

- `overview` -> `wiki/overview/`
- `glossary` -> `wiki/glossary/`
- `concept` -> `wiki/concepts/`
- `team` -> `wiki/teams/`
- `project` -> `wiki/projects/`
- `system` -> `wiki/systems/`
- `practice` -> `wiki/practices/`
- `runbook` -> `wiki/runbooks/`
- `decision` -> `wiki/decisions/`
- `learning` -> `wiki/learning/`
- `mirrored` -> `wiki/mirrored/`

## Type Notes

`system` pages should describe boundaries, owners, dependencies, related runbooks, and source evidence.

`runbook` pages should describe scope, prerequisites, steps, verification, rollback, related pages, source evidence, and maintenance notes.

`decision` pages should describe the decision, context, alternatives, impact, source evidence, and supersession links when applicable.

`learning` pages should describe context, what happened, lessons learned, follow-up actions, and source evidence.

`mirrored` pages must include mirror metadata: `mirror_provider`, `remote_id`, `remote_url`, `remote_version`, `remote_hash`, `synced_at`, `collector`, and `mirror_status`.

## Compile Enforcement

`prompts/compile-wiki.md` must generate candidates that satisfy this contract. If required evidence is missing, the compiler must write the gap into the candidate instead of inventing values.
