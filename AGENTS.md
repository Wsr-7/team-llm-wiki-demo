# Team KB Agent Protocol

## Authority Layer

The GitHub repository is the authority layer for the knowledge base. Formal knowledge lives under `wiki/` and `persons/`. The `indexes/`, `graph/`, `exports/`, and `site/` directories are derived or auxiliary layers.

## Identity Rules

All employee references must use `staff:########`. Names, email addresses, GitHub usernames, aliases, and pinyin are not valid person identifiers.

## Write Rules

1. `raw/` stores source material. Do not rewrite the original source.
2. AI-generated material must start in `inbox/`.
3. Formal changes under `wiki/` and `persons/` must go through PR review.
4. Every generated or promoted knowledge item must include `source_refs`.
5. Candidate pages must include `status`, `review_state`, `confidence`, and either `owners` or `owner_candidates`.
6. Confluence mirror snapshots must be written to `confluence-mirror/`.
7. Mirror snapshots from other external systems must use a source-specific `*-mirror/` directory when such a mirror root exists. If no mirror root exists yet, store the material as a normal captured source under `raw/sources/` until the mirror contract is added.
8. Mirror, raw, and inbox content must not be treated as formal wiki knowledge.

## Query Rules

1. Read `indexes/INDEX.md` first.
2. Search `wiki/`, `persons/`, and `indexes/`.
3. Read the most relevant pages before answering. Do not answer from snippets alone.
4. Cite page paths or knowledge IDs in the answer.
5. Explicitly call out `stale`, `superseded`, `disputed`, or low-confidence pages.
6. If the knowledge base has no answer, return `unknown` and suggest a candidate page or source to add.

## Ingest, Compile, And Promote

`ingest-source` standardizes one source into source-level candidate material. It writes to `inbox/ingest-candidates/` and never writes to `wiki/`.

`compile-wiki` reads raw sources, mirror snapshots, ingest candidates, existing wiki pages, all schema documents, templates, and indexes. It creates reviewable wiki candidates or patch proposals under `inbox/compile-candidates/`, plus conflict or sync review items when needed.

`promote-knowledge` is the only prompt allowed to prepare a formal `wiki/` patch. The patch still requires PR checks and owner review before it becomes accepted knowledge.

## Related Rules

Phase 1 related-page discovery is limited to three explainable signals:

- direct wikilink
- backlink
- shared source_refs

Each related result must include its reason.
