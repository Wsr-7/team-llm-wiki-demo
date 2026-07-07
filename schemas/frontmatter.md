# Wiki 页面 Frontmatter 规则

适用范围：`wiki/**/*.md`（含 `wiki/glossary.md`）。`inbox/` 条目**没有** frontmatter 要求。

## 字段总表

```yaml
---
owner: staff:12345678                  # 必填
updated: 2026-07-07                    # 必填
sources:                               # 条件必填 (见下)
  - https://jira.company.com/browse/PAY-1234
  - https://confluence.company.com/pages/123456 (moved to .../789, 2026-07)
status: needs-review                   # 可选, 枚举: needs-review | superseded
superseded_by: wiki/runbooks/payment-failover-v2.md   # status: superseded 时必填
tags: [payment, oncall]                # 可选
---
```

允许的字段**只有以上六个**。新增字段需先修改本文档（见 `schemas/README.md` 的修改规则），`check.ts` 会拒绝未知字段。

## 字段语义

| 字段 | 必填 | 规则 |
| --- | --- | --- |
| `owner` | 是 | `staff:########`（8 位 staff-id），必须存在于 `team/people.md`。`staff:00000000` 是系统占位符，出现在正式页面会触发 warning，应尽快替换为真实负责人 |
| `updated` | 是 | `YYYY-MM-DD`，最后一次**实质确认或修改**的日期。只改错别字不用更新；确认"内容仍然正确"应该更新 |
| `sources` | 条件 | `wiki/troubleshooting|runbooks|decisions/` 下必填非空；其它类型强烈建议。条目为 URL 或 ticket 号；纯经验总结无外部来源时，在正文声明"经验总结，无外部来源" 并在此处填 ticket/PR 亦可 |
| `status` | 否 | 缺省 = 现行有效（这是常态）。`needs-review` = 存疑/待确认/有未裁决冲突；`superseded` = 已被取代，agent 不得作为现行指导引用 |
| `superseded_by` | 条件 | `status: superseded` 时必填，repo 内相对路径，目标文件必须存在 |
| `tags` | 否 | 小写短词，用于 grep 命中率，不建受控词表（园艺时合并同义 tag） |

没有的字段及理由：`confidence`（无法校准的伪精度，用 status 三态）、`type`（目录即类型）、`id`（路径即 id）、`created_at`（git log）、`review_state`（并入 status）、`visibility`（repo 权限即边界）。

## status 与信任模型

```text
信任级别 (agent 引用时的处理):
  wiki/ 无 status        → 现行有效, 直接引用
  wiki/ needs-review     → 可引用, 必须附带"此页待确认"警告
  wiki/ superseded       → 不得作为现行指导, 顺 superseded_by 找替代页
  inbox/                 → unverified, 引用必须声明未经审核
```

多页冲突时的裁决顺序见 `AGENTS.md` → "Answering questions" 第 4 条。

## sources 约定（含链接失效处理）

1. **链接为主，摘录为辅**：sources 提供可点击的核查通道；页面正文的"来源摘录"小节保存关键证据原文（报错原文、步骤依据、决策原话）。重要性越高，摘得越多。
2. **失效注记**：外链被移动/删除时不删条目，追加注记——
   `(moved to <new-url>, YYYY-MM)` 或 `(dead link as of YYYY-MM, excerpt preserved in page)`。
3. **易失来源**（聊天记录、口述、会议）：原文粘进 inbox 条目；compile 成正式页后精华进"来源摘录"，git 历史永久保留完整原文。sources 可写 `git-history: inbox/YYYY-MM-DD-<slug>.md`。
4. **禁止**：整页复制外部文档、粘贴凭证/客户数据。

## 页面类型分类法（目录即类型）

| 目录 | 类型 | 回答的问题 | 模板 |
| --- | --- | --- | --- |
| `wiki/troubleshooting/` | 排障 | 出了 X 问题怎么定位和解决？ | `templates/troubleshooting.md` |
| `wiki/runbooks/` | 操作手册 | 如何安全地执行 X 操作？ | `templates/runbook.md` |
| `wiki/systems/` | 系统 | X 系统是什么、边界、依赖、找谁？ | `templates/system.md` |
| `wiki/decisions/` | 决策 | 为什么当初选了 X？ | `templates/decision.md` |
| `wiki/concepts/` | 概念 | X（领域概念）是什么、为什么重要？ | `templates/concept.md` |
| `wiki/guides/` | 指南 | 怎么做 X（流程/实践/how-to）？ | `templates/guide.md` |
| `wiki/glossary.md` | 术语 | X 这个词在团队里指什么？ | 文件内自带条目格式 |

页面必须放在上述目录内（`check.ts` 强制）。需要子目录按域分组时可自由创建（如 `wiki/runbooks/payment/`）。

v2 旧分类的去向：`overview` → README/INDEX 承担；`team` → `team/people.md`；`project` → systems 或 decisions；`practice`、`learning` → guides；`mirrored` → 取消（Confluence 策略见 docs/llm-wiki-architecture-v3/02 §9）。

## 正文纪律

- 30 秒可扫读；一页只回答一个问题；超过 200 行拆页。
- 首行是 `# 标题`（INDEX 生成依赖它）；标题下第一段是一句话摘要（会进 INDEX）。
- 页面互链用相对路径 markdown 链接（`check.ts` 校验有效性）。
