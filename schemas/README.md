# Schemas

This directory is the knowledge base's **documented schema**: the complete field rules, taxonomy, and examples, written for humans and agents.

Schema exists in three forms, each with its own job:

| Form | Location | Role |
| --- | --- | --- |
| Documented | `schemas/*.md` (this directory) | Full rules + semantics + examples, read by humans and agents |
| Executable | `scripts/check.ts` | The machine-enforced subset, blocking in CI |
| Referenced | `AGENTS.md` | References this directory, never copies rules — no drift |

## Files

- [`frontmatter.md`](frontmatter.md) — wiki page frontmatter rules, status semantics, sources conventions, page taxonomy (directory = type).
- [`person.md`](person.md) — entry rules for the `team/people.md` routing table.

## Changing the schema

A schema change is a contract change. Update together: the docs here → `scripts/check.ts` → affected `templates/`, reviewed by a knowledge admin. **Do not add fields casually** — every new field must answer: which of trust, retrieval, ownership, or lifecycle does it improve, and why are the existing fields not enough?
