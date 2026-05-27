# Boundaries

- `core/` owns deterministic analysis and persistence.
- `providers/` adapts prompts, rules, and install targets.
- `protocols/` defines how agents operate.
- `skills/` defines which expertise an agent applies.
- `contracts/` defines structured map formats.
- `.sixeyes/` stores generated project cognition.

Provider code must not contain architecture detection or enforcement logic.
