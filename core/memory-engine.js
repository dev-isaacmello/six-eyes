import path from "path";
import fs from "fs-extra";
import { MAP_FILES, STATE_DIRNAME } from "./constants.js";
import { buildContextRankings } from "./context-engine.js";

function statePath(workspacePath) {
  return path.join(workspacePath, STATE_DIRNAME);
}

function mapPath(workspacePath, mapName) {
  return path.join(statePath(workspacePath), mapName);
}

async function writeJson(filePath, data) {
  await fs.outputJson(filePath, data, { spaces: 2 });
}

async function readJson(filePath, fallback = {}) {
  if (!(await fs.pathExists(filePath))) {
    return fallback;
  }

  return fs.readJson(filePath);
}

export async function ensureStateDirectory(workspacePath) {
  await fs.ensureDir(statePath(workspacePath));
}

export async function persistAnalysisMaps(workspacePath, analysis) {
  await ensureStateDirectory(workspacePath);

  const architectureMap = {
    generatedAt: analysis.generatedAt,
    detected: analysis.architecture.detected,
    layers: analysis.architecture.layers,
  };

  const dependencyMap = {
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
    guidance: analysis.summary.guidance,
    cognitionScore: analysis.summary.cognitionScore,
  };

  const domainMap = {
    generatedAt: analysis.generatedAt,
    boundaries: analysis.domain.boundaries,
  };

  const contextRankings = {
    generatedAt: analysis.generatedAt,
    rankings: buildContextRankings(analysis),
  };

  const agentMemory = {
    generatedAt: analysis.generatedAt,
    planner: {
      architecture: architectureMap.detected,
      dependencyRisks:
        dependencyMap.cycles.length + dependencyMap.layerViolations.length,
    },
    reviewer: {
      hotspots: dependencyMap.hotspots.slice(0, 10),
      guidance: semanticMap.guidance,
    },
    security: {
      guidance: semanticMap.guidance.filter((g) =>
        g.toLowerCase().includes("auth"),
      ),
    },
  };

  await Promise.all([
    writeJson(mapPath(workspacePath, MAP_FILES.architecture), architectureMap),
    writeJson(mapPath(workspacePath, MAP_FILES.dependencyGraph), dependencyMap),
    writeJson(mapPath(workspacePath, MAP_FILES.semantic), semanticMap),
    writeJson(mapPath(workspacePath, MAP_FILES.domain), domainMap),
    writeJson(
      mapPath(workspacePath, MAP_FILES.contextRankings),
      contextRankings,
    ),
    writeJson(mapPath(workspacePath, MAP_FILES.agentMemory), agentMemory),
    writeJson(mapPath(workspacePath, MAP_FILES.indexState), {
      generatedAt: analysis.generatedAt,
      fileStamp: analysis.scan.nextStamp,
    }),
  ]);
}

export async function readStoredMaps(workspacePath) {
  await ensureStateDirectory(workspacePath);
  const files = await fs.readdir(statePath(workspacePath));
  return files.sort();
}

export async function readIndexState(workspacePath) {
  await ensureStateDirectory(workspacePath);
  return readJson(mapPath(workspacePath, MAP_FILES.indexState), {
    generatedAt: null,
    fileStamp: {},
  });
}
