import {
  ARCHITECTURE_PATTERNS,
  FRAMEWORK_SIGNALS,
} from "../shared/constants.js";
import { readFileText } from "../scanner/scanProject.js";
import { classifyLayers } from "./classifyLayers.js";
import { detectEntrypoints } from "./detectEntrypoints.js";
import { extractDomains } from "./extractDomains.js";

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

function extractPyprojectDependencies(text) {
  const packages = new Set();

  for (const match of text.matchAll(/dependencies\s*=\s*\[([\s\S]*?)\]/g)) {
    for (const dep of match[1].matchAll(/["']([A-Za-z0-9_.-]+)/g)) {
      packages.add(dep[1].toLowerCase());
    }
  }

  for (const match of text.matchAll(/^\s*([A-Za-z0-9_.-]+)\s*[<>=~!]/gm)) {
    packages.add(match[1].toLowerCase());
  }

  return packages;
}

function extractRequirementsDependencies(text) {
  const packages = new Set();

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || line.startsWith("-")) {
      continue;
    }

    const match = line.match(/^([A-Za-z0-9_.-]+)/);
    if (match) {
      packages.add(match[1].toLowerCase());
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
    (anchorScore * 0.45 + codeScore * 0.25 + packageScore * 0.3).toFixed(2),
  );

  return {
    confidence,
    found: [...foundAnchors, ...foundCode, ...foundPackages],
    foundAnchors,
    foundCode,
    foundPackages,
  };
}

function detectFrameworks(evidence) {
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
  const hotspotPenalty = hotspots.filter((hotspot) => hotspot.score > 12).length * 2;
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

function buildOperationalGuidance(semanticMap) {
  const actions = [];

  if (semanticMap.dependency.cycles.length > 0) {
    actions.push(
      "Break circular dependencies in high-fanin modules before adding new features.",
    );
  }

  if (semanticMap.dependency.layerViolations.length > 0) {
    actions.push(
      "Fix layer violations where infrastructure leaks into domain contracts.",
    );
  }

  if (semanticMap.scan.changedFiles.length > 20) {
    actions.push(
      "Use incremental rollout and split changes into bounded contexts to reduce regression risk.",
    );
  }

  if (semanticMap.frameworks.detected.some((framework) => framework.name === "Next.js")) {
    actions.push(
      "When changing data flow, trace server/client boundaries and cache invalidation strategy.",
    );
  }

  if (semanticMap.frameworks.detected.some((framework) => framework.name === "FastAPI")) {
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

async function collectEvidence(workspacePath, scan) {
  const evidence = {
    anchors: new Set(),
    code: new Set(),
    packages: new Set(),
  };
  const tokenEvidence = new Set();
  const markerPathEvidence = new Set();

  const packageJsonFiles = scan.files.filter((file) =>
    file.relPath.endsWith("package.json"),
  );
  for (const packageFile of packageJsonFiles) {
    const text = await readFileText(workspacePath, packageFile.relPath);
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

  const pubspecFiles = scan.files.filter((file) =>
    file.relPath.endsWith("pubspec.yaml"),
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

  const pyprojectFiles = scan.files.filter((file) =>
    file.relPath.endsWith("pyproject.toml"),
  );
  for (const pyprojectFile of pyprojectFiles) {
    const text = await readFileText(workspacePath, pyprojectFile.relPath);
    for (const depName of extractPyprojectDependencies(text)) {
      evidence.packages.add(depName);
    }
  }

  const requirementsFiles = scan.files.filter((file) =>
    file.relPath.endsWith("requirements.txt"),
  );
  for (const requirementsFile of requirementsFiles) {
    const text = await readFileText(workspacePath, requirementsFile.relPath);
    for (const depName of extractRequirementsDependencies(text)) {
      evidence.packages.add(depName);
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
      "screens",
      "widgets",
      "bloc",
      "cubit",
      "provider",
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
      "domain event",
    ]) {
      if (lowered.includes(marker)) {
        tokenEvidence.add(marker);
      }
    }
  }

  return { evidence, tokenEvidence, markerPathEvidence };
}

export async function buildSemanticMap(workspacePath, scan, dependency) {
  const { evidence, tokenEvidence, markerPathEvidence } = await collectEvidence(
    workspacePath,
    scan,
  );
  const frameworks = detectFrameworks(evidence);
  const layers = classifyLayers(scan);
  const architectures = detectArchitectures(
    layers,
    tokenEvidence,
    markerPathEvidence,
  );
  const hasDartFiles = scan.files.some((file) => file.relPath.endsWith(".dart"));
  const hasPubspec = scan.files.some((file) => file.relPath.endsWith("pubspec.yaml"));

  if (!architectures.length && hasDartFiles && hasPubspec) {
    architectures.push({
      name: "Dart Package",
      confidence: 0.6,
      evidence: ["marker:dart", "marker:pubspec"],
    });
  }

  const semanticMap = {
    generatedAt: new Date().toISOString(),
    scan,
    frameworks: {
      detected: frameworks,
    },
    architecture: {
      detected: architectures,
      layers,
      entrypoints: detectEntrypoints(scan),
    },
    dependency,
    domain: {
      boundaries: extractDomains(scan),
    },
    symbols: {
      files: scan.symbols ?? [],
    },
    summary: {
      cognitionScore: computeCognitionScore({
        cycles: dependency.cycles,
        layerViolations: dependency.layerViolations,
        hotspots: dependency.hotspots,
        changedFiles: scan.changedFiles,
        architectures,
      }),
      guidance: [],
    },
  };

  semanticMap.summary.guidance = buildOperationalGuidance(semanticMap);
  return semanticMap;
}
