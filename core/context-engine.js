function computeContextRank(analysis) {
  const ranked = [];
  const hotspotWeights = new Map(
    analysis.dependency.hotspots.map((entry) => [entry.file, entry.score]),
  );
  const changed = new Set(analysis.scan.changedFiles);

  for (const file of analysis.scan.files) {
    const score =
      (hotspotWeights.get(file.relPath) ?? 0) * 2 +
      (changed.has(file.relPath) ? 12 : 0) +
      (file.relPath.includes("domain") ? 8 : 0) +
      (file.relPath.includes("service") ? 6 : 0) +
      (file.relPath.includes("controller") ? 4 : 0);

    ranked.push({
      file: file.relPath,
      score,
    });
  }

  return ranked.sort((a, b) => b.score - a.score);
}

export function generateContextSummary(analysis, { top = 10 } = {}) {
  const ranked = computeContextRank(analysis).slice(0, top);
  const frameworks = analysis.frameworks.detected
    .map((f) => `${f.name} (${Math.round(f.confidence * 100)}%)`)
    .join(", ");
  const architectures = analysis.architecture.detected
    .map((a) => `${a.name} (${Math.round(a.confidence * 100)}%)`)
    .join(", ");

  const topFiles = ranked
    .map((item) => `- ${item.file} [rank:${item.score}]`)
    .join("\n");

  const guidance = analysis.summary.guidance.map((g) => `- ${g}`).join("\n");

  return `# Six Eyes Context Pack

## Cognition Score
${analysis.summary.cognitionScore}/100

## Framework Inference
${frameworks || "none detected"}

## Architecture Inference
${architectures || "none detected"}

## Dependency Risks
- cycles: ${analysis.dependency.cycles.length}
- layer violations: ${analysis.dependency.layerViolations.length}
- hotspots: ${analysis.dependency.hotspots.length}

## Priority Context (Top ${top})
${topFiles || "- no files available"}

## Operational Guidance
${guidance}
`;
}

export function buildContextRankings(analysis) {
  return computeContextRank(analysis);
}
