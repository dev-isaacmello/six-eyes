# OpenAI/Codex Adapter

Inject this context envelope before code generation:

- architecture summary
- dependency risk summary
- top-ranked files (bounded token budget)

Always reject actions that increase cycle count or break layer direction.
