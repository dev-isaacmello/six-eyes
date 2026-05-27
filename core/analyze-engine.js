import { buildDependencyGraph } from "./dependency-engine/buildDependencyGraph.js";
import { scanProject } from "./scanner/scanProject.js";
import { buildSemanticMap } from "./semantic-engine/buildSemanticMap.js";

export async function analyzeProject(workspacePath) {
  const scan = await scanProject(workspacePath);
  const dependency = await buildDependencyGraph(workspacePath, scan);

  return buildSemanticMap(workspacePath, scan, dependency);
}
