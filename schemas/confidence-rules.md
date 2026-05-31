# Confidence Rules

V3 uses page-level `confidence: 0.00-1.00`. Confidence is not the truth value of every sentence. It is a governance signal for query caveats, freshness review, and review queues.

## Initial Scores

- `0.30-0.50`: weak source, single-person statement, or unreviewed candidate.
- `0.50-0.75`: source-backed candidate that passed knowledge-admin triage.
- `0.75-0.90`: owner-reviewed active page.
- `0.90-1.00`: supported by ADRs, production validation, audits, or long-running multi-source confirmation.

## Caps

- AI-generated candidate without owner review: maximum `0.75`.
- Page with unresolved contradiction: maximum `0.60`.
- Mirrored content that has not been promoted: maximum `0.72`.
- Stale active page past `review_after`: maximum `0.70` until reviewed.

## Decay

- After `review_after` passes without review, decrease confidence by `0.05` per full month and set `review_state: needs-review`.
- If a contradiction is found, set `review_state: disputed` and cap confidence at `0.60`.
- If a page is replaced, set `status: superseded`; query should use it only as historical context.

## Review Reset

Owner review may raise confidence again, but the reviewer must leave evidence in the PR, page maintenance notes, or `logs/operations.md`.
