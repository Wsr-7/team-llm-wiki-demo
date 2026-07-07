---
owner: staff:00000000
updated: YYYY-MM-DD
sources:
  - https://original-source-url
status: superseded
superseded_by: wiki/runbooks/REPLACE-new-page.md
tags: []
---

# <Original page title>

> **This page has been superseded and is no longer current guidance.**
> Read the [replacement page](../wiki/runbooks/REPLACE-new-page.md) instead.
> This page is kept for historical context only (why we did it this way at the time).

<!-- How to supersede a page correctly (this file is an example, not a page type):
     废弃一页的正确姿势 (本文件是示例, 不是可复制的页面类型):
     1. In the PR that adds the NEW page, also edit the old page: add
        status: superseded and superseded_by.
        在【新页面】的 PR 里同时修改旧页: 加 status: superseded 和 superseded_by。
     2. Add the banner block above under the old page's title, pointing to the new page.
        在旧页标题下加上方的提示块, 指向新页。
     3. Do not delete the old body — historical context has value; if the content is
        actively harmful, delete the body and keep only the banner.
        不删除旧页正文——历史语境有价值; 内容确实有害时可删正文只留提示块。
     4. Fix other pages that cite the old page as current guidance (grep for the path —
        the link checker cannot catch semantic staleness).
        修正其它页面对旧页的"现行指导"式引用 (靠 grep, 断链检查帮不了这个)。
     5. Run npm run build-index && npm run check.
     Agent behavior: superseded pages must never be cited as current guidance;
     always follow superseded_by.
     agent 行为: superseded 页面不得作为现行指导引用, 必须顺 superseded_by 走。 -->

(original body remains here …)
