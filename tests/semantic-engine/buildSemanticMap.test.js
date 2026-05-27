import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

import { analyzeProject } from "../../core/analyze-engine.js";

test("analyzeProject detects FastAPI fixture evidence", async () => {
  const workspace = path.resolve("examples", "fastapi-ddd");
  const analysis = await analyzeProject(workspace);

  assert.ok(
    analysis.frameworks.detected.some((framework) => framework.name === "FastAPI"),
  );
  assert.ok(
    analysis.domain.boundaries.some((boundary) => boundary.boundedContext === "domain"),
  );
  assert.ok(analysis.architecture.entrypoints.includes("app/main.py"));
});
