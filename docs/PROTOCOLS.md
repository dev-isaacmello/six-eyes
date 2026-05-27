# Protocols

Protocols define how an AI agent should operate.

Current protocols:

- implementation
- refactor
- review
- debugging
- migration

Protocols resolve constraints and execution order before any provider-specific prompt is generated.

Each protocol should answer:

- what evidence must be loaded
- what sequence the agent follows
- what constraints block unsafe action
- what verification closes the loop
