import { readJsonFile, writeJsonFile } from "../shared/cache.js";
import { getMapPath } from "../shared/paths.js";

export async function updateMemory(workspacePath, mapName, patch) {
  const filePath = getMapPath(workspacePath, mapName);
  const current = await readJsonFile(filePath, {});
  const next = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  await writeJsonFile(filePath, next);
  return next;
}
