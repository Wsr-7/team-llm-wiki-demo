# Confidence Rules

V3 使用页面级 `confidence: 0.00-1.00`。它不是事实本身，而是 query 排序、过期降权和 review 队列的治理信号。

## Initial Scores

- `0.30-0.50`: 弱来源或单人陈述，只能作为 candidate。
- `0.50-0.75`: 有 `source_refs`，并通过知识管理员初审。
- `0.75-0.90`: 领域 owner review 通过，可作为 active 页面。
- `0.90-1.00`: 被 ADR、生产验证、审计或多源长期确认支持。

## Decay

- 到达 `review_after` 后未复审：每月降低 `0.05`，并设置 `review_state=needs-review`。
- 存在冲突：设置 `review_state=disputed`，confidence 不高于 `0.60`。
- 被替代：设置 `status=superseded`，查询时仅作历史依据。

## Phase 0 Rule

AI 可以建议 confidence。正式 active 页的 confidence 必须由 owner review 确认。
