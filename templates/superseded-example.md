---
owner: staff:00000000
updated: YYYY-MM-DD
sources:
  - https://original-source-url
status: superseded
superseded_by: wiki/runbooks/REPLACE-new-page.md
tags: []
---

# <原页面标题>

> **本页已被取代，不再是现行指导。** 请阅读
> [替代页面](../wiki/runbooks/REPLACE-new-page.md)。
> 保留本页仅作历史参考（当时为什么这么做）。

<!-- 废弃一页的正确姿势 (本文件是示例, 不是可复制的页面类型):
     1. 在【新页面】的 PR 里同时修改旧页: 加 status: superseded 和 superseded_by。
     2. 在旧页标题下加上方的提示块, 指向新页。
     3. 不删除旧页正文——历史语境有价值; 内容确实有害时可删正文只留提示块。
     4. 修正其它页面指向旧页的"现行指导"式引用 (check 的断链报告帮不了这个, 靠 grep)。
     5. 运行 npm run build-index && npm run check。
     agent 行为: superseded 页面不得作为现行指导引用, 必须顺 superseded_by 走。 -->

（原正文保留在此……）
