# Providers

Provider adapters translate Six Eyes maps into tool-specific rules and prompts.

Supported adapters:

- Claude
- Codex
- Cursor
- Aider
- OpenAI
- Generic

Providers are integration edges, not architecture engines.

Provider adapters consume memory and protocol output. They should not change the
meaning of a map, only adapt it to a host tool's prompt, rule, or install shape.
