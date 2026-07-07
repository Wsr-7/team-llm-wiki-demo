# Wiki Page Frontmatter Rules

Scope: `wiki/**/*.md` (including `wiki/glossary.md`). `inbox/` entries have **no** frontmatter requirements.

## All fields

```yaml
---
owner: staff:12345678                  # required
updated: 2026-07-07                    # required
sources:                               # conditionally required (see below)
  - https://jira.company.com/browse/PAY-1234
  - https://confluence.company.com/pages/123456 (moved to .../789, 2026-07)
status: needs-review                   # optional, enum: needs-review | superseded
superseded_by: wiki/runbooks/payment-failover-v2.md   # required when status: superseded
tags: [payment, oncall]                # optional
---
```

These six fields are the **only** allowed fields. Adding a field requires changing this document first (see `schemas/README.md`); `check.ts` rejects unknown fields.

## Field semantics

| Field | Required | Rule |
| --- | --- | --- |
| `owner` | yes | `staff:########` (8-digit staff-id), must exist in `team/people.md`. `staff:00000000` is the system placeholder; on a formal page it triggers a warning and should be replaced with a real owner |
| `updated` | yes | `YYYY-MM-DD`, date of the last **substantive confirmation or change**. Typo fixes don't bump it; confirming "still accurate" should |
| `sources` | conditional | Non-empty required under `wiki/troubleshooting|runbooks|decisions/`; strongly recommended elsewhere. Entries are URLs or ticket ids. For pure experience with no external source, state "experience summary, no external source" in the body and reference the related ticket/PR here |
| `status` | no | Absent = current (the normal case). `needs-review` = doubtful / pending confirmation / unresolved conflict; `superseded` = replaced, agents must not cite it as current guidance |
| `superseded_by` | conditional | Required with `status: superseded`; repo-relative path; target file must exist |
| `tags` | no | Short lowercase words to improve grep hit rate. No controlled vocabulary — synonymous tags get merged at gardening |

Fields that intentionally do not exist, and why: `confidence` (uncalibratable false precision — use the three status states), `type` (the directory is the type), `id` (the path is the id), `created_at` (git log), `review_state` (folded into status), `visibility` (repo permissions are the boundary).

## Status and the trust model

```text
Trust levels (how agents must treat content):
  wiki/ without status   → current, cite freely
  wiki/ needs-review     → usable, must attach a "pending review" warning
  wiki/ superseded       → never cite as current guidance; follow superseded_by
  inbox/                 → unverified, must be labeled as such when cited
```

Resolution order when several pages could answer a question: `AGENTS.md` → "Answering questions", step 4.

## Sources conventions (including link rot)

1. **Links first, excerpts as insurance**: `sources` gives a clickable verification path; the page body's "Source excerpts" section preserves the load-bearing evidence verbatim (error messages, step justifications, decision statements). The more critical the claim, the more you excerpt.
2. **Rot annotations**: when an external link moves or dies, don't delete the entry — annotate it:
   `(moved to <new-url>, YYYY-MM)` or `(dead link as of YYYY-MM, excerpt preserved in page)`.
3. **Ephemeral sources** (chat threads, verbal accounts, meetings): paste the original text into the inbox entry; after compiling into a formal page the essentials go into "Source excerpts", and git history keeps the full original forever. A source entry may read `git-history: inbox/YYYY-MM-DD-<slug>.md`.
4. **Never**: bulk-copy external documents, or paste credentials / customer data.

## Page taxonomy (directory = type)

| Directory | Type | Question it answers | Template |
| --- | --- | --- | --- |
| `wiki/troubleshooting/` | troubleshooting | How do I diagnose and fix problem X? | `templates/troubleshooting.md` |
| `wiki/runbooks/` | runbook | How do I safely perform operation X? | `templates/runbook.md` |
| `wiki/systems/` | system | What is system X — boundaries, dependencies, who to ask? | `templates/system.md` |
| `wiki/decisions/` | decision | Why did we choose X back then? | `templates/decision.md` |
| `wiki/concepts/` | concept | What is (domain concept) X and why does it matter? | `templates/concept.md` |
| `wiki/guides/` | guide | How do we do X (process / practice / how-to)? | `templates/guide.md` |
| `wiki/glossary.md` | glossary | What does the term X mean on this team? | entry format inside the file |

Pages must live in these directories (`check.ts` enforces it). Subdirectories for domain grouping are free-form (e.g. `wiki/runbooks/payment/`).

Where the v2 legacy types went: `overview` → README/INDEX; `team` → `team/people.md`; `project` → systems or decisions; `practice`, `learning` → guides; `mirrored` → dropped (Confluence strategy: docs/llm-wiki-architecture-v3/02 §9).

## Body discipline

- Scannable in 30 seconds; one page answers one question; split pages over 200 lines.
- First line is `# Title` (INDEX generation depends on it); the first paragraph under the title is a one-line summary (it goes into INDEX).
- **All content is English** (see `AGENTS.md`, "Language"); verbatim evidence quotes may stay in their original language with an English gloss.
- Cross-links use relative markdown links (`check.ts` validates them).
