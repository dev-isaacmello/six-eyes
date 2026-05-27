import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

import { buildDependencyGraph } from "../../core/dependency-engine/buildDependencyGraph.js";

test("buildDependencyGraph resolves imports and flags forbidden layer direction", async () => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), "six-eyes-graph-"));

  try {
    await mkdir(path.join(workspace, "src", "domain"), { recursive: true });
    await mkdir(path.join(workspace, "src", "infrastructure"), { recursive: true });
    await writeFile(
      path.join(workspace, "src", "domain", "user.js"),
      "import { saveUser } from '../infrastructure/repo.js';\nexport function createUser() { return saveUser(); }\n",
    );
    await writeFile(
      path.join(workspace, "src", "infrastructure", "repo.js"),
      "export function saveUser() { return true; }\n",
    );

    const result = await buildDependencyGraph(workspace);

    assert.deepEqual(result.graph["src/domain/user.js"], [
      "src/infrastructure/repo.js",
    ]);
    assert.equal(result.layerViolations.length, 1);
    assert.equal(result.layerViolations[0].edge, "domain->infrastructure");
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});
