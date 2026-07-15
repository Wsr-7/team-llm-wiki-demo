// Executable schema for the knowledge base. Documented rules live in
// schemas/frontmatter.md and schemas/person.md; this enforces the
// machine-checkable subset. Zero dependencies, run with: node scripts/check.ts
import {
  collectWikiPages,
  buildIndexContent,
  listFiles,
  readText,
  displayPath,
  fileExists,
  resolveLink,
  reportAndExit,
  repoPath,
} from "./lib.ts";
import { posix } from "node:path";

const errors = [];
const warnings = [];

const STAFF_ID = /^staff:\d{8}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const ALLOWED_FIELDS = new Set(["owner", "updated", "verified", "sources", "status", "superseded_by", "tags"]);
const ALLOWED_STATUS = new Set(["needs-review", "superseded"]);
const SOURCES_REQUIRED_SECTIONS = new Set(["troubleshooting", "runbooks", "decisions"]);
const ALLOWED_SECTIONS = new Set(["troubleshooting", "runbooks", "systems", "decisions", "concepts", "guides"]);

// --- team/people.md: collect known staff ids ---
const knownStaffIds = new Set();
if (fileExists("team/people.md")) {
  for (const match of readText(repoPath("team/people.md")).matchAll(/staff:\d{8}/g)) {
    knownStaffIds.add(match[0]);
  }
} else {
  errors.push("team/people.md is missing");
}

// --- wiki pages ---
const pages = collectWikiPages();
for (const page of pages) {
  const at = page.path;

  if (page.parseError) {
    errors.push(`${at}: ${page.parseError}`);
    continue;
  }

  // location = type
  if (page.path !== "wiki/glossary.md" && !ALLOWED_SECTIONS.has(page.section ?? "")) {
    errors.push(`${at}: pages must live in wiki/{${[...ALLOWED_SECTIONS].join("|")}}/ or be wiki/glossary.md (see schemas/frontmatter.md)`);
  }

  // field allowlist
  for (const key of Object.keys(page.data)) {
    if (!ALLOWED_FIELDS.has(key)) errors.push(`${at}: unknown frontmatter field "${key}" — propose schema changes via schemas/ first`);
  }

  // owner
  const owner = page.data.owner;
  if (typeof owner !== "string" || !STAFF_ID.test(owner)) {
    errors.push(`${at}: "owner" is required and must match staff:######## (8 digits)`);
  } else if (!knownStaffIds.has(owner)) {
    errors.push(`${at}: owner ${owner} is not listed in team/people.md`);
  } else if (owner === "staff:00000000") {
    warnings.push(`${at}: owner is the system placeholder staff:00000000 — assign a real owner`);
  }

  // updated
  const updated = page.data.updated;
  if (typeof updated !== "string" || !DATE.test(updated) || Number.isNaN(Date.parse(updated))) {
    errors.push(`${at}: "updated" is required and must be a valid YYYY-MM-DD date`);
  } else if (Date.parse(updated) > Date.now() + 24 * 3600 * 1000) {
    warnings.push(`${at}: "updated" (${updated}) is in the future`);
  }

  // sources
  const sources = page.data.sources;
  if (SOURCES_REQUIRED_SECTIONS.has(page.section ?? "")) {
    if (!Array.isArray(sources) || sources.length === 0) {
      errors.push(`${at}: pages under wiki/${page.section}/ require a non-empty "sources" list`);
    }
  }
  if (sources !== undefined && !Array.isArray(sources)) errors.push(`${at}: "sources" must be a list`);

  // status / superseded_by
  const status = page.data.status;
  if (status !== undefined && !ALLOWED_STATUS.has(status)) {
    errors.push(`${at}: "status" must be one of ${[...ALLOWED_STATUS].join(" | ")} (absent = current)`);
  }
  if (status === "superseded") {
    const target = page.data.superseded_by;
    if (typeof target !== "string" || target.length === 0) {
      errors.push(`${at}: status superseded requires "superseded_by"`);
    } else if (!fileExists(target)) {
      errors.push(`${at}: superseded_by target does not exist: ${target}`);
    }
  } else if (page.data.superseded_by !== undefined) {
    errors.push(`${at}: "superseded_by" is only allowed together with status: superseded`);
  }

  // verified (optional: date the procedure was last validated for real)
  const verified = page.data.verified;
  if (verified !== undefined && (typeof verified !== "string" || !DATE.test(verified) || Number.isNaN(Date.parse(verified)))) {
    errors.push(`${at}: "verified" must be a valid YYYY-MM-DD date when present`);
  }

  // tags
  if (page.data.tags !== undefined && !Array.isArray(page.data.tags)) errors.push(`${at}: "tags" must be a list`);

  // body
  if (!page.title) errors.push(`${at}: body must start with a "# Title" heading (INDEX generation depends on it)`);
  const lineCount = page.body.split("\n").length;
  if (lineCount > 200) warnings.push(`${at}: ${lineCount} lines — split pages over 200 lines`);
  if ((page.section === "runbooks" || page.section === "troubleshooting") && !/^##\s+Source excerpts/im.test(page.body)) {
    warnings.push(`${at}: no "## Source excerpts" section — quote the load-bearing evidence (see schemas/frontmatter.md)`);
  }
}

// --- superseded_by chain cycle detection ---
const byPath = new Map(pages.map((page) => [page.path, page]));
for (const page of pages) {
  if (page.data?.status !== "superseded") continue;
  const seen = new Set([page.path]);
  let target = page.data.superseded_by;
  while (typeof target === "string" && byPath.has(target)) {
    if (seen.has(target)) {
      errors.push(`${page.path}: superseded_by chain contains a cycle (${[...seen, target].join(" → ")})`);
      break;
    }
    seen.add(target);
    target = byPath.get(target).data?.superseded_by;
  }
}

// --- internal links ---
const LINK = /\[[^\]]*\]\(([^)]+)\)/g;
const linkScanFiles = [
  ...listFiles("wiki", [".md"]),
  ...listFiles("team", [".md"]),
  ...["README.md", "AGENTS.md"].filter((file) => fileExists(file)).map((file) => repoPath(file)),
];
for (const fullPath of linkScanFiles) {
  const from = displayPath(fullPath);
  const withoutFences = readText(fullPath).split(/```[\s\S]*?```/).join("\n");
  for (const match of withoutFences.matchAll(LINK)) {
    const rawTarget = match[1].trim();
    if (/^(https?:|mailto:|#)/.test(rawTarget)) continue;
    const target = rawTarget.split("#")[0].split(" ")[0];
    if (target === "") continue;
    const resolved = resolveLink(from, target);
    if (!fileExists(resolved)) errors.push(`${from}: broken link → ${rawTarget}`);
  }
}

// --- INDEX freshness (warning only: a bot rebuilds INDEX.md on main after
// merge, see .github/workflows/rebuild-index.yml; keeping this an error would
// make INDEX.md a merge-conflict magnet across concurrent PRs) ---
if (!fileExists("INDEX.md")) {
  errors.push("INDEX.md is missing — run: npm run build-index");
} else {
  const current = readText(repoPath("INDEX.md")).replace(/\r\n/g, "\n").trimEnd();
  const expected = buildIndexContent(pages).trimEnd();
  if (current !== expected) warnings.push("INDEX.md is out of date (auto-rebuilt on main after merge; run npm run build-index locally to silence)");
}

// --- inbox naming (warning only: inbox stays zero-friction) ---
for (const fullPath of listFiles("inbox", [".md"])) {
  const name = posix.basename(displayPath(fullPath));
  if (!/^\d{4}-\d{2}-\d{2}-.+\.md$/.test(name)) {
    warnings.push(`inbox/${name}: prefer the naming convention YYYY-MM-DD-<slug>.md`);
  }
}

reportAndExit(errors, warnings, `check passed: ${pages.length} wiki page(s), ${linkScanFiles.length} file(s) link-scanned`);
