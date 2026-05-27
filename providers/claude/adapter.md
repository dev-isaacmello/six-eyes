# Claude Adapter

Load context in this order:

1. `.sixeyes/runtime/context-window.json` top files and guidance
2. `.sixeyes/memory/architecture-memory.json` layers and entrypoints
3. `.sixeyes/graph/dependency-graph.json` cycles, hotspots, and metrics
4. `.sixeyes/graph/violations.json` blocking boundary evidence

If task involves auth, secrets, tokens, cookies, or tools, append the security
section from `.sixeyes/memory/project-memory.json`.

Claude-specific rule: keep the final answer grounded in concrete files and map
evidence; avoid broad architectural advice unless the graph supports it.
