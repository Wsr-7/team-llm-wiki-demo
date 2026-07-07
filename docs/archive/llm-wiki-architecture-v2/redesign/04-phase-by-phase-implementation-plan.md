# Phase-By-Phase Implementation Plan

> Purpose: a more complete step-by-step implementation plan from Phase 0 onward.
> Principle: do not add smarter retrieval before the knowledge base becomes trustworthy.

## Phase Overview

| Phase | Name | Main Outcome |
| --- | --- | --- |
| Phase 0 | Baseline Hardening | Existing skeleton becomes checkable and CI-enforced |
| Phase 0.5 | Lifecycle And Provenance | Source hashes, review queues, claim refs, confidence rules |
| Phase 1 | Minimum Usable Team Wiki | Real raw-to-candidate-to-wiki workflow with owner review |
| Phase 2 | Search And Query Evaluation | Search corpus, chunks, query eval, safe query workflow |
| Phase 3 | Graph And Impact Navigation | Deterministic graph sidecars and related/impact queries |
| Phase 4 | OKF Interoperability | Generated OKF-compatible bundle and static viewer path |
| Phase 5 | Automation And Crystallization | Event logs, session crystallization, automated PR proposals |
| Phase 6 | Platform Interface | Read-only MCP/API gateway and dashboards |

## Phase 0: Baseline Hardening

### Goal

Make the current repository internally consistent, enforceable, and safe to evolve.

### Step 0.1: Define Formal Check Scope

Tasks:

```text
1. Create a central path policy in scripts/lib/paths.ts.
2. Include only formal knowledge and control paths in normal checks.
3. Exclude design-draft and html-ppt related content from formal checks.
4. Add a separate docs check only if needed.
```

Acceptance criteria:

```text
npm run check does not fail because of presentation assets or design examples.
Formal checks do not ignore real wiki/raw/inbox/schema issues.
```

### Step 0.2: Replace Frontmatter Parser

Tasks:

```text
1. Add a real YAML parser.
2. Add JSON Schema validator.
3. Refactor check-frontmatter, check-candidates, check-person-files, check-source-refs to use shared parser.
4. Validate nested frontmatter correctly.
```

Acceptance criteria:

```text
Nested frontmatter structures are parsed correctly.
Invalid schema fails deterministically.
Existing demo files either pass or intentionally fail with clear errors.
```

### Step 0.3: Add Real Source Manifest Check

Tasks:

```text
1. Implement scripts/check-source-manifests.ts.
2. Validate manifest/source pair existence.
3. Validate id/path conventions.
4. Compute real sha256 for source.md.
5. Fail if manifest hash does not match source.md.
```

Acceptance criteria:

```text
Every raw source has valid manifest.md and source.md.
Every manifest has a real source hash.
```

### Step 0.4: Fix Demo Page Status Semantics

Tasks:

```text
1. Decide whether demo pages remain in wiki/.
2. If yes, mark them draft or production_applicable=false.
3. Ensure query rules warn about non-production pages.
```

Acceptance criteria:

```text
No page marked active/reviewed can simultaneously say it is not real operational guidance unless query rules recognize production_applicable=false.
```

### Step 0.5: Add CI Workflow

Tasks:

```text
1. Add .github/workflows/lint.yml.
2. Run npm run check.
3. Document local and CI commands.
```

Acceptance criteria:

```text
PRs cannot merge if checks fail.
```

### Step 0.6: Replace Placeholder CODEOWNERS

Tasks:

```text
1. Replace @org placeholders with real GitHub teams or documented placeholders for demo only.
2. Separate schema/admin ownership from domain ownership.
```

Acceptance criteria:

```text
CODEOWNERS can be activated in the target GitHub org without silent mismatch.
```

### Step 0.7: Add Branch Protection Instructions

Tasks:

```text
1. Update docs/branch-protection.md with exact required settings.
2. Include required CI check names.
3. Include CODEOWNERS review requirement.
```

Acceptance criteria:

```text
A repository admin can configure branch protection from the document without guessing.
```

## Phase 0.5: Lifecycle And Provenance Hardening

### Goal

Prevent the wiki from becoming a stale or unverifiable document pile.

### Step 0.5.1: Build And Check Index

Tasks:

```text
1. Implement scripts/build-index.ts.
2. Implement scripts/check-index.ts.
3. Generate indexes/INDEX.md from wiki frontmatter.
4. Mark stale/superseded/draft pages explicitly.
```

Acceptance criteria:

```text
Every wiki page appears in generated index.
Index entries match page title, id, status, and type.
Manual drift is detected.
```

### Step 0.5.2: Build Review Queue

Tasks:

```text
1. Implement scripts/check-review-after.ts.
2. Implement scripts/build-review-queue.ts.
3. Detect expired review_after.
4. Detect missing owners.
5. Detect low-confidence active pages.
6. Detect disputed pages.
```

Acceptance criteria:

```text
indexes/REVIEW_QUEUE.md can be generated from repo state.
Expired active pages are visible in review queue.
```

### Step 0.5.3: Enforce Confidence Rules

Tasks:

```text
1. Implement scripts/check-confidence-rules.ts.
2. Encode confidence-rules.md as machine-checkable constraints.
3. Fail hard violations.
4. Warn soft violations.
```

Acceptance criteria:

```text
review_state=disputed cannot have confidence above 0.60.
active pages require source_refs.
superseded pages require superseded_by.
```

### Step 0.5.4: Add Claim References For High-Risk Pages

Tasks:

```text
1. Add schemas/claim-ref.schema.json.
2. Update runbook and decision templates with optional claim_refs.
3. Add examples for one runbook claim.
4. Add script to validate claim refs point to existing sources and line ranges.
```

Acceptance criteria:

```text
At least one runbook has a valid claim_ref.
Claim refs validate against source path and line range.
```

### Step 0.5.5: Add Supersession Review

Tasks:

```text
1. Implement scripts/check-superseded-references.ts.
2. Add template for supersession notice.
3. Add prompt for supersede-page or extend prepare-wiki-patch.
```

Acceptance criteria:

```text
Active pages cannot use superseded pages as current guidance without an explicit historical note.
```

### Step 0.5.6: Add Contradiction Review

Tasks:

```text
1. Add inbox/reviews/contradictions/.gitkeep.
2. Add templates/contradiction-review.md.
3. Add prompts/resolve-contradiction.md.
```

Acceptance criteria:

```text
A contradiction can be represented without directly editing active wiki pages.
```

## Phase 1: Minimum Usable Team Wiki

### Goal

Use the system for real team knowledge with a manually controlled loop.

### Step 1.1: Add Real Source Material

Tasks:

```text
1. Select 3-5 real internal sources that are safe to store in the repo.
2. Add them under raw/ with real manifests.
3. Run source checks.
```

Acceptance criteria:

```text
At least 3 real source folders pass source manifest validation.
```

### Step 1.2: Run Ingest And Compile Manually

Tasks:

```text
1. Use prompts/ingest-source.md to create candidates.
2. Use prompts/compile-wiki.md to produce Wiki Proposal sections.
3. Add quality notes and open questions.
```

Acceptance criteria:

```text
At least 3 candidates exist with Source Understanding and Wiki Proposal sections.
```

### Step 1.3: Prepare PR-Ready Wiki Patches

Tasks:

```text
1. Use prepare-wiki-patch protocol.
2. Create or update formal wiki pages.
3. Update generated index and review queue.
4. Run all checks.
```

Acceptance criteria:

```text
At least 2 formal wiki pages are merged through PR review.
```

### Step 1.4: Establish Owner Review Habit

Tasks:

```text
1. Assign real owners.
2. Require owner approval for domain pages.
3. Record unresolved questions in inbox/reviews.
```

Acceptance criteria:

```text
No active formal page has placeholder owner.
```

### Step 1.5: Query Protocol Trial

Tasks:

```text
1. Ask 10 real team questions.
2. Answer using query-wiki protocol.
3. Record unknowns and candidate opportunities.
```

Acceptance criteria:

```text
Answers cite wiki pages and source refs.
Unknowns produce candidate or source suggestions.
```

## Phase 2: Search And Query Evaluation

### Goal

Move from browsing wiki pages to evaluated query support.

### Step 2.1: Create Query Evaluation Set

Tasks:

```text
1. Add indexes/QUERY_EVAL.md.
2. Include 20-50 representative questions.
3. For each question, list expected page ids and must-not-use pages.
```

Acceptance criteria:

```text
Search changes can be evaluated against a stable query set.
```

### Step 2.2: Build Search Corpus

Tasks:

```text
1. Implement build-search-corpus.ts.
2. Include wiki pages, personal profiles, and indexes.
3. Exclude raw, inbox, personal raw/wiki, and mirror by default.
4. Attach status, review_state, confidence, owners, tags, and source_refs.
```

Acceptance criteria:

```text
indexes/search/corpus.jsonl is generated and deterministic.
```

### Step 2.3: Build Chunk Manifest

Tasks:

```text
1. Implement build-chunks.ts.
2. Split pages by headings.
3. Generate stable chunk ids.
4. Track hash and source metadata.
```

Acceptance criteria:

```text
indexes/search/chunks.jsonl is generated and deterministic.
```

### Step 2.4: Implement Search Wrapper

Tasks:

```text
1. Implement scripts/search.ts.
2. Start with lexical search and rg fallback.
3. Return ranked results with page/chunk metadata.
```

Acceptance criteria:

```text
A query returns structured results with status/confidence/source metadata.
```

### Step 2.5: Evaluate Search

Tasks:

```text
1. Implement evaluate-search.ts.
2. Measure hit@5.
3. Measure stale/superseded misuse.
4. Measure unknown correctness manually or semi-automatically.
```

Acceptance criteria:

```text
Search has a baseline score before vector search is introduced.
```

### Step 2.6: Add Hybrid Search Later

Tasks:

```text
1. Add vector search only after lexical baseline exists.
2. Add graph seed results after graph sidecars exist.
3. Fuse lexical, vector, and graph results with reciprocal rank fusion.
```

Acceptance criteria:

```text
Hybrid search improves query eval without increasing stale misuse.
```

## Phase 3: Graph And Impact Navigation

### Goal

Generate deterministic graph sidecars and support impact/related queries.

### Step 3.1: Export Nodes

Tasks:

```text
1. Implement export-nodes.ts.
2. Include wiki pages, personal profiles, and source manifests.
3. Include type, title, path, status, confidence, owners.
```

Acceptance criteria:

```text
graph/nodes.jsonl can be rebuilt from repo state.
```

### Step 3.2: Export Edges

Tasks:

```text
1. Implement export-edges.ts.
2. Generate owns, maintains, wikilink, backlink, shared_source, related_to, supersedes.
3. Every edge includes reason and evidence.
```

Acceptance criteria:

```text
graph/edges.jsonl contains only explainable edges.
```

### Step 3.3: Add Graph Report

Tasks:

```text
1. Generate graph/graph-report.md.
2. Report orphan pages, missing backlinks, isolated owners, stale clusters.
```

Acceptance criteria:

```text
Graph health is visible without a graph database.
```

### Step 3.4: Add Static Graph Viewer

Tasks:

```text
1. Implement render-graph-html.ts.
2. Generate graph/viz.html.
3. Support filtering by type, status, owner, confidence.
```

Acceptance criteria:

```text
A team member can inspect the graph locally without a backend.
```

## Phase 4: OKF Interoperability

### Goal

Export a portable OKF-compatible bundle without weakening internal schema.

### Step 4.1: Define OKF Export Profile

Tasks:

```text
1. Write schemas/okf-export-profile.md.
2. Map internal types to OKF type strings.
3. Map internal fields to x-team-* extensions.
```

Acceptance criteria:

```text
Export rules are documented and deterministic.
```

### Step 4.2: Implement Export

Tasks:

```text
1. Implement export-okf.ts.
2. Generate okf/index.md and okf/log.md.
3. Convert internal links to standard markdown links.
4. Exclude restricted/confidential pages unless policy allows.
```

Acceptance criteria:

```text
okf/ can be regenerated and passes OKF conformance basics.
```

### Step 4.3: Validate Export

Tasks:

```text
1. Check every OKF concept has frontmatter and type.
2. Check index/log structure.
3. Tolerate broken links according to OKF, but report them.
```

Acceptance criteria:

```text
OKF export is useful to external agents and viewers.
```

## Phase 5: Automation And Crystallization

### Goal

Move from manual-only workflows to controlled event-driven proposals.

### Step 5.1: Add Event Log

Tasks:

```text
1. Add logs/events.jsonl.
2. Add event.schema.json.
3. Log source.created, candidate.created, wiki.page.updated, query.answered, session.ended, review_after.expired.
```

Acceptance criteria:

```text
Automation actions are auditable.
```

### Step 5.2: Add Session Crystallization

Tasks:

```text
1. Add prompts/crystallize-session.md.
2. Convert useful session conclusions into candidates, not direct wiki updates.
3. Require source references or mark as manual/query/session origin.
```

Acceptance criteria:

```text
A useful discussion can become a candidate without bypassing review.
```

### Step 5.3: Add Automated PR Proposal

Tasks:

```text
1. Allow scripts or agents to prepare PR-ready patch sets.
2. Require all checks.
3. Require owner review.
4. Do not auto-merge.
```

Acceptance criteria:

```text
Automation reduces bookkeeping but does not remove human judgment.
```

## Phase 6: Platform Interface

### Goal

Expose the knowledge base safely after the repo workflow is stable.

Potential interfaces:

```text
read-only MCP server
internal search API
static documentation site
OKF bundle browser
owner/review dashboard
```

Acceptance criteria:

```text
External interfaces do not become the authority layer.
All answers remain traceable to wiki pages and source refs.
Permission boundaries are enforced.
```

## Final Implementation Rule

Each phase must leave the system in a working state. Do not start the next phase if the previous phase cannot pass checks and produce useful reviewed knowledge.
