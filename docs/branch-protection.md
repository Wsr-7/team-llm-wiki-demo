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

inbox 口径（已定，2026-07-07）：**全走 PR**。`inbox/` 贡献同样发 PR，但 CODEOWNERS 对 `/inbox/` 不设 owner，因此 inbox PR 无需任何审批，自己开自己合（可开 auto-merge），捕获成本约 1 分钟。注意：branch protection 的 "Require approvals" 数量请设为 0（审批要求由 CODEOWNERS 按路径驱动），否则 inbox 自合会被挡住。

bot 例外：`.github/workflows/rebuild-index.yml` 会在 merge 后向 main 直接 push 一个 INDEX.md 重建 commit。开启分支保护时，需在 bypass 列表中允许 GitHub Actions（Rulesets → Bypass list → 添加 GitHub Actions app；或经典 branch protection 的 "Allow specified actors to bypass required pull requests"）。若组织政策不允许 bypass，替代方案：让该 workflow 改为开自动 PR 并 auto-merge（inbox 同款零审批路径对 INDEX.md 单独放行）。

规模提示（150-200 人团队）：种子期结束前必须补齐**域级 CODEOWNERS 行**（`/wiki/runbooks/payment/ @org/payment-team` 等），否则 `*` 兜底会让 knowledge-admins 成为全部 PR 的瓶颈并退化为橡皮章审批。
