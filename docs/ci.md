# CI 方案（Jenkins 为主，GitHub Actions 为参考实现）

> 公司内部 CI 为 Jenkins pipeline，无法使用 GitHub Actions。
> 本文定义知识库的三个自动化职责、它们在 Jenkins 上的落地方式，
> 以及 `.github/workflows/` 下三个 yml 的角色（参考实现，公司内不生效）。

## 1. 三个自动化职责

| # | 职责 | 触发 | 是否阻断 | 作用 |
| --- | --- | --- | --- | --- |
| J1 | **PR 校验** | 每个 PR / 分支推送 | **阻断 merge** | 跑 `npm run check`：frontmatter 必填与枚举、owner 存在性、链接有效性、supersede 环、页面纪律 warning |
| J2 | **INDEX 重建** | main 有新 commit | 不阻断 | 跑 `npm run build-index`，有 diff 就以服务账号 commit + push 回 main（避免每个 PR 自带 INDEX 造成合并冲突，见 06 §R4） |
| J3 | **园艺看门狗** | 定时（每周一） | 不阻断，发通知 | 检查 21 天内是否有园艺产出；没有就向团队频道/邮件示警（治理停摆可见化，见 06 §R1） |

## 2. Jenkins 落地

### J1 PR 校验（必做，Phase 0）

- 建 **Multibranch Pipeline**（或在现有 PR 流水线中加一个 stage），指向本 repo；仓库根的 [`Jenkinsfile`](../Jenkinsfile) 已就绪。
- Agent 要求：Node.js ≥ 22.6（脚本零依赖，**不需要 npm install**）。
- 在托管平台把该 pipeline 结果设为 merge 门禁（GitHub Enterprise: branch protection 的 required status check；Bitbucket: merge checks → minimum successful builds）。

### J2 INDEX 重建（建议做；可降级）

- 现成 pipeline 文件：[`jenkins/index-rebuild.Jenkinsfile`](../jenkins/index-rebuild.Jenkinsfile)。建一个由 main push 触发的 Pipeline job（webhook 或 SCM polling），"Pipeline script from SCM" 指向该文件即可。
- 分支保护需允许该服务账号直推 main（GHE: bypass 列表；Bitbucket: branch permission 例外）。
- **降级方案**（不想配服务账号时）：不建此 job。`check` 对 INDEX 过期只报 warning，由园丁每双周跑一次 `npm run build-index` 随园艺 PR 提交——INDEX 最多漂移两周，可接受。

### J3 园艺看门狗（建议做，10 分钟配置）

- 现成 pipeline 文件：[`jenkins/gardening-watchdog.Jenkinsfile`](../jenkins/gardening-watchdog.Jenkinsfile)。建一个 Pipeline job 指向该文件即可（cron 触发器已内置：每周一）；21 天无园艺产出时 job 变红，把日常的红色构建通知（邮件/Teams webhook）接上即可。
- 依赖一个约定：**园艺 PR 用 squash merge 且保留 `gardening: YYYY-MM-DD` 标题**（这样 main 历史里能 grep 到）。此约定已写入 prompts/gardening.md 的 PR 标题规则。

## 3. `.github/workflows/` 三个 yml 是什么、怎么用

它们是同样三个职责的 **GitHub Actions 参考实现**，在公司内网 **不会执行**（Actions 不可用）。保留的原因：本 demo repo 托管在 github.com 上时它们即刻生效；未来迁到支持 Actions 的环境可即插即用；同时它们是 J1-J3 的精确规格说明。

| 文件 | 对应职责 | 行为 |
| --- | --- | --- |
| `check.yml` | J1 | PR 与 main push 时跑 `npm run check`，失败阻断 merge（需在 branch protection 勾选该 check） |
| `rebuild-index.yml` | J2 | main 每次 push 后跑 `build-index`，INDEX.md 有变化则以 `github-actions[bot]` 身份 commit 回 main |
| `gardening-watchdog.yml` | J3 | 每周一定时查 21 天内有无标题含 `gardening:` 的 PR，没有则自动开一个带 `gardening-overdue` label 的 issue |

公司内落地时**以 Jenkins 版为准**，三个 yml 无需删除也无需配置。

## 4. 托管平台差异备忘

本设计的审核门禁用了两个 GitHub 特性：CODEOWNERS 与 branch protection（配置见 [`branch-protection.md`](branch-protection.md)）。

| 特性 | GitHub / GitHub Enterprise | Bitbucket (Data Center) |
| --- | --- | --- |
| 按路径指定 reviewer | CODEOWNERS | Default reviewers（无路径粒度）+ 插件（如 Code Owners for Bitbucket） |
| 必须 PR + 状态检查 | branch protection / rulesets | Branch permissions + merge checks |
| inbox 零审批自合 | CODEOWNERS 对 `/inbox/` 不设 owner | Default reviewers 数设 0，靠约定 + J1 校验 |

若公司托管是 GHE，一切按现有文档执行；若是 Bitbucket，按上表映射，语义不变：**wiki/ 必须有域 owner 审批，inbox/ 零审批，check 必须绿**。
