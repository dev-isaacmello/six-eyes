import test from "node:test";
import assert from "node:assert/strict";

import { executeProtocol } from "../../core/protocol-engine/executeProtocol.js";

test("executeProtocol validates and resolves constraints", () => {
  const result = executeProtocol(
    {
      id: "implementation",
      constraints: ["read-context-window"],
      steps: [{ name: "scan", action: "load maps" }],
    },
    {
      constraints: ["verify-output"],
    },
  );

  assert.equal(result.ok, true);
  assert.deepEqual(result.steps[0].constraints, [
    "read-context-window",
    "verify-output",
  ]);
});

test("executeProtocol rejects invalid protocols", () => {
  const result = executeProtocol({ id: "empty", steps: [] });

  assert.equal(result.ok, false);
  assert.ok(result.errors.length > 0);
});
