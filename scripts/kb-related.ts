import {
  displayPath,
  getArray,
  getString,
  listFiles,
  parseFrontmatter,
  readText,
} from "./kb-lib.ts";

type Page = {
  id: string;
  path: string;
  text: string;
  sourceRefs: string[];
};

const targetArg = process.argv[2];
if (!targetArg) {
  console.error("Usage: node scripts/kb-related.ts <page-id-or-path>");
  process.exit(1);
}

const pages: Page[] = [];
for (const file of listFiles("wiki", [".md"])) {
  const text = readText(file);
  const parsed = parseFrontmatter(text);
  const id = parsed ? getString(parsed.data, "id") : null;
  if (!id) {
    continue;
  }
  pages.push({
    id,
    path: displayPath(file),
    text,
    sourceRefs: getArray(parsed.data, "source_refs"),
  });
}

const target = pages.find((page) => page.id === targetArg || page.path.includes(targetArg));
if (!target) {
  console.error(`Page not found: ${targetArg}`);
  process.exit(1);
}

const related = new Map<string, Set<string>>();
const addRelation = (to: string, reason: string) => {
  if (!related.has(to)) {
    related.set(to, new Set());
  }
  related.get(to)?.add(reason);
};

for (const match of target.text.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g)) {
  addRelation(match[1], "direct-wikilink");
}

for (const page of pages) {
  if (page.id === target.id) {
    continue;
  }
  if (page.text.includes(`[[${target.id}]]`)) {
    addRelation(page.id, "backlink");
  }
  for (const sourceRef of target.sourceRefs) {
    if (page.sourceRefs.includes(sourceRef)) {
      addRelation(page.id, `shared-source ${sourceRef}`);
    }
  }
}

for (const [to, reasons] of [...related.entries()].sort(([left], [right]) => left.localeCompare(right))) {
  for (const reason of [...reasons].sort()) {
    console.log(`${to}\t${reason}`);
  }
}
