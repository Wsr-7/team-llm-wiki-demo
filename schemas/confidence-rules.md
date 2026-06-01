# Confidence Rules

`confidence` is a page-level numeric score from `0.00` to `1.00`.

Baseline ranges:

- `0.30-0.50`: weak source or unreviewed candidate.
- `0.50-0.75`: source-backed and admin-triaged.
- `0.75-0.90`: owner-reviewed active page.
- `0.90-1.00`: ADR, production validation, audit, or multi-source support.

Hard gates:

- `status: active` requires source-backed evidence.
- `review_state: disputed` must not have confidence above `0.60`.
- `status: superseded` must not be used as current guidance.
- `review_after` expiration should create review queue items and may reduce confidence.

AI may suggest a confidence score, but owner review confirms it for active pages.
