# Architecture Review Skill

Use this skill to evaluate layer direction, domain boundaries, dependency cycles, and high-impact hotspots.

Read in order:

1. `.sixeyes/memory/architecture-memory.json`
2. `.sixeyes/maps/domain-map.json`
3. `.sixeyes/graph/dependency-graph.json`
4. `.sixeyes/graph/hotspots.json`
5. `.sixeyes/graph/violations.json`

Report findings only when they have file-level evidence. Treat new cycles,
deepened layer violations, and domain leakage as blocking risks.
