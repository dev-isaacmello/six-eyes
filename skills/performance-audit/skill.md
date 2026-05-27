# Performance Audit Skill

Use this skill to inspect hotspots, expensive entrypoints, and repeated dependency paths before optimizing.

Focus areas:

- high fan-in files from `.sixeyes/graph/hotspots.json`
- request/response entrypoints from `.sixeyes/memory/architecture-memory.json`
- data access paths that cross application and infrastructure layers
- repeated imports that imply shared mutable state or oversized modules

Optimization proposals must include expected impact and verification strategy.
