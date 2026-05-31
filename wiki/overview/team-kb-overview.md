---
id: kb:overview:team-kb
title: "Team Knowledge Base Overview"
type: overview
status: active
review_state: reviewed
confidence: 0.80
visibility: internal
owners:
  - staff:00000000
source_refs:
  - raw:sources/2026-05-31-demo-payment-failover
related:
  - kb:runbook:payment-failover
  - kb:system:payment-gateway
created_at: 2026-05-31
updated_at: 2026-05-31
review_after: 2026-08-31
---

# Team Knowledge Base Overview

## 摘要

本 repo 用于验证 GitHub repo 驱动的团队 LLM Wiki 知识库方案。

## 当前结论

- `raw/` 保存来源。
- `inbox/` 保存 AI 或人工整理出的候选知识。
- `wiki/` 保存正式团队知识。
- `persons/` 使用 8 位 staff-id 建立责任映射。
- `indexes/`、`logs/`、`graph/` 是可重建或审计辅助层。

## 相关页面

- [[kb:runbook:payment-failover]]
- [[kb:system:payment-gateway]]

## 来源与证据

- `raw:sources/2026-05-31-demo-payment-failover`
