# Cursor Prompts

Cursor prompt fragments should reference generated map files directly and keep
rules concise:

```txt
Use .sixeyes/runtime/context-window.json for file priority.
Do not introduce cycles listed by .sixeyes/graph/dependency-graph.json.
Do not deepen violations listed by .sixeyes/graph/violations.json.
```
