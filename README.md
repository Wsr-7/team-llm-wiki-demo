# Team LLM Wiki

The team knowledge base: a git-managed wiki that **both humans and AI agents read and write**.
Production issue solutions, troubleshooting, runbooks, system knowledge, decision records, distilled experience — it all lives here.

- Reviewed knowledge lives in [`wiki/`](wiki/), enters only via PR, and is safe to cite.
- Catalog entry point: [`INDEX.md`](INDEX.md) (one line per page, generated).
- Agent protocol: [`AGENTS.md`](AGENTS.md) (works with any agent — Copilot / Claude Code / opencode / internal models).
- Language policy: **all repository content is English** (verbatim evidence quotes may stay in their original language). See `AGENTS.md`.

## How to query

- **With AI**: ask in any agent connected to this repo (Copilot Chat / Copilot Space / Claude Code / opencode). The agent follows the protocol, answers with citations, and returns `unknown` with a page suggestion when the wiki has no answer.
- **Without AI**: open [`INDEX.md`](INDEX.md), or use GitHub web search.

## How to contribute (two lanes)

| Lane | When | How | Cost |
| --- | --- | --- | --- |
| **Quick capture** | Just solved an issue / a discussion worth keeping / a lesson learned | Create a file in [`inbox/`](inbox/) named `YYYY-MM-DD-<slug>.md` with the context, commit directly to main (inbox is PR-exempt). Or hand the material to an agent and let it follow [`prompts/capture.md`](prompts/capture.md) | ≤ 5 min |
| **Formal page** | Content is mature and should become team knowledge | Copy the matching template from [`templates/`](templates/) → fill the frontmatter (rules: [`schemas/frontmatter.md`](schemas/frontmatter.md)) → open a PR | 15–30 min |

Inbox entries get compiled into formal pages at the **biweekly gardening session** (agent + rotating gardener) — you do not need to follow up.

## Layout

| Path | Content |
| --- | --- |
| `wiki/troubleshooting/` | Production issues: symptoms → root cause → resolution |
| `wiki/runbooks/` | Operational procedures: preconditions → steps → verification → rollback |
| `wiki/systems/` | System pages: boundaries, dependencies, owners, known pitfalls |
| `wiki/decisions/` | Decision records (lightweight ADR) |
| `wiki/concepts/` | Domain concepts and background knowledge |
| `wiki/guides/` | How-tos and team practices |
| `wiki/glossary.md` | Team terms |
| `inbox/` | Unreviewed quick captures (unverified content) |
| `team/people.md` | staff-id ↔ GitHub ↔ owned-domain routing table |
| `schemas/` `prompts/` `templates/` | Rules, task protocols, page templates (control plane — changes need admin review) |
| `docs/` | Architecture docs and design history of this repo itself |

## Local commands

```bash
npm run check         # validate: required fields / enums / links / owners / INDEX freshness (required for PRs)
npm run build-index   # regenerate INDEX.md (run after adding, moving, or retitling pages)
```

Scripts are dependency-free and run directly with `node` (Node 22.6+).

## Governance

- Formal knowledge changes via PR only; CODEOWNERS and branch protection setup: [`docs/branch-protection.md`](docs/branch-protection.md).
- Biweekly gardening session (30 min): the agent produces a maintenance PR per [`prompts/gardening.md`](prompts/gardening.md); the rotating gardener reviews and merges.
- Design docs and evolution history: [`docs/llm-wiki-architecture-v3/`](docs/llm-wiki-architecture-v3/).
