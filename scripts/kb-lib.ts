import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

export type Frontmatter = Record<string, unknown>;

export const repoRoot = process.cwd();

export function repoPath(path: string): string {
  return join(repoRoot, path);
}

export function displayPath(path: string): string {
  return relative(repoRoot, path).replaceAll("\\", "/");
}

export function listFiles(root: string, extensions: string[]): string[] {
  const start = repoPath(root);
  if (!existsSync(start)) {
    return [];
  }

  const files: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }
      if (extensions.some((extension) => entry.name.endsWith(extension))) {
        files.push(fullPath);
      }
    }
  };
  walk(start);
  return files.sort();
}

export function readText(path: string): string {
  return readFileSync(path, "utf8");
}

export function pathExists(path: string): boolean {
  return existsSync(repoPath(path));
}

export function isDirectory(path: string): boolean {
  const fullPath = repoPath(path);
  return existsSync(fullPath) && statSync(fullPath).isDirectory();
}

export function parseFrontmatter(text: string): { data: Frontmatter; body: string } | null {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    return null;
  }

  const data: Frontmatter = {};
  const lines = match[1].split(/\r?\n/);
  let activeArrayKey: string | null = null;

  for (const line of lines) {
    const arrayItem = line.match(/^\s+-\s*(.*)$/);
    if (activeArrayKey && arrayItem) {
      (data[activeArrayKey] as unknown[]).push(parseScalar(arrayItem[1]));
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

  return {
    data,
    body: text.slice(match[0].length),
  };
}

export function getString(data: Frontmatter, key: string): string | null {
  const value = data[key];
  return typeof value === "string" ? value : null;
}

export function getNumber(data: Frontmatter, key: string): number | null {
  const value = data[key];
  return typeof value === "number" ? value : null;
}

export function getArray(data: Frontmatter, key: string): string[] {
  const value = data[key];
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
}

export function failIfErrors(errors: string[], successMessage: string): void {
  if (errors.length > 0) {
    for (const error of errors) {
      console.error(error);
    }
    process.exit(1);
  }
  console.log(successMessage);
}

function parseScalar(rawValue: string): unknown {
  const value = rawValue.trim();
  if (value === "[]") {
    return [];
  }
  if (value === "null" || value === "~") {
    return null;
  }
  if (/^-?\d+(?:\.\d+)?$/.test(value)) {
    return Number(value);
  }
  return value.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
}
