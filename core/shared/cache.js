import fs from "fs-extra";

export async function readJsonFile(filePath, fallback = {}) {
  if (!(await fs.pathExists(filePath))) {
    return fallback;
  }

  return fs.readJson(filePath);
}

export async function writeJsonFile(filePath, data) {
  await fs.outputJson(filePath, data, { spaces: 2 });
}
