import { displayPath, failIfErrors, getString, listDirs, parseFrontmatter, readText } from "./lib.ts";

const errors = [];

for (const dir of listDirs("personal")) {
  const path = displayPath(dir);
  const id = path.split("/").pop() ?? "";
  if (!/^[0-9]{8}$/.test(id)) {
    errors.push(`${path}: personal directory name must be exactly 8 digits`);
    continue;
  }
  const profile = `${dir}/profile.md`;
  let parsed = null;
  try {
    parsed = parseFrontmatter(readText(profile));
  } catch {
    errors.push(`${path}/profile.md: missing profile file`);
    continue;
  }
  if (!parsed) {
    errors.push(`${path}/profile.md: missing frontmatter`);
    continue;
  }
  if (getString(parsed.data, "staff_id") !== id) errors.push(`${path}/profile.md: staff_id must match directory name`);
  if (getString(parsed.data, "id") !== `staff:${id}`) errors.push(`${path}/profile.md: id must be staff:${id}`);
  if (getString(parsed.data, "type") !== "profile") errors.push(`${path}/profile.md: type must be profile`);
}

failIfErrors(errors, "personal profile check passed");
