import { getMapPath } from "../shared/paths.js";
import { writeJsonFile } from "../shared/cache.js";
import { buildContextRankings, buildContextWindow } from "../context-engine.js";

export async function persistMemory(workspacePath, analysis) {
  const architectureMemory = {
    generatedAt: analysis.generatedAt,
    detected: analysis.architecture.detected,
    layers: analysis.architecture.layers,
    entrypoints: analysis.architecture.entrypoints ?? [],
  };

  const dependencyGraph = {
    generatedAt: analysis.generatedAt,
    graph: analysis.dependency.graph,
    cycles: analysis.dependency.cycles,
    hotspots: analysis.dependency.hotspots,
    layerViolations: analysis.dependency.layerViolations,
    metrics: analysis.dependency.metrics,
  };

  const semanticMap = {
    generatedAt: analysis.generatedAt,
    frameworks: analysis.frameworks.detected,
    architecture: analysis.architecture.detected,
    entrypoints: analysis.architecture.entrypoints ?? [],
    guidance: analysis.summary.guidance,
    cognitionScore: analysis.summary.cognitionScore,
  };

  const domainMap = {
    generatedAt: analysis.generatedAt,
    boundaries: analysis.domain.boundaries,
  };

  const symbolMap = {
    generatedAt: analysis.generatedAt,
    files: analysis.symbols?.files ?? [],
  };

  const contextWindow = buildContextWindow(analysis, {
    top: analysis.scan.files.length,
  });

  const projectMemory = {
    generatedAt: analysis.generatedAt,
    planner: {
      architecture: architectureMemory.detected,
      entrypoints: architectureMemory.entrypoints,
      dependencyRisks:
        dependencyGraph.cycles.length + dependencyGraph.layerViolations.length,
    },
    reviewer: {
      hotspots: dependencyGraph.hotspots.slice(0, 10),
      guidance: semanticMap.guidance,
    },
    security: {
      guidance: semanticMap.guidance.filter((item) =>
        item.toLowerCase().includes("auth"),
      ),
    },
  };

  await Promise.all([
    writeJsonFile(getMapPath(workspacePath, "architecture"), architectureMemory),
    writeJsonFile(getMapPath(workspacePath, "dependencyGraph"), dependencyGraph),
    writeJsonFile(getMapPath(workspacePath, "semantic"), semanticMap),
    writeJsonFile(getMapPath(workspacePath, "domain"), domainMap),
    writeJsonFile(getMapPath(workspacePath, "symbol"), symbolMap),
    writeJsonFile(getMapPath(workspacePath, "hotspots"), {
      generatedAt: analysis.generatedAt,
      hotspots: analysis.dependency.hotspots,
    }),
    writeJsonFile(getMapPath(workspacePath, "violations"), {
      generatedAt: analysis.generatedAt,
      violations: analysis.dependency.layerViolations,
    }),
    writeJsonFile(getMapPath(workspacePath, "contextWindow"), {
      ...contextWindow,
      rankings: buildContextRankings(analysis),
    }),
    writeJsonFile(getMapPath(workspacePath, "projectMemory"), projectMemory),
    writeJsonFile(getMapPath(workspacePath, "decisions"), {
      generatedAt: analysis.generatedAt,
      decisions: [],
    }),
    writeJsonFile(getMapPath(workspacePath, "session"), {
      generatedAt: analysis.generatedAt,
      lastCommand: "scan",
    }),
    writeJsonFile(getMapPath(workspacePath, "indexState"), {
      generatedAt: analysis.generatedAt,
      fileStamp: analysis.scan.nextStamp,
    }),
  ]);
}
