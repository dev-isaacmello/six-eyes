# Cursor Adapter

Reference Six Eyes maps from workspace root `.sixeyes/`.

Recommended flow:

1. Plan with architecture + dependency maps.
2. Execute edits using top-ranked context only.
3. Validate no new cycles or layer violations after change.

Use:

- `.sixeyes/runtime/context-window.json` for prompt context
- `.sixeyes/graph/hotspots.json` for high-risk files
- `.sixeyes/graph/violations.json` for rule blockers
- `.sixeyes/maps/symbol-map.json` when jumping between symbols
