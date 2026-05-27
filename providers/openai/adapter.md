# OpenAI/Codex Adapter

Inject this context envelope before code generation:

- architecture summary
- dependency risk summary
- top-ranked files (bounded token budget)
- protocol constraints
- selected skill metadata

Always reject actions that increase cycle count or break layer direction.

Structured outputs should match `contracts/*.schema.json` whenever a tool or
agent handoff consumes Six Eyes data.
