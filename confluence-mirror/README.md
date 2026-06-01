# Confluence Mirror

This directory is only for manually triggered, stateless, one-way Confluence snapshots.

Confluence snapshots enter `confluence-mirror/`. Other external mirrors should use their own source-specific `*-mirror/` root only after that contract is explicitly introduced.

Mirror pages do not enter formal wiki knowledge by default. To formalize mirror content, create or update a candidate under `inbox/candidates/` with:

- `candidate_origin: mirror`
- `candidate_intent: sync`
- `candidate_status: proposed`

The knowledge base does not decide which Confluence pages may be mirrored. Page selection, permissions, and export policy belong to the upstream Confluence export process.
