import { scoreImportance } from "./scoreImportance.js";

export function rankFiles(analysis) {
  return analysis.scan.files
    .map((file) => ({
      file: file.relPath,
      score: scoreImportance(file, analysis),
    }))
    .sort((a, b) => b.score - a.score);
}
