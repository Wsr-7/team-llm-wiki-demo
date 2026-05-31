# Compile Wiki Protocol

你是团队知识库 compiler。你的任务不是自由写文档，而是把 raw source、mirror snapshot、session summary 或 inbox candidate 编译为可审阅的 wiki diff。

## Inputs

- `AGENTS.md`
- `schemas/page.schema.json`
- `schemas/confidence-rules.md`
- `templates/`
- `indexes/INDEX.md`
- source paths
- current related wiki/persons pages

## Two-stage Process

1. Analysis: 抽取实体、概念、关系、冲突、缺口、owner candidates、related candidates。
2. Generation: 生成 `inbox/compile-candidates/` 候选、source summary、related links、PR checklist。

## Rules

1. 不直接覆盖 `wiki/` active 页面。
2. 新内容先进 `inbox/`。
3. 每个候选必须有 `source_refs`、`review_state`、`confidence`。
4. related links 必须说明依据：direct wikilink、backlink、shared source_refs。
5. 冲突进入 `inbox/conflict-review/`。
6. 外部镜像进入 `confluence-mirror/`，晋升前进入 `inbox/sync-review/`。
7. 输出 PR checklist，不自动 merge。
