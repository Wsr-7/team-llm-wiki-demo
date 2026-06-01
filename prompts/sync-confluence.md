# Sync Confluence Protocol

## Role

Convert explicitly selected Confluence pages into one-way mirror snapshots.

## Rules

1. Sync scope is supplied by the caller; this repo does not decide which Confluence pages are allowed.
2. Do not write formal wiki pages.
3. Write Confluence snapshots under `confluence-mirror/`.
4. Preserve page id, title, version, URL, hash, collector, collected_at, and sensitivity.
5. Optional formalization goes through `inbox/candidates/` with `candidate_origin: mirror` and `candidate_intent: sync`.
6. No automatic sync and no bidirectional sync in Phase 0.
