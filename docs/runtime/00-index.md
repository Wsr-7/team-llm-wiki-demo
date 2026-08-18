# LLM Wiki Search Runtime 初次技术调研报告 — 拆分索引

原文档（约 4180 行 / 70KB）在部分 Markdown 阅读/编辑软件中打开会卡顿，现按主题拆分为以下 4 个文档，内容与原文一一对应、未做删减或改写。各文档内部小节编号（`# N.`）与原文保持一致，便于交叉引用。

| 文档 | 覆盖章节 | 主题 |
|---|---|---|
| [01-overview-and-architecture.md](./01-overview-and-architecture.md) | §0–§12 | 文档目的、Executive Summary、背景与目标 + VS Code 集成方案对比（Language Model Tool / Custom Agent / Chat Participant / MCP）、是否需要容器、Repo 同步策略、Repo/Runtime 规则边界、`llm-wiki.yaml` |
| [02-retrieval-and-tool-design.md](./02-retrieval-and-tool-design.md) | §13–§32 | 检索管线（Query Routing、BM25、Vector Search、Hybrid Merge、Rerank、Chunking、Link Expansion、Evidence Package）+ Tool 与 Runtime 设计（`wiki_query` 等、LM Tool Adapter、Only One Retrieval Core、Runtime 接口/组件/伪代码） |
| [03-storage-security-lifecycle.md](./03-storage-security-lifecycle.md) | §33–§75 | 存储/安全/测试（Index Storage、Security、Error Handling、Observability、评测、Test Pyramid）+ Runtime 生命周期与运维（语言选择、版本兼容、Multi-Repo、并发、原子索引替换、超时/取消、Token 预算） |
| [04-roadmap-and-final-architecture.md](./04-roadmap-and-final-architecture.md) | §76–§86 + Appendix A–D | 推荐开发阶段（Phase 0–7）、MVP 验收标准、Architecture Decision 候选与倾向、最终推荐架构、核心设计原则汇总、最终建议、Runtime API / Tool Adapter / Python Script Adapter / Codex Continuation Prompt 草案 |

原始未拆分文件已移除，内容全部迁移至以上文档，总行数一致（4180 行）。
