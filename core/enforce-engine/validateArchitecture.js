import { validateBoundaries } from "./validateBoundaries.js";
import { validateLayers } from "./validateLayers.js";

export function validateArchitecture(analysis, rules = {}) {
  const layers = validateLayers(analysis.dependency, rules.layers);
  const boundaries = validateBoundaries(analysis.domain, analysis.dependency);

  return {
    valid: layers.valid && boundaries.valid,
    layers,
    boundaries,
  };
}
