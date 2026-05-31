import {
  displayPath,
  failIfErrors,
  getArray,
  getString,
  listFiles,
  parseFrontmatter,
  readText,
} from "./kb-lib.ts";

const sourceIds = new Set<string>();
const errors: string[] = [];

for (const manifest of listFiles("raw", [".md"])) {
  if (!displayPath(manifest).endsWith("/manifest.md")) {
    continue;
  }
  const parsed = parseFrontmatter(readText(manifest));
  const id = parsed ? getString(parsed.data, "id") : null;
  if (id) {
    sourceIds.add(id);
  }
}

for (const mirror of listFiles("confluence-mirror", [".md"])) {
  const parsed = parseFrontmatter(readText(mirror));
  const id = parsed ? getString(parsed.data, "id") : null;
  if (id) {
    sourceIds.add(id);
  }
}

for (const page of listFiles("wiki", [".md"])) {
  const parsed = parseFrontmatter(readText(page));
  if (!parsed) {
    continue;
  }

  const status = getString(parsed.data, "status");
  const refs = getArray(parsed.data, "source_refs");
  if (status === "active" && refs.length === 0) {
    errors.push(`${displayPath(page)}: active page missing source_refs`);
  }
  for (const ref of refs) {
    if (!sourceIds.has(ref)) {
      errors.push(`${displayPath(page)}: unknown source_ref ${ref}`);
    }
  }
}

failIfErrors(errors, "source_refs check passed");
