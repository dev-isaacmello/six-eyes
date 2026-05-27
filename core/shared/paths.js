import path from "path";
import { MAP_FILES, STATE_DIRNAME } from "./constants.js";

export function toProjectPath(filePath) {
  return String(filePath).replaceAll("\\", "/");
}

export function getStateDir(workspacePath) {
  return path.join(workspacePath, STATE_DIRNAME);
}

export function getMapPath(workspacePath, mapName) {
  const mapFile = MAP_FILES[mapName] ?? mapName;
  return path.join(getStateDir(workspacePath), mapFile);
}

export function getRelativePath(workspacePath, absoluteFilePath) {
  return toProjectPath(path.relative(workspacePath, absoluteFilePath));
}
