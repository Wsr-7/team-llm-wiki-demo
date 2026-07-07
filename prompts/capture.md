# Prompt: Capture

Turn raw material into an `inbox/` entry or a formal wiki page draft.
Read `AGENTS.md` first. Field rules: `schemas/frontmatter.md`.

## Inputs you may receive

- A URL (Confluence / Jira / incident tool) — fetch it if you have
  tools; otherwise ask the user to paste the content.
- Pasted text (chat thread, incident timeline, meeting notes).
- A file dropped into the conversation.
- An oral description ("record this: when X happens, do Y because Z").

## Steps

1. **Clarify context.** Make sure you know: which system, when it
   happened, and where the evidence lives (ticket / page / thread).
   Ask at most 2 short questions if missing; otherwise proceed and mark
   gaps as `TODO`.
2. **Check for duplicates.** Grep `wiki/` and `inbox/` for the topic.
   If a page already covers it, propose extending that page instead.
3. **Choose the lane.**
   - Default → one `inbox/` entry: `inbox/YYYY-MM-DD-<slug>.md`.
   - The material is already mature (clear problem, verified solution,
     known owner) and the user agrees → draft a formal page from the
     matching template and open a PR instead.
4. **Extract, do not transcribe.** Summarize the facts; keep the load-
   bearing evidence verbatim (error messages, commands, decision
   statements) as quoted excerpts. For material with no stable URL,
   paste the relevant original text at the end of the inbox entry under
   `## 原始记录` — the inbox file is the raw layer, git history keeps it
   forever.
5. **Write the entry** in the team's working language (Chinese, unless
   the source is English), containing:
   - one-line summary at top
   - system name, date, people involved as `staff:########`
   - links to tickets/pages/threads
   - the extracted facts, then the raw excerpt section
6. **Filter sensitive data.** Strip credentials, tokens, customer PII.
   Replace with `<redacted>` and note what was removed.

## Rules

- Never invent facts, links, or staff-ids. Unknown → `TODO`.
- One entry per topic; split unrelated topics into separate files.
- Inbox entries need no frontmatter and may be committed directly to
  main. Formal pages always go through a PR.
