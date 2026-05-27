import { LAYER_HINTS } from "../shared/constants.js";

export function detectLayer(filePath) {
  const normalized = filePath.toLowerCase();
  for (const [layer, hints] of Object.entries(LAYER_HINTS)) {
    if (
      hints.some(
        (hint) =>
          normalized.includes(`/${hint}`) || normalized.includes(`${hint}/`),
      )
    ) {
      return layer;
    }
  }

  return "unknown";
}

export function detectViolations(graph, rules = {}) {
  const forbidden = new Set(
    rules.forbiddenEdges ?? [
      "domain->application",
      "domain->infrastructure",
      "domain->presentation",
      "application->infrastructure",
      "application->presentation",
      "presentation->infrastructure",
    ],
  );
  const violations = [];

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
