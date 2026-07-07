# Prompt: Gardening

Biweekly maintenance run. Driven by the rotating human gardener; the
agent does the bookkeeping and proposes everything as ONE pull request.
Read `AGENTS.md` first.

## Preconditions

- Work from up-to-date `main`, on a new branch `gardening/YYYY-MM-DD`.
- `npm run check` passes before you start (if not, fixing that is the
  first item of the PR).

## Step 1 — Inbox triage

For every file in `inbox/`, classify:

| Verdict | Action |
| --- | --- |
| promote | Draft a formal page from the matching template (extract, keep key excerpts, fill frontmatter with a proposed owner from `team/people.md`); delete the inbox file in the same PR (git history preserves it) |
| merge | Fold the content into an existing wiki page; update that page's `updated`; delete the inbox file |
| keep | Not mature yet — leave it, note why |
| drop | No lasting value — propose deletion, note why |

Rules: entries older than 2 gardening cycles must not stay `keep`
without a reason; when unsure between promote/keep, ask the gardener in
the PR description rather than deciding silently.

## Step 2 — Health report

Scan `wiki/` and report:

- Stale: `updated` older than 180 days (90 for `wiki/runbooks/`).
- `needs-review` pages and unresolved conflicts.
- Orphans: pages no other page or INDEX section links to contextually.
- Oversize: pages over 200 lines (propose a split).
- Broken external links in `sources:` — verify only if you have tools;
  otherwise list unverified externals older than 12 months for humans
  to spot-check. Apply the annotation convention from
  `schemas/frontmatter.md` (moved/dead + date).
- Tag drift: synonymous tags to merge.

Propose fixes you can do mechanically (annotations, link updates,
`needs-review` flags) in the PR. Anything needing an owner's judgment
goes into the report, assigned to the owner via `team/people.md`.

## Step 3 — Regenerate

Run `npm run build-index`, then `npm run check`. Both must pass.

## Step 4 — One PR

Open a single PR titled `gardening: YYYY-MM-DD` whose description
contains:

```markdown
## Inbox triage
<table of file → verdict → action>

## Health report
<findings, each with a proposed owner or action>

## Metrics
- Answer rate: <answered>/<asked> this cycle (gardener fills from notes)
- Freshness: <pages updated within 180d> / <total pages>
- Contributors: <distinct authors in last month> (git shortlog -sn --since="1 month ago" -- wiki/ inbox/)

## Needs human decision
<the shortlist>
```

## Hard limits

- Everything in ONE PR; humans review and merge.
- Never delete or rewrite a `wiki/` page without listing it under
  "Needs human decision" — except pure mechanical fixes (links, typos,
  annotations).
- Keep the diff reviewable in 10 minutes; if it is bigger, split by
  deferring low-priority items to the next cycle.
