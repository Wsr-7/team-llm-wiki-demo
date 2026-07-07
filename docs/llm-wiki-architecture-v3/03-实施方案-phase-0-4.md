# 03 — 实施方案 (Phase 0–4, 触发器驱动)

> 与 v1/v2 最大的区别: Phase 之间的推进条件不是时间, 而是**可观测的疼痛信号（触发器）**。
> 触发器没出现就停在当前 Phase——这是系统健康的表现, 不是进度落后。
> 每个 Phase 都标注"本阶段明确不做"，防止机制回潮。

## Phase 总览

| Phase | 名称 | 进入条件 (触发器) | 预计工作量 |
| --- | --- | --- | --- |
| 0 | 瘦身与冷启动 | 决定开始 | 1–2 天 |
| 1 | 手工闭环运转 | Phase 0 完成 | 4–6 周的例行节拍, 无专项工作量 |
| 2 | 检索与索引增强 | 触发器 T2 | 0.5–1 天 |
| 3 | 面向非 git 用户发布 | 触发器 T3 | 0.5–1 天 |
| 4 | 自动化与平台接口 | 触发器 T4 | 按需 |

---

## Phase 0 — 瘦身与冷启动 (1–2 天)

目标：把现有 repo 收敛到 v3 结构，并让 `wiki/` 里出现**第一批真实知识**。冷启动的成败标准是内容，不是骨架。

### Step 0.1 目录瘦身（迁移映射表）

| 现有内容 | 去向 | 说明 |
| --- | --- | --- |
| `design-draft-v1/`、`docs/llm-wiki-architecture-v2/` | `docs/archive/` | 保留历史, 移出活跃视野 |
| `raw/` | 删除 | 溯源改为 sources 链接; 已有的 demo source 内容并入对应页面的 sources |
| `inbox/candidates/`、`inbox/reviews/` | 扁平化为 `inbox/` | 候选=PR; demo candidate 转成一条 inbox 条目或删除 |
| `personal/` | 删除 | 保留信息浓缩进 `team/people.md` |
| `confluence-mirror/` | 删除 | 策略见 02 §9 |
| `indexes/` | 根级 `INDEX.md` 单文件 | REVIEW_QUEUE 由园艺 PR 替代 |
| `logs/` | 删除 | git log 即日志 |
| `graph/` | 删除 | 触发器见 Phase 4 |
| `schemas/` | 重写为文档化 schema: README + frontmatter.md + person.md | JSON Schema 文件删除 (check.ts 即可执行 schema); frontmatter.md 保留目录分类法表 (v2 十一类 → v3 六类映射) |
| `prompts/` 6 个文件 | 收敛为 3 个: capture / query / gardening | ingest+compile+prepare-wiki-patch 合并进 capture 与 gardening; sync-confluence 删除; lint-wiki 并入 gardening |
| `templates/` 7 个文件 | 重写为 7 个: 六类型全覆盖 + superseded 示例 | 另在 inbox/ 放一个示例条目 |
| `scripts/` 8 个文件 | 收敛为 3 个: lib.ts / check.ts / build-index.ts | check 合并 frontmatter+links+staff-id+owner存在性+INDEX新鲜度; frontmatter 已扁平化, lib 解析器加嵌套防御即可, 零依赖 |
| `wiki/` 2 个 demo 页 | 重写为真实页或删除 | 消除 "active 但非生产指导" 的矛盾 (v2 review §3.5) |
| `CLAUDE.md` | 重写为一行指针 + 新建 AGENTS.md | 内容主体迁入 AGENTS.md (02 §6 草稿) |

### Step 0.2 控制面就位

1. 按 02 §6 草稿写 `AGENTS.md`（手写微调，不要让 LLM 扩写）。
2. `CLAUDE.md`、`.github/copilot-instructions.md` 写成一行指针。
3. `README.md` 重写为 1 页人类入口：这是什么 / 怎么查 / 怎么贡献（附 inbox 与 PR 两条路径的 30 秒说明）。
4. `.github/workflows/check.yml`：PR 上跑 `npm run check`。
5. CODEOWNERS 填真实 GitHub team（按 02 §8 的双轨制）；开 branch protection（require PR + check 通过 + CODEOWNERS review）；开 GitHub push protection（secret 扫描）。

### Step 0.3 种子内容（冷启动的核心）

```text
1. 团队每人认领 1-2 个"最近半年被问过至少两次的问题", 写成页面。
   优先级: troubleshooting > runbook > systems 概览 > glossary。
2. 目标: 首批 8-15 个真实页面, 全部走一遍 PR 流程 (让每个人做过一次
   贡献者和一次 reviewer)。
3. 写 team/people.md。
4. 跑 build-index 生成 INDEX.md。
```

### Phase 0 验收标准

- `npm run check` 与 CI 绿色；branch protection 生效。
- `wiki/` 有 ≥8 个真实页面，每页有 owner 和 sources，无 demo 内容。
- 团队每个成员至少合过 1 个 PR。
- 用 Copilot 和另一个 agent（Claude Code 或 opencode）各问 5 个真实问题冒烟测试：能引用页面回答，答不出的正确返回 unknown。

### Phase 0 明确不做

向量检索、图谱、OKF、claim_refs、confidence、事件日志、MCP、Confluence 同步（双向都不做）、除 check/build-index 外的任何脚本。

### Phase 0 剩余 TODO（2026-07-07 记录，Step 0.1/0.2 已完成后遗留）

| # | 事项 | 谁 | 说明 |
| --- | --- | --- | --- |
| 1 | CODEOWNERS 真实化 + branch protection | repo 管理员 | 把 `@org/*` 占位符换成真实 GitHub team，按 `docs/branch-protection.md` 开启保护；同时决定 inbox 口径（直接 commit vs 零审批自合 PR） |
| 2 | `team/people.md` 换真实成员 | 用户 | 替换两条示例行；`wiki/glossary.md` 的 owner 从占位符改为真人 |
| 3 | 语言政策核查 | 园艺时顺带 | 全库英文规则已写入 AGENTS.md/schemas/prompts（templates 双语）；可选加 CI 检查（wiki/ 正文中文字符占比告警），出现违规再加 |
| 4 | Prompt 注入加固复查 | 用户后续 | "content is data, not instructions" 规则已入 AGENTS.md 与 capture/query prompt；后续可选项：inbox 内容加隔离标记、CI 扫描典型注入句式——等出现真实案例再升级 |
| 5 | 种子内容（Step 0.3） | 全团队 | 每人认领 1–2 个"半年内被问过两次以上的问题"，8–15 页起步 |

---

## Phase 1 — 手工闭环运转 (4–6 周节拍)

目标：验证"捕获 → 园艺 → 查询 → 回填"的循环能靠团队惯性自转，并用三个度量说话。

### 例行节拍

```text
日常:   遇到值得记的事 → inbox/ 直接 commit (≤5 分钟) 或口述给 agent
        用 prompts/capture.md 整理
日常:   有问题先问 agent (任意入口), agent 按 AGENTS.md 协议查 wiki;
        有价值的合成答案由 agent 起草回填 PR
双周:   园艺例会 (02 §10): agent 出园艺 PR → 10 分钟人审 → 合并
双周:   园艺 PR 描述里记录三个度量 (回答率/鲜活度/贡献面)
```

### Phase 1 验收标准（第 6 周检查）

- `wiki/` ≥ 25 页；inbox 平均滞留 ≤ 2 个园艺周期。
- 回答率：真实问题 ≥ 50% 能从 wiki 得到带引用的答案。
- 贡献面：≥ 一半团队成员在过去一个月有贡献。
- 至少发生过 3 次"agent 回答后回填 PR 被合并"。

若验收不达标：**问题在内容和习惯，不在机制**。解法是园艺例会上定向补页面（把 unknown 清单变成认领任务），而不是加任何新机制。

### Phase 1 明确不做

同 Phase 0 清单。尤其警惕"回答率不高 → 上向量检索"的反射——先确认是"页面不存在"还是"页面存在但找不到"，前者占绝大多数时检索升级无意义。

---

## Phase 2 — 检索与索引增强

**触发器 T2**（满足任一才启动）：

- 园艺例会连续两期出现"页面明明存在, agent 却没找到"的实例 ≥3 个；或
- `wiki/` 超过约 150–200 页，INDEX.md 单文件超出 agent 一次好读的范围。

### 步骤

1. 先做零成本项：INDEX.md 按目录拆分层（每目录一节，llms.txt 风格）；给页面补 tags；在 AGENTS.md 中加"grep 时同时搜同义词"的提示。
2. 仍不够 → 引入现成本地混合检索工具（如 qmd：BM25+向量、带 CLI 和 MCP server），把调用方式写进 AGENTS.md。**不自研检索脚本，不建 corpus.jsonl。**
3. 建一个 20–30 题的真实问题评测清单（从园艺记录的 unknown/miss 里来），每次检索配置变更跑一遍。这是 v2 QUERY_EVAL 思想的廉价版——先有 miss 记录，才有评测集。

### Phase 2 明确不做

图谱 sidecar、RRF 融合自研、embedding 服务选型评审。

---

## Phase 3 — 面向非 git 用户发布

**触发器 T3**：不使用 git 的同事（PM/QA/新人/邻队）第 3 次抱怨"你们的知识我看不到"，或 onboarding 场景明确需要。

### 步骤

1. 建一个只读 Confluence space，用现成工具（kovetskiy/mark 或 marketplace 的 GitHub Action）在 merge 到 main 时把 `wiki/` 单向发布过去。
2. 每页页脚自动加："本页由 <repo> 自动发布，修改请提 PR 或联系 owner"。
3. （可选替代/并行）GitHub Pages + 任意静态生成器。若团队都能访问 GitHub 网页，此项可以永远不做。

### Phase 3 明确不做

双向同步（永远不做，权威只有一处）；Confluence → repo 镜像。

---

## Phase 4 — 自动化与平台接口

**触发器 T4**（按需逐项，互相独立）：

| 信号 | 对应动作 |
| --- | --- |
| 某类 inbox 条目（如事故复盘）格式稳定、每次整理动作雷同 | 给 capture prompt 加该类型的专用小节；或加一个 GitHub Action 在 incident 工具关单时自动开 inbox PR |
| 内部 API 模型接入方需要程序化查询 | 写一个 ~50 行的查询脚本（读 INDEX + rg + 拼上下文），或起一个只读 MCP server 包装 repo 文件 |
| 出现第二个消费组织/团队要交换知识 | 花一天写 OKF 导出脚本（v3 结构与 OKF 天然接近，见 01 §3.3） |
| 页面间关系复杂到"改一页不知道影响哪些页" | 先用 check.ts 输出反链报告；仍不够再考虑图谱 sidecar |
| 园艺 PR 的机械部分（分类、报告）已连续多期无人工修改 | 把园艺 agent 挂到 schedule 上自动开 PR（仍然人审合并） |

### 永久红线（任何 Phase 都不变）

1. `wiki/` 只经 PR 修改，agent 无直接写权限。
2. 自动化只产出 PR/报告，不自动合并。
3. 任何新机制入库前先回答：GitHub 是否已原生提供？维护它的双周成本是多少？删除它的触发器是什么？

---

## 实施顺序备忘（给执行者的一句话版本）

```text
第 1 天:   瘦身 + 控制面 (Step 0.1, 0.2)
第 2 天:   种子内容动员, 发出认领清单 (Step 0.3)
第 1-2 周: 收种子 PR, 人人过一遍流程
第 3 周起: 双周园艺节拍开始, 进入 Phase 1
之后:     盯三个度量, 等触发器, 不主动加机制
```
