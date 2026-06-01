import { existsSync } from "node:fs";
import { dirname, join, normalize } from "node:path";
import { displayPath, failIfErrors, listFiles, readText, repoRoot } from "./lib.ts";

const errors = [];
const markdownLinkPattern = /\[[^\]]+\]\(([^)]+)\)/g;
const wikiLinkPattern = /\[\[([^\]]+)\]\]/g;

for (const file of listFiles(".", [".md"])) {
  const path = displayPath(file);
  if (path.startsWith(".git/")) continue;
  const text = readText(file);
  for (const match of text.matchAll(markdownLinkPattern)) {
    const target = match[1];
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    const clean = target.split("#")[0];
    if (!clean) continue;
    const resolved = normalize(join(dirname(file), clean));
    if (!existsSync(resolved)) errors.push(`${path}: broken markdown link ${target}`);
  }
  for (const match of text.matchAll(wikiLinkPattern)) {
    const target = match[1];
    const resolved = join(repoRoot, target);
    if (!existsSync(resolved)) errors.push(`${path}: broken wikilink ${target}`);
  }
}

failIfErrors(errors, "link check passed");
