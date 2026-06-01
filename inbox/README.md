# Inbox

AI-generated or manually drafted candidates live here before they become formal wiki pages.

## Directories

- `candidates/`: working candidate documents. `ingest-source`, `compile-wiki`, personal promotion, and mirror formalization all update candidate files here.
- `reviews/`: reviewer notes, rejection rationale, conflict notes, and freshness review notes that should not yet change formal wiki pages.

## Candidate Lifecycle

Candidate files must use `schemas/candidate.schema.json` and include:

- `candidate_origin`: `raw`, `personal`, `mirror`, `query`, or `manual`.
- `candidate_intent`: `ingest`, `compile`, `promotion`, or `sync`.
- `candidate_status`: `proposed`, `in_review`, `promoted`, `rejected`, or `superseded`.

`ingest-source` records source understanding in the same candidate. `compile-wiki` replaces or updates the candidate's wiki proposal section. `prepare-wiki-patch` is the only prompt that prepares formal `wiki/` changes for PR review.

