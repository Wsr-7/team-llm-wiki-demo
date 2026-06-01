# Frontmatter Rules

Formal wiki pages under `wiki/` must use YAML frontmatter.

Required fields:

- `id`
- `title`
- `type`
- `status`
- `review_state`
- `confidence`
- `visibility`
- `owners`
- `source_refs`
- `related`
- `created_at`
- `updated_at`

Allowed page types:

| Type | Directory |
| --- | --- |
| overview | `wiki/overview/` |
| glossary | `wiki/glossary/` |
| concept | `wiki/concepts/` |
| team | `wiki/teams/` |
| project | `wiki/projects/` |
| system | `wiki/systems/` |
| practice | `wiki/practices/` |
| runbook | `wiki/runbooks/` |
| decision | `wiki/decisions/` |
| learning | `wiki/learning/` |
| mirrored | `wiki/mirrored/` |

Owner fields must use `staff:########`.
