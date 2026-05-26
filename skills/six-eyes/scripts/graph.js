import { generateDependencyGraph } from "../../../core/graph-engine.js";

export { generateDependencyGraph };

if (process.argv[1] && process.argv[1].endsWith("graph.js")) {
  generateDependencyGraph(process.cwd())
    .then((result) => {
      console.log(JSON.stringify(result.metrics, null, 2));
    })
    .catch((error) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
}
