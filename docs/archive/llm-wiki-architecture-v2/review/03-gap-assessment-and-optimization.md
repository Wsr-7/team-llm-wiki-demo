# Gap Assessment And Optimization Recommendations

> Scope: consolidated gap analysis based on current repo review and external references.
> Output: prioritized optimization roadmap.

## 1. Summary

The current repo has strong conceptual alignment with LLM Wiki, LLM Wiki v2, and OKF. The biggest gap is that core design guarantees are not yet mechanically enforced.

The system should not move directly to vector search, MCP, graph database, or enterprise automation. It first needs a hardening layer that turns design rules into checks, generated artifacts, and review gates.

## 2. Gap Matrix

| Area | Current State | Target State | Priority |
| --- | --- | --- | --- |
| Lint scope | Scans `design-draft/` and presentation assets | Formal checks scan only knowledge/control paths | P0 |
| Raw immutability | Documented but not enforced | Real source hash and path/id validation | P0 |
| YAML parsing | Custom lightweight parser | Real YAML parser plus JSON Schema validation | P0 |
| CI | Not implemented | Required workflow for all checks | P0 |
| Branch protection | Documented only | Required PR, CODEOWNERS, checks | P0 |
| Demo active pages | Active but non-production | Demo pages marked draft or non-production | P0 |
| Index | Manual | Generated and checked | P0 |
| Review lifecycle | Fields exist | Expiration queue and confidence checks | P0.5 |
| Source refs | Page-level only | Claim anchors and citations | P0.5 |
| Supersession | Fields exist | Reference checks and review workflow | P0.5 |
| Candidate quality | Not measured | Quality score and review gates | P1 |
| Search | Design only | Corpus, chunks, query eval, fallback search | P1 |
| Graph | Design only | Nodes/edges/backlinks sidecars | P1 |
| Privacy | Basic visibility/sensitivity | Secret scan, index policy, audit logs | P1 |
| OKF | Not implemented | Export profile and optional import | P2 |
| Automation | Design only | Event contracts then automated PRs | P2 |
| MCP/API | Design only | Read-only query gateway after governance is stable | P3 |

## 3. P0: Phase 0 Hardening

### 3.1 Fix Lint Scope

Current issue: `check-staff-id` and `check-links` scan all markdown files, including design notes and presentation materials.

Recommended policy:

```text
knowledge_control_paths:
  - AGENTS.md
  - schemas/
  - templates/
  - prompts/
  - raw/
  - confluence-mirror/
  - personal/
  - inbox/
  - wiki/
  - indexes/
  - logs/
  - scripts/

excluded_paths:
  - design-draft/
  - design-draft/html-ppt-assets/
  - design-draft/html-slide-design-scheme/
  - docs/llm-wiki-architecture-v2/
```

Rationale: presentation and design documentation may contain examples, placeholders, and explanatory snippets that are not formal knowledge.

### 3.2 Make Raw Source Hash Real

Required behavior:

```text
For every raw source folder:
  manifest.md exists
  source.md exists
  manifest.id matches path
  manifest.hash equals actual SHA256 of source.md
  source_type is allowed
  collector is valid staff id
  collected_at is a valid ISO date
```

Recommended script:

```text
scripts/check-source-manifests.ts
```

### 3.3 Replace Custom YAML Parser

Required behavior:

```text
parse YAML frontmatter with a real YAML parser
validate page frontmatter with page.schema.json
validate candidate frontmatter with candidate.schema.json
validate person profile frontmatter with person.schema.json
validate source manifest frontmatter with source-manifest.schema.json
```

Recommended libraries:

```text
yaml
ajv
```

### 3.4 Add CI

Minimum workflow:

```text
.github/workflows/lint.yml
  npm install or npm ci
  npm run check
```

Later workflows:

```text
check-source-manifests
check-index
check-review-after
check-secrets
check-okf-export
```

### 3.5 Fix Demo Page Semantics

A page that says it is not production guidance should not be `status: active` unless the system has an explicit `production_applicable: false` field and query agents honor it.

Recommended immediate fix:

```yaml
status: draft
review_state: unreviewed
confidence: 0.30
production_applicable: false
```

### 3.6 Generate And Check Index

Recommended scripts:

```text
scripts/build-index.ts
scripts/check-index.ts
```

`check-index` should fail if:

- A wiki page is missing from `indexes/INDEX.md`.
- An index entry points to a missing file.
- An index ID does not match page frontmatter.
- A stale/superseded page is not marked accordingly.

## 4. P0.5: Lifecycle And Provenance Hardening

### 4.1 Review Expiration

Add:

```text
scripts/check-review-after.ts
scripts/build-review-queue.ts
```

Behavior:

```text
If today > review_after and status is active:
  mark finding as stale-review-needed
  add item to indexes/REVIEW_QUEUE.md
  fail CI only when configured as strict
```

### 4.2 Confidence Rules

Enforce:

```text
review_state: disputed => confidence <= 0.60
status: active => non-empty source_refs
status: superseded => must have superseded_by
status: active => must not cite superseded page as current guidance
```

Recommended script:

```text
scripts/check-confidence-rules.ts
```

### 4.3 Claim References

Add claim anchoring gradually. Do not require every sentence to be a claim. Start with high-risk content:

```text
runbook steps
decision outcomes
system ownership
API contracts
security/privacy rules
incident learnings
```

Suggested frontmatter extension:

```yaml
claim_refs:
  - claim_id: claim:<domain>:<slug>
    source_ref: raw:<category>:<source-id>
    source_path: raw/<category>/<source-id>/source.md
    start_line: 10
    end_line: 12
    quote_hash: sha256:<hash>
    confidence: 0.80
    last_confirmed_at: YYYY-MM-DD
```

### 4.4 Supersession Checks

Add:

```text
scripts/check-superseded-references.ts
```

Behavior:

```text
If active page references superseded page:
  allow only if context says historical/background
  otherwise fail or create review queue item
```

### 4.5 Contradiction Review

Add directory and prompt:

```text
inbox/reviews/contradictions/
prompts/resolve-contradiction.md
```

Minimal review record:

```yaml
id: review:contradiction:<slug>
status: open | resolved | rejected
claim_a: claim:<id>
claim_b: claim:<id>
suggested_resolution: prefer_a | prefer_b | merge | needs-human
owner: staff:12345678
created_at: YYYY-MM-DD
```

## 5. P1: Search, Graph, And Quality

### 5.1 Candidate Quality Score

Add quality metadata to candidates:

```yaml
quality:
  structure_score: 0.80
  citation_score: 0.70
  consistency_score: 0.65
  actionability_score: 0.75
  overall: 0.72
quality_status: pass | needs-rewrite | needs-human-review
```

Use quality score to decide whether a candidate can become PR-ready.

### 5.2 Search Foundation

Add:

```text
indexes/search/corpus.jsonl
indexes/search/chunks.jsonl
indexes/QUERY_EVAL.md
scripts/build-search-corpus.ts
scripts/build-chunks.ts
scripts/search.ts
scripts/evaluate-search.ts
```

Search should return:

```json
{
  "page_id": "kb:runbook:payment-failover",
  "chunk_id": "kb:runbook:payment-failover#procedure-1",
  "path": "wiki/runbooks/payment/payment-failover.md",
  "title": "Payment Failover Runbook",
  "status": "active",
  "review_state": "reviewed",
  "confidence": 0.86,
  "source_refs": ["raw:runbooks:2026-06-01-payment-failover"],
  "snippet": "...",
  "score": 0.91
}
```

### 5.3 Hybrid Search Later

Start with deterministic search and corpus generation. Add hybrid only after evaluation exists.

Future search streams:

```text
lexical search: exact terms, file path, title, headings
vector search: semantic similarity
graph search: owner/system/runbook/decision relationships
fusion: reciprocal rank fusion
```

### 5.4 Graph Sidecars

Add:

```text
graph/nodes.jsonl
graph/edges.jsonl
graph/backlinks.jsonl
graph/graph-report.md
graph/viz.html
scripts/export-nodes.ts
scripts/export-edges.ts
scripts/render-graph-html.ts
```

Graph sidecars are derived artifacts. Markdown and frontmatter remain canonical.

### 5.5 Privacy Controls

Add:

```text
scripts/check-secrets.ts
scripts/check-sensitive-index-policy.ts
logs/query.md
logs/redaction.md
```

High-risk content must not enter default search without an explicit index policy.

## 6. P2: OKF Export And Automation

### 6.1 OKF Export

Add:

```text
scripts/export-okf.ts
okf/
```

OKF export should be generated, not hand-edited.

Internal fields should be preserved as extension fields:

```yaml
x-team-id:
x-team-status:
x-team-review-state:
x-team-confidence:
x-team-owners:
x-team-source-refs:
```

### 6.2 Event Contract

Define events before automation:

```text
logs/events.jsonl
```

Event types:

```text
source.created
candidate.created
wiki.page.updated
query.answered
session.ended
review_after.expired
contradiction.detected
okf.export.generated
```

### 6.3 Controlled Automation

Automation should initially create PRs, not merge them.

Allowed early automation:

```text
build index
build review queue
build graph sidecars
build search corpus
open candidate PR
open stale review issue
```

Disallowed until maturity:

```text
automatically merge wiki updates
automatically promote personal knowledge
automatically publish restricted content
automatically delete or rewrite raw sources
```

## 7. P3: Platform And MCP

Only after P0-P2 are stable:

```text
read-only MCP query gateway
permission-aware search API
OKF import/export API
static viewer hosting
ownership dashboard
review SLA dashboard
```

Do not build a platform too early. The repo-first model should remain the source of truth.

## 8. Optimization Direction

The optimized architecture should follow this order:

```text
1. Governance correctness
2. Evidence and provenance
3. Lifecycle health
4. Deterministic derived artifacts
5. Search evaluation
6. Graph navigation
7. OKF interoperability
8. Event-driven automation
9. MCP/API platform
```

## 9. Final Recommendation

Do not rush to Phase 3 search or Phase 5 automation. The immediate next version should be:

```text
Phase 0.5: Governance And Lifecycle Hardening
```

It should turn the current repo from a promising skeleton into a trustworthy knowledge base foundation.
