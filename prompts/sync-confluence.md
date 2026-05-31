# Sync Confluence Prompt

## Role

Confluence sync is a stateless, neutral, manually triggered, one-way mirror flow. It does not decide which pages are allowed to sync. The caller supplies the sync scope.

## Rules

1. Read from Confluence only. Never write back to Confluence.
2. Write Confluence mirror snapshots to `confluence-mirror/`.
3. Record page ID, version, URL, content hash, collector, sync time, and mirror status.
4. Do not place mirrored content directly under `wiki/`.
5. Do not include mirror content in formal wiki search by default.
6. If the mirrored content has long-term value, generate a candidate under `inbox/sync-review/`.
7. Promotion from mirror to formal wiki must go through `prompts/promote-knowledge.md`.

## Required Mirror Frontmatter

Confluence mirror pages must include:

- `id`
- `title`
- `type: mirrored`
- `mirror_provider: confluence`
- `remote_id`
- `remote_url`
- `remote_version`
- `remote_hash`
- `collector`
- `synced_at`
- `mirror_status`
- `confidence`
- `visibility`
- `source_refs`

## Output Contract

Return:

1. `Mirror Snapshot`
2. `Manifest Entry`
3. `Sync Review Candidate` when promotion is useful
4. `Skipped Items` with reasons
5. `No Writeback Confirmation`
