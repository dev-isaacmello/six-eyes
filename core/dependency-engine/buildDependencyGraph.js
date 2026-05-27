import { scanProject } from "../scanner/scanProject.js";
import { resolveImportCandidates } from "../scanner/scanImports.js";
import { detectCycles } from "./detectCycles.js";
import { detectHotspots } from "./detectHotspots.js";
import { detectViolations } from "./detectViolations.js";

function resolveKnownImports(file, imports, knownFiles) {
  const resolved = imports.flatMap((specifier) => {
    const candidates = resolveImportCandidates(file, specifier);
    if (!candidates) {
      return [];
    }

    return candidates.filter((candidate) => knownFiles.has(candidate));
  });

  return [...new Set(resolved)];
}

export async function buildDependencyGraph(workspacePath, scan = null) {
  const projectScan = scan ?? (await scanProject(workspacePath));
  const knownFiles = new Set(projectScan.files.map((file) => file.relPath));
  const importsByFile = new Map(
    (projectScan.imports ?? []).map((entry) => [entry.file, entry.imports]),
  );

  const graph = {};
  let edgeCount = 0;

  for (const file of projectScan.files) {
    const resolved = resolveKnownImports(
      file.relPath,
      importsByFile.get(file.relPath) ?? [],
      knownFiles,
    );

    edgeCount += resolved.length;
    graph[file.relPath] = resolved;
  }

  const cycles = detectCycles(graph);
  const hotspots = detectHotspots(graph);
  const layerViolations = detectViolations(graph);

  return {
    graph,
    cycles,
    hotspots,
    layerViolations,
    metrics: {
      files: projectScan.files.length,
      edges: edgeCount,
    },
  };
}
