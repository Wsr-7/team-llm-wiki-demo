// Regenerates INDEX.md from wiki/ frontmatter and page bodies.
// Run after adding, moving, or retitling pages: node scripts/build-index.ts
import { writeFileSync } from "node:fs";
import { collectWikiPages, buildIndexContent, repoPath } from "./lib.ts";

const pages = collectWikiPages();
const broken = pages.filter((page) => page.parseError || !page.title);
for (const page of broken) {
  console.warn(`WARN  ${page.path}: ${page.parseError ?? "missing # Title"} — indexed with fallbacks, fix and rebuild`);
}
writeFileSync(repoPath("INDEX.md"), `${buildIndexContent(pages).trimEnd()}\n`, "utf8");
console.log(`INDEX.md written: ${pages.length} page(s)`);
