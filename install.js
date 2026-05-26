import { runInstall } from "./core/install-engine.js";

const providerArgIndex = process.argv.findIndex((arg) => arg === "--provider");
const provider =
  providerArgIndex >= 0 ? process.argv[providerArgIndex + 1] : "claude";

runInstall({
  provider,
  workspacePath: process.cwd(),
}).catch((error) => {
  console.error(
    "Six Eyes install failed:",
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
});
