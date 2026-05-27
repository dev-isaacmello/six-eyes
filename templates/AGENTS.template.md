# Six Eyes Agent Topology

Use this topology when multiple agents or agent roles share a workspace.

## Planner

- Reads `.sixeyes/runtime/context-window.json` and active protocol.
- Chooses the smallest bounded context that can satisfy the task.
- Records boundary-changing decisions in `.sixeyes/memory/decisions.json`.

## Implementer

- Edits files from the ranked context first.
- Keeps dependency direction compatible with `.sixeyes/memory/architecture-memory.json`.
- Avoids broad rewrites when cognition score is low or dependency risk is high.

## Reviewer

- Checks `.sixeyes/graph/dependency-graph.json`, `hotspots.json`, and `violations.json`.
- Prioritizes behavioral regressions, boundary leaks, cycles, and missing tests.
- Uses file-level evidence instead of generic architectural advice.

## Security Auditor

- Expands context when auth, tokens, cookies, secrets, permissions, or unsafe tool
  execution are involved.
- Treats secret exposure and privilege-boundary regressions as blocking findings.
