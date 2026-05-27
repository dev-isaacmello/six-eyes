# Generic Adapter

Minimal provider contract:

1. Load architecture and dependency maps.
2. Select top-ranked files by task intent.
3. Enforce no-regression gates on cycles and layer boundaries.

Required map names:

- `.sixeyes/runtime/context-window.json`
- `.sixeyes/maps/semantic-map.json`
- `.sixeyes/graph/dependency-graph.json`
- `.sixeyes/memory/project-memory.json`
