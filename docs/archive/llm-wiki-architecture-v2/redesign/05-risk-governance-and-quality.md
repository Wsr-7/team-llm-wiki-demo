# Risk, Governance, And Quality Design

> Purpose: define the main risks, governance controls, quality gates, and operational safeguards for the redesigned team LLM Wiki.

## 1. Core Risk Thesis

The main risk of a team LLM Wiki is not that retrieval fails. The main risk is that the system becomes confidently wrong over time.

Common failure modes:

```text
stale knowledge remains active
AI-generated text becomes accepted without review
source evidence is missing or too coarse
old and new claims contradict each other
personal notes leak into team truth
restricted content enters default search
indexes and graph sidecars drift from canonical markdown
automation silently changes formal knowledge
```

The design must prioritize trust, provenance, and lifecycle before search intelligence.

## 2. Risk Register

| Risk | Description | Impact | Mitigation | Phase |
| --- | --- | --- | --- | --- |
| Lint boundary pollution | Presentation or design examples fail formal checks | Medium | Path policy and formal check scope | Phase 0 |
| Raw source mutation | Source evidence changes without trace | High | SHA256 source hash and immutable source rule | Phase 0 |
| Weak YAML parsing | Nested metadata parsed incorrectly | High | Real YAML parser and JSON Schema validation | Phase 0 |
| Fake active demo knowledge | Demo page treated as real guidance | High | Mark demo as draft or non-production | Phase 0 |
| Manual index drift | Index omits or misstates pages | Medium | Generated index and check-index | Phase 0.5 |
| Stale active pages | Old guidance used as current truth | High | review_after checks and review queue | Phase 0.5 |
| Superseded page misuse | Replaced guidance still cited | High | superseded reference checks | Phase 0.5 |
| Coarse provenance | Page source exists but claim support is unclear | High | claim_refs for high-risk claims | Phase 0.5 |
| AI hallucinated formal knowledge | Agent writes plausible but unsupported content | High | candidate buffer, owner review, citation gates | Phase 1 |
| Owner ambiguity | No one responsible for page correctness | High | required owners and CODEOWNERS | Phase 1 |
| Candidate quality variance | AI proposals vary in structure and evidence | Medium | candidate quality scores | Phase 1 |
| Search stale misuse | Search ranks stale/superseded pages too high | High | query eval and status-aware ranking | Phase 2 |
| Sensitive content leakage | Restricted content enters search/export | Critical | index_policy, secret scan, export filters | Phase 2 |
| Graph false edges | Inferred relationships become trusted | Medium | deterministic edge sources only | Phase 3 |
| OKF export loses governance | External export hides internal status/confidence | Medium | x-team extension fields | Phase 4 |
| Automation overreach | Agent opens or merges unsafe changes | Critical | automated PR only, no auto-merge | Phase 5 |
| Platform authority drift | MCP/API becomes perceived source of truth | High | repo remains canonical, derived artifacts only | Phase 6 |

## 3. Governance Model

### 3.1 Roles

| Role | Responsibility |
| --- | --- |
| Knowledge Admin | Owns schema, prompts, templates, governance policy, CI checks |
| Domain Owner | Reviews domain pages and confirms formal knowledge |
| Contributor | Adds sources, proposes candidates, answers review questions |
| AI Agent | Ingests, compiles, checks, proposes, and queries under protocol |
| Repo Admin | Configures branch protection, CODEOWNERS, and CI |

### 3.2 Authority Rules

```text
raw/ is source evidence, not synthesized knowledge.
inbox/candidates/ is proposal space, not truth.
wiki/ is formal team truth after review.
confluence-mirror/ is external snapshot evidence, not truth.
personal/ is personal context, not team truth.
indexes/, graph/, okf/ are derived projections.
```

### 3.3 Write Authority

| Path | Human Direct Write | AI Direct Write | PR Required |
| --- | --- | --- | --- |
| `raw/source.md` | Add only | No rewrite | Yes |
| `raw/manifest.md` | Yes | Assist only | Yes |
| `inbox/candidates/` | Yes | Yes | Optional before formalization |
| `inbox/reviews/` | Yes | Yes | Optional |
| `wiki/` | Yes | Patch proposal only | Yes |
| `schemas/` | Admin only | Patch proposal only | Yes |
| `prompts/` | Admin only | Patch proposal only | Yes |
| `templates/` | Admin only | Patch proposal only | Yes |
| `indexes/` | Generated | Generated | Yes |
| `graph/` | Generated | Generated | Yes |
| `okf/` | Generated | Generated | Yes |
| `logs/` | Append | Controlled append | Yes or controlled automation |

## 4. Quality Gates

### 4.1 Required Phase 0 Checks

```text
check-staff-id
check-person-files
check-frontmatter
check-source-manifests
check-source-refs
check-candidates
check-links
```

### 4.2 Required Phase 0.5 Checks

```text
check-index
check-review-after
check-confidence-rules
check-superseded-references
check-claim-refs
```

### 4.3 Required Phase 1 Checks

```text
check-candidate-quality
check-owner-review-readiness
check-production-applicability
```

### 4.4 Required Phase 2 Checks

```text
build-search-corpus
build-chunks
evaluate-search
check-sensitive-index-policy
```

### 4.5 Required Phase 3 Checks

```text
export-nodes
export-edges
check-graph-consistency
check-orphan-pages
check-invalid-edges
```

### 4.6 Required Phase 4 Checks

```text
export-okf
check-okf-basic-conformance
check-okf-export-policy
```

### 4.7 Required Phase 5 Checks

```text
check-events
check-automation-permissions
check-crystallization-candidates
```

## 5. Page Quality Model

### 5.1 Confidence Versus Quality

Do not confuse confidence and quality.

```text
confidence = how trustworthy the facts are
quality = how useful, structured, cited, and maintainable the page is
```

A page can be high quality but low confidence if evidence is weak. A page can have high confidence facts but poor quality structure.

### 5.2 Candidate Quality Score

Candidates should include:

```yaml
quality:
  structure_score: 0.00
  citation_score: 0.00
  consistency_score: 0.00
  actionability_score: 0.00
  owner_clarity_score: 0.00
  overall: 0.00
quality_status: pass | needs-rewrite | needs-human-review
```

Recommended thresholds:

| Quality Status | Rule |
| --- | --- |
| `pass` | overall >= 0.75 and citation_score >= 0.70 |
| `needs-human-review` | overall 0.50-0.75 or owner unclear |
| `needs-rewrite` | overall < 0.50 or missing source references |

### 5.3 Formal Page Quality Checklist

Before a page becomes active:

```text
[ ] Owner is real and valid.
[ ] Source refs exist.
[ ] High-risk claims have claim refs or explicit review note.
[ ] Status and review_state are consistent.
[ ] Confidence rationale is explainable.
[ ] Related links are explainable.
[ ] Page is included in generated index.
[ ] Sensitive content policy is clear.
[ ] review_after is appropriate for page type.
```

## 6. Confidence And Lifecycle Rules

### 6.1 Baseline Confidence Ranges

| Confidence | Meaning |
| --- | --- |
| 0.00-0.30 | unsupported, speculative, or rejected |
| 0.30-0.50 | weak source or unreviewed candidate |
| 0.50-0.75 | source-backed and admin-triaged |
| 0.75-0.90 | owner-reviewed active knowledge |
| 0.90-1.00 | audit-backed, ADR-backed, production-validated, or multi-source supported |

### 6.2 Hard Rules

```text
active page requires source_refs.
disputed page must not have confidence above 0.60.
superseded page must not be used as current guidance.
superseded page must have superseded_by.
review_after expiration creates review queue item.
confidential page must not enter default OKF export.
restricted page must not enter default search without policy.
```

### 6.3 Review Cadence

| Page Type | Default Review After |
| --- | --- |
| runbook | 90 days |
| system | 180 days |
| decision | 365 days unless decision is explicitly time-bound |
| glossary | 365 days |
| practice | 180 days |
| learning | no forced expiry, but can be archived |
| mirrored | follows source sync policy |

## 7. Privacy And Sensitive Content

### 7.1 Sensitivity Levels

```text
internal: normal team-internal content
restricted: limited audience or team-specific sensitive content
confidential: high-sensitivity content, not default searchable/exportable
```

### 7.2 Ingest Protection

Before source or candidate promotion:

```text
check for API keys, tokens, passwords, secrets
check for private customer data patterns
check for personal data not needed for knowledge
check for confidential links or screenshots
confirm sensitivity and visibility
```

### 7.3 Search Policy

Default search should include:

```text
wiki/ active internal pages
personal/*/profile.md limited fields
indexes/
```

Default search should exclude:

```text
raw/
inbox/
confluence-mirror/
personal/*/raw
personal/*/wiki
restricted/confidential pages unless policy allows
presentation assets
```

### 7.4 Export Policy

OKF export should exclude confidential pages by default. Restricted pages require explicit export policy.

## 8. Query Safety

A query answer must:

```text
1. Read index or search results first.
2. Read full top pages, not snippets alone.
3. Check status, review_state, confidence, and source_refs.
4. Mark stale, disputed, superseded, low-confidence, or non-production pages.
5. Cite page path and source refs.
6. Return unknown when evidence is missing.
7. Suggest candidate creation when a durable knowledge gap is found.
```

A query answer must not:

```text
1. Treat raw source as formal wiki unless explicitly asked for evidence.
2. Treat candidate as formal truth.
3. Treat Confluence mirror as formal truth.
4. Hide lifecycle warnings.
5. Use confidential pages without permission.
```

## 9. Automation Safety

### 9.1 Allowed Early Automation

```text
generate index
generate review queue
generate search corpus
generate graph sidecars
generate OKF export
create candidate from source
create PR-ready patch
open review item
```

### 9.2 Disallowed Early Automation

```text
auto-merge formal wiki changes
auto-delete raw sources
auto-promote personal notes
auto-export restricted pages
auto-resolve contradictions without human owner
```

### 9.3 Automation Audit

Every automation event should be logged with:

```json
{
  "event_id": "evt_<id>",
  "event_type": "candidate.created",
  "actor": "agent:<name>",
  "target": "candidate:<slug>",
  "source_refs": ["raw:<category>:<source-id>"],
  "created_at": "YYYY-MM-DDTHH:mm:ssZ",
  "result": "success | failed | needs-review"
}
```

## 10. Operational Metrics

Track these metrics once real usage begins:

| Metric | Purpose |
| --- | --- |
| Active pages count | Knowledge base size |
| Pages without source refs | Evidence quality |
| Pages past review_after | Staleness risk |
| Low-confidence active pages | Trust risk |
| Candidates awaiting review | Workflow backlog |
| Contradictions open | Semantic conflict |
| Query hit rate | Search usefulness |
| Unknown answer rate | Knowledge gap visibility |
| Stale misuse rate | Query safety |
| Owner response time | Governance health |

## 11. Final Governance Rule

The project should optimize for a boring, inspectable, auditable knowledge system.

A flashy graph or search demo is less valuable than a small set of pages that are source-backed, owner-reviewed, lifecycle-aware, and safe for agents to query.
