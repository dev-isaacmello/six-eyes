import {
  FRAMEWORK_SIGNALS,
  ARCHITECTURE_PATTERNS,
  LAYER_HINTS,
} from "./constants.js";
import { readFileText, scanWorkspace } from "./scanner-engine.js";
import { generateDependencyGraph } from "./graph-engine.js";

function extractPubspecDependencies(text) {
  const packages = new Set();
  const lines = text.split(/\r?\n/);
  let activeSection = null;
  let sectionIndent = 0;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const sectionMatch = rawLine.match(
      /^([ \t]*)(dependencies|dev_dependencies|dependency_overrides):\s*$/,
    );
    if (sectionMatch) {
      activeSection = sectionMatch[2];
      sectionIndent = sectionMatch[1].length;
      continue;
    }

    if (!activeSection) {
      continue;
    }

    const indent = rawLine.match(/^[ \t]*/)?.[0].length ?? 0;
    if (indent <= sectionIndent) {
      activeSection = null;
      continue;
    }

    const packageMatch = trimmed.match(/^([A-Za-z0-9_.-]+):\s*$/);
    if (packageMatch) {
      packages.add(packageMatch[1].toLowerCase());
    }
  }

  return packages;
}

function scoreFramework(rules, evidence) {
  const anchors = rules.anchors ?? [];
  const code = rules.code ?? [];
  const packages = rules.packages ?? [];

  const foundAnchors = anchors.filter((signal) =>
    evidence.anchors.has(signal.toLowerCase()),
  );
  const foundCode = code.filter((signal) =>
    evidence.code.has(signal.toLowerCase()),
  );
  const foundPackages = packages.filter((signal) =>
    evidence.packages.has(signal.toLowerCase()),
  );

  const anchorScore = anchors.length ? foundAnchors.length / anchors.length : 0;
  const codeScore = code.length ? foundCode.length / code.length : 0;
  const packageScore = packages.length
    ? foundPackages.length / packages.length
    : 0;

  const confidence = Number(
    (anchorScore * 0.5 + codeScore * 0.35 + packageScore * 0.15).toFixed(2),
  );

  return {
    confidence,
    found: [...foundAnchors, ...foundCode, ...foundPackages],
    foundAnchors,
    foundCode,
    foundPackages,
  };
}

function detectFrameworks(scan, evidence) {
  const detected = [];
  for (const [framework, rules] of Object.entries(FRAMEWORK_SIGNALS)) {
    const score = scoreFramework(rules, evidence);
    const passesConfidence = score.confidence >= 0.35;
    const hasGroundedEvidence =
      score.foundAnchors.length > 0 || score.foundPackages.length > 0;

    if (passesConfidence && hasGroundedEvidence) {
      detected.push({
        name: framework,
        confidence: score.confidence,
        evidence: score.found,
      });
    }
  }

  return detected.sort((a, b) => b.confidence - a.confidence);
}

function detectLayers(scan) {
  const layers = {};
  for (const layer of Object.keys(LAYER_HINTS)) {
    layers[layer] = [];
  }

  for (const file of scan.files) {
    const normalized = file.relPath.toLowerCase();
    for (const [layer, hints] of Object.entries(LAYER_HINTS)) {
      if (
        hints.some(
          (h) => normalized.includes(`/${h}/`) || normalized.includes(`${h}.`),
        )
      ) {
        layers[layer].push(file.relPath);
      }
    }
  }

  return layers;
}

function detectArchitectures(layers, tokenEvidence, markerPathEvidence) {
  const detected = [];

  for (const [name, rule] of Object.entries(ARCHITECTURE_PATTERNS)) {
    let score = 0;
    const evidence = [];

    if (rule.requiredLayers) {
      for (const layer of rule.requiredLayers) {
        if ((layers[layer] ?? []).length > 0) {
          score += 1;
          evidence.push(`layer:${layer}`);
        }
      }
    }

    if (rule.markers) {
      for (const marker of rule.markers) {
        if (tokenEvidence.has(marker) && markerPathEvidence.has(marker)) {
          score += 1;
          evidence.push(`marker:${marker}`);
        }
      }
    }

    if (score >= rule.threshold) {
      detected.push({
        name,
        confidence: Number(
          Math.min(score / Math.max(rule.threshold, 1), 1).toFixed(2),
        ),
        evidence,
      });
    }
  }

  return detected.sort((a, b) => b.confidence - a.confidence);
}

function buildDomainMap(scan) {
  const candidates = [
    "domain",
    "billing",
    "user",
    "account",
    "order",
    "payment",
    "auth",
  ];
  const boundaries = [];

  for (const candidate of candidates) {
    const files = scan.files
      .filter((file) => file.relPath.toLowerCase().includes(`/${candidate}`))
      .map((file) => file.relPath)
      .slice(0, 25);

    if (files.length) {
      boundaries.push({
        boundedContext: candidate,
        files,
      });
    }
  }

  return boundaries;
}

function computeCognitionScore({
  cycles,
  layerViolations,
  hotspots,
  changedFiles,
  architectures,
}) {
  const architectureBonus = Math.min(architectures.length * 8, 20);
  const cyclePenalty = Math.min(cycles.length * 5, 35);
  const layerPenalty = Math.min(layerViolations.length * 6, 24);
  const hotspotPenalty = hotspots.filter((h) => h.score > 12).length * 2;
  const churnPenalty = Math.min(changedFiles.length, 20);

  const score =
    100 +
    architectureBonus -
    cyclePenalty -
    layerPenalty -
    hotspotPenalty -
    churnPenalty;
  return Math.max(Math.min(score, 100), 1);
}

function buildOperationalGuidance(analysis) {
  const actions = [];

  if (analysis.dependency.cycles.length > 0) {
    actions.push(
      "Break circular dependencies in high-fanin modules before adding new features.",
    );
  }

  if (analysis.dependency.layerViolations.length > 0) {
    actions.push(
      "Fix layer violations where infrastructure leaks into domain contracts.",
    );
  }

  if (analysis.scan.changedFiles.length > 20) {
    actions.push(
      "Use incremental rollout and split changes into bounded contexts to reduce regression risk.",
    );
  }

  if (analysis.frameworks.detected.some((f) => f.name === "Next.js")) {
    actions.push(
      "When changing data flow, trace server/client boundaries and cache invalidation strategy.",
    );
  }

  if (analysis.frameworks.detected.some((f) => f.name === "FastAPI")) {
    actions.push(
      "For endpoint updates, validate auth dependency injection and Pydantic model compatibility.",
    );
  }

  if (!actions.length) {
    actions.push(
      "Maintain current architecture boundaries and enforce deterministic dependency direction.",
    );
  }

  return actions;
}

export async function analyzeProject(workspacePath) {
  const scan = await scanWorkspace(workspacePath);
  const dependency = await generateDependencyGraph(workspacePath);
  const evidence = {
    anchors: new Set(),
    code: new Set(),
    packages: new Set(),
  };
  const tokenEvidence = new Set();
  const markerPathEvidence = new Set();

  const packageJsonFiles = scan.files.filter((f) =>
    f.relPath.endsWith("package.json"),
  );
  for (const pkgFile of packageJsonFiles) {
    const text = await readFileText(workspacePath, pkgFile.relPath);
    try {
      const parsed = JSON.parse(text);
      const allDeps = {
        ...(parsed.dependencies ?? {}),
        ...(parsed.devDependencies ?? {}),
      };

      for (const depName of Object.keys(allDeps)) {
        evidence.packages.add(depName.toLowerCase());
      }
    } catch {
      // Ignore malformed package.json.
    }
  }

  const pubspecFiles = scan.files.filter((f) =>
    f.relPath.endsWith("pubspec.yaml"),
  );
  for (const pubspecFile of pubspecFiles) {
    const text = await readFileText(workspacePath, pubspecFile.relPath);
    for (const depName of extractPubspecDependencies(text)) {
      evidence.packages.add(depName);
      if (depName === "flutter" || depName === "flutter_test") {
        tokenEvidence.add("flutter");
        markerPathEvidence.add("flutter");
      }
    }
  }

  for (const file of scan.files) {
    evidence.anchors.add(file.relPath.toLowerCase());
    if (file.relPath.toLowerCase().endsWith(".dart")) {
      evidence.anchors.add("dart");
      tokenEvidence.add("dart");
    }
    const text = await readFileText(workspacePath, file.relPath);
    const lowered = text.toLowerCase();

    const pathLower = file.relPath.toLowerCase();
    for (const marker of [
      "aggregate",
      "entity",
      "valueobject",
      "ports",
      "adapters",
      "features",
      "commands",
      "queries",
      "main",
    ]) {
      if (pathLower.includes(marker)) {
        markerPathEvidence.add(marker);
      }
    }

    for (const rules of Object.values(FRAMEWORK_SIGNALS)) {
      for (const signal of rules.code ?? []) {
        if (lowered.includes(signal.toLowerCase())) {
          evidence.code.add(signal.toLowerCase());
        }
      }

      for (const anchor of rules.anchors ?? []) {
        if (file.relPath.toLowerCase().endsWith(anchor.toLowerCase())) {
          evidence.anchors.add(anchor.toLowerCase());
        }
      }
    }

    for (const marker of [
      "aggregate",
      "entity",
      "valueobject",
      "bounded context",
      "ports",
      "adapters",
      "main",
    ]) {
      if (lowered.includes(marker)) {
        tokenEvidence.add(marker);
      }
    }
  }

  const frameworks = detectFrameworks(scan, evidence);
  const layers = detectLayers(scan);
  const architectures = detectArchitectures(
    layers,
    tokenEvidence,
    markerPathEvidence,
  );
  const hasDartFiles = scan.files.some((file) =>
    file.relPath.endsWith(".dart"),
  );
  const hasPubspec = scan.files.some((file) =>
    file.relPath.endsWith("pubspec.yaml"),
  );

  if (!architectures.length && hasDartFiles && hasPubspec) {
    architectures.push({
      name: "Dart Package",
      confidence: 0.6,
      evidence: ["marker:dart", "marker:pubspec"],
    });
  }
  const domainMap = buildDomainMap(scan);

  const cognitionScore = computeCognitionScore({
    cycles: dependency.cycles,
    layerViolations: dependency.layerViolations,
    hotspots: dependency.hotspots,
    changedFiles: scan.changedFiles,
    architectures,
  });

  const analysis = {
    generatedAt: new Date().toISOString(),
    scan,
    frameworks: {
      detected: frameworks,
    },
    architecture: {
      detected: architectures,
      layers,
    },
    dependency,
    domain: {
      boundaries: domainMap,
    },
    summary: {
      cognitionScore,
      guidance: [],
    },
  };

  analysis.summary.guidance = buildOperationalGuidance(analysis);
  return analysis;
}
