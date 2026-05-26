import path from "path";
import { readFileText, scanWorkspace } from "./scanner-engine.js";
import { LAYER_HINTS } from "./constants.js";

function extractImportsForLanguage(filePath, content) {
  const ext = path.extname(filePath).toLowerCase();

  if ([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"].includes(ext)) {
    const imports = [
      ...content.matchAll(/import\s+[^'"\n]*?from\s+['"]([^'"]+)['"]/g),
      ...content.matchAll(/import\s*\(\s*['"]([^'"]+)['"]\s*\)/g),
      ...content.matchAll(/export\s+[^'"\n]*?from\s+['"]([^'"]+)['"]/g),
      ...content.matchAll(/require\(\s*['"]([^'"]+)['"]\s*\)/g),
    ].map((match) => match[1]);

    return imports;
  }

  if (ext === ".py") {
    const imports = [
      ...content.matchAll(/^\s*import\s+([\w\.]+)/gm),
      ...content.matchAll(/^\s*from\s+([\w\.]+)\s+import\s+/gm),
    ].map((match) => match[1]);

    return imports;
  }

  if (ext === ".cs") {
    const imports = [...content.matchAll(/^\s*using\s+([\w\.]+)/gm)].map(
      (match) => match[1],
    );

    return imports;
  }

  return [];
}

function resolveRelativeImport(originFile, specifier) {
  if (!specifier.startsWith(".")) {
    return null;
  }

  const base = path.posix.dirname(originFile);
  const targetBase = path.posix.normalize(path.posix.join(base, specifier));

  return [
    targetBase,
    `${targetBase}.js`,
    `${targetBase}.ts`,
    `${targetBase}.tsx`,
    `${targetBase}.jsx`,
    `${targetBase}.py`,
    `${targetBase}.cs`,
    `${targetBase}/index.js`,
    `${targetBase}/index.ts`,
    `${targetBase}/index.tsx`,
  ];
}

function detectLayer(filePath) {
  const normalized = filePath.toLowerCase();
  for (const [layer, hints] of Object.entries(LAYER_HINTS)) {
    if (
      hints.some(
        (h) => normalized.includes(`/${h}`) || normalized.includes(`${h}/`),
      )
    ) {
      return layer;
    }
  }

  return "unknown";
}

function buildCycleList(graph) {
  const visiting = new Set();
  const visited = new Set();
  const stack = [];
  const cycles = [];

  function dfs(node) {
    if (visiting.has(node)) {
      const fromIdx = stack.indexOf(node);
      cycles.push(stack.slice(fromIdx).concat(node));
      return;
    }

    if (visited.has(node)) {
      return;
    }

    visiting.add(node);
    stack.push(node);

    const edges = graph[node] ?? [];
    for (const next of edges) {
      if (graph[next]) {
        dfs(next);
      }
    }

    stack.pop();
    visiting.delete(node);
    visited.add(node);
  }

  for (const node of Object.keys(graph)) {
    dfs(node);
  }

  return cycles.slice(0, 25);
}

function computeHotspots(graph) {
  const fanIn = {};
  const fanOut = {};

  for (const [file, deps] of Object.entries(graph)) {
    fanOut[file] = deps.length;
    for (const dep of deps) {
      fanIn[dep] = (fanIn[dep] ?? 0) + 1;
    }
  }

  const candidates = Object.keys(graph).map((file) => ({
    file,
    fanIn: fanIn[file] ?? 0,
    fanOut: fanOut[file] ?? 0,
    score: (fanIn[file] ?? 0) * 2 + (fanOut[file] ?? 0),
  }));

  return candidates.sort((a, b) => b.score - a.score).slice(0, 15);
}

function detectLayerViolations(graph) {
  const violations = [];
  const forbidden = new Set([
    "infrastructure->domain",
    "presentation->infrastructure",
  ]);

  for (const [origin, deps] of Object.entries(graph)) {
    const originLayer = detectLayer(origin);
    for (const dep of deps) {
      const targetLayer = detectLayer(dep);
      const edge = `${originLayer}->${targetLayer}`;

      if (forbidden.has(edge)) {
        violations.push({
          type: "layer-violation",
          origin,
          dependency: dep,
          edge,
        });
      }
    }
  }

  return violations;
}

export async function generateDependencyGraph(workspacePath) {
  const scan = await scanWorkspace(workspacePath);
  const knownFiles = new Set(scan.files.map((f) => f.relPath));
  const graph = {};
  let edgeCount = 0;

  for (const file of scan.files) {
    const content = await readFileText(workspacePath, file.relPath);
    const imports = extractImportsForLanguage(file.relPath, content);

    const resolved = imports.flatMap((specifier) => {
      const relativeCandidates = resolveRelativeImport(file.relPath, specifier);
      if (!relativeCandidates) {
        return [];
      }

      return relativeCandidates.filter((candidate) =>
        knownFiles.has(candidate),
      );
    });

    const unique = [...new Set(resolved)];
    edgeCount += unique.length;
    graph[file.relPath] = unique;
  }

  const cycles = buildCycleList(graph);
  const hotspots = computeHotspots(graph);
  const layerViolations = detectLayerViolations(graph);

  return {
    graph,
    cycles,
    hotspots,
    layerViolations,
    metrics: {
      files: scan.files.length,
      edges: edgeCount,
    },
  };
}
