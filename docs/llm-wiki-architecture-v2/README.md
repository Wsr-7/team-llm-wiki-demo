# Team LLM Wiki Architecture Review And Redesign

> Created: 2026-06-19
> Scope: architecture review, external reference analysis, gap assessment, and redesigned implementation plan for `team-llm-wiki-demo`.

This directory is a design and review workspace. It is not formal team knowledge under `wiki/`.

The existing `design-draft/html-ppt-assets/` and `design-draft/html-slide-design-scheme/` content is presentation material used to explain and promote the LLM Wiki idea to team members. It is not part of the runtime graph, not part of the knowledge model, and should be excluded from formal wiki lint/search/graph construction.

## Document Map

### Review Archive

- `review/01-current-architecture-review.md` — complete review of the current repository architecture and implementation state.
- `review/02-external-reference-analysis.md` — analysis of Karpathy LLM Wiki, Rohit LLM Wiki v2, Google OKF, and Google knowledge-catalog.
- `review/03-gap-assessment-and-optimization.md` — gap matrix, priority classification, and optimization recommendations.

### Redesigned Architecture

- `redesign/01-new-design-principles.md` — new design thesis, goals, non-goals, and design principles.
- `redesign/02-system-architecture.md` — redesigned system architecture, diagrams, and runtime boundaries.
- `redesign/03-repository-structure-and-schema.md` — proposed repository layout, schema model, source model, claim model, graph model, and OKF export profile.
- `redesign/04-phase-by-phase-implementation-plan.md` — detailed step-by-step implementation plan from Phase 0 onward.
- `redesign/05-risk-governance-and-quality.md` — risk register, governance controls, quality gates, and operational safeguards.

## Recommended Reading Order

1. Read `review/01-current-architecture-review.md` to understand the current repo state.
2. Read `review/02-external-reference-analysis.md` to understand the external references.
3. Read `review/03-gap-assessment-and-optimization.md` to see what must change.
4. Read all files under `redesign/` as the proposed next-generation design.

## Key Conclusion

The current repo has the right core direction: Git repository as authority layer, raw sources separated from formal wiki, AI output isolated in candidates, and schema/prompt rules as the agent contract.

The main weakness is that several critical ideas are currently design intent rather than enforceable system behavior: raw immutability, real source hashing, CI gates, index consistency, review lifecycle, claim-level provenance, search evaluation, graph sidecars, privacy-aware indexing, and OKF-compatible export.

The redesign keeps the current direction but hardens it into a maintainable knowledge system.
