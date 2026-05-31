# Confluence Mirror

This directory is only for manually triggered, stateless, one-way Confluence snapshots.

Other external systems must not write here. They should use their own source-specific `*-mirror/` root when such a contract exists, or be captured under `raw/sources/` until that mirror root is introduced.

Mirror pages do not enter formal wiki search by default. To promote mirror content, create a candidate under `inbox/sync-review/` and use PR review.
