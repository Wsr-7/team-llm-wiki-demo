import { displayPath, failIfErrors, listFiles, readText } from "./lib.ts";

const files = listFiles(".", [".md", ".json", ".yaml", ".yml", ".ts"])
  .filter((path) => !displayPath(path).startsWith(".git/"));
const errors = [];

for (const file of files) {
  const text = readText(file);
  for (const match of text.matchAll(/staff:[0-9A-Za-z_-]+/g)) {
    if (!/^staff:[0-9]{8}$/.test(match[0])) {
      errors.push(`${displayPath(file)}: invalid staff id ${match[0]}`);
    }
  }
}

failIfErrors(errors, "staff-id check passed");
