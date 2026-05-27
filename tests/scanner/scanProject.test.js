import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

import { scanProject } from "../../core/scanner/scanProject.js";

test("scanProject indexes files, imports, and symbols", async () => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), "six-eyes-scanner-"));

  try {
    await mkdir(path.join(workspace, "src"), { recursive: true });
    await writeFile(
      path.join(workspace, "src", "service.js"),
      "export function createUser() { return true; }\n",
    );
    await writeFile(
      path.join(workspace, "src", "index.js"),
      "import { createUser } from './service.js';\nexport const boot = createUser;\n",
    );

    const scan = await scanProject(workspace);

    assert.deepEqual(
      scan.files.map((file) => file.relPath).sort(),
      ["src/index.js", "src/service.js"],
    );
    assert.deepEqual(scan.imports.find((entry) => entry.file === "src/index.js").imports, [
      "./service.js",
    ]);
    assert.ok(
      scan.symbols
        .find((entry) => entry.file === "src/service.js")
        .symbols.includes("createUser"),
    );
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});
