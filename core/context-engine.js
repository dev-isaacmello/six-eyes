import {
  buildContextWindow,
  renderContextWindow,
} from "./context-engine/buildContextWindow.js";
import { rankFiles } from "./context-engine/rankFiles.js";

export function generateContextSummary(analysis, { top = 10 } = {}) {
  return renderContextWindow(buildContextWindow(analysis, { top }));
}

export function buildContextRankings(analysis) {
  return rankFiles(analysis);
}

export { buildContextWindow, renderContextWindow };
export { rankFiles } from "./context-engine/rankFiles.js";
export { scoreImportance } from "./context-engine/scoreImportance.js";
export { semanticSearch } from "./context-engine/semanticSearch.js";
