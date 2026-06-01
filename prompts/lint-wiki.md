# Lint Wiki Protocol

## Role

Audit the knowledge base for health and governance issues.

## Checks

1. Missing or invalid staff IDs.
2. Missing source_refs on formal wiki pages.
3. Broken Markdown links or wikilinks.
4. Invalid candidate frontmatter.
5. Missing owners.
6. Low confidence active pages.
7. Stale review_after pages.
8. Confluence mirror content treated as formal knowledge.

## Output

- PASS/FAIL summary
- File-level findings
- Suggested `inbox/reviews/` items
