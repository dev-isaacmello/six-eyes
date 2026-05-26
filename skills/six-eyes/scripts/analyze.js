import { analyzeProject } from "../../../core/analyze-engine.js";

export { analyzeProject };

if (process.argv[1] && process.argv[1].endsWith("analyze.js")) {
  analyzeProject(process.cwd())
    .then((result) => {
      console.log(JSON.stringify(result.summary, null, 2));
    })
    .catch((error) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
}
