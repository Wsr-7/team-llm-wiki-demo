# Schemas

This directory contains the repository contracts that agents and scripts must read before changing knowledge content.

- `frontmatter.md`: human-readable frontmatter contract and page-type rules.
- `confidence-rules.md`: confidence score, decay, and caps.
- `page.schema.json`: machine-readable wiki page schema.
- `source-manifest.schema.json`: machine-readable source manifest schema.

Prompts must read all `schemas/*.md` and all `schemas/*.json`, not just one schema file.
