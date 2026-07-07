# 04 — 调研笔记与 FAQ

> 本文档记录 v3 设计所依据的外部证据（2026-07-07 联网调研），以及对"被砍掉的概念"的逐条答辩。

## 1. 关键外部证据

### E1. Wiki 对比 grep 的受控实测（对"检索基建"最重要的反证）

Karpathy llm-wiki gist 评论区（gist.github.com/karpathy/442a6bf555914893e9891c11519de94f）有开发者对 archcheck（C++ 架构检查器）做了受控 A/B：28 个高质量、每条 claim 带 `file:line` 引用、带 staleness 追踪的 wiki 页面，对比"无 wiki、让 agent 直接 grep 代码库"。结果：4 个查询问题两组正确率均为 4/4，token 消耗差异接近零。

**v3 的解读**：agent 自带的 grep 已是够强的检索引擎；wiki 的边际价值在于承载 **grep 不到的知识**（事故根因、决策理由、口头传承、跨系统经验）——这恰好就是用户团队的痛点清单。因此 v3 把内容方向对准 troubleshooting/runbook/decision，而把检索基建全部推迟到触发器之后。

### E2. AGENTS.md 的负面研究（对"schema 极简手写"的支撑）

arXiv 2602.11988《Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?》：LLM 生成的 AGENTS.md 在 8 个实验设置中的 5 个**降低**了任务成功率，平均每任务多走 2.45–3.92 步。原因：LLM 生成的指令冗长、泛化（"write clean code"类），复述 agent 本来就知道的东西。

**v3 的解读**：AGENTS.md 必须手写、≤150 行、只写团队特有约定。这直接否定了 v1/v2 把大量通用治理论述放进 agent 协议的做法。

### E3. Karpathy 原文与社区共识（对"index 导航上限"与"死因"的标定)

- 原文明确：index.md 导航在 ~100–200 页内够用，之后才需要真检索（qmd 等现成工具）。
- 原文明确：人类放弃 wiki 的原因是**维护负担增长快于价值**；LLM 的作用是把维护成本压到近零。
- 社区实践总结（Hermes agent 的 llm-wiki skill 等）：页面 30 秒可扫读、超 200 行拆分、tag 必须来自受控词表、矛盾必须显式记录不许静默覆盖、批量改动（10+ 页）先向人确认。这些微观纪律被 v3 直接吸收进 AGENTS.md，替代 v2 的宏观治理机器。

### E4. 内部 wiki 失败研究（对"园艺例会"的支撑）

多个来源（everbright-it.de 的知识库综述、APQC 调查等）一致结论：知识库失败极少因为工具，几乎总是因为**所有权缺失**——没有人的职责描述里包含"维护它"。AI 降低维护的操作成本，但不解决责任归属。

**v3 的解读**：治理机制收敛为一个带轮值的双周园艺例会——把"所有权"做成日历上的 30 分钟，而不是 frontmatter 里的字段。

### E5. Copilot 官方生态（对"多入口接入"的支撑）

- GitHub 官方：`.github/copilot-instructions.md` 在每次 Copilot Chat/agent 请求时被读取；支持 org 级与路径级 instructions。
- Microsoft 官方博客给出的模式与 v3 完全一致：**建一个 markdown 知识库 repo + Copilot Space 挂载它**，即可让 Copilot 成为"团队规范教练"，无需任何额外基建。
- GitBook 2026 行业报告：面向 agent 的文档交付事实标准 = 结构化 markdown + llms.txt 风格索引 + （可选）MCP。v3 的 INDEX.md 即 llms.txt 风格；MCP 留作 Phase 4 触发项。

### E6. markdown ↔ Confluence 工具现状（对"方向反转"的支撑）

repo → Confluence 的单向发布是成熟路径：kovetskiy/mark（CLI，长期维护）、GitHub Actions marketplace 多个现成 action、Atlassian marketplace 的 GitHub Markdown Sync。而 Confluence → markdown 主要用于一次性迁移导出，作为持续镜像的实践几乎不存在（会制造永久过期副本）。行业通行做法（mdtidy 等总结）：**权威源放 git markdown，高流量页面单向发布到 Confluence 接受轻微滞后**。

## 2. FAQ — 被砍概念的逐条答辩

**Q1: OKF 真的不要了吗？**
不建 OKF 导出层。v3 结构（markdown + frontmatter + INDEX.md + 目录即类型）与 OKF v0.1 的差距只剩字段名映射，出现真实的外部消费方时一天可补（03 Phase 4 触发器）。在那之前，OKF 唯一的作用是让你多维护一份 spec。详见 01 §3.3。

**Q2: claim_refs（行号锚点 + quote_hash）呢？高危 runbook 不需要吗？**
高危 runbook 需要的是**可点击的出处**（incident ticket、监控面板、原始 Confluence 页）和**负责人签字**（owner + PR review），这两样 v3 都有。行号锚点防的是"来源被篡改且无处核查"，但 v3 的来源是 Jira/Confluence 这类自带历史的系统，威胁模型不成立。真正金融/审计级的场景应该由公司合规系统承载，不该由团队 wiki 自建。

**Q3: confidence 分数呢？agent 怎么知道该多信一页？**
三档枚举：无 status = 现行有效（已过 PR 审核，这本身就是信任声明）；`needs-review` = 存疑/待确认；`superseded` = 已过时。加上 `updated` 日期，agent 获得的信任信号比一个无法校准的浮点数更可靠。v2 自己也承认 confidence 规则需要一个专门脚本来防止乱填——需要防乱填的字段就是不该存在的字段。

**Q4: 没有 raw/ 了，AI 幻觉怎么防？**
防幻觉的机制是（a）sources 链接可点击核查；（b）PR 审核人负责抽查；（c）AGENTS.md 硬规则"Never invent sources"。全文落盘防不了幻觉——幻觉发生在"从来源到结论"的加工环节，落盘只是把错误的原材料多存一份。

**Q5: 个人经验沉淀没有 personal/ 空间放哪？**
个人自己的知识库（Karpathy 原始个人模式）是个人的事，放个人 repo/Obsidian。想变成团队知识的那一刻，路径 = inbox 一条 or 直接 PR。"团队 repo 里的私人抽屉"这个中间态没有存在价值，详见 01 §P7。

**Q6: logs/（操作日志）真不要了？llm-wiki 原文有 log.md。**
原文的 log.md 服务于**没有版本控制的 Obsidian vault** 场景。团队版跑在 git 上，`git log`、PR 历史、园艺 PR 描述已覆盖全部日志需求且不会漂移。

**Q7: 向量检索/图谱以后要是真需要了，现在不留接口会不会返工？**
不会。检索和图谱都是**纯派生物**——输入永远是 `wiki/**/*.md + frontmatter`，v3 保持这个输入面干净（这正是 v2 "canonical vs derived" 原则里正确的部分）。派生物晚建不欠债，早建才欠债（要跟着 schema 变动一起维护）。

**Q8: 只有 5 条校验规则，质量靠什么保证？**
靠 PR review（人）+ 园艺例会（节拍）+ 模板（结构）+ AGENTS.md 写作纪律（agent）。校验脚本只兜"机器擅长且人眼易漏"的底：必填字段、断链、staff-id 格式。v2 规划的 ~20 个脚本里，其余的要么在为伪精度字段打补丁（check-confidence-rules），要么在重造 GitHub（check-candidates 的状态机校验）。

**Q9: 为什么 inbox/ 允许直接 commit main？不怕垃圾进来吗？**
inbox 的竞争对手是"随手发在 Teams 里然后消失"。门槛为零才能赢。垃圾的成本由双周园艺兜底（分类/合并/删除），且 inbox 内容被 AGENTS.md 明确标记为 unverified，agent 引用时必须声明。**宁要 inbox 里 10 条粗糙的真知识，不要流程完美的空库。**

**Q10: 公司内部 API 模型上下文小，读不动整个 repo 怎么办？**
查询协议本来就不是"读整个 repo"：INDEX.md（几 KB）+ 命中的 2–3 页（每页 <200 行）。这个上下文预算连小模型都够。这也是"页面 30 秒可扫读、超 200 行拆分"纪律的第二重意义。

**Q11: sources 里的 Confluence/Jira 链接以后被移动/删除/标过时了怎么办？（link rot）**
三层机制（详见 02 §5.2）：capture 时把关键证据摘录进页面正文（定向保险，替代 raw/ 的全额保险）；sources 条目加状态注记（moved/dead + 日期），失效是被记录的事实而非静默腐烂；园艺时更新 URL 或标 needs-review 交 owner 补证。核心逻辑：知识本体已编译进页面，外链死亡只损失再核查通道，而通道里最值钱的部分已经在摘录里。易失来源（聊天/口述）则原文进 inbox，git 历史就是永久 raw 层。

**Q12: 未来的搜索层是"把 wiki 全喂给 agent"吗？会不会塞爆上下文？**
不是。查询的上下文预算 = query 协议 system prompt（~1k tokens）+ INDEX.md（~2–5k）+ agent 选中取回的 2–5 页（~3–10k），合计 15k 以内。规模增长后**唯一变化的环节是"选页"**——把"读全量 INDEX"换成"关键词/BM25 检索取 top-N 候选"，取页和回答环节永远不变。这就是页面尺寸纪律 + frontmatter 稳定 + 路径稳定三条约定的意义：它们就是给未来搜索层做的全部预留。

**Q13: "线上知识客服"（输入问题 → 检索知识库 → 回答）超出搜索服务的范畴了吗？**
是的，它是一个小 agent，但增量很小。正确的分层：底层是**检索原语**（`list` / `search` / `get` 三个无状态只读接口，CLI 或 MCP 只是包装形式）= 搜索服务；其上"问 → 检索 → 综合 → 引用"的循环 = 一个小 agent（≈ prompts/query.md + 约 200 行胶水，跑在内部 API 模型上）；网页客服、Teams bot、IDE agent 都只是这个组合的不同薄客户端。今天要做的唯一预留：把检索原语规划为独立可复用层，而它的输入面就是 `wiki/**/*.md + frontmatter`——已经稳定。

## 3. 调研来源清单

- Karpathy, llm-wiki gist + 评论区（含 archcheck A/B 实测）— gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- arXiv 2602.11988, Evaluating AGENTS.md
- agents.md 官方站 / betterclaw.io AGENTS.md 最佳实践（手写、只写特有约定）
- Hermes Agent bundled skill: research-llm-wiki（页面纪律、矛盾处理、log 轮转）
- GitHub Docs: repository custom instructions / custom-instructions-support 矩阵
- Microsoft Community Hub: Copilot Spaces + Markdown KB as "Best Practices Coach"
- GitHub Blog: 5 tips for writing better custom instructions
- everbright-it.de: Wikis Nobody Maintains（所有权论）; APQC: 3 Biggest Problems Facing Internal Wikis
- GitBook Blog 2026: Best AI documentation tools（llms.txt/MCP 趋势）
- kovetskiy/mark; GitHub Actions confluence-markdown-sync; mdtidy: Confluence and Markdown（同步方向的行业实践）
- Towards AI: I built Karpathy's LLM Wiki twice（.md 版 vs 代码版的取舍：小规模/形态未定时 .md 版更优——对应本团队现状）
