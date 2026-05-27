# Six Eyes Cognitive Runtime

Load this file as the provider-facing summary, then ground decisions in the
generated maps under `.sixeyes/`.

## Required Maps

- `.sixeyes/runtime/context-window.json`: ranked task context and guidance
- `.sixeyes/maps/semantic-map.json`: frameworks, entrypoints, and cognition score
- `.sixeyes/graph/dependency-graph.json`: imports, cycles, and fan-in/fan-out
- `.sixeyes/graph/violations.json`: layer direction violations
- `.sixeyes/memory/architecture-memory.json`: detected layers and entrypoints
- `.sixeyes/memory/decisions.json`: durable architecture decisions

## Operating Rules

- Read the context window before non-trivial edits.
- Treat cycles and layer violations as architectural evidence.
- Keep provider-specific behavior out of `core/`.
- Prefer the active protocol over free-form reasoning for implementation,
  refactor, review, debugging, and migration work.

## Output Expectations

Return impacted files, changed boundaries, verification evidence, and any
decision worth persisting into `.sixeyes/memory/decisions.json`.
