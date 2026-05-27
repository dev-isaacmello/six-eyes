export function validateBoundaries(domainMap, dependencyGraph) {
  const boundaries = domainMap.boundaries ?? [];
  const graph = dependencyGraph.graph ?? dependencyGraph;
  const warnings = [];

  for (const boundary of boundaries) {
    const files = new Set(boundary.files ?? []);

    for (const file of files) {
      const deps = graph[file] ?? [];
      const externalDeps = deps.filter((dep) => !files.has(dep));

      if (externalDeps.length) {
        warnings.push({
          boundedContext: boundary.boundedContext,
          file,
          externalDeps,
        });
      }
    }
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
}
