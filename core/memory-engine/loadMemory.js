import { MAP_FILES } from "../shared/constants.js";
import { readJsonFile } from "../shared/cache.js";
import { getMapPath } from "../shared/paths.js";

export async function loadMemory(workspacePath) {
  const entries = await Promise.all(
    Object.entries(MAP_FILES).map(async ([name]) => [
      name,
      await readJsonFile(getMapPath(workspacePath, name), null),
    ]),
  );

  return Object.fromEntries(entries.filter(([, value]) => value !== null));
}
