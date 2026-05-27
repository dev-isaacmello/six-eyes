import { rankFiles } from "./rankFiles.js";

export function buildContextWindow(analysis, { top = 10 } = {}) {
  const ranked = rankFiles(analysis).slice(0, top);

  return {
    generatedAt: analysis.generatedAt,
    cognitionScore: analysis.summary.cognitionScore,
    frameworks: analysis.frameworks.detected,
    architectures: analysis.architecture.detected,
    risks: {
      cycles: analysis.dependency.cycles.length,
      layerViolations: analysis.dependency.layerViolations.length,
      hotspots: analysis.dependency.hotspots.length,
    },
    files: ranked,
    guidance: analysis.summary.guidance,
  };
}

export function renderContextWindow(contextWindow) {
  const frameworks = contextWindow.frameworks
    .map((framework) => `${framework.name} (${Math.round(framework.confidence * 100)}%)`)
    .join(", ");
  const architectures = contextWindow.architectures
    .map((architecture) => `${architecture.name} (${Math.round(architecture.confidence * 100)}%)`)
    .join(", ");
  const topFiles = contextWindow.files
    .map((item) => `- ${item.file} [rank:${item.score}]`)
    .join("\n");
  const guidance = contextWindow.guidance.map((item) => `- ${item}`).join("\n");

  return `# Six Eyes Context Pack

## Cognition Score
${contextWindow.cognitionScore}/100

## Framework Inference
${frameworks || "none detected"}

## Architecture Inference
${architectures || "none detected"}

## Dependency Risks
- cycles: ${contextWindow.risks.cycles}
- layer violations: ${contextWindow.risks.layerViolations}
- hotspots: ${contextWindow.risks.hotspots}

## Priority Context (Top ${contextWindow.files.length})
${topFiles || "- no files available"}

## Operational Guidance
${guidance}
`;
}
