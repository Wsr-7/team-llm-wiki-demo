# New Design Principles

> Purpose: define the next-generation design thesis for the team LLM Wiki.
> This document supersedes the earlier phase drafts conceptually, but does not modify existing repo behavior by itself.

## 1. Design Thesis

A team LLM Wiki should not be designed as a chatbot memory dump, a pure RAG index, or a documentation site. It should be designed as a governed knowledge codebase.

The core thesis:

```text
Git is the authority layer.
Markdown is the human-readable knowledge medium.
YAML frontmatter is the machine-readable control plane.
Raw sources are immutable evidence.
Candidates are the AI/human proposal buffer.
Formal wiki pages are reviewed team knowledge.
Derived indexes, search corpora, graph sidecars, OKF exports, and visualizations are rebuildable projections.
```

LLMs should be used as compilers, maintainers, reviewers, and query assistants. They should not be allowed to silently rewrite team truth.

## 2. Goals

The redesigned system should support:

1. Durable team knowledge stored as versioned markdown.
2. Evidence-backed formal wiki pages.
3. Human owner review before formalization.
4. AI-assisted ingest, compile, query, lint, and refactor workflows.
5. Staff-id based responsibility tracking.
6. Review lifecycle, stale detection, supersession, and confidence management.
7. Claim-level provenance for high-risk knowledge.
8. Explainable related-page discovery.
9. Generated indexes and review queues.
10. Search and graph sidecars that are rebuildable from canonical markdown.
11. OKF-compatible export without weakening internal governance.
12. Event logs that prepare for future automation.
13. Clear exclusion of presentation material from formal knowledge checks.

## 3. Non-Goals

The redesigned system should not:

1. Become a pure vector database or RAG product.
2. Let LLMs merge formal knowledge without PR review.
3. Treat Confluence mirror snapshots as formal truth.
4. Treat personal notes as team truth.
5. Depend on a graph database in early phases.
6. Require an MCP/API platform before the repo workflow is stable.
7. Require OKF internally for every governance field.
8. Automatically delete old knowledge as a form of forgetting.
9. Scan presentation assets as formal knowledge.
10. Put sensitive or restricted material into default search without policy.

## 4. Core Principles

### 4.1 Repo First, Platform Later

The repository is the source of truth. Platforms, viewers, search services, graph viewers, MCP gateways, and OKF bundles are derived views.

If a derived artifact is deleted, it should be rebuildable from repo content.

### 4.2 Evidence Before Synthesis

Every formal wiki page must be backed by source evidence. For low-risk overview pages, page-level `source_refs` may be enough. For high-risk operational guidance, claim-level evidence is required.

High-risk areas:

```text
runbook steps
incident root causes
security and privacy rules
production architecture claims
API contracts
ownership and escalation paths
ADR decisions
migration rules
```

### 4.3 Candidate Buffer Before Formal Knowledge

AI-generated or query-derived knowledge must first enter `inbox/candidates/`. Formal wiki pages change only through PR review.

This creates a safe buffer where AI can be useful without corrupting the formal wiki.

### 4.4 Lifecycle Is Part Of Knowledge

A knowledge page is not just content. It has lifecycle metadata:

```text
status
review_state
confidence
verified_at
review_after
supersedes
superseded_by
memory_policy
```

Knowledge can be active, stale, disputed, superseded, archived, or draft. Query agents must treat these states as hard guidance.

### 4.5 Page-Level Confidence Is Not Enough Forever

Page-level confidence is acceptable in Phase 0. For scale, high-risk claims need claim-level confidence and source anchors.

Use a progressive model:

```text
Phase 0: page-level confidence
Phase 0.5: claim refs for high-risk facts
Phase 1+: claim-level confidence for formal operational knowledge
```

### 4.6 Explainable Graph Before Smart Graph

Start with graph edges that are deterministic and explainable:

```text
frontmatter related
standard markdown links
backlinks
shared source_refs
owners and maintainers
supersedes / superseded_by
```

LLM-inferred edges must be candidates, not direct graph facts.

### 4.7 Search Must Be Evaluated

Search should not be added just because it is technically easy. It must have an evaluation set and known failure modes.

Minimum search success criteria:

```text
top-5 expected page hit rate
stale/superseded misuse rate
citation correctness
unknown correctness
permission leakage checks
```

### 4.8 Internal Strictness, External Compatibility

Internal wiki schema should be strict because team knowledge needs governance.

OKF export should be permissive and compatible because external consumers need portability.

Therefore:

```text
Internal schema != OKF schema
Internal schema -> OKF export profile
```

### 4.9 Human Ownership Is Not Optional

Every formal page needs an owner. Owner review is how knowledge becomes team truth.

AI can suggest owners, but cannot confirm them.

### 4.10 Automation Must Produce Reviewable Artifacts

Early automation should create:

```text
candidate files
review queue items
PRs
generated indexes
generated graph sidecars
reports
```

It should not directly merge or silently update formal knowledge.

## 5. Design Slogan

```text
Do not build a bigger retrieval system.
Build a knowledge system that can survive retrieval, review, revision, and time.
```

## 6. New Architecture Layers

```text
Layer 0: Source Evidence
  raw/, confluence-mirror/, external references

Layer 1: Proposal And Review
  inbox/candidates/, inbox/reviews/

Layer 2: Formal Team Knowledge
  wiki/

Layer 3: Control Plane
  AGENTS.md, schemas/, templates/, prompts/, scripts/

Layer 4: Derived Projections
  indexes/, graph/, search corpus, OKF export, logs/

Layer 5: Future Access Interfaces
  static viewer, MCP gateway, API, search service
```

## 7. What Changes From The Current Design

The redesigned system keeps the current directory idea but changes the operational emphasis:

| Current Emphasis | New Emphasis |
| --- | --- |
| Documentation of rules | Enforced rules |
| Page-level source refs | Source refs plus claim refs |
| Manual index | Generated and checked index |
| Phase plan as docs | Phase plan as implementation gates |
| Graph as future idea | Deterministic graph sidecars after lifecycle hardening |
| Search as feature | Search as evaluated projection |
| OKF as inspiration | OKF as export/import compatibility layer |
| Automation as future agent behavior | Automation as explicit event contract and PR producer |

## 8. First Principle For Implementation

When choosing between making the system smarter and making it more trustworthy, choose trust first.

The correct order is:

```text
correctness -> provenance -> lifecycle -> search -> graph -> automation -> platform
```
