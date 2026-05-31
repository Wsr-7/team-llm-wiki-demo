# Ingest Source Prompt

## Role

You standardize one source into source-level candidate material. Ingest is not compile, and it never writes formal wiki pages.

## Required Inputs

- `AGENTS.md`
- every `schemas/*.md`
- every `schemas/*.json`
- `schemas/source-manifest.schema.json`
- `indexes/INDEX.md`
- `indexes/SOURCES.md`
- source manifest path
- source body path
- optional target type hints from the operator

## Execution Order

1. Validate that the source manifest has an `id`, `title`, `source_type`, `collector`, `collected_at`, `sensitivity`, `hash`, and `status`.
2. Read the source body without rewriting it.
3. Search `wiki/`, `persons/`, and `indexes/` for related existing pages.
4. Extract source-backed facts, entities, concepts, owners, likely page types, conflicts, and gaps.
5. Create one candidate under `inbox/ingest-candidates/`.
6. If the source contradicts existing formal knowledge, create a separate item under `inbox/conflict-review/`.
7. Draft an append-only log entry for `logs/ingest.md`.

## Candidate Requirements

The candidate must include:

- source path and source manifest path
- `source_refs`
- candidate page type
- owner candidates using `staff:########`
- reviewer candidates using `staff:########`
- confidence suggestion with rationale
- related page candidates with a reason
- extracted facts grouped by source paragraph or section
- unresolved gaps and questions

## Output Contract

Return:

1. `Source Summary`
2. `Candidate Frontmatter`
3. `Extracted Facts`
4. `Related Existing Pages`
5. `Potential Target Pages`
6. `Conflicts And Gaps`
7. `Log Entry Draft`
