# Team Knowledge Base Demo

这是一个用于验证团队知识库 V3 方案的试验 repo。

GitHub repo 是知识库权威层。正式知识位于 `wiki/` 和 `persons/`，必须通过 PR、CI 和 owner review 进入主干。AI agent 可以帮助整理、编译、检查和提出候选变更，但不能绕过 review 直接把内容写成正式知识。

## 快速入口

- 知识总索引：[indexes/INDEX.md](indexes/INDEX.md)
- Agent 协议：[AGENTS.md](AGENTS.md)
- Compile 规则：[prompts/compile-wiki.md](prompts/compile-wiki.md)
- 页面 schema：[schemas/page.schema.json](schemas/page.schema.json)
- Confidence 规则：[schemas/confidence-rules.md](schemas/confidence-rules.md)
- 人员责任映射：[persons/](persons/)
- Demo runbook：[wiki/runbooks/payment-failover.md](wiki/runbooks/payment-failover.md)

## Phase 0 贡献流程

1. 把原始资料放入 `raw/`，并补充 source manifest。
2. 使用 `prompts/ingest-source.md` 生成 `inbox/ingest-candidates/` 候选。
3. 使用 `prompts/compile-wiki.md` 将候选编译为 wiki 页面草稿或 patch proposal。
4. 使用 `prompts/promote-knowledge.md` 准备 PR diff。
5. PR 通过校验与 owner review 后，正式知识才进入 `wiki/`。

## Phase 0 当前范围

已建立：

- repo 目录骨架
- staff-id 人员规范
- 页面 schema 与 confidence 规则
- source manifest 模板
- compile / ingest / query / lint / promote prompts
- 最小 demo raw source、candidate、formal wiki page
- 基础索引、日志和校验脚本

暂不做：

- embedding / vector search
- QMD 接入
- Confluence 远端同步
- 自动 ingest 守护进程
- 复杂图数据库或自动抽图
- 静态站点发布

## 人员标识

所有人员字段必须使用 8 位数字 staff-id：

```yaml
owners:
  - staff:00000000
```

`staff:00000000` 仅作为 demo 占位符，正式使用前必须替换为真实员工 staff-id。
