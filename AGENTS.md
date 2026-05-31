# Team KB Agent Protocol

## 权威层

GitHub repo 是知识库权威层。正式知识位于 `wiki/` 和 `persons/`。`indexes/`、`graph/`、`exports/`、`site/` 是派生层或辅助层。

## 身份规则

所有员工引用必须使用 `staff:########`。禁止使用姓名、邮箱、GitHub username、拼音作为人员主键。

## 写入规则

1. `raw/` 是原始来源，不修改原文。
2. AI 生成内容默认写入 `inbox/`。
3. `wiki/` 和 `persons/` 的正式修改必须通过 PR。
4. 每次写入必须包含 `source_refs`。
5. 候选页必须包含 `status`、`review_state`、`confidence`、`owners` 或 `owner_candidates`。
6. Confluence 等外部镜像先进 `confluence-mirror/`，要晋升必须进入 `inbox/sync-review/`。
7. 不得把 mirror、raw、inbox 内容直接混入正式主搜索。

## 查询规则

1. 先读 `indexes/INDEX.md`。
2. 再检索 `wiki/`、`persons/`、`indexes/`。
3. 回答必须引用页面路径或知识 ID。
4. 对 `stale`、`superseded`、`disputed` 或低 confidence 页面必须显式说明。
5. 如果知识库没有答案，输出 unknown，并建议创建 candidate。

## Compile 规则

`ingest-source` 只把单个来源标准化为候选材料。`compile-wiki` 把来源、候选和已有 wiki 编译成可审阅的 wiki diff。真正进入 `wiki/` 只能通过 `promote-knowledge`、PR、CI 和 owner review。

## Related 规则

Phase 1 只允许三种 related 信号：

- direct wikilink
- backlink
- shared source_refs

每条 related 必须输出 reason。
