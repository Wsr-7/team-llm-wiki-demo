# Ingest Source Prompt

请处理一个 raw source，把它标准化为可编译材料。

## Inputs

- source manifest path
- source content path
- target type candidates

## Rules

1. 读取 `AGENTS.md`、`schemas/`、`indexes/INDEX.md`。
2. 读取 raw source 与 manifest。
3. 搜索相关 wiki 页面，列出可能需要更新的页面。
4. 不直接修改 `wiki/` active 页面。
5. 在 `inbox/ingest-candidates/` 下生成候选。
6. 候选必须包含 `source_refs`、owner candidates、confidence 初始建议值。
7. 如果发现冲突，写入 `inbox/conflict-review/`。
8. 更新 `logs/ingest.md` 的 append-only 草稿条目。
