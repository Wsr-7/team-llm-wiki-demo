# Lint Wiki Prompt

请检查知识库健康度：

1. frontmatter 是否缺字段。
2. staff-id 是否符合 `staff:########`。
3. active 页面是否缺 `source_refs`。
4. active 页面是否缺 `confidence`。
5. `review_after` 是否过期。
6. `[[wikilink]]` 是否断裂。
7. active 页面是否引用 superseded 页面。
8. restricted/confidential 是否被导出。

输出：

- blocking issues
- warnings
- suggested fixes
- review queue updates
