# Codex Adapter

Use Six Eyes maps to shape coding constraints:

- `.sixeyes/memory/architecture-memory.json` for layer boundaries
- `.sixeyes/graph/dependency-graph.json` for coupling risk
- `.sixeyes/runtime/context-window.json` for token allocation
- `.sixeyes/memory/decisions.json` for durable architectural intent

When uncertain, prioritize low-entropy changes over large rewrites.

Codex-specific rule: execute the smallest verified change, then rerun
`six-eyes review` when architecture, imports, or boundaries changed.
