import { BaseProvider } from "./BaseProvider.js";
import { ProviderRegistry } from "./ProviderRegistry.js";

export const providerRegistry = new ProviderRegistry();

for (const name of ["claude", "codex", "cursor", "aider", "openai", "generic"]) {
  providerRegistry.register(name, (config) => new BaseProvider({ ...config, name }));
}

export function loadProvider(name, config = {}) {
  const key = providerRegistry.has(name) ? name : "generic";
  return providerRegistry.create(key, config);
}
