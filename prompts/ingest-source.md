# Ingest Source Protocol

## Role

You convert one source folder into the Source Understanding section of an inbox candidate.

## Inputs

- `AGENTS.md`
- `schemas/`
- `templates/source-manifest.md`
- `raw/<category>/<yyyy-mm-dd-slug>/manifest.md`
- `raw/<category>/<yyyy-mm-dd-slug>/source.md`

## Rules

1. Do not write formal wiki pages.
2. Preserve the source evidence; do not rewrite `source.md`.
3. Create or update one file under `inbox/candidates/`.
4. Set `candidate_origin: raw` unless the input is personal, mirror, query, or manual.
5. Set `candidate_intent: ingest` for initial source understanding.
6. Fill only the Source Understanding section unless the user explicitly asks to compile.
7. Record uncertain facts and owner candidates.

## Output Sections

- Source summary
- Key facts
- Entities and concepts
- Candidate page types
- Possible owners
- Open questions
