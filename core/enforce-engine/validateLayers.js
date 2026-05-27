import { detectViolations } from "../dependency-engine/detectViolations.js";

export function validateLayers(dependencyGraph, rules = {}) {
  const violations = detectViolations(dependencyGraph.graph ?? dependencyGraph, rules);

  return {
    valid: violations.length === 0,
    violations,
  };
}
