# AI Runtime

Six Eyes acts as AI architectural middleware between agents and code. The agent
does not start from a raw repository; it starts from deterministic memory.

Required maps:

- `.sixeyes/maps/semantic-map.json`
- `.sixeyes/maps/domain-map.json`
- `.sixeyes/maps/symbol-map.json`
- `.sixeyes/graph/dependency-graph.json`
- `.sixeyes/graph/hotspots.json`
- `.sixeyes/graph/violations.json`
- `.sixeyes/runtime/context-window.json`
- `.sixeyes/memory/architecture-memory.json`
- `.sixeyes/memory/project-memory.json`
- `.sixeyes/memory/decisions.json`

Runtime flow:

```txt
scan -> understand -> enforce -> remember -> guide -> constrain
```

Agent rule: use `protocols/` to decide how to operate and `skills/` to decide
which expertise to apply.
