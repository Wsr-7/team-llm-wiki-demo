---
owner: staff:00000000
updated: YYYY-MM-DD
# verified (optional): the date this procedure was last executed successfully
# for real — distinct from `updated` (text edits). Gardening flags runbooks
# whose verified/updated is older than 90 days.
# verified: YYYY-MM-DD
sources:
  - https://REPLACE-with-ticket-or-page-url
tags: []
---

# Runbook: <operation name>
<!-- 标题: Runbook: <操作名称> -->

<!-- One-line summary: what this runbook lets you do safely. Body must be English.
     一句话摘要: 这个 runbook 让你安全地完成什么操作。 -->

## When to use
<!-- 适用场景: When to run this — and when NOT to (misuse is worse than no use).
     什么情况下执行; 什么情况下【不要】执行。 -->

## Preconditions
<!-- 前置条件: Permissions, tools, time window, who to notify (staff:########).
     权限、工具、时间窗口、需要通知谁。 -->

## Steps
<!-- 步骤: One action per step + expected result / verification;
     mark risky steps [approval required] or [irreversible].
     Evidence markers: tag load-bearing steps with [E1], [E2], … pointing to
     the matching numbered excerpt in "Source excerpts" — the reviewer must be
     able to see WHY this step is what it is.
     每步一个动作 + 预期结果/验证方式; 高危步骤标注; 关键步骤加 [E#] 指向来源摘录编号。 -->

1. … [E1]
   - verify: …

## Rollback
<!-- 回滚: How to back out if step N fails. If there is no rollback path, say so and state the consequence.
     执行到第 N 步失败时如何回退; 没有回滚路径就明说并标注后果。 -->

## Escalation
<!-- 升级路径: Who to call when stuck/timed out: staff:######## and the escalation order.
     卡住/超时找谁及升级顺序。 -->

## Source excerpts
<!-- 来源摘录: Verbatim evidence behind the steps (key passages, incident conclusions),
     numbered so steps can reference them with [E#].
     步骤依据的证据原文, 编号供正文 [E#] 引用。 -->

- [E1] > … (source: <link or ticket>)
