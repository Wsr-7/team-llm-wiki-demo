# Current Architecture Review

> Scope: strict review of the current `team-llm-wiki-demo` repository.
> Review date: 2026-06-19.
> Review stance: LLM knowledge-base architecture review, not a code implementation task.

## 1. Executive Summary

The repository is best described as a Phase 0 prototype of a Git-backed team LLM Wiki. It is not yet a production knowledge-base system and not yet a retrieval-augmented QA system.

Its strongest architectural decision is the separation between evidence, candidates, and formal knowledge:

```text
raw/                  immutable source evidence, intended to be append-only
inbox/candidates/     AI-generated or human-proposed candidate knowledge
wiki/                 curated formal team knowledge after review
personal/<staff-id>/  personal profile and personal knowledge space
schemas/              structural contracts
prompts/              agent task protocols
templates/            page templates
indexes/              human-readable navigation and review summaries
graph/                future rebuildable relationship sidecars
logs/                 operation logs
```

This is directionally strong. It avoids the common mistake of building a pure RAG demo that repeatedly retrieves raw documents at query time without improving the knowledge base.

The main weakness is that many critical properties are currently documented but not enforced. In particular: raw immutability, real source hashing, branch protection, CI, stale review, index consistency, claim provenance, graph generation, and privacy-aware search are not yet implemented.

## 2. Current Architecture

### 2.1 Authority Model

The repository states that GitHub is the authority layer and that formal knowledge lives under `wiki/`. This is the correct high-level authority model.

However, current enforcement is incomplete:

- `.github/workflows/` does not contain active CI workflows.
- `docs/branch-protection.md` says branch protection is intended but not configured.
- `CODEOWNERS` still uses placeholder teams such as `@org/knowledge-admins` and `@org/payment-platform`.
- The current demo formal pages are already active, even though their body says they are not production guidance.

This means the authority model is currently a design declaration rather than an enforceable governance mechanism.

### 2.2 Knowledge Flow

Current intended flow:

```text
source material
  -> raw/<category>/<date-slug>/manifest.md + source.md
  -> prompts/ingest-source.md
  -> inbox/candidates/<candidate>.md
  -> prompts/compile-wiki.md
  -> prompts/prepare-wiki-patch.md
  -> PR review
  -> wiki/<type>/<page>.md
```

This is sound. The candidate layer is especially important because it prevents AI output from directly contaminating formal team knowledge.

### 2.3 Schema Pack

The repo defines a Schema Pack as:

```text
AGENTS.md + schemas/ + templates/ + prompts/
```

This is one of the strongest parts of the design. It gives agents a concrete contract: what to read, where to write, how to cite sources, and how to answer queries.

Current limitation: the schema pack is partly enforced by simple scripts, but the scripts do not yet fully validate the JSON Schema files, nested YAML, source hashes, lifecycle rules, or index consistency.

## 3. Implementation Findings

### 3.1 Local Check Results

The following checks were inspected or run:

```text
node scripts/check-frontmatter.ts      -> passed
node scripts/check-candidates.ts       -> passed
node scripts/check-person-files.ts     -> passed
node scripts/check-source-refs.ts      -> passed
node scripts/check-staff-id.ts         -> failed
node scripts/check-links.ts            -> failed
```

The failures are caused by `design-draft/` examples being included in global lint scope. Examples such as placeholder wikilinks and invalid sample staff IDs are treated as real repository data.

This is an architectural issue: the lint boundary does not match the knowledge boundary.

### 3.2 `design-draft/` And `html-ppt*` Should Be Excluded

The user clarified that `html-ppt-assets/` and `html-slide-design-scheme/` are presentation material used to explain and promote the project. They are not formal knowledge, not graph input, and not runtime content.

Recommended rule:

```text
Formal knowledge checks should scan:
  AGENTS.md
  schemas/
  templates/
  prompts/
  raw/
  confluence-mirror/
  personal/
  inbox/
  wiki/
  indexes/
  logs/
  scripts/

Formal knowledge checks should not scan:
  design-draft/
  design-draft/html-ppt-assets/
  design-draft/html-slide-design-scheme/
  future presentation or marketing material
```

### 3.3 Raw Source Hash Is Not Real Yet

Current manifest example:

```yaml
hash: "sha256:demo-payment-runbook-source-v1"
```

This is not a real source hash. As a result, `raw/` is not technically immutable or auditable yet.

Missing checks:

- `manifest.md` must exist for each source folder.
- `source.md` must exist for each source folder.
- `id` must match path conventions.
- `hash` must be a real SHA256 of `source.md`.
- Changing `source.md` must fail CI unless explicitly handled by a supersession or replacement flow.

### 3.4 Current YAML Parser Is Too Weak

`scripts/lib.ts` contains a small custom frontmatter parser. It handles basic scalars and simple arrays but is not reliable for nested YAML structures such as:

```yaml
origin:
  system: manual
  url: ""

aliases:
  github: ""
  email_hash: ""

owns:
  systems: []
  projects: []
```

Recommendation: replace the custom parser with a real YAML library and validate frontmatter with JSON Schema using a validator such as Ajv.

### 3.5 Formal Demo Page Has Semantic Conflict

The demo runbook is marked as:

```yaml
status: active
review_state: reviewed
confidence: 0.78
```

But the body says it is not production operational guidance and that demo data must be replaced before real use.

This is dangerous because a query agent should trust `active + reviewed` pages as current formal guidance. A demo-only page should not be active production knowledge.

Recommended fix:

```yaml
status: draft
review_state: unreviewed
confidence: 0.30
production_applicable: false
```

Or keep it outside `wiki/` until the governance flow is demonstrated without making it current guidance.

### 3.6 Index Is Manual And Can Drift

`indexes/INDEX.md` is manually maintained. There is no script proving that every formal wiki page is included, that deleted pages are removed, or that titles and IDs match frontmatter.

This will fail once the wiki has more than a few pages.

Required scripts:

```text
scripts/build-index.ts
scripts/check-index.ts
```

### 3.7 Lifecycle Fields Exist But Are Not Enforced

The repo already has fields such as:

```yaml
status:
review_state:
confidence:
verified_at:
review_after:
supersedes:
superseded_by:
```

But there is no check for:

- `review_after` expiration.
- active pages citing superseded pages without warning.
- disputed pages having confidence above the allowed threshold.
- stale pages being treated as current guidance.
- review queue generation.

Required scripts:

```text
scripts/check-review-after.ts
scripts/build-review-queue.ts
scripts/check-superseded-references.ts
scripts/check-confidence-rules.ts
```

### 3.8 Source References Are Page-Level Only

Current `source_refs` point to source IDs only:

```yaml
source_refs:
  - raw:runbooks:2026-06-01-demo-payment-runbook
```

This is acceptable for Phase 0, but insufficient for scalable trust. It cannot answer which source line supports which claim.

Recommended next layer:

```yaml
claim_refs:
  - claim_id: claim:payment-failover:primary-degraded-before-backup
    source_ref: raw:runbooks:2026-06-01-demo-payment-runbook
    path: raw/runbooks/2026-06-01-demo-payment-runbook/source.md
    start_line: 3
    end_line: 3
    quote_hash: sha256:<hash-of-evidence-snippet>
```

### 3.9 Search And Graph Are Still Future Design

Current repo has `graph/README.md`, `scripts/related.ts`, and Phase 3/4 design drafts. But there is no production-ready search corpus, chunk manifest, query evaluation set, graph sidecar, or graph visualization.

This is fine for Phase 0, but the repo should not yet be described as a searchable or graph-aware knowledge system.

## 4. Current Strengths

1. Clear authority layer: Git repository as durable knowledge authority.
2. Proper separation: raw, candidate, formal wiki, personal, mirror.
3. Agent protocol exists in `AGENTS.md`.
4. Phase plan is incremental instead of platform-first.
5. Identity rule uses stable staff IDs rather than names or emails.
6. Confluence mirror is correctly separated from formal knowledge.
7. Query rules require reading index first and citing sources.
8. Related-page rules are explainable and intentionally conservative.

## 5. Current Weaknesses

1. Lint scope includes presentation and design-draft material.
2. Raw source immutability is not technically enforced.
3. Hash values are placeholders.
4. YAML parsing is too weak for nested metadata.
5. No real CI workflow exists.
6. Branch protection is documented but not enforced.
7. Demo pages are semantically inconsistent with active formal status.
8. Index can drift.
9. Review lifecycle is not enforced.
10. Source provenance is too coarse.
11. No claim-level confidence.
12. No privacy-aware search policy.
13. No OKF-compatible export profile.
14. Graph and search are mostly design intent.
15. Candidate quality is not measured.

## 6. Feasibility Assessment

The current design is feasible for a small engineering team if Phase 0 hardening is completed first.

Expected capability by scale:

| Scale | Required Capability |
| --- | --- |
| 0-100 pages | `INDEX.md`, strict CI, raw source hash, PR review |
| 100-500 pages | generated index, query eval, chunk manifest, search wrapper |
| 500-2000 pages | hybrid search, lifecycle review queue, graph sidecars |
| 2000+ pages | permission-aware search, OKF import/export, MCP/API gateway, dashboards |

The primary scaling risk is not retrieval. The primary risk is semantic corruption: stale claims, duplicate pages, weak provenance, and agent-generated text becoming trusted without review.

## 7. Review Conclusion

The repository is a solid Phase 0 skeleton. It has the correct governance-first instincts and should not be redirected into a simple RAG product.

The next step should be Phase 0 hardening:

```text
1. Fix lint boundaries.
2. Make raw source hashing real.
3. Introduce real YAML and JSON Schema validation.
4. Add CI and branch protection.
5. Fix demo page status semantics.
6. Generate and check indexes.
7. Enforce basic lifecycle rules.
8. Add source anchors and claim references.
```

Only after this should the project move to search, graph, MCP, automation, or OKF export.
