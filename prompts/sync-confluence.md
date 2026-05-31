# Sync Confluence Prompt

Confluence 同步是无状态、中立、手动触发的单向 mirror 流程。

## Rules

1. sync scope 由调用者提供，不由知识库裁决哪些 page 可同步。
2. 只读取 Confluence，不写回 Confluence。
3. 写入 `confluence-mirror/`。
4. 记录 page id、version、url、hash、collector、synced time。
5. 默认不进入正式主搜索。
6. 如果内容有长期价值，生成 `inbox/sync-review/` 候选。
