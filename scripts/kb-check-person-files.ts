import {
  displayPath,
  failIfErrors,
  getString,
  listFiles,
  parseFrontmatter,
  readText,
} from "./kb-lib.ts";

const errors: string[] = [];

for (const file of listFiles("persons", [".md"])) {
  const name = displayPath(file).split("/").pop()?.replace(/\.md$/, "") ?? "";
  if (!/^[0-9]{8}$/.test(name)) {
    errors.push(`${displayPath(file)}: person file name must be exactly 8 digits`);
    continue;
  }

  const parsed = parseFrontmatter(readText(file));
  if (!parsed) {
    errors.push(`${displayPath(file)}: missing frontmatter`);
    continue;
  }

  if (getString(parsed.data, "staff_id") !== name) {
    errors.push(`${displayPath(file)}: staff_id must match file name`);
  }
  if (getString(parsed.data, "id") !== `staff:${name}`) {
    errors.push(`${displayPath(file)}: id must be staff:${name}`);
  }
}

failIfErrors(errors, "person file check passed");
