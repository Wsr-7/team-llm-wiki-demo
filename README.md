# Team LLM Wiki

团队知识库：一个 git repo 管理的、**人和 AI Agent 都能直接读写**的团队知识库。
生产问题解决方案、troubleshooting、runbook、系统知识、决策记录、经验沉淀——都在这里。

- 正式知识在 [`wiki/`](wiki/)，只通过 PR 进入，可以放心引用。
- 目录入口：[`INDEX.md`](INDEX.md)（每页一行，脚本生成）。
- Agent 行为协议：[`AGENTS.md`](AGENTS.md)（Copilot / Claude Code / opencode 等任意 agent 通用）。

## 怎么查

- **用 AI**：在任意接入了本 repo 的 agent 里直接提问（Copilot Chat / Copilot Space / Claude Code / opencode）。agent 会按协议查 wiki 并给出带引用的回答；答不出会返回 `unknown` 并建议该补哪页。
- **不用 AI**：打开 [`INDEX.md`](INDEX.md) 找页面，或用 GitHub 网页搜索。

## 怎么贡献（两条路径）

| 路径 | 什么时候用 | 怎么做 | 成本 |
| --- | --- | --- | --- |
| **快速捕获** | 刚解决一个问题 / 一段值得记的讨论 / 一条经验 | 在 [`inbox/`](inbox/) 建一个文件 `YYYY-MM-DD-一句话.md`，写清上下文，直接 commit 到 main（inbox 允许免 PR）。也可以把材料丢给 agent，让它按 [`prompts/capture.md`](prompts/capture.md) 整理 | ≤ 5 分钟 |
| **正式页面** | 内容已成形，值得成为团队正式知识 | 复制 [`templates/`](templates/) 对应模板 → 填 frontmatter（规则见 [`schemas/frontmatter.md`](schemas/frontmatter.md)）→ 发 PR | 15–30 分钟 |

inbox 里的条目会在**双周园艺例会**上由 agent + 轮值园丁整理成正式页面，你不用管后续。

## 目录结构

| 路径 | 内容 |
| --- | --- |
| `wiki/troubleshooting/` | 生产问题：现象 → 根因 → 处置 |
| `wiki/runbooks/` | 操作手册：前置 → 步骤 → 验证 → 回滚 |
| `wiki/systems/` | 系统页：边界、依赖、负责人、已知坑 |
| `wiki/decisions/` | 决策记录（轻量 ADR） |
| `wiki/concepts/` | 领域概念与背景知识 |
| `wiki/guides/` | how-to 与团队实践 |
| `wiki/glossary.md` | 术语表 |
| `inbox/` | 未审快速捕获区（内容未验证） |
| `team/people.md` | staff-id ↔ GitHub ↔ 负责域 路由表 |
| `schemas/` `prompts/` `templates/` | 规则、任务协议、页面模板（控制面，改动需 admin 审核） |
| `docs/` | 本知识库自身的架构文档与历史归档 |

## 本地命令

```bash
npm run check         # 校验: frontmatter 必填/枚举/链接/owner/INDEX 新鲜度 (PR 必过)
npm run build-index   # 重新生成 INDEX.md (新增/移动/改标题后运行)
```

脚本零依赖，`node` 直接运行（Node 22.6+）。

## 治理

- 正式知识只经 PR；CODEOWNERS 与 branch protection 配置见 [`docs/branch-protection.md`](docs/branch-protection.md)。
- 双周园艺例会（30 分钟）：agent 按 [`prompts/gardening.md`](prompts/gardening.md) 产出整理 PR，轮值园丁审核合并。
- 设计文档与演进历史：[`docs/llm-wiki-architecture-v3/`](docs/llm-wiki-architecture-v3/)。
