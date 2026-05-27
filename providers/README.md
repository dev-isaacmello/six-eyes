# Providers

Provider adapters define how Six Eyes cognitive maps and guidance are injected
into each agent runtime.

- claude
- cursor
- openai
- aider
- codex
- generic

Each adapter can expose provider-specific system prompt snippets and context
selection defaults.

Adapters may own prompt formatting, rule generation, install targets, and
provider templates. They must not own semantic scanning, architecture detection,
dependency enforcement, or memory contracts.

## Adapter Contract

Every provider should expose:

- `adapter.md`: human-readable loading order and provider-specific rules
- `provider.js`: runtime adapter class extending `BaseProvider`
- `rules.js`: deterministic rule list
- `prompts/`: prompt fragments for the provider
- `templates/`: installable provider assets

Provider output should prefer the schemas in `contracts/` when another tool will
consume the result.
