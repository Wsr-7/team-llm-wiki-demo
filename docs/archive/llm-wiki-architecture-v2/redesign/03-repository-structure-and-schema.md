# Repository Structure And Schema Design

> Purpose: propose the next repository layout and schema model.

## 1. Proposed Repository Structure

```text
team-llm-wiki/
├── README.md
├── AGENTS.md
├── index.md                         # generated OKF-compatible root index, optional in early phases
├── log.md                           # generated OKF-compatible root log, optional in early phases
├── .github/
│   ├── CODEOWNERS
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/
│       ├── lint.yml
│       ├── knowledge-check.yml
│       └── export-check.yml
├── raw/
│   ├── docs/
│   ├── runbooks/
│   ├── incidents/
│   ├── meetings/
│   ├── code-chunks/
│   └── external/
├── confluence-mirror/
│   ├── manifest/
│   ├── pages/
│   └── glossary/
├── personal/
│   └── 12345678/
│       ├── profile.md
│       ├── raw/
│       └── wiki/
├── inbox/
│   ├── candidates/
│   └── reviews/
│       ├── stale/
│       ├── contradictions/
│       ├── missing-owner/
│       ├── low-confidence/
│       └── sensitive-content/
├── wiki/
│   ├── overview/
│   ├── glossary/
│   ├── concepts/
│   ├── teams/
│   ├── projects/
│   ├── systems/
│   ├── practices/
│   ├── runbooks/
│   ├── decisions/
│   ├── learning/
│   └── mirrored/
├── schemas/
│   ├── README.md
│   ├── frontmatter.md
│   ├── confidence-rules.md
│   ├── page.schema.json
│   ├── candidate.schema.json
│   ├── person.schema.json
│   ├── source-manifest.schema.json
│   ├── claim-ref.schema.json
│   ├── graph.schema.json
│   ├── event.schema.json
│   └── okf-export-profile.md
├── templates/
│   ├── page-system.md
│   ├── page-runbook.md
│   ├── page-decision.md
│   ├── page-learning.md
│   ├── page-glossary.md
│   ├── candidate.md
│   ├── contradiction-review.md
│   ├── source-manifest.md
│   └── person.md
├── prompts/
│   ├── ingest-source.md
│   ├── compile-wiki.md
│   ├── prepare-wiki-patch.md
│   ├── query-wiki.md
│   ├── lint-wiki.md
│   ├── sync-confluence.md
│   ├── resolve-contradiction.md
│   ├── crystallize-session.md
│   └── export-okf.md
├── scripts/
│   ├── lib/
│   │   ├── frontmatter.ts
│   │   ├── schema.ts
│   │   ├── paths.ts
│   │   └── hashes.ts
│   ├── check-staff-id.ts
│   ├── check-person-files.ts
│   ├── check-frontmatter.ts
│   ├── check-source-manifests.ts
│   ├── check-source-refs.ts
│   ├── check-candidates.ts
│   ├── check-links.ts
│   ├── check-index.ts
│   ├── check-review-after.ts
│   ├── check-confidence-rules.ts
│   ├── check-superseded-references.ts
│   ├── check-secrets.ts
│   ├── build-index.ts
│   ├── build-review-queue.ts
│   ├── build-search-corpus.ts
│   ├── build-chunks.ts
│   ├── search.ts
│   ├── evaluate-search.ts
│   ├── export-nodes.ts
│   ├── export-edges.ts
│   ├── render-graph-html.ts
│   ├── export-okf.ts
│   └── init-skeleton.ts
├── indexes/
│   ├── INDEX.md
│   ├── REVIEW_QUEUE.md
│   ├── QUERY_EVAL.md
│   └── search/
│       ├── corpus.jsonl
│       └── chunks.jsonl
├── graph/
│   ├── nodes.jsonl
│   ├── edges.jsonl
│   ├── backlinks.jsonl
│   ├── graph-report.md
│   └── viz.html
├── okf/
│   ├── index.md
│   ├── log.md
│   └── wiki/
├── logs/
│   ├── operations.md
│   ├── ingest.md
│   ├── lint.md
│   ├── query.md
│   ├── redaction.md
│   └── events.jsonl
└── docs/
    └── llm-wiki-architecture-v2/
```

## 2. Directory Responsibilities

| Directory | Responsibility | Canonical Or Derived | AI Direct Write |
| --- | --- | --- | --- |
| `raw/` | Immutable source evidence | Canonical evidence | Add only, no rewrite |
| `confluence-mirror/` | External one-way snapshots | Canonical external snapshot | Via sync only |
| `personal/` | Personal profile and non-formal knowledge | Personal boundary | Restricted |
| `inbox/candidates/` | Proposed knowledge | Proposal | Yes |
| `inbox/reviews/` | Review queues | Governance | Yes |
| `wiki/` | Formal reviewed team knowledge | Canonical team truth | PR only |
| `schemas/` | Structural contracts | Canonical control | Admin PR only |
| `templates/` | Page and review templates | Canonical control | Admin PR only |
| `prompts/` | Agent task protocols | Canonical control | Admin PR only |
| `scripts/` | Deterministic validators and generators | Control | PR only |
| `indexes/` | Navigation, review queue, search corpus | Derived | Generated PR |
| `graph/` | Relationship sidecars and viewer | Derived | Generated PR |
| `okf/` | OKF-compatible export | Derived | Generated only |
| `logs/` | Audit and event records | Append-oriented | Controlled append |
| `docs/` | Architecture and project documentation | Documentation | PR only |

## 3. Formal Page Schema

### 3.1 Required Fields

```yaml
id: kb:<type>:<slug>
title: <human readable title>
type: overview | glossary | concept | team | project | system | practice | runbook | decision | learning | mirrored
status: draft | candidate | active | stale | superseded | archived
review_state: unreviewed | reviewed | needs-review | disputed
confidence: 0.00
visibility: internal | restricted | confidential
owners:
  - staff:12345678
source_refs:
  - raw:<category>:<source-id>
related: []
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
```

### 3.2 Recommended Fields

```yaml
maintainers: []
reviewers: []
knowledge_sources: []
tags: []
verified_at: YYYY-MM-DD
review_after: YYYY-MM-DD
supersedes: []
superseded_by: []
production_applicable: true
memory_tier: semantic | procedural | episode | raw_observation
memory_policy:
  retention_class: durable | normal | transient
  decay_half_life_days: 180
index_policy:
  include_in_default_search: true
  allowed_roles: []
  redaction_required: false
claim_refs: []
```

### 3.3 Page ID Rule

Use stable IDs that do not depend on future file movement:

```text
kb:system:payment-gateway
kb:runbook:payment-failover
kb:decision:payment-provider-v2
kb:concept:checkout-error-baseline
```

File path can change. ID should not.

## 4. Source Manifest Schema

### 4.1 Required Fields

```yaml
id: raw:<category>:<yyyy-mm-dd-slug>
title: <title>
source_type: doc | runbook | incident | meeting | code-chunk | external | confluence
collector: staff:12345678
collected_at: YYYY-MM-DD
sensitivity: internal | restricted | confidential
hash: sha256:<real-source-md-hash>
status: captured | superseded | rejected
origin:
  system: manual | confluence | github | slack | meeting | external
  url: ""
```

### 4.2 Hash Rule

The hash must be computed from `source.md` bytes, not from the manifest.

If the source changes, do not edit it in place silently. Use one of these strategies:

```text
1. Create a new source folder with a new date and slug.
2. Mark the old source as superseded.
3. Create a review item explaining why the source changed.
```

## 5. Candidate Schema

### 5.1 Required Fields

```yaml
id: candidate:<slug>
candidate_origin: raw | personal | mirror | query | manual | session
candidate_intent: ingest | compile | promotion | sync | crystallize
candidate_status: proposed | in_review | promoted | rejected | superseded
source_refs: []
owner_candidates: []
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
```

### 5.2 Recommended Quality Fields

```yaml
quality:
  structure_score: 0.00
  citation_score: 0.00
  consistency_score: 0.00
  actionability_score: 0.00
  overall: 0.00
quality_status: pass | needs-rewrite | needs-human-review
```

### 5.3 Required Sections

```text
Source Understanding
Wiki Proposal
Review Notes
Decision Log
Quality Notes
Open Questions
```

## 6. Claim Reference Schema

Claim references are designed for high-risk facts, not every sentence.

```yaml
claim_refs:
  - claim_id: claim:<domain>:<slug>
    statement: <short normalized claim>
    confidence: 0.80
    source_refs:
      - source_ref: raw:<category>:<source-id>
        source_path: raw/<category>/<source-id>/source.md
        start_line: 10
        end_line: 12
        quote_hash: sha256:<hash>
    last_confirmed_at: YYYY-MM-DD
    contradiction_refs: []
```

## 7. Graph Schema

### 7.1 Node

```json
{"id":"kb:system:payment-gateway","type":"system","title":"Payment Gateway","path":"wiki/systems/payment/payment-gateway.md","status":"active","confidence":0.86,"owners":["staff:12345678"]}
```

### 7.2 Edge

```json
{"from":"kb:runbook:payment-failover","to":"kb:system:payment-gateway","type":"runbook_for","reason":"explicit-frontmatter","evidence":["wiki/runbooks/payment/payment-failover.md"]}
```

### 7.3 Allowed Edge Types In Early Phases

```text
owns
maintains
wikilink
backlink
shared_source
related_to
runbook_for
depends_on
supersedes
contradicts
```

Every edge must include:

```text
from
to
type
reason
evidence
```

## 8. Search Corpus Schema

Each chunk should carry enough metadata for safe answers:

```json
{
  "chunk_id": "kb:runbook:payment-failover#procedure-001",
  "page_id": "kb:runbook:payment-failover",
  "path": "wiki/runbooks/payment/payment-failover.md",
  "heading": "Procedure",
  "text_hash": "sha256:<chunk-hash>",
  "status": "active",
  "review_state": "reviewed",
  "confidence": 0.86,
  "visibility": "internal",
  "owners": ["staff:12345678"],
  "source_refs": ["raw:runbooks:2026-06-01-payment-failover"],
  "tags": ["payment", "failover"]
}
```

## 9. OKF Export Profile

Internal schema remains strict. OKF export is a generated compatibility view.

### 9.1 Internal To OKF Mapping

| Internal Field | OKF Field |
| --- | --- |
| `title` | `title` |
| `type` | mapped `type` such as `Playbook`, `System`, `Decision` |
| `summary` or first paragraph | `description` |
| `id` | `resource` or `x-team-id` |
| `updated_at` | `timestamp` |
| `tags` | `tags` |
| `status` | `x-team-status` |
| `confidence` | `x-team-confidence` |
| `owners` | `x-team-owners` |
| `source_refs` | `x-team-source-refs` |

### 9.2 Export Rule

The OKF export should:

- Use standard markdown links.
- Generate `index.md` and `log.md`.
- Preserve internal metadata under `x-team-*` extension fields.
- Exclude restricted/confidential pages unless export policy allows them.
- Never be hand-edited as canonical source.

## 10. Schema Evolution Rule

Schema changes must be treated like API changes:

```text
1. Update schema docs.
2. Update JSON Schema.
3. Update templates.
4. Update prompts.
5. Update validators.
6. Run migration or compatibility checks.
7. Require knowledge admin review.
```

Do not add fields casually. Every field should either improve trust, retrieval, ownership, lifecycle, interoperability, or automation.
