# Team LLM Wiki

> 中文版: [README.zh-CN.md](README.zh-CN.md)

The team knowledge base: a git-managed wiki that **both humans and AI agents read and write**. Production issue solutions, troubleshooting guides, runbooks, system knowledge, decision records, distilled experience — it all lives here, reviewed via pull requests and consumable by any agent.

## Table of contents

- [How it works in one minute](#how-it-works-in-one-minute)
- [How to query](#how-to-query)
- [How to contribute](#how-to-contribute)
- [Getting external content in (Confluence / Jira / chats)](#getting-external-content-in-confluence--jira--chats)
- [Repository layout](#repository-layout)
- [Trust and evidence model](#trust-and-evidence-model)
- [Local commands](#local-commands)
- [CI](#ci)
- [Governance](#governance)
- [Language policy](#language-policy)
- [Design docs](#design-docs)

## How it works in one minute

```text
capture (anyone, ≤5 min)          review (GitHub native)         consume (any entry)
─────────────────────────         ──────────────────────         ───────────────────
raw material ──► inbox/  ──────►  Pull Request ──► wiki/  ──────► humans: INDEX/GitHub
(any language,   self-merge PR    (domain owner    (reviewed,     agents: cited answers,
 no format)      no review)        review + CI)     English)      unknown → page suggestion
```

- `inbox/` is a zero-friction dump: no frontmatter, no review, any language.
- The **PR is the candidate layer**: review notes, revisions, and the decision all live in the PR.
- `wiki/` is reviewed team knowledge — the only content agents may cite without a caveat.
- A biweekly **gardening session** (agent drafts, rotating human gardener reviews) compiles inbox entries into formal pages and reports stale content.

## How to query

- **With AI**: ask in any agent connected to this repo — Copilot Chat / Copilot Space, Claude Code, opencode, or an internal model wired to [`prompts/query.md`](prompts/query.md). The agent reads [`INDEX.md`](INDEX.md), greps `wiki/`, reads full pages, and answers **with citations**; if the wiki has no answer it returns `unknown` plus a suggestion of which page should exist.
- **Without AI**: open [`INDEX.md`](INDEX.md) (one line per page) or use GitHub web search.

Agent entry points (all converge on [`AGENTS.md`](AGENTS.md)): `.github/copilot-instructions.md` (Copilot), `CLAUDE.md` (Claude Code), `AGENTS.md` itself (opencode/Codex and the de-facto standard).

## How to contribute

| Lane | When | How | Cost |
| --- | --- | --- | --- |
| **Quick capture** | Just solved an issue / a discussion worth keeping / a lesson learned | Create `inbox/YYYY-MM-DD-<slug>.md` with the context (any language, no frontmatter), open a PR and **merge it yourself** — inbox PRs need no review. Or hand the material to an agent ([`prompts/capture.md`](prompts/capture.md)) | ≤ 5 min |
| **Formal page** | Content is mature and should become team knowledge | Copy the matching template from [`templates/`](templates/) → fill the frontmatter ([`schemas/frontmatter.md`](schemas/frontmatter.md)) → open a PR for the domain owner ([`team/people.md`](team/people.md)) | 15–30 min |

You do not need to follow up on inbox entries — the gardening session promotes mature ones into `wiki/` (drafted by the agent, approved by the owner).

## Getting external content in (Confluence / Jira / chats)

Your job is only to **deliver the content to an agent** — converting and structuring it into markdown is the agent's job. Three channels, cheapest first:

1. **Copy-paste (covers ~90%)**: open the Confluence page → select all → copy → paste into the agent chat. Lost formatting is fine; the agent restructures against a template.
2. **Export a file**: page `⋯` menu → Export to Word/PDF (or View Storage Format) → drop the file into the chat, or save it and give the agent the path.
3. **Atlassian MCP** (if approved by the company): configure it once in your own agent client; afterwards pasting the URL is enough — the agent fetches content itself.

Conventions: screenshots/images are described in words in the page (the `sources:` link keeps the originals reachable); **no bulk space mirroring** — we migrate individual pages when they are repeatedly needed, and the migrated wiki page becomes authoritative (mark the old Confluence page "no longer maintained"). Worked dialogue examples: [`docs/llm-wiki-architecture-v3/05-工作流场景图解.md`](docs/llm-wiki-architecture-v3/05-工作流场景图解.md).

## Repository layout

| Path | Content |
| --- | --- |
| `wiki/troubleshooting/` | Production issues: symptoms → root cause → resolution |
| `wiki/runbooks/` | Operational procedures: preconditions → steps → verification → rollback |
| `wiki/systems/` | System pages: boundaries, dependencies, owners, known pitfalls |
| `wiki/decisions/` | Decision records (lightweight ADR) |
| `wiki/concepts/` | Domain concepts and background knowledge |
| `wiki/guides/` | How-tos and team practices |
| [`wiki/glossary.md`](wiki/glossary.md) | Team terms, one-line definitions |
| `inbox/` | Unreviewed quick captures (unverified, any language) |
| [`team/people.md`](team/people.md) | staff-id ↔ GitHub ↔ owned-domain routing table |
| [`schemas/`](schemas/) | Documented schema: field rules, taxonomy, sources conventions |
| [`prompts/`](prompts/) | Task protocols: capture / query / gardening |
| [`templates/`](templates/) | Page skeletons (bilingual comments), one per page type |
| [`scripts/`](scripts/) | `check.ts` (executable schema) and `build-index.ts`, zero dependencies |
| [`docs/`](docs/) | Architecture docs, CI plan, design history — not team knowledge |

## Trust and evidence model

- **Location = trust**: `wiki/` is citable; `inbox/` must be labeled unverified; `docs/` is about the repo itself.
- **Status enum** (no confidence scores): absent = current · `needs-review` = doubtful, cite with a warning · `superseded` = never cite, follow `superseded_by`.
- **Evidence ladder** for runbooks/troubleshooting: `sources:` links + verbatim "Source excerpts" + `[E#]` markers tying load-bearing steps to numbered excerpts + optional `verified:` date (last real-world execution) + a mandatory "Unevidenced claims" list in agent-drafted PRs.
- Full rules: [`schemas/frontmatter.md`](schemas/frontmatter.md) · agent behavior: [`AGENTS.md`](AGENTS.md).

## Local commands

```bash
npm run check         # validate: required fields / enums / links / owners / supersede cycles
npm run build-index   # regenerate INDEX.md (INDEX staleness is a warning; a CI bot rebuilds it on main)
```

Scripts are dependency-free and run directly with `node` (Node.js ≥ 22.6, no `npm install`).

## CI

The company CI is **Jenkins** — the root [`Jenkinsfile`](Jenkinsfile) runs `npm run check` as the PR merge gate (job J1). Two more jobs are defined in [`docs/ci.md`](docs/ci.md): INDEX rebuild on main (J2) and the gardening watchdog (J3, alerts when the maintenance loop stalls for 21 days). The `.github/workflows/` files are the same three jobs as a **GitHub Actions reference implementation**; they do not run in environments without Actions.

## Governance

- Formal knowledge changes via PR only; domain owners are enforced through CODEOWNERS. Setup: [`docs/branch-protection.md`](docs/branch-protection.md).
- Biweekly gardening (30 min): the agent produces one maintenance PR per [`prompts/gardening.md`](prompts/gardening.md); a rotating gardener reviews and merges. A watchdog alerts if no gardening PR lands for 21 days.
- Participation model for a 150–200 person org: 15–25 seed/active contributors on the supply side, everyone on the consume side.

## Language policy

Formal content (`wiki/`, control plane, INDEX, commit/PR text) is **English**; `inbox/` raw captures may be Chinese or mixed and are translated when compiled into wiki pages; verbatim evidence quotes keep their original language with a one-line English gloss. The only sanctioned Chinese formal file is [`README.zh-CN.md`](README.zh-CN.md). Details: [`AGENTS.md`](AGENTS.md).

## Design docs

Architecture, rationale for every cut concept, phase plan with upgrade triggers, workflow walkthroughs, and the adversarial review live in [`docs/llm-wiki-architecture-v3/`](docs/llm-wiki-architecture-v3/).
