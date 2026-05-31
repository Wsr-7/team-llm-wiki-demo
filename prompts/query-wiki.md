# Query Wiki Prompt

回答团队知识问题前必须：

1. 读取 `AGENTS.md` 和 `indexes/INDEX.md`。
2. 使用 QMD basic search 或 `rg` fallback 检索 `wiki/`、`persons/`、`indexes/`。
3. 读取最相关页面正文和 `source_refs`。
4. 明确区分 active、needs-review、stale、superseded、disputed、unknown。
5. 如果启用 related pages，必须说明 direct wikilink、backlink 或 shared source_refs。
6. 不得只凭搜索 snippet 回答。
7. 如果信息不足，输出知识缺口。
