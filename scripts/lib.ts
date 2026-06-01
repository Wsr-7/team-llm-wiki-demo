import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

export const repoRoot = process.cwd();

export function repoPath(path) {
  return join(repoRoot, path);
}

export function displayPath(path) {
  return relative(repoRoot, path).replaceAll("\\", "/");
}

export function pathExists(path) {
  return existsSync(repoPath(path));
}

export function listFiles(root, extensions) {
  const start = repoPath(root);
  if (!existsSync(start)) return [];
  const files = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === ".git") continue;
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      else if (extensions.some((extension) => entry.name.endsWith(extension))) files.push(fullPath);
    }
  };
  walk(start);
  return files.sort();
}

export function listDirs(root) {
  const start = repoPath(root);
  if (!existsSync(start)) return [];
  return readdirSync(start, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(start, entry.name));
}

export function readText(path) {
  return readFileSync(path, "utf8");
}

export function isDirectory(path) {
  const fullPath = repoPath(path);
  return existsSync(fullPath) && statSync(fullPath).isDirectory();
}

export function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return null;
  const data = {};
  const lines = match[1].split(/\r?\n/);
  let activeArrayKey = null;
  for (const line of lines) {
    const arrayItem = line.match(/^\s+-\s*(.*)$/);
    if (activeArrayKey && arrayItem) {
      data[activeArrayKey].push(parseScalar(arrayItem[1]));
      continue;
    }
    const keyValue = line.match(/^([A-Za-z_][A-Za-z0-9_-]*):(?:\s*(.*))?$/);
    if (!keyValue) {
      activeArrayKey = null;
      continue;
    }
    const [, key, rawValue = ""] = keyValue;
    const value = rawValue.trim();
    if (value === "") {
      data[key] = [];
      activeArrayKey = key;
      continue;
    }
    data[key] = parseScalar(value);
    activeArrayKey = null;
  }
  return { data, body: text.slice(match[0].length) };
}

export function getString(data, key) {
  return typeof data[key] === "string" ? data[key] : null;
}

export function getNumber(data, key) {
  return typeof data[key] === "number" ? data[key] : null;
}

export function getArray(data, key) {
  const value = data[key];
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}

export function failIfErrors(errors, successMessage) {
  if (errors.length > 0) {
    for (const error of errors) console.error(error);
    process.exit(1);
  }
  console.log(successMessage);
}

function parseScalar(rawValue) {
  const value = rawValue.trim();
  if (value === "[]") return [];
  if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(",").map((part) => parseScalar(part.trim()));
  }
  if (value === "null" || value === "~") return null;
  if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
  return value.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
}
