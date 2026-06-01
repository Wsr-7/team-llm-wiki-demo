import { displayPath, failIfErrors, getArray, getString, listFiles, parseFrontmatter, readText } from "./lib.ts";

const allowedOrigin = new Set(["raw", "personal", "mirror", "query", "manual"]);
const allowedIntent = new Set(["ingest", "compile", "promotion", "sync"]);
const allowedStatus = new Set(["proposed", "in_review", "promoted", "rejected", "superseded"]);
const errors = [];

for (const file of listFiles("inbox/candidates", [".md"])) {
  const path = displayPath(file);
  const parsed = parseFrontmatter(readText(file));
  if (!parsed) { errors.push(`${path}: missing frontmatter`); continue; }
  const origin = getString(parsed.data, "candidate_origin");
  const intent = getString(parsed.data, "candidate_intent");
  const status = getString(parsed.data, "candidate_status");
  if (!origin || !allowedOrigin.has(origin)) errors.push(`${path}: invalid candidate_origin`);
  if (!intent || !allowedIntent.has(intent)) errors.push(`${path}: invalid candidate_intent`);
  if (!status || !allowedStatus.has(status)) errors.push(`${path}: invalid candidate_status`);
  if (getArray(parsed.data, "source_refs").length === 0) errors.push(`${path}: missing source_refs`);
  if (!parsed.body.includes("## Source Understanding")) errors.push(`${path}: missing Source Understanding section`);
  if (!parsed.body.includes("## Wiki Proposal")) errors.push(`${path}: missing Wiki Proposal section`);
}

failIfErrors(errors, "candidate check passed");
