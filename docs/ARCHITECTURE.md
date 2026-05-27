# Architecture

Six Eyes is split into five pillars:

1. Cognitive Runtime
2. AI Protocol System
3. Architectural Governance
4. Provider Adapters
5. Semantic Persistence

`core/` must stay deterministic, provider-independent, and highly testable.

## Module Ownership

- `core/scanner/`: file, import, and symbol evidence
- `core/semantic-engine/`: frameworks, layers, domains, and entrypoints
- `core/dependency-engine/`: graph, cycles, hotspots, and layer direction
- `core/enforce-engine/`: governance checks and reports
- `core/context-engine/`: ranked execution context
- `core/memory-engine/`: persistent cognitive maps
- `core/protocol-engine/`: protocol validation and step resolution
- `core/provider-runtime/`: provider abstractions

Compatibility wrappers in `core/*.js` preserve the public API while the focused
modules carry the architecture forward.
