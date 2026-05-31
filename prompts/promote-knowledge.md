# Promote Knowledge Prompt

请将候选知识晋升为正式 wiki 草稿。

## Inputs

- candidate path
- target type
- owner staff-id

## Rules

1. 检查 `source_refs`。
2. 检查是否已有重复页面。
3. 选择正确模板。
4. 生成 `wiki/<type>/` 下的新页面或 patch proposal。
5. reviewer/owner 未明确确认时，confidence 不得高于 `0.75`。
6. 更新 `indexes/INDEX.md` 草稿。
7. 不删除候选源。
8. 输出 PR checklist。
