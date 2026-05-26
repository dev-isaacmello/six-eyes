# Claude Adapter

Load context in this order:

1. `.sixeyes/context-rankings.json` top files
2. `.sixeyes/architecture.json`
3. `.sixeyes/dependency-graph.json` cycles and violations only

If task involves auth or secrets, append `.sixeyes/agent-memory.json` security section.
