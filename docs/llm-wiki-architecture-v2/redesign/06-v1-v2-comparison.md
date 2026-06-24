# Old Design Vs New Design Comparison

> Purpose: compare the original repo design / phase drafts with the redesigned architecture under `docs/llm-wiki-architecture-v2/redesign/`.
>
> Scope: system architecture, repository structure, schema model, phase plan, search, graph, OKF, lifecycle, governance, automation, and risk controls.

## 1. Executive Summary

The old design is a strong Phase 0 / MVP design for a Git-backed team LLM Wiki. It proves the core idea:

```text
raw source evidence -> AI/human candidate -> reviewed wiki page -> query/lint workflow
```

The new design does not reject that foundation. It hardens it into a long-running knowledge system by adding stronger boundaries, lifecycle rules, provenance, generated artifacts, quality gates, and phase-level acceptance criteria.

In short:

```text
Old design: prove that the LLM Wiki workflow can work.
New design: make the LLM Wiki trustworthy enough to keep working over time.
```

## 2. High-Level Positioning

| Dimension | Old Design | New Design |
| --- | --- | --- |
| Main identity | GitHub repo based team LLM Wiki | Governed knowledge codebase |
| Main objective | Demonstrate raw -> candidate -> wiki workflow | Build trustworthy, auditable, evolvable knowledge infrastructure |
| Primary design unit | Markdown page and prompt workflow | Knowledge object with lifecycle, provenance, policy, and derived projections |
| Main strength | Lightweight, understandable, good demo skeleton | Stronger production direction, clearer gates, better long-term health |
| Main weakness | Many rules are documented but not enforced | More complex, requires disciplined phased implementation |
| Agent role | Ingest, compile, query, lint under prompt protocol | Proposal engine, validator helper, search assistant, graph/search/export generator, but never silent authority |
| Source of truth | `wiki/` in Git repo | `wiki/` plus source evidence and governance metadata in Git repo |
| Derived artifacts | Future graph and indexes | Explicitly generated indexes, search corpus, graph sidecars, OKF export, event logs |

## 3. System Architecture Comparison

### 3.1 Old Architecture

The old system is centered around the core LLM Wiki pipeline:

```text
Sources
  -> raw/
  -> inbox/candidates/
  -> wiki/
  -> indexes/
  -> later graph/search/automation
```

Its main architectural boundaries are:

```text
raw/                 immutable source evidence
inbox/candidates/    proposed knowledge
wiki/                formal reviewed knowledge
personal/            personal knowledge and profile space
confluence-mirror/   external snapshot, not formal truth
indexes/             navigation and review queue
graph/               future graph sidecars
logs/                operation logs
```

This is directionally correct. The main gap is that the old architecture does not fully separate canonical content, proposal content, derived content, future interfaces, and presentation material.

### 3.2 New Architecture

The new architecture uses explicit layers:

```text
Layer 0: Source Evidence
  raw/, confluence-mirror/, external references

Layer 1: Proposal And Review
  inbox/candidates/, inbox/reviews/

Layer 2: Formal Team Knowledge
  wiki/, personal/*/profile.md

Layer 3: Control Plane
  AGENTS.md, schemas/, templates/, prompts/, scripts/, GitHub workflows

Layer 4: Derived Projections
  indexes/, graph/, search corpus, OKF export, logs/

Layer 5: Future Access Interfaces
  static viewer, MCP gateway, API, search service
```

### 3.3 Main Architecture Difference

| Topic | Old Design | New Design |
| --- | --- | --- |
| Canonical vs derived | Implied | Explicit |
| AI write boundary | Mostly prompt-defined | Explicit: AI can write candidates/reviews/derived artifacts, not silently merge formal wiki |
| Runtime interface boundary | Future idea | Separate layer after repo workflow matures |
| Presentation material | Not clearly excluded | `html-ppt*` explicitly treated as presentation/persuasion material, excluded from formal lint/search/graph |
| Graph/search authority | Future functionality | Derived projections only; canonical markdown/frontmatter remains authority |
| Automation authority | Future capability | Automation creates reviewable artifacts, not silent truth |

## 4. Repository Structure Comparison

### 4.1 Old Directory Structure

The old repo already has a good skeleton:

```text
raw/
confluence-mirror/
personal/
inbox/
wiki/
schemas/
templates/
prompts/
scripts/
indexes/
graph/
logs/
docs/
design-draft/
```

Old structure strengths:

```text
1. Clear raw/candidate/wiki split.
2. Personal space is separated from team truth.
3. Confluence mirror is not mixed into formal wiki.
4. Schema Pack exists through AGENTS.md + schemas + templates + prompts.
5. Later graph/index/log folders are anticipated.
```

Old structure weaknesses:

```text
1. design-draft and html-ppt related material are not clearly excluded from formal checks.
2. inbox/reviews is not typed into stale, contradictions, missing owner, low confidence, sensitive content.
3. graph/ is mostly a placeholder.
4. indexes/ has no search corpus or chunk manifest.
5. There is no okf/ export area.
6. logs/ lacks query, redaction, and event logs.
7. scripts/ has basic checks but not lifecycle/search/graph/export generators.
```

### 4.2 New Directory Structure

The new design keeps the old skeleton but expands it into operational zones:

```text
index.md                         # generated OKF-compatible root index, later phase
log.md                           # generated OKF-compatible root log, later phase
.github/workflows/               # CI checks
raw/                             # immutable source evidence
confluence-mirror/               # one-way snapshots
personal/                        # personal profile and non-formal personal knowledge
inbox/candidates/                # proposed knowledge
inbox/reviews/stale/             # review queue for stale pages
inbox/reviews/contradictions/    # contradiction review records
inbox/reviews/missing-owner/     # ownership issues
inbox/reviews/low-confidence/    # confidence issues
inbox/reviews/sensitive-content/ # privacy and sensitivity issues
wiki/                            # formal reviewed knowledge
schemas/                         # machine-readable and human-readable contracts
templates/                       # page and review templates
prompts/                         # agent task protocols
scripts/                         # validators and generators
indexes/INDEX.md                 # generated navigation
indexes/REVIEW_QUEUE.md          # generated review queue
indexes/QUERY_EVAL.md            # search evaluation set
indexes/search/corpus.jsonl      # generated search corpus
indexes/search/chunks.jsonl      # generated chunks
graph/nodes.jsonl                # generated graph nodes
graph/edges.jsonl                # generated graph edges
graph/backlinks.jsonl            # generated backlinks
graph/graph-report.md            # generated graph health report
graph/viz.html                   # static graph viewer
okf/                             # generated OKF-compatible bundle
logs/query.md                    # query audit
logs/redaction.md                # redaction audit
logs/events.jsonl                # automation and lifecycle events
docs/llm-wiki-architecture-v2/   # architecture review and redesign documents
```

### 4.3 Main Directory Difference

| Directory Area | Old Design | New Design |
| --- | --- | --- |
| `raw/` | Source folders with manifest/source | Same, but with strict hash and immutability checks |
| `inbox/reviews/` | General review area | Typed review queues for stale, contradiction, owner, confidence, sensitive content |
| `indexes/` | Manual navigation and review queue | Generated navigation, review queue, query eval, search corpus, chunks |
| `graph/` | Future sidecar placeholder | Generated nodes/edges/backlinks/report/static viewer |
| `okf/` | Not present | Generated interoperability export |
| `logs/` | Operation log | Operation, ingest, lint, query, redaction, event logs |
| `design-draft/html-ppt*` | Ambiguous in checks | Explicitly excluded as presentation material |
| `scripts/` | Basic check scripts | Validators plus generators for index, review queue, search, graph, OKF |

## 5. Schema Model Comparison

### 5.1 Old Page Schema

The old page schema is page-level and governance-aware:

```yaml
id: kb:<type>:<slug>
title: <title>
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

This is a good starting point. It can govern pages, but it cannot fully govern high-risk claims, search behavior, memory lifecycle, export policy, or automation events.

### 5.2 New Page Schema

The new schema keeps the old fields and adds lifecycle, memory, indexing, and provenance extensions:

```yaml
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

### 5.3 Claim Reference Difference

Old design:

```yaml
source_refs:
  - raw:runbooks:2026-06-01-demo-payment-runbook
```

New design:

```yaml
claim_refs:
  - claim_id: claim:payment:failover-requires-degradation-confirmation
    statement: "Failover requires degradation confirmation before switching providers."
    confidence: 0.78
    source_refs:
      - source_ref: raw:runbooks:2026-06-01-demo-payment-runbook
        source_path: raw/runbooks/2026-06-01-demo-payment-runbook/source.md
        start_line: 1
        end_line: 3
        quote_hash: sha256:<hash>
    last_confirmed_at: 2026-06-01
    contradiction_refs: []
```

Main difference:

```text
Old design: the page knows which source it came from.
New design: high-risk claims know exactly which source span supports them.
```

### 5.4 Candidate Schema Difference

Old candidate:

```yaml
candidate_origin: raw | personal | mirror | query | manual
candidate_intent: ingest | compile | promotion | sync
candidate_status: proposed | in_review | promoted | rejected | superseded
```

New candidate:

```yaml
candidate_origin: raw | personal | mirror | query | manual | session
candidate_intent: ingest | compile | promotion | sync | crystallize
candidate_status: proposed | in_review | promoted | rejected | superseded
quality:
  structure_score: 0.00
  citation_score: 0.00
  consistency_score: 0.00
  actionability_score: 0.00
  owner_clarity_score: 0.00
  overall: 0.00
quality_status: pass | needs-rewrite | needs-human-review
```

Main difference:

```text
Old design: candidate is an AI/human proposal buffer.
New design: candidate is a scored, reviewable, promotable knowledge proposal.
```

### 5.5 Source Manifest Difference

Old design has source manifests, but the demo hash is not a real SHA256 hash.

New design requires:

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

Main difference:

```text
Old design: source manifest exists.
New design: source manifest becomes a verifiable evidence contract.
```

## 6. Phase Plan Comparison

## 6.1 Old Phase Plan

The old plan is broadly:

| Phase | Old Focus |
| --- | --- |
| Phase 0 | Start and baseline repo skeleton |
| Phase 1 | Manual loop and minimum usable knowledge base |
| Phase 2 | Quality gates and PR checks |
| Phase 3 | Search and QA enhancement |
| Phase 4 | Graph and lifecycle governance |
| Phase 5 | Automation and enterprise integration |

The old sequence is reasonable, but some trust-critical items appear too late. For example, lifecycle, supersession, source hash, review queue, and claim-level provenance are foundational, but they were mostly treated as later governance capabilities.

## 6.2 New Phase Plan

The new plan is:

| Phase | New Focus | Key Outcome |
| --- | --- | --- |
| Phase 0 | Baseline Hardening | Existing skeleton becomes checkable and CI-enforced |
| Phase 0.5 | Lifecycle And Provenance | Source hashes, review queues, confidence rules, claim refs |
| Phase 1 | Minimum Usable Team Wiki | Real source -> candidate -> formal page workflow |
| Phase 2 | Search And Query Evaluation | Search corpus, chunks, query eval, safe query workflow |
| Phase 3 | Graph And Impact Navigation | Deterministic graph sidecars and related/impact queries |
| Phase 4 | OKF Interoperability | Generated OKF-compatible bundle |
| Phase 5 | Automation And Crystallization | Event logs, session crystallization, PR proposals |
| Phase 6 | Platform Interface | Read-only MCP/API, dashboard, static viewer, search API |

### 6.3 Main Phase Difference

| Topic | Old Plan | New Plan |
| --- | --- | --- |
| Quality gates | Phase 2 | Phase 0 and 0.5 |
| Lifecycle | Mostly Phase 4 | Phase 0.5 |
| Source hash | Not emphasized enough | Phase 0 |
| Claim-level provenance | Not explicit | Phase 0.5 |
| Search | Phase 3 | Phase 2, but only after query eval exists |
| Graph | Phase 4 | Phase 3, after lifecycle and search foundation |
| OKF | Not a formal phase | Phase 4 |
| Automation | Phase 5 enterprise integration | Phase 5 event-driven, PR-only automation |
| Platform/MCP | Mixed into later integration | Separate Phase 6 after repo workflow matures |

Core shift:

```text
Old plan: directories -> workflow -> PR checks -> search -> graph -> automation.
New plan: trust -> provenance -> lifecycle -> real workflow -> evaluated search -> graph -> interoperability -> automation -> platform.
```

## 7. Phase-By-Phase Detailed Comparison

### 7.1 Phase 0

| Aspect | Old Phase 0 | New Phase 0 |
| --- | --- | --- |
| Objective | Create baseline skeleton and demo | Harden the existing skeleton |
| Main work | Directories, README, AGENTS, schema, templates, prompts, demo pages | Formal path scope, real YAML parser, JSON Schema validation, source hash, CI, CODEOWNERS, branch protection, demo semantics |
| Success meaning | The repo looks like an LLM Wiki | The repo can reliably check itself |
| Key risk | Demo skeleton has unenforced rules | Scope/checks/source integrity become enforceable |

New Phase 0 tasks:

```text
1. Define formal check scope.
2. Exclude design-draft/html-ppt material from formal checks.
3. Replace custom YAML parser.
4. Add JSON Schema validation.
5. Add check-source-manifests.
6. Fix demo page status semantics.
7. Add CI workflow.
8. Replace placeholder CODEOWNERS.
9. Update branch protection instructions.
```

### 7.2 Phase 0.5

Old design has no explicit Phase 0.5.

New Phase 0.5 introduces lifecycle and provenance before the knowledge base grows:

```text
1. build-index.ts / check-index.ts
2. build-review-queue.ts
3. check-review-after.ts
4. check-confidence-rules.ts
5. check-superseded-references.ts
6. claim-ref schema and minimal examples
7. contradiction review template and prompt
```

Why it matters:

```text
If lifecycle and provenance arrive only after the wiki grows, the repository will already contain stale, weak, or untraceable knowledge.
```

### 7.3 Phase 1

| Aspect | Old Phase 1 | New Phase 1 |
| --- | --- | --- |
| Objective | Manual loop and minimal usable knowledge base | Real team usage with owner-reviewed formal pages |
| Source input | Demo or initial sources | 3-5 real safe internal sources |
| Candidate flow | Ingest and compile manually | Ingest, compile, quality notes, open questions |
| Formalization | PR-ready wiki patch | Owner-reviewed PR with generated index/review queue |
| Query trial | Basic query prompt | 10 real questions with unknown/candidate feedback loop |

Main difference:

```text
Old Phase 1 proves workflow mechanics.
New Phase 1 proves workflow usefulness on real knowledge.
```

### 7.4 Phase 2

| Aspect | Old Phase 2 | New Phase 2 |
| --- | --- | --- |
| Objective | Quality gates and PR checks | Search and query evaluation |
| Reason for change | Quality gates were too late | Quality gates move to Phase 0/0.5 |
| Main artifacts | CI, PR checks | QUERY_EVAL.md, corpus.jsonl, chunks.jsonl, search.ts, evaluate-search.ts |
| Search philosophy | Improve retrieval | Evaluate retrieval safety before vector/hybrid |

New Phase 2 does not immediately start with vector search. It starts with evaluation:

```text
1. Define representative questions.
2. Define expected page hits and must-not-use pages.
3. Generate corpus and chunks.
4. Build lexical/rg fallback search.
5. Measure hit@5 and stale misuse.
6. Add hybrid search only after baseline exists.
```

### 7.5 Phase 3

| Aspect | Old Phase 3 | New Phase 3 |
| --- | --- | --- |
| Objective | Search and QA enhancement | Graph and impact navigation |
| Reason for change | Search moved to Phase 2 | Graph now has its own focused phase |
| Main artifacts | QMD/vector/rerank/search | nodes.jsonl, edges.jsonl, backlinks.jsonl, graph-report.md, viz.html |
| Edge policy | Related rules exist | Every edge needs reason and evidence |

New graph principle:

```text
Markdown/frontmatter is canonical.
Graph sidecars are derived.
LLM-inferred edges must become candidates, not direct graph facts.
```

### 7.6 Phase 4

| Aspect | Old Phase 4 | New Phase 4 |
| --- | --- | --- |
| Objective | Graph and lifecycle governance | OKF interoperability |
| Reason for change | Lifecycle moved earlier, graph moved to Phase 3 | External portability becomes a separate phase |
| Main artifacts | Graph/lifecycle scripts | okf/, export-okf.ts, okf index.md, okf log.md, x-team metadata |

New OKF principle:

```text
Internal schema remains strict.
OKF export is a generated compatibility view.
Do not weaken internal governance for external compatibility.
```

### 7.7 Phase 5

| Aspect | Old Phase 5 | New Phase 5 |
| --- | --- | --- |
| Objective | Automation and enterprise integration | Automation and crystallization with audit |
| Automation model | Broad future integrations | Event log first, PR proposals only |
| Key artifacts | MCP/API/integrations | logs/events.jsonl, crystallize-session prompt, automated PR proposals |
| Safety stance | Not fully separated | Explicit no auto-merge, no silent formal updates |

New automation rule:

```text
Automation may create candidates, review items, reports, generated artifacts, and PRs.
Automation must not silently merge formal wiki changes.
```

### 7.8 Phase 6

Old design does not clearly separate a platform phase.

New Phase 6 introduces platform interfaces only after governance is stable:

```text
read-only MCP server
internal search API
static documentation site
OKF bundle browser
owner/review dashboard
```

Main principle:

```text
External interfaces are consumers of the repo, not authority layers.
```

## 8. Search Design Comparison

| Aspect | Old Search Design | New Search Design |
| --- | --- | --- |
| Main idea | Use QMD/BM25/vector/rerank later | Start with corpus, chunks, query eval, lexical baseline |
| Evaluation | Mentioned but not central | Required before hybrid search |
| Search corpus | Not explicitly structured | `indexes/search/corpus.jsonl` |
| Chunk manifest | Not explicit | `indexes/search/chunks.jsonl` |
| Query eval | Future design | `indexes/QUERY_EVAL.md` in Phase 2 |
| Result safety | Query prompt checks stale/confidence | Search results carry status/review_state/confidence/source_refs |
| Hybrid search | Planned | Added only after evaluated lexical baseline |

Main difference:

```text
Old design asks: how do we search better?
New design asks: how do we know search is safe and useful?
```

## 9. Graph Design Comparison

| Aspect | Old Graph Design | New Graph Design |
| --- | --- | --- |
| Status | Later-phase design | Dedicated derived projection phase |
| Canonical source | Implied markdown/frontmatter | Explicit markdown/frontmatter authority |
| Edge generation | Related links, backlinks, shared source refs, explicit related | Same, but every edge must have reason and evidence |
| LLM inferred edges | Not always clearly constrained | Must enter candidate/review first |
| Outputs | nodes/edges/backlinks | nodes/edges/backlinks + graph-report + static viz |
| Purpose | Relationship and related discovery | Impact navigation, graph health, related discovery, static inspection |

New edge example:

```json
{"from":"kb:runbook:payment-failover","to":"kb:system:payment-gateway","type":"runbook_for","reason":"explicit-frontmatter","evidence":["wiki/runbooks/payment/payment-failover.md"]}
```

Main difference:

```text
Old design plans a graph.
New design treats graph as an explainable, rebuildable, auditable projection.
```

## 10. OKF And Interoperability Comparison

| Aspect | Old Design | New Design |
| --- | --- | --- |
| OKF role | Not central | Dedicated Phase 4 export profile |
| Internal schema | Strict team schema | Still strict team schema |
| External compatibility | Not defined | Generated OKF-compatible bundle |
| Link style | Wiki paths / internal conventions | Standard markdown links in export |
| Metadata preservation | Internal-only | `x-team-*` extension fields |
| Export policy | Not defined | Restricted/confidential export policy |

Old design is internal-first. New design is internal-first plus export-compatible.

Key rule:

```text
Internal Team Wiki Schema -> OKF Export Profile
```

Not:

```text
Internal Team Wiki Schema = OKF Schema
```

## 11. Lifecycle And Confidence Comparison

| Aspect | Old Design | New Design |
| --- | --- | --- |
| Status | Has status field | Status enforced by checks |
| Review state | Has review_state | Review state tied to confidence rules |
| Confidence | Page-level score | Page-level plus claim-level for high-risk claims |
| Review expiration | `review_after` exists | `check-review-after` and generated review queue |
| Supersession | `supersedes`, `superseded_by` fields | Superseded reference checks and review workflow |
| Forgetting | Mentioned as confidence decay guidance | Memory policy and retention class proposed |
| Contradictions | Disputed pages/review queues | Typed contradiction review records and resolver prompt |

Main difference:

```text
Old design records lifecycle metadata.
New design operationalizes lifecycle metadata.
```

## 12. Governance And Risk Comparison

| Risk Area | Old Design | New Design |
| --- | --- | --- |
| Lint boundary | Too broad; design-draft can pollute checks | Formal path policy excludes presentation/design material |
| Raw mutation | Rule says do not rewrite raw | Real hash validation and source manifest check |
| AI hallucination | AI writes candidates first | Candidate quality score, owner review, source/claim gates |
| Stale pages | Query prompt should warn | Review queue generation and lifecycle checks |
| Sensitive content | Visibility/sensitivity fields | Secret scan, index policy, redaction log, export policy |
| Automation overreach | Future concern | PR-only automation and event audit |
| Index drift | Manual risk | Generated/checkable index |
| Graph false edges | Future risk | Deterministic edges only with reason/evidence |

Main difference:

```text
Old design knows the risks.
New design maps risks to controls, scripts, queues, and phase gates.
```

## 13. Automation Comparison

| Aspect | Old Automation | New Automation |
| --- | --- | --- |
| Position | Later enterprise integration | Later controlled automation after governance is stable |
| Trigger model | Broad future integrations | Explicit event model |
| Event log | Not central | `logs/events.jsonl` |
| Session crystallization | Mentioned later | Dedicated prompt and candidate flow |
| Merge behavior | Not fully specified | No auto-merge for formal knowledge |
| Output | Sync, MCP, API, PRs | Candidates, review items, generated artifacts, PR proposals |

New event types:

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

Main difference:

```text
Old design treats automation as capability expansion.
New design treats automation as auditable proposal generation.
```

## 14. Presentation Material Handling

The user clarified that `html-ppt-assets/` and `html-slide-design-scheme/` are presentation attempts for explaining and promoting the LLM Wiki idea to team members.

New design explicitly treats them as:

```text
presentation material
communication collateral
not formal wiki content
not graph input
not search corpus input
not source-ref checked content
not staff-id checked content
not broken-wikilink checked content
```

Recommended exclusion:

```text
design-draft/html-ppt-assets/
design-draft/html-slide-design-scheme/
```

Recommended broader caution:

```text
design-draft/ should not be scanned by formal wiki checks unless a dedicated design-doc check is intentionally created.
```

## 15. Ten Most Important Changes

1. New design adds Phase 0.5 for lifecycle and provenance hardening.
2. New design explicitly excludes `html-ppt*` presentation assets from formal knowledge processing.
3. New design requires real SHA256 source hashes instead of placeholder source hashes.
4. New design upgrades from page-level `source_refs` to high-risk claim-level `claim_refs`.
5. New design changes `INDEX.md` from manual navigation to generated and checkable navigation.
6. New design turns confidence rules into scripts and review queue items.
7. New design requires query evaluation before vector or hybrid search.
8. New design makes graph sidecars deterministic, explainable, and rebuildable.
9. New design adds an OKF export profile instead of forcing internal schema to become OKF.
10. New design makes automation event-driven, auditable, and PR-only.

## 16. What Should Not Change

The old design has several correct foundations that should be preserved:

```text
1. Git repository remains the authority layer.
2. Formal team knowledge remains under wiki/.
3. raw/ remains source evidence.
4. inbox/candidates/ remains the AI/human proposal buffer.
5. personal/ remains non-formal unless promoted.
6. confluence-mirror/ remains a one-way snapshot, not truth.
7. AGENTS.md + schemas + templates + prompts remain the Schema Pack.
8. staff:######## remains the canonical identity model.
9. AI should not silently write formal truth.
10. Related-page discovery should start with explainable signals.
```

The new design strengthens these foundations rather than replacing them.

## 17. Recommended Implementation Order

Do not implement the entire new design at once. Use this order:

```text
Step 1: Phase 0 hardening
  - formal path scope
  - exclude design-draft/html-ppt material from formal checks
  - real YAML parser
  - JSON Schema validation
  - real source manifest hash check
  - CI workflow
  - demo page status cleanup

Step 2: Phase 0.5 lifecycle and provenance
  - build-index/check-index
  - build-review-queue
  - check-review-after
  - check-confidence-rules
  - check-superseded-references
  - minimal claim refs for high-risk pages
  - contradiction review template

Step 3: Phase 1 real usage pilot
  - add 3-5 safe real sources
  - produce candidates
  - promote 2 formal pages through PR
  - answer 10 real questions

Step 4: Phase 2 search foundation
  - query eval set
  - search corpus
  - chunk manifest
  - lexical search wrapper
  - evaluate search before hybrid

Step 5: Phase 3 graph sidecars
  - nodes/edges/backlinks
  - graph report
  - static graph viewer

Step 6: Phase 4 OKF export
  - export profile
  - generated OKF bundle
  - export policy

Step 7: Phase 5 and 6 only after the repo workflow is stable
  - event logs
  - crystallization
  - automated PR proposals
  - read-only MCP/API/search/dashboard
```

## 18. Final Comparison Judgment

The old design is suitable for explaining the concept and proving the basic workflow.

The new design is suitable for turning the concept into a maintainable team knowledge system.

A compact summary:

```text
Old design = MVP skeleton + workflow demonstration.
New design = governance-first architecture + lifecycle hardening + evaluated retrieval + derived graph/export/automation layers.
```

The next practical engineering move should be to implement only Phase 0 and Phase 0.5 first. That gives the repo real trust guarantees without prematurely building vector search, graph visualizers, MCP servers, or automation platforms.
