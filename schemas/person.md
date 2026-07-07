# 人员路由表规则 (`team/people.md`)

`team/people.md` 是全库唯一的人员映射表：**staff-id ↔ GitHub ↔ 负责域**。

作用：

1. agent 回答"这事该找谁"的唯一依据。
2. `check.ts` 校验页面 `owner` 字段的存在性来源。
3. staff-id 与 GitHub reviewer 之间的翻译表（页面内容用 staff-id，PR/CODEOWNERS 用 GitHub 标识）。

## 表格列定义

| 列 | 必填 | 规则 |
| --- | --- | --- |
| `staff_id` | 是 | `staff:########`，8 位数字，公司唯一员工标识，表内主键 |
| `github` | 建议 | GitHub username，用于 PR reviewer 指派 |
| `owns` | 建议 | 负责的系统/域，逗号分隔，与 wiki 页面的 owner 分工对应 |
| `notes` | 否 | 备注（如：园丁轮值顺序、离职交接中等） |

## 规则

1. `staff:00000000` 是系统占位符，保留在表内（模板/示例/待认领页面用），不代表真人。
2. 成员加入/离开团队时更新本表；离职者名下页面在园艺例会上重新认领 owner。
3. 本表本身的 owner 是 knowledge admin（CODEOWNERS 控制）。
4. 不在表内记录姓名、邮箱等直接 PII——staff-id 即身份，需要联系人时通过公司系统反查。
