import path from "path";
import fs from "fs-extra";
import { LEGACY_MAP_FILES, MAP_FILES, STATE_DIRNAME } from "./constants.js";
import { readJsonFile } from "./shared/cache.js";
import { getMapPath, getStateDir } from "./shared/paths.js";
import { persistMemory } from "./memory-engine/persistMemory.js";

function legacyMapPath(workspacePath, mapName) {
  return path.join(getStateDir(workspacePath), LEGACY_MAP_FILES[mapName]);
}

async function listFilesRecursive(dir, root = dir) {
  if (!(await fs.pathExists(dir))) {
    return [];
  }

  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFilesRecursive(absolute, root)));
      continue;
    }

    files.push(path.relative(root, absolute).replaceAll("\\", "/"));
  }

  return files;
}

export async function ensureStateDirectory(workspacePath) {
  await fs.ensureDir(path.join(workspacePath, STATE_DIRNAME));
}

export async function persistAnalysisMaps(workspacePath, analysis) {
  await ensureStateDirectory(workspacePath);
  await persistMemory(workspacePath, analysis);
}

export async function readStoredMaps(workspacePath) {
  await ensureStateDirectory(workspacePath);
  return (await listFilesRecursive(getStateDir(workspacePath))).sort();
}

export async function readIndexState(workspacePath) {
  await ensureStateDirectory(workspacePath);

  const indexState = await readJsonFile(getMapPath(workspacePath, "indexState"), null);
  if (indexState) {
    return indexState;
  }

  return readJsonFile(legacyMapPath(workspacePath, "indexState"), {
    generatedAt: null,
    fileStamp: {},
  });
}

export { compressMemory } from "./memory-engine/compressMemory.js";
export { loadMemory } from "./memory-engine/loadMemory.js";
export { persistMemory } from "./memory-engine/persistMemory.js";
export { updateMemory } from "./memory-engine/updateMemory.js";
export { MAP_FILES };
