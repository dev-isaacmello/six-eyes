import { analyzeProject } from "../../../core/analyze-engine.js";
import { generateContextSummary } from "../../../core/context-engine.js";

export { generateContextSummary };

if (process.argv[1] && process.argv[1].endsWith("context.js")) {
  analyzeProject(process.cwd())
    .then((analysis) => {
      console.log(generateContextSummary(analysis, { top: 10 }));
    })
    .catch((error) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
}
