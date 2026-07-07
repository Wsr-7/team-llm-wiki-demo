# Branch Protection 配置

repo 管理员按下列设置配置 `main` 分支保护（Settings → Branches → Add rule）。
前提：`.github/CODEOWNERS` 中的 `@org/*` 占位符已替换为真实 GitHub team。

必开：

1. **Require a pull request before merging** — 正式知识只经 PR。
2. **Require review from Code Owners** — 控制面与领域页面由对应 owner 审。
3. **Require status checks to pass** — 勾选 check：`check`（`.github/workflows/check.yml`）。
4. **Restrict force pushes / deletions**。

建议开：

- Require conversation resolution before merging。
- Settings → Code security: 开启 **Push protection**（secret 扫描，替代自建 check-secrets 脚本）。

例外说明：`inbox/` 的"直接 commit 到 main"约定与分支保护冲突时，取分支保护优先——此时 inbox 贡献改为"发 PR + 自合"（CODEOWNERS 对 `/inbox/` 不设 owner，PR 可零审批合并），捕获成本仍然是分钟级。
