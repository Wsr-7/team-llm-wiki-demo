import { closeSync, existsSync, mkdirSync, openSync } from "node:fs";
import { join } from "node:path";
import { repoRoot } from "./kb-lib.ts";

const directories = [
  "raw/sources",
  "raw/meetings",
  "raw/incidents",
  "raw/sessions",
  "confluence-mirror/glossary",
  "confluence-mirror/pages",
  "confluence-mirror/manifest",
  "inbox/ingest-candidates",
  "inbox/compile-candidates",
  "inbox/promotion-candidates",
  "inbox/conflict-review",
  "inbox/stale-review",
  "inbox/sync-review",
  "wiki/overview",
  "wiki/glossary",
  "wiki/concepts",
  "wiki/teams",
  "wiki/projects",
  "wiki/systems",
  "wiki/practices",
  "wiki/runbooks",
  "wiki/decisions",
  "wiki/learning",
  "wiki/mirrored",
  "persons",
  "schemas",
  "templates",
  "prompts",
  "scripts",
  "indexes",
  "graph",
  "logs",
  "exports",
  "site",
];

for (const directory of directories) {
  const fullPath = join(repoRoot, directory);
  mkdirSync(fullPath, { recursive: true });

  const keepPath = join(fullPath, ".gitkeep");
  if (!existsSync(keepPath)) {
    closeSync(openSync(keepPath, "w"));
  }
}

console.log("skeleton directories ensured");
