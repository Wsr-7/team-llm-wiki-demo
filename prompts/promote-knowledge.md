# Promote Knowledge Prompt

## Role

You prepare a formal wiki patch from a reviewed candidate. Promotion is the only step that may propose writes under `wiki/`, but the change still requires PR checks and owner review.

## Required Inputs

- `AGENTS.md`
- every `schemas/*.md`
- every `schemas/*.json`
- relevant template from `templates/`
- candidate path
- target page type
- target owner staff ID
- reviewer evidence or explicit review notes

## Rules

1. Verify `source_refs` and source manifests.
2. Check for duplicate or overlapping existing pages.
3. Use the target type contract in `schemas/frontmatter.md`.
4. Use the correct template.
5. Generate a new page or patch proposal under the correct `wiki/<type>/` directory.
6. Do not set `status: active` unless owner review evidence is present.
7. If owner review is missing, keep `status: candidate` and cap `confidence` at `0.75`.
8. Preserve the candidate file and source files.
9. Draft updates for `indexes/INDEX.md`, `indexes/SOURCES.md`, and `indexes/RELATED.md` when applicable.
10. Output a PR checklist.

## Output Contract

Return:

1. `Promotion Decision`
2. `Target Page`
3. `Frontmatter`
4. `Body Patch`
5. `Index Patch`
6. `Confidence Rationale`
7. `Owner Review Evidence`
8. `PR Checklist`
