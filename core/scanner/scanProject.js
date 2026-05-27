import path from "path";
import fs from "fs-extra";
import { readIndexState } from "../memory-engine.js";
import { getRelativePath } from "../shared/paths.js";
import { scanFiles } from "./scanFiles.js";
import { scanImports } from "./scanImports.js";
import { scanSymbols } from "./scanSymbols.js";

export async function readFileText(workspacePath, relPath) {
  const absolute = path.join(workspacePath, relPath);
  return fs.readFile(absolute, "utf8");
}

export async function scanProject(workspacePath) {
  const indexState = await readIndexState(workspacePath);
  const fileScan = await scanFiles(workspacePath, {
    previousStamp: indexState.fileStamp ?? {},
  });

  const filesWithContent = [];
  for (const file of fileScan.files) {
    filesWithContent.push({
      ...file,
      content: await readFileText(workspacePath, file.relPath),
    });
  }

  return {
    ...fileScan,
    imports: scanImports(filesWithContent),
    symbols: scanSymbols(filesWithContent),
  };
}

export function normalizePath(workspacePath, filePath) {
  return getRelativePath(workspacePath, filePath);
}
