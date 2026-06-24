# 仓库结构与 Schema 设计

> 目的：提出下一阶段仓库布局与 schema 模型。

## 1. 提议的仓库结构

```text
team-llm-wiki/
├── README.md
├── AGENTS.md
├── index.md                         # 生成的 OKF 兼容根索引，早期阶段可选
├── log.md                           # 生成的 OKF 兼容根日志，早期阶段可选
├── .github/
│   ├── CODEOWNERS
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/
│       ├── lint.yml
│       ├── knowledge-check.yml
│       └── export-check.yml
├── raw/
│   ├── docs/
│   ├── runbooks/
│   ├── incidents/
│   ├── meetings/
│   ├── code-chunks/
│   └── external/
├── confluence-mirror/
│   ├── manifest/
│   ├── pages/
│   └── glossary/
├── personal/
│   └── 12345678/
│       ├── profile.md
│       ├── raw/
│       └── wiki/
├── inbox/
│   ├── candidates/
│   └── reviews/
│       ├── stale/
│       ├── contradictions/
│       ├── missing-owner/
│       ├── low-confidence/
│       └── sensitive-content/
├── wiki/
│   ├── overview/
│   ├── glossary/
│   ├── concepts/
│   ├── teams/
│   ├── projects/
│   ├── systems/
│   ├── practices/
│   ├── runbooks/
│   ├── decisions/
│   ├── learning/
│   └── mirrored/
├── schemas/
│   ├── README.md
│   ├── frontmatter.md
│   ├── confidence-rules.md
│   ├── page.schema.json
│   ├── candidate.schema.json
│   ├── person.schema.json
│   ├── source-manifest.schema.json
│   ├── claim-ref.schema.json
│   ├── graph.schema.json
│   ├── event.schema.json
│   └── okf-export-profile.md
├── templates/
│   ├── page-system.md
│   ├── page-runbook.md
│   ├── page-decision.md
│   ├── page-learning.md
│   ├── page-glossary.md
│   ├── candidate.md
│   ├── contradiction-review.md
│   ├── source-manifest.md
│   └── person.md
├── prompts/
│   ├── ingest-source.md
│   ├── compile-wiki.md
│   ├── prepare-wiki-patch.md
│   ├── query-wiki.md
│   ├── lint-wiki.md
│   ├── sync-confluence.md
│   ├── resolve-contradiction.md
│   ├── crystallize-session.md
│   └── export-okf.md
├── scripts/
│   ├── lib/
│   │   ├── frontmatter.ts
│   │   ├── schema.ts
│   │   ├── paths.ts
│   │   └── hashes.ts
│   ├── check-staff-id.ts
│   ├── check-person-files.ts
│   ├── check-frontmatter.ts
│   ├── check-source-manifests.ts
│   ├── check-source-refs.ts
│   ├── check-candidates.ts
│   ├── check-links.ts
│   ├── check-index.ts
│   ├── check-review-after.ts
│   ├── check-confidence-rules.ts
│   ├── check-superseded-references.ts
│   ├── check-secrets.ts
│   ├── build-index.ts
│   ├── build-review-queue.ts
│   ├── build-search-corpus.ts
│   ├── build-chunks.ts
│   ├── search.ts
│   ├── evaluate-search.ts
│   ├── export-nodes.ts
│   ├── export-edges.ts
│   ├── render-graph-html.ts
│   ├── export-okf.ts
│   └── init-skeleton.ts
├── indexes/
│   ├── INDEX.md
│   ├── REVIEW_QUEUE.md
│   ├── QUERY_EVAL.md
│   └── search/
│       ├── corpus.jsonl
│       └── chunks.jsonl
├── graph/
│   ├── nodes.jsonl
│   ├── edges.jsonl
│   ├── backlinks.jsonl
│   ├── graph-report.md
│   └── viz.html
├── okf/
│   ├── index.md
│   ├── log.md
│   └── wiki/
├── logs/
│   ├── operations.md
│   ├── ingest.md
│   ├── lint.md
│   ├── query.md
│   ├── redaction.md
│   └── events.jsonl
└── docs/
    └── llm-wiki-architecture-v2/
```

## 2. 目录职责

| 目录 | 职责 | 规范源还是衍生内容 | AI 直接写入 |
| --- | --- | --- | --- |
| `raw/` | 不可变的来源证据 | 规范证据（Canonical evidence） | 仅追加，不可重写 |
| `confluence-mirror/` | 外部单向快照 | 规范外部快照（Canonical external snapshot） | 仅通过同步 |
| `personal/` | 个人档案与非正式知识 | 个人边界（Personal boundary） | 受限 |
| `inbox/candidates/` | 提议的知识 | 提议（Proposal） | 是 |
| `inbox/reviews/` | 审查队列 | 治理（Governance） | 是 |
| `wiki/` | 经过正式审查的团队知识 | 规范团队真值（Canonical team truth） | 仅通过 PR |
| `schemas/` | 结构契约 | 规范控制（Canonical control） | 仅通过管理 PR |
| `templates/` | 页面与审查模板 | 规范控制（Canonical control） | 仅通过管理 PR |
| `prompts/` | Agent 任务协议 | 规范控制（Canonical control） | 仅通过管理 PR |
| `scripts/` | 确定性校验器与生成器 | 控制（Control） | 仅通过 PR |
| `indexes/` | 导航、审查队列、搜索语料库 | 衍生（Derived） | 生成的 PR |
| `graph/` | 关系侧卡与查看器 | 衍生（Derived） | 生成的 PR |
| `okf/` | OKF 兼容导出 | 衍生（Derived） | 仅由生成 |
| `logs/` | 审计与事件记录 | 仅追加（Append-oriented） | 受控追加 |
| `docs/` | 架构与项目文档 | 文档（Documentation） | 仅通过 PR |

## 3. 正式页面 Schema

### 3.1 必填字段

```yaml
id: kb:<type>:<slug>
title: <human readable title>
type: overview | glossary | concept | team | project | system | practice | runbook | decision | learning | mirrored
status: draft | candidate | active | stale | superseded | archived
review_state: unreviewed | reviewed | needs-review | disputed
confidence: 0.00
visibility: internal | restricted | confidential
owners:
  - staff:12345678
source_refs:
  - raw:<category>:<source-id>
related: []
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
```

### 3.2 推荐字段

```yaml
maintainers: []
reviewers: []
knowledge_sources: []
tags: []
verified_at: YYYY-MM-DD
review_after: YYYY-MM-DD
supersedes: []
superseded_by: []
production_applicable: true
memory_tier: semantic | procedural | episode | raw_observation
memory_policy:
  retention_class: durable | normal | transient
  decay_half_life_days: 180
index_policy:
  include_in_default_search: true
  allowed_roles: []
  redaction_required: false
claim_refs: []
```

### 3.3 页面 ID 规则

使用不依赖于未来文件移动的稳定 ID：

```text
kb:system:payment-gateway
kb:runbook:payment-failover
kb:decision:payment-provider-v2
kb:concept:checkout-error-baseline
```

文件路径可以变更。ID 不应变更。

## 4. 来源清单（Source Manifest）Schema

### 4.1 必填字段

```yaml
id: raw:<category>:<yyyy-mm-dd-slug>
title: <title>
source_type: doc | runbook | incident | meeting | code-chunk | external | confluence
collector: staff:12345678
collected_at: YYYY-MM-DD
sensitivity: internal | restricted | confidential
hash: sha256:<real-source-md-hash>
status: captured | superseded | rejected
origin:
  system: manual | confluence | github | slack | meeting | external
  url: ""
```

### 4.2 哈希规则

哈希值必须从 `source.md` 字节内容计算，而非从清单文件（manifest）计算。

如果来源内容发生变化，请勿静默原地编辑。请使用以下策略之一：

```text
1. 创建新的来源文件夹，使用新日期和 slug。
2. 将旧来源标记为已废弃（superseded）。
3. 创建审查条目，说明来源变更的原因。
```

## 5. 候选条目（Candidate）Schema

### 5.1 必填字段

```yaml
id: candidate:<slug>
candidate_origin: raw | personal | mirror | query | manual | session
candidate_intent: ingest | compile | promotion | sync | crystallize
candidate_status: proposed | in_review | promoted | rejected | superseded
source_refs: []
owner_candidates: []
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
```

### 5.2 推荐质量字段

```yaml
quality:
  structure_score: 0.00
  citation_score: 0.00
  consistency_score: 0.00
  actionability_score: 0.00
  overall: 0.00
quality_status: pass | needs-rewrite | needs-human-review
```

### 5.3 必需章节

```text
Source Understanding
Wiki Proposal
Review Notes
Decision Log
Quality Notes
Open Questions
```

## 6. 声明引用（Claim Reference）Schema

声明引用针对高风险事实，而非每个句子。

```yaml
claim_refs:
  - claim_id: claim:<domain>:<slug>
    statement: <short normalized claim>
    confidence: 0.80
    source_refs:
      - source_ref: raw:<category>:<source-id>
        source_path: raw/<category>/<source-id>/source.md
        start_line: 10
        end_line: 12
        quote_hash: sha256:<hash>
    last_confirmed_at: YYYY-MM-DD
    contradiction_refs: []
```

## 7. 图谱（Graph）Schema

### 7.1 节点（Node）

```json
{"id":"kb:system:payment-gateway","type":"system","title":"Payment Gateway","path":"wiki/systems/payment/payment-gateway.md","status":"active","confidence":0.86,"owners":["staff:12345678"]}
```

### 7.2 边（Edge）

```json
{"from":"kb:runbook:payment-failover","to":"kb:system:payment-gateway","type":"runbook_for","reason":"explicit-frontmatter","evidence":["wiki/runbooks/payment/payment-failover.md"]}
```

### 7.3 早期阶段允许的边类型

```text
owns
maintains
wikilink
backlink
shared_source
related_to
runbook_for
depends_on
supersedes
contradicts
```

每条边必须包含：

```text
from
to
type
reason
evidence
```

## 8. 搜索语料库（Search Corpus）Schema

每个分块（chunk）应携带足够的元数据以确保安全回答：

```json
{
  "chunk_id": "kb:runbook:payment-failover#procedure-001",
  "page_id": "kb:runbook:payment-failover",
  "path": "wiki/runbooks/payment/payment-failover.md",
  "heading": "Procedure",
  "text_hash": "sha256:<chunk-hash>",
  "status": "active",
  "review_state": "reviewed",
  "confidence": 0.86,
  "visibility": "internal",
  "owners": ["staff:12345678"],
  "source_refs": ["raw:runbooks:2026-06-01-payment-failover"],
  "tags": ["payment", "failover"]
}
```

## 9. OKF 导出配置（Export Profile）

内部 schema 保持严格。OKF 导出是一个生成的兼容性视图。

### 9.1 内部到 OKF 映射

| 内部字段 | OKF 字段 |
| --- | --- |
| `title` | `title` |
| `type` | 映射后的 `type`，例如 `Playbook`、`System`、`Decision` |
| `summary` 或首段 | `description` |
| `id` | `resource` 或 `x-team-id` |
| `updated_at` | `timestamp` |
| `tags` | `tags` |
| `status` | `x-team-status` |
| `confidence` | `x-team-confidence` |
| `owners` | `x-team-owners` |
| `source_refs` | `x-team-source-refs` |

### 9.2 导出规则

OKF 导出应当：

- 使用标准 Markdown 链接。
- 生成 `index.md` 和 `log.md`。
- 在 `x-team-*` 扩展字段下保留内部元数据。
- 排除 restricted/confidential 级别的页面，除非导出策略允许。
- 永远不要作为规范源（canonical source）被手动编辑。

## 10. Schema 演进规则

Schema 变更必须像 API 变更一样对待：

```text
1. 更新 schema 文档。
2. 更新 JSON Schema。
3. 更新模板。
4. 更新 prompts。
5. 更新校验器。
6. 执行迁移或兼容性检查。
7. 需要知识管理员的审查。
```

不要随意添加字段。每个字段应至少改善信任度（trust）、检索（retrieval）、所有权（ownership）、生命周期（lifecycle）、互操作性（interoperability）或自动化（automation）中的一个方面。
