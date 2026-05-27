export {
  buildDependencyGraph,
  buildDependencyGraph as generateDependencyGraph,
} from "./dependency-engine/buildDependencyGraph.js";

export { detectCycles } from "./dependency-engine/detectCycles.js";
export { detectHotspots } from "./dependency-engine/detectHotspots.js";
export {
  detectLayer,
  detectViolations,
} from "./dependency-engine/detectViolations.js";
