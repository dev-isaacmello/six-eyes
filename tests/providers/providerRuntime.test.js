import test from "node:test";
import assert from "node:assert/strict";

import { loadProvider, providerRegistry } from "../../core/provider-runtime/loadProvider.js";

test("provider runtime exposes registered providers and falls back to generic", () => {
  assert.ok(providerRegistry.list().includes("codex"));

  const codex = loadProvider("codex");
  const fallback = loadProvider("unknown-provider");

  assert.equal(codex.name, "codex");
  assert.equal(fallback.name, "generic");
});
