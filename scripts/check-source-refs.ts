import { displayPath, failIfErrors, getArray, getString, listFiles, parseFrontmatter, readText } from "./lib.ts";

const sourceIds = new Set();
const errors = [];

for (const manifest of listFiles("raw", [".md"])) {
  if (!displayPath(manifest).endsWith("/manifest.md")) continue;
  const parsed = parseFrontmatter(readText(manifest));
  const id = parsed ? getString(parsed.data, "id") : null;
  if (id) sourceIds.add(id);
}

for (const mirror of listFiles("confluence-mirror", [".md"])) {
  const parsed = parseFrontmatter(readText(mirror));
  const id = parsed ? getString(parsed.data, "id") : null;
  if (id) sourceIds.add(id);
}

for (const page of listFiles("wiki", [".md"])) {
  const parsed = parseFrontmatter(readText(page));
  if (!parsed) continue;
  for (const ref of getArray(parsed.data, "source_refs")) {
    if (!sourceIds.has(ref)) errors.push(`${displayPath(page)}: unknown source_ref ${ref}`);
  }
}

for (const candidate of listFiles("inbox/candidates", [".md"])) {
  const parsed = parseFrontmatter(readText(candidate));
  if (!parsed) continue;
  for (const ref of getArray(parsed.data, "source_refs")) {
    if (!sourceIds.has(ref)) errors.push(`${displayPath(candidate)}: unknown source_ref ${ref}`);
  }
}

failIfErrors(errors, "source_refs check passed");
