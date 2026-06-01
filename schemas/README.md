# Schema Pack

The Schema Pack is the contract that keeps humans and AI agents aligned.

Files:

- `frontmatter.md`: common frontmatter rules and page type mapping.
- `confidence-rules.md`: numeric confidence rules and decay guidance.
- `page.schema.json`: formal wiki page schema.
- `person.schema.json`: personal profile schema.
- `source-manifest.schema.json`: raw source manifest schema.
- `candidate.schema.json`: inbox candidate schema.

`AGENTS.md` is the entry point. Agents must read this folder before writing candidates or formal wiki patches.
