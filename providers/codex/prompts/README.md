# Codex Prompts

Codex prompt envelope:

```txt
Objective: <task>
Context: .sixeyes/runtime/context-window.json
Protocol: protocols/<mode>/protocol.md
Skill: skills/<expertise>/skill.md
Guardrails: .sixeyes/graph/violations.json and .sixeyes/memory/architecture-memory.json
```

Prefer concrete file edits, explicit verification, and memory updates when
architecture decisions change.
