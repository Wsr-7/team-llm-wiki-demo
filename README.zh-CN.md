# Team LLM Wiki（中文版）

> English version: [README.md](README.md)
> 本文件是 README 的中文镜像，也是语言政策下唯一的中文正式文件；两份如有出入，以英文版为准。

团队知识库：一个 git 管理的、**人和 AI Agent 共同读写**的 wiki。生产问题解决方案、troubleshooting、runbook、系统知识、决策记录、经验沉淀——都在这里，经 PR 审核入库，任意 agent 均可消费。

## 目录

- [一分钟看懂运作方式](#一分钟看懂运作方式)
- [怎么查](#怎么查)
- [怎么贡献](#怎么贡献)
- [外部内容怎么进来confluence--jira--聊天记录](#外部内容怎么进来confluence--jira--聊天记录)
- [目录结构](#目录结构)
- [信任与证据模型](#信任与证据模型)
- [本地命令](#本地命令)
- [CI](#ci)
- [治理](#治理)
- [语言政策](#语言政策)
- [设计文档](#设计文档)

## 一分钟看懂运作方式

```text
捕获 (任何人, ≤5 分钟)            审核 (GitHub 原生)             消费 (任意入口)
─────────────────────            ─────────────────             ─────────────────
原始材料 ──► inbox/  ──────────►  Pull Request ──► wiki/ ─────► 人: INDEX/GitHub
(任意语言,    PR 自合,             (域 owner 审核    (已审核,     agent: 带引用回答,
 无格式要求)  零审批)               + CI 校验)        英文)       答不出 → 建页建议
```

- `inbox/` 是零门槛暂存区：无 frontmatter、无审核、语言随意。
- **PR 就是候选层**：审核意见、修改记录、拍板结论全在 PR 里。
- `wiki/` 是已审核的团队知识——agent 唯一可以不加警告直接引用的内容。
- 双周**园艺例会**（agent 起草、轮值园丁审核）把 inbox 条目编译成正式页面并报告过期内容。

## 怎么查

- **用 AI**：在任何接入本 repo 的 agent 里直接提问——Copilot Chat / Copilot Space、Claude Code、opencode，或挂了 [`prompts/query.md`](prompts/query.md) 的内部模型。agent 会读 [`INDEX.md`](INDEX.md)、grep `wiki/`、读页面全文后**带引用**回答；答不出会返回 `unknown` 并建议该补哪页。
- **不用 AI**：打开 [`INDEX.md`](INDEX.md)（每页一行）或用 GitHub 网页搜索。

Agent 入口（全部汇聚到 [`AGENTS.md`](AGENTS.md)）：`.github/copilot-instructions.md`（Copilot）、`CLAUDE.md`（Claude Code）、`AGENTS.md` 本身（opencode/Codex 及事实标准）。

## 怎么贡献

| 路径 | 什么时候用 | 怎么做 | 成本 |
| --- | --- | --- | --- |
| **快速捕获** | 刚解决一个问题 / 一段值得留的讨论 / 一条经验 | 建 `inbox/YYYY-MM-DD-<slug>.md` 写清上下文（任意语言、无 frontmatter），发 PR 后**自己合并**——inbox PR 零审批。也可以把材料丢给 agent（[`prompts/capture.md`](prompts/capture.md)） | ≤ 5 分钟 |
| **正式页面** | 内容已成形，该成为团队正式知识 | 复制 [`templates/`](templates/) 对应模板 → 填 frontmatter（[`schemas/frontmatter.md`](schemas/frontmatter.md)）→ 发 PR 给域 owner（[`team/people.md`](team/people.md)）审 | 15–30 分钟 |

inbox 条目不用跟进——园艺例会会把成熟的条目晋升进 `wiki/`（agent 起草、owner 批准）。

## 外部内容怎么进来（Confluence / Jira / 聊天记录）

你的职责只是**把内容送到 agent 面前**——转成 markdown 和结构化是 agent 的活。三条通道，从最省事排起：

1. **复制粘贴（覆盖约 90% 场景）**：打开 Confluence 页 → 全选 → 复制 → 粘贴进 agent 对话框。格式丢了没关系，agent 会按模板重新结构化。
2. **导出文件**：页面 `⋯` 菜单 → Export to Word/PDF（或 View Storage Format）→ 文件拖进对话，或存盘后把路径给 agent。
3. **Atlassian MCP**（公司批准的话）：在自己的 agent 客户端配一次，之后贴 URL 即可，agent 自己抓取。

两个约定：**截图/图片**不随粘贴进来——重要截图内容用文字转述进页面，原图靠 `sources:` 链接回 Confluence 查看；**不做整个 space 的批量镜像**——只按需搬运被反复查询的单页，搬运后 wiki 版本是权威（在原 Confluence 页标注"已停止维护"）。完整伪对话示例见 [`docs/llm-wiki-architecture-v3/05-工作流场景图解.md`](docs/llm-wiki-architecture-v3/05-工作流场景图解.md)。

## 目录结构

| 路径 | 内容 |
| --- | --- |
| `wiki/troubleshooting/` | 生产问题：现象 → 根因 → 处置 |
| `wiki/runbooks/` | 操作手册：前置 → 步骤 → 验证 → 回滚 |
| `wiki/systems/` | 系统页：边界、依赖、负责人、已知坑 |
| `wiki/decisions/` | 决策记录（轻量 ADR） |
| `wiki/concepts/` | 领域概念与背景知识 |
| `wiki/guides/` | how-to 与团队实践 |
| [`wiki/glossary.md`](wiki/glossary.md) | 术语表，一句话定义 |
| `inbox/` | 未审快速捕获区（未验证内容，任意语言） |
| [`team/people.md`](team/people.md) | staff-id ↔ GitHub ↔ 负责域 路由表 |
| [`schemas/`](schemas/) | 文档化 schema：字段规则、分类法、sources 约定 |
| [`prompts/`](prompts/) | 任务协议：capture / query / gardening |
| [`templates/`](templates/) | 页面模板（中英双语注释），每类型一个 |
| [`scripts/`](scripts/) | `check.ts`（可执行 schema）与 `build-index.ts`，零依赖 |
| [`docs/`](docs/) | 架构文档、CI 方案、设计历史——不是团队知识本体 |

## 信任与证据模型

- **位置即信任**：`wiki/` 可直接引用；`inbox/` 引用必须声明未验证；`docs/` 是关于本仓库自身的。
- **status 三态**（没有 confidence 打分）：缺省 = 现行有效 · `needs-review` = 存疑，引用须带警告 · `superseded` = 不得引用，顺 `superseded_by` 找替代页。
- **证据阶梯**（runbook/troubleshooting）：`sources:` 链接 + "Source excerpts" 原文摘录 + `[E#]` 标记把关键步骤对应到编号摘录 + 可选 `verified:`（最后一次真实执行日期）+ agent 起草的 PR 必须自报 "Unevidenced claims"。
- 完整规则：[`schemas/frontmatter.md`](schemas/frontmatter.md) · agent 行为：[`AGENTS.md`](AGENTS.md)。

## 本地命令

```bash
npm run check         # 校验: 必填字段/枚举/链接/owner 存在性/supersede 环
npm run build-index   # 重新生成 INDEX.md (INDEX 过期只是 warning; CI bot 会在 main 上自动重建)
```

脚本零依赖，`node` 直接运行（Node.js ≥ 22.6，无需 `npm install`）。

## CI

公司 CI 为 **Jenkins**——仓库根的 [`Jenkinsfile`](Jenkinsfile) 把 `npm run check` 作为 PR 合并门禁（J1）。另外两个 job 定义在 [`docs/ci.md`](docs/ci.md)：main 上的 INDEX 重建（J2）、园艺看门狗（J3，维护停摆 21 天自动示警）。`.github/workflows/` 下是同样三个 job 的 **GitHub Actions 参考实现**，在没有 Actions 的环境不会执行。

## 治理

- 正式知识只经 PR；域 owner 由 CODEOWNERS 强制。配置见 [`docs/branch-protection.md`](docs/branch-protection.md)。
- 双周园艺（30 分钟）：agent 按 [`prompts/gardening.md`](prompts/gardening.md) 产出一个维护 PR，轮值园丁审核合并；看门狗在 21 天无园艺 PR 时报警。
- 150–200 人组织的参与模型：供给侧 15–25 名种子/活跃贡献者，消费侧全员。

## 语言政策

正式内容（`wiki/`、控制面、INDEX、commit/PR 文案）为**英文**；`inbox/` 原始捕获可为中文或混杂，编译成 wiki 页时翻译；证据原文引用保留原语言并附一行英文说明。唯一的中文正式文件是本 README 镜像。细则见 [`AGENTS.md`](AGENTS.md)。

## 设计文档

架构、每个被砍概念的理由、带升级触发器的阶段计划、工作流图解、对抗性审查，都在 [`docs/llm-wiki-architecture-v3/`](docs/llm-wiki-architecture-v3/)。
