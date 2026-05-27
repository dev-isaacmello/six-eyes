# Aider Adapter

Before applying edits:

1. Read `.sixeyes/runtime/context-window.json`.
2. Restrict changed files to highest-impact context.
3. Validate dependency graph does not introduce architecture regressions.

Use `.sixeyes/maps/symbol-map.json` to choose edit files and
`.sixeyes/graph/dependency-graph.json` to keep related files in scope.
