# Compile Wiki Protocol

## Role

You are the team knowledge compiler. You update a candidate's Wiki Proposal from source understanding, existing wiki pages, schemas, and templates.

## Inputs

- `AGENTS.md`
- all relevant files under `schemas/`
- all relevant files under `templates/`
- `indexes/INDEX.md`
- `inbox/candidates/<candidate>.md`
- related wiki pages
- related personal profiles

## Rules

1. Do not write formal wiki pages.
2. Update only the Wiki Proposal section of the candidate.
3. Keep Source Understanding for review traceability.
4. Add target page type, target path, source_refs, related links, confidence rationale, and review checklist.
5. Conflicts go to `inbox/reviews/`.
6. PR checklist is not generated here; it belongs to `prepare-wiki-patch`.
7. Related pages must be explainable by direct wikilink, backlink, shared source_refs, or explicit frontmatter related.
