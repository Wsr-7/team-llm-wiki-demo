# New System Architecture

> Purpose: redesigned system architecture for the next version of the team LLM Wiki.

## 1. Architecture Overview

The redesigned architecture separates canonical knowledge from generated projections and future platform interfaces.

```mermaid
flowchart TB
    subgraph Sources["Source Evidence Layer"]
        R1["raw/ immutable source folders"]
        R2["confluence-mirror/ one-way snapshots"]
        R3["personal/*/raw local observations"]
        R4["external source references"]
    end

    subgraph Proposal["Proposal And Review Layer"]
        C1["inbox/candidates/ proposed knowledge"]
        C2["inbox/reviews/ stale conflict owner quality queues"]
    end

    subgraph Formal["Formal Knowledge Layer"]
        W1["wiki/ reviewed team knowledge"]
        W2["personal/*/profile.md responsibility map"]
    end

    subgraph Control["Control Plane"]
        A1["AGENTS.md"]
        A2["schemas/"]
        A3["templates/"]
        A4["prompts/"]
        A5["scripts/"]
        A6[".github workflows and CODEOWNERS"]
    end

    subgraph Derived["Derived Projection Layer"]
        I1["indexes/ generated navigation"]
        I2["indexes/search corpus and chunks"]
        G1["graph/nodes edges backlinks"]
        O1["okf/ generated export"]
        L1["logs/ audit and events"]
        V1["graph/viz.html static viewer"]
    end

    subgraph Interfaces["Future Access Interfaces"]
        Q1["query-wiki prompt"]
        Q2["search wrapper"]
        Q3["read-only MCP gateway"]
        Q4["static documentation viewer"]
    end

    Sources --> C1
    C1 --> C2
    C2 --> W1
    Control --> C1
    Control --> W1
    W1 --> I1
    W1 --> I2
    W1 --> G1
    W1 --> O1
    W1 --> L1
    G1 --> V1
    I1 --> Q1
    I2 --> Q2
    G1 --> Q2
    O1 --> Q3
    Q2 --> Q3
    Q1 --> C1
```

## 2. Canonical Versus Derived

### 2.1 Canonical Inputs

Canonical inputs are the files humans and agents must treat as source-of-truth or governance source:

```text
raw/**/manifest.md
raw/**/source.md
confluence-mirror/**
personal/*/profile.md
wiki/**/*.md
AGENTS.md
schemas/**
templates/**
prompts/**
scripts/**
.github/CODEOWNERS
.github/workflows/**
```

### 2.2 Derived Outputs

Derived outputs must be rebuildable:

```text
indexes/INDEX.md
indexes/REVIEW_QUEUE.md
indexes/search/corpus.jsonl
indexes/search/chunks.jsonl
graph/nodes.jsonl
graph/edges.jsonl
graph/backlinks.jsonl
graph/graph-report.md
graph/viz.html
okf/**
```

### 2.3 Excluded Material

Presentation and persuasion material is excluded from formal knowledge processing:

```text
design-draft/html-ppt-assets/
design-draft/html-slide-design-scheme/
```

The broader `design-draft/` folder is useful as historical design context, but should not be included in formal staff-id, wikilink, source-ref, search, or graph checks unless a dedicated documentation check is explicitly created.

## 3. Data Flow

### 3.1 Source Ingest Flow

```mermaid
sequenceDiagram
    participant Human as Human Or Import Tool
    participant Raw as raw/
    participant Agent as Ingest Agent
    participant Candidate as inbox/candidates/
    participant Review as inbox/reviews/
    participant PR as Pull Request
    participant Wiki as wiki/

    Human->>Raw: Add manifest.md and source.md
    Agent->>Raw: Verify hash, source type, collector, sensitivity
    Agent->>Candidate: Create Source Understanding
    Agent->>Candidate: Add Wiki Proposal
    Agent->>Review: Create review items if conflicts or missing owner
    Agent->>PR: Prepare patch after candidate matures
    PR->>Wiki: Merge only after CI and owner review
```

### 3.2 Query Flow

```mermaid
sequenceDiagram
    participant User as User
    participant Agent as Query Agent
    participant Index as indexes/INDEX.md
    participant Search as Search Wrapper
    participant Wiki as wiki/
    participant Graph as graph/
    participant Candidate as inbox/candidates/

    User->>Agent: Ask question
    Agent->>Index: Read navigation first
    Agent->>Search: Search corpus and fallback lexical search
    Search->>Graph: Optional related seed lookup
    Search->>Agent: Return ranked pages/chunks
    Agent->>Wiki: Read top pages fully
    Agent->>Agent: Check status, review_state, confidence, source_refs
    Agent->>User: Return cited answer or unknown
    Agent->>Candidate: Optional query-origin candidate if answer has durable value
```

### 3.3 Lifecycle Flow

```mermaid
stateDiagram-v2
    [*] --> draft
    draft --> candidate: source understanding or proposal
    candidate --> active: owner reviewed and merged
    candidate --> archived: rejected
    active --> stale: review_after expired
    active --> disputed: contradiction detected
    active --> superseded: replaced by newer page
    stale --> active: owner revalidated
    disputed --> active: resolved without replacement
    disputed --> superseded: resolved by newer page
    superseded --> archived: optional archive
    archived --> [*]
```

## 4. Knowledge Object Model

### 4.1 Source

A source is raw evidence.

```text
raw/<category>/<yyyy-mm-dd>-<slug>/manifest.md
raw/<category>/<yyyy-mm-dd>-<slug>/source.md
```

Required qualities:

- Source id is stable.
- Source content hash is real.
- Source body is not rewritten in place.
- Source sensitivity is explicit.
- Collector is a valid staff id.

### 4.2 Candidate

A candidate is a proposal, not truth.

Candidate sections:

```text
Source Understanding
Wiki Proposal
Review Notes
Decision Log
Quality Notes
Open Questions
```

Candidate status:

```text
proposed -> in_review -> promoted | rejected | superseded
```

### 4.3 Formal Page

A formal page is reviewed team knowledge.

Required traits:

- Valid frontmatter.
- Valid owner.
- Non-empty source refs for active pages.
- Clear lifecycle fields.
- Review metadata.
- Related links explainable by deterministic signals.

### 4.4 Claim Reference

A claim reference is optional at first but required for high-risk content.

Use it when a statement is operationally important, likely to change, or potentially disputed.

```yaml
claim_refs:
  - claim_id: claim:payment:failover-requires-degradation-confirmation
    source_ref: raw:runbooks:2026-06-01-demo-payment-runbook
    source_path: raw/runbooks/2026-06-01-demo-payment-runbook/source.md
    start_line: 1
    end_line: 3
    quote_hash: sha256:<hash>
    confidence: 0.78
    last_confirmed_at: 2026-06-01
```

### 4.5 Graph Edge

Graph edges are derived unless explicitly stored in frontmatter.

Trusted deterministic edge sources:

```text
owners -> owns
maintainers -> maintains
source_refs shared by pages -> shared_source
markdown links -> wikilink
reverse markdown links -> backlink
related frontmatter -> related_to
supersedes/superseded_by -> supersedes
```

LLM-inferred edges must enter `inbox/candidates/` or `inbox/reviews/`, not direct graph sidecars.

## 5. Trust Boundaries

### 5.1 AI Write Boundary

AI may write:

```text
inbox/candidates/
inbox/reviews/
proposed PR patches
generated reports
derived sidecars
```

AI must not silently write or merge:

```text
wiki/ active pages
schemas/
prompts/
templates/
raw/source.md rewrites
```

### 5.2 Mirror Boundary

`confluence-mirror/` is external snapshot evidence, not formal team truth.

Mirror content can support candidates but should not be searched as current guidance by default unless an explicit index policy allows it.

### 5.3 Personal Boundary

`personal/<staff-id>/` is not team truth. Personal notes can inspire candidates, but promotion requires review.

### 5.4 Presentation Boundary

`html-ppt*` and similar material is communication collateral. It should be ignored by formal knowledge checks.

## 6. Runtime Modes

### 6.1 Phase 0 Runtime

```text
manual source addition
manual prompt execution
manual PR
CI validation
owner review
```

### 6.2 Phase 1 Runtime

```text
candidate quality gates
source hash checks
index generation
review queue generation
claim refs for high-risk content
```

### 6.3 Phase 2 Runtime

```text
search corpus generation
query eval
search wrapper
rg fallback
```

### 6.4 Phase 3 Runtime

```text
graph sidecar generation
related and impact queries
static graph viewer
supersession checks
```

### 6.5 Phase 4 Runtime

```text
OKF export
read-only generated bundle
standard markdown link export
root index.md and log.md compatibility
```

### 6.6 Phase 5 Runtime

```text
event logs
automation hooks
automated PR generation
session crystallization
read-only MCP gateway
```

## 7. Architecture Decision

The system should remain file-first and repo-first until all core governance gates are reliable.

Do not introduce a mandatory database, hosted service, or graph platform in the early phases. Those can be consumers of the repo, not replacements for it.
