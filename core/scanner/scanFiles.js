import path from "path";
import fs from "fs-extra";
import fg from "fast-glob";
import {
  DEFAULT_IGNORES,
  MAX_FILE_SIZE_BYTES,
  SOURCE_GLOBS,
} from "../shared/constants.js";
import { toProjectPath } from "../shared/paths.js";

async function buildFileMeta(workspacePath, relPath) {
  const absolutePath = path.join(workspacePath, relPath);
  const stats = await fs.stat(absolutePath);
  const extension = path.extname(relPath).toLowerCase();

  return {
    relPath,
    extension,
    size: stats.size,
    modifiedAt: stats.mtimeMs,
  };
}

export async function scanFiles(workspacePath, { previousStamp = {} } = {}) {
  const matches = new Set();

  for (const pattern of SOURCE_GLOBS) {
    const found = fg.sync(pattern, {
      cwd: workspacePath,
      dot: false,
      onlyFiles: true,
      ignore: DEFAULT_IGNORES,
    });

    for (const relPath of found) {
      matches.add(toProjectPath(relPath));
    }
  }

  const files = [];
  const changedFiles = [];
  const nextStamp = {};

  for (const relPath of [...matches].sort()) {
    const meta = await buildFileMeta(workspacePath, relPath);
    nextStamp[relPath] = meta.modifiedAt;

    if (meta.size > MAX_FILE_SIZE_BYTES) {
      continue;
    }

    files.push(meta);

    if (!previousStamp[relPath] || previousStamp[relPath] !== meta.modifiedAt) {
      changedFiles.push(meta.relPath);
    }
  }

  const removedFiles = Object.keys(previousStamp).filter(
    (relPath) => !nextStamp[relPath],
  );

  return {
    workspacePath,
    files,
    changedFiles,
    removedFiles,
    nextStamp,
    snapshotAt: new Date().toISOString(),
    stats: {
      files: files.length,
      changedFiles: changedFiles.length,
      removedFiles: removedFiles.length,
    },
  };
}
