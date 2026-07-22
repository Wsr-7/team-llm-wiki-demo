# Loop State · team-llm-wiki

> worker / reviewer 每轮开工前先读本文件，收工时回填；人类可随时手改。

## 当前阶段

- v3 架构文档 01–07 已合入 main（PR #3，2026-07-16 merged）。
- 2026-07-23：`docs/llm-wiki-architecture-v3/08` 按发起人反馈修订为**单库分域**方案（domain 第二轴、域内自治清单、能/不能自定分界、新域 15 分钟 checklist；分库降为权限隔离附录 A）。分支 `design-20260723`，PR #5 待审阅。

## In progress

- 无。

## 待人工验证 / 决策

- 审阅并合并 design-20260723 → main 的 PR（08 文档）。
- 发起人按 07 清单推进阶段①-③（宣讲、people.md、CODEOWNERS、Jenkins J1）。
- 小组分库诉求出现时按 08 §3 触发器评估，不默认建库。

## Gate

- `npm run check`：wiki frontmatter / 链接 / 索引的可执行 schema 校验。
- `scripts/gate.ps1`：包装 `npm run check` 并附加 git 状态检查。审查 worker 产出前必跑。

## Lessons

- （一条一行，追加到这里）
