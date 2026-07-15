# External Reference Analysis

> Scope: Karpathy LLM Wiki, Rohit LLM Wiki v2, Google Open Knowledge Format, and Google knowledge-catalog.
> Purpose: identify what the repo should absorb, what it should defer, and what should be used only for interoperability.

## 1. Reference Map

| Reference | Best Used For | Role In This Project |
| --- | --- | --- |
| Karpathy LLM Wiki | Core wiki pattern | Foundation: raw sources, maintained wiki, schema/agent instructions, index/log, ingest/query/lint |
| Rohit LLM Wiki v2 | Long-term memory health | Lifecycle, claim confidence, supersession, forgetting, hybrid search, graph, automation, quality controls |
| Google OKF | Interoperability format | Export/import compatibility profile; not a replacement for internal governance schema |
| Google knowledge-catalog | Reference tooling | Producer/consumer separation, static visualizer, sample bundle approach |

## 2. Karpathy LLM Wiki

### 2.1 Core Insight

Karpathy's LLM Wiki pattern is not a normal RAG system. It proposes that the LLM incrementally builds and maintains a persistent markdown wiki between users and raw sources. Raw sources remain immutable; the wiki is structured, linked, and updated over time.

The key layers are:

```text
raw sources -> wiki -> schema / AGENTS.md
```

The schema file, such as `AGENTS.md`, is the instruction contract that tells the agent how the wiki is structured and how to ingest, query, and maintain it.

### 2.2 Relevant Ideas For This Repo

The current repo has already absorbed the following ideas well:

- Raw source layer is separate from wiki.
- Wiki is markdown-based.
- Agent protocol exists in `AGENTS.md`.
- `indexes/INDEX.md` is read first during query.
- There are explicit ingest/query/lint prompts.
- The repo treats bookkeeping as an agent-suitable task.

### 2.3 Missing Or Weakly Implemented Ideas

Karpathy emphasizes `index.md` and `log.md` as discoverability and history surfaces. The current repo has `indexes/INDEX.md` and `logs/operations.md`, but they are not generated, checked, or aligned with OKF naming conventions.

The repo should add:

```text
scripts/build-index.ts
scripts/check-index.ts
scripts/append-operation-log.ts
root index.md and log.md as generated or mirrored OKF-compatible views
```

### 2.4 Key Takeaway

Karpathy defines the baseline. The current repo is aligned with it conceptually, but it needs deterministic scripts and CI so that the wiki does not rely on agent discipline alone.

## 3. Rohit LLM Wiki v2

### 3.1 Core Insight

LLM Wiki v2 extends the basic wiki pattern with lifecycle machinery. The original pattern gets a wiki started; v2 tries to keep a large wiki sharp over time.

Important v2 additions:

```text
memory lifecycle
claim-level confidence
confidence decay and reinforcement
supersession
forgetting / retention policy
consolidation tiers
typed knowledge graph
hybrid search with BM25 + vector + graph
reciprocal rank fusion
automation hooks
quality scoring
contradiction resolution
multi-agent collaboration
private/shared memory boundaries
privacy and governance controls
crystallization from sessions
```

### 3.2 What The Repo Already Absorbs

The current repo has partially absorbed v2 in these areas:

| v2 Idea | Current Repo Evidence | Absorption Quality |
| --- | --- | --- |
| Lifecycle | `status`, `review_state`, `confidence`, `review_after` | Medium |
| Supersession | `supersedes`, `superseded_by` in templates | Medium |
| Graph | `graph/` placeholder and Phase 4 design | Medium in design, low in implementation |
| Hybrid search | Phase 3 design mentions QMD, vector, rerank | Medium in design, low in implementation |
| Private/shared boundary | `personal/`, `inbox/`, `wiki/` separation | Good |
| Automation | Phase 5 design | Low implementation |
| Crystallization | Phase 5 mentions crystallize-session | Low implementation |
| Governance | `visibility`, `sensitivity`, staff-id rules | Medium |

### 3.3 What The Repo Has Not Fully Absorbed

#### Claim-Level Confidence

Current repo uses page-level confidence only:

```yaml
confidence: 0.78
```

v2 argues that each fact or claim should know its confidence, source support, recency, and contradictions. This is essential once pages mix stable and unstable claims.

Recommended addition:

```yaml
claim_refs:
  - claim_id: claim:<domain>:<slug>
    confidence: 0.78
    source_refs:
      - raw:<category>:<source-id>#L10-L12
    last_confirmed_at: YYYY-MM-DD
    contradiction_refs: []
```

#### Forgetting And Retention

Current repo has `review_after`, but that is not the same as forgetting. v2's forgetting model means stale, unreinforced, or low-value knowledge should be deprioritized without necessarily being deleted.

Recommended addition:

```yaml
memory_policy:
  retention_class: durable | normal | transient
  decay_half_life_days: 30
  reinforcement_events: []
```

#### Consolidation Tiers

The repo has governance stages, not memory tiers. Add a lightweight field:

```yaml
memory_tier: raw_observation | episode | semantic | procedural
```

Suggested mapping:

| Existing Area | Memory Tier |
| --- | --- |
| `raw/` | raw_observation |
| `inbox/candidates/` | episode |
| `wiki/systems/`, `wiki/concepts/` | semantic |
| `wiki/runbooks/`, `wiki/practices/` | procedural |
| `wiki/decisions/` | semantic and durable |

#### Hybrid Search

Current design mentions hybrid search but has no implementation. A minimum viable hybrid-ready foundation should include:

```text
indexes/search/corpus.jsonl
indexes/search/chunks.jsonl
indexes/QUERY_EVAL.md
scripts/build-search-corpus.ts
scripts/build-chunks.ts
scripts/search.ts
scripts/evaluate-search.ts
```

#### Quality Score

Confidence measures fact trust. Quality measures whether a page or candidate is well-structured, cited, consistent, and actionable. Add quality scoring mainly to candidates:

```yaml
quality:
  structure_score: 0.80
  citation_score: 0.70
  consistency_score: 0.65
  actionability_score: 0.75
  overall: 0.72
quality_status: pass | needs-rewrite | needs-human-review
```

#### Automation Hooks

Do not implement fully automated ingest immediately. But define the event contract early:

```text
source.created
candidate.created
wiki.page.updated
query.answered
session.ended
review_after.expired
contradiction.detected
```

This lets future automation be auditable rather than hidden.

## 4. Google Open Knowledge Format

### 4.1 Core Insight

OKF formalizes the LLM Wiki pattern into a portable format. It is intentionally minimal: markdown files with YAML frontmatter, normal markdown links, optional `index.md`, optional `log.md`, and permissive consumer behavior.

OKF is not trying to define every team's internal schema. It defines an interoperability surface.

### 4.2 What Matters For This Repo

OKF suggests these useful conventions:

```text
A knowledge bundle is a directory tree of markdown files.
Every concept document has YAML frontmatter.
Only `type` is required for concept documents.
`title`, `description`, `resource`, `tags`, and `timestamp` are recommended.
Standard markdown links express relationships.
`index.md` supports progressive disclosure.
`log.md` records chronological history.
Consumers should tolerate unknown types, unknown fields, missing optional fields, broken links, and missing indexes.
```

### 4.3 Internal Schema Should Remain Stricter Than OKF

The team wiki needs stricter fields:

```yaml
id:
status:
review_state:
confidence:
owners:
source_refs:
visibility:
review_after:
supersedes:
superseded_by:
```

Do not weaken internal governance to match OKF. Instead, add an OKF export profile.

### 4.4 Proposed OKF Export Profile

Internal page:

```yaml
id: kb:runbook:payment-failover
title: Payment Failover Runbook
type: runbook
status: active
review_state: reviewed
confidence: 0.86
owners:
  - staff:12345678
source_refs:
  - raw:runbooks:2026-06-01-payment-failover
```

OKF-compatible export:

```yaml
type: Playbook
title: Payment Failover Runbook
description: Procedure for payment gateway failover.
resource: teamwiki://kb/runbook/payment-failover
tags: [payment, failover, runbook]
timestamp: 2026-06-01T00:00:00Z
x-team-id: kb:runbook:payment-failover
x-team-status: active
x-team-review-state: reviewed
x-team-confidence: 0.86
x-team-owners:
  - staff:12345678
x-team-source-refs:
  - raw:runbooks:2026-06-01-payment-failover
```

### 4.5 Link Convention

Current repo uses wiki-style links such as:

```text
wiki/systems/payment/payment-gateway.md
```

For OKF export, standard markdown links should be preferred:

```md
[Payment Gateway](/wiki/systems/payment/payment-gateway.md)
```

Internally, the repo may keep stricter `related` metadata and knowledge IDs. Externally, OKF export should be normal markdown.

## 5. Google knowledge-catalog

Google's knowledge-catalog is useful less as a schema source and more as an example of producer/consumer separation.

The repo should eventually support:

```text
Producers:
  raw source importer
  Confluence mirror importer
  GitHub issue or ADR importer
  session crystallizer
  query-answer candidate generator

Consumers:
  query-wiki prompt
  static graph viewer
  search index
  OKF bundle exporter
  MCP/API gateway
```

A particularly valuable idea is a static single-file visualizer. For this repo, that means:

```text
scripts/render-graph-html.ts
graph/viz.html
```

This should be generated from graph sidecars and should not require a backend.

## 6. How The References Should Be Combined

The correct synthesis is:

```text
Karpathy LLM Wiki:
  Defines the basic pattern.

Rohit LLM Wiki v2:
  Defines long-term health mechanisms.

Google OKF:
  Defines portable exchange format.

knowledge-catalog:
  Demonstrates producer/consumer tooling.
```

The project should not choose one reference and discard the others. It should layer them:

```text
Internal Team Wiki Schema
  strict governance model
  owners/status/review/confidence/source refs/visibility

LLM Wiki v2 Runtime Model
  lifecycle, claims, graph, search, quality, automation, privacy

OKF Export Profile
  portable markdown + YAML frontmatter bundle
  standard links, index.md, log.md, permissive consumption
```

## 7. References

- Karpathy LLM Wiki gist: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- Rohit LLM Wiki v2 gist: https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2
- Google Cloud OKF announcement: https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing/
- OKF v0.1 spec: https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md
- Google knowledge-catalog repository: https://github.com/GoogleCloudPlatform/knowledge-catalog
