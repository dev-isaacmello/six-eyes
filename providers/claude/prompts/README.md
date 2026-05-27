# Claude Prompts

Use this prompt envelope before implementation or review:

```txt
Read .sixeyes/runtime/context-window.json and .sixeyes/graph/violations.json.
Apply the active protocol from protocols/.
Use the selected skill from skills/.
Return impacted files, architectural risk, and verification evidence.
```

Claude should treat `.sixeyes/memory/architecture-memory.json` as persistent
architecture intent and `.sixeyes/memory/decisions.json` as durable history.
