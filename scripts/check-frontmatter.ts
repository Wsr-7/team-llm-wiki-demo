import { displayPath, failIfErrors, getArray, getNumber, getString, listFiles, parseFrontmatter, readText } from "./lib.ts";

const requiredFields = ["id", "title", "type", "status", "review_state", "confidence", "visibility", "owners", "source_refs", "related", "created_at", "updated_at"];
const allowedTypes = new Set(["overview", "glossary", "concept", "team", "project", "system", "practice", "runbook", "decision", "learning", "mirrored"]);
const allowedStatus = new Set(["draft", "candidate", "active", "stale", "superseded", "archived"]);
const allowedReviewState = new Set(["unreviewed", "reviewed", "needs-review", "disputed"]);
const allowedVisibility = new Set(["internal", "restricted", "confidential"]);
const typeDirs = { overview: "wiki/overview/", glossary: "wiki/glossary/", concept: "wiki/concepts/", team: "wiki/teams/", project: "wiki/projects/", system: "wiki/systems/", practice: "wiki/practices/", runbook: "wiki/runbooks/", decision: "wiki/decisions/", learning: "wiki/learning/", mirrored: "wiki/mirrored/" };
const errors = [];

for (const file of listFiles("wiki", [".md"])) {
  const path = displayPath(file);
  const parsed = parseFrontmatter(readText(file));
  if (!parsed) { errors.push(`${path}: missing frontmatter`); continue; }
  const { data } = parsed;
  for (const field of requiredFields) if (!(field in data)) errors.push(`${path}: missing ${field}`);
  const type = getString(data, "type");
  if (!type || !allowedTypes.has(type)) errors.push(`${path}: invalid type ${String(data.type)}`);
  else if (!path.startsWith(typeDirs[type])) errors.push(`${path}: type ${type} must live under ${typeDirs[type]}`);
  const status = getString(data, "status");
  if (!status || !allowedStatus.has(status)) errors.push(`${path}: invalid status ${String(data.status)}`);
  const reviewState = getString(data, "review_state");
  if (!reviewState || !allowedReviewState.has(reviewState)) errors.push(`${path}: invalid review_state ${String(data.review_state)}`);
  const visibility = getString(data, "visibility");
  if (!visibility || !allowedVisibility.has(visibility)) errors.push(`${path}: invalid visibility ${String(data.visibility)}`);
  const confidence = getNumber(data, "confidence");
  if (confidence === null || confidence < 0 || confidence > 1) errors.push(`${path}: confidence must be a number between 0 and 1`);
  const owners = getArray(data, "owners");
  if (owners.length === 0) errors.push(`${path}: owners must contain at least one staff id`);
  for (const owner of owners) if (!/^staff:[0-9]{8}$/.test(owner)) errors.push(`${path}: invalid owner ${owner}`);
  if (getString(data, "status") === "active" && getArray(data, "source_refs").length === 0) errors.push(`${path}: active page must contain source_refs`);
}

failIfErrors(errors, "frontmatter check passed");
