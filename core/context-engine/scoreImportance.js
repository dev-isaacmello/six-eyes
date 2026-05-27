export function scoreImportance(file, analysis) {
  const hotspotWeights = new Map(
    analysis.dependency.hotspots.map((entry) => [entry.file, entry.score]),
  );
  const changed = new Set(analysis.scan.changedFiles);

  return (
    (hotspotWeights.get(file.relPath) ?? 0) * 2 +
    (changed.has(file.relPath) ? 12 : 0) +
    (file.relPath.includes("domain") ? 8 : 0) +
    (file.relPath.includes("service") ? 6 : 0) +
    (file.relPath.includes("controller") ? 4 : 0)
  );
}
