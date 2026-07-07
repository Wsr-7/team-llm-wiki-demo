# Schemas

本目录是知识库的**文档化 schema**：完整的字段规则、分类法与示例，供人和 agent 阅读。

Schema 有三种形态，各司其职：

| 形态 | 位置 | 作用 |
| --- | --- | --- |
| 文档形态 | `schemas/*.md`（本目录） | 完整规则 + 语义解释 + 示例，人和 agent 读 |
| 可执行形态 | `scripts/check.ts` | 机器强制的子集，CI 阻断 |
| 引用形态 | `AGENTS.md` | 只引用本目录，不复制规则，避免漂移 |

## 文件

- [`frontmatter.md`](frontmatter.md) — wiki 页面 frontmatter 字段规则、status 语义、sources 约定、页面类型分类法（目录即类型）。
- [`person.md`](person.md) — `team/people.md` 人员路由表的条目规则。

## 修改规则

Schema 变更 = 契约变更，必须同时更新：本目录文档 → `scripts/check.ts` → 受影响的 `templates/`，并由 knowledge admin 审核 PR。**不要随手加字段**——每个新字段都要回答：它改进了信任、检索、所有权、生命周期中的哪一个？现有字段为什么不够？
