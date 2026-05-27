# Dependency Analysis Skill

Use this skill to reason about cycles, fan-in, fan-out, and layer-crossing imports.

Procedure:

1. Load `.sixeyes/graph/dependency-graph.json`.
2. Review cycles first, then hotspots, then layer violations.
3. Trace whether each risky edge is relative, framework, or generated glue.
4. Suggest the smallest edge removal or interface boundary that reduces risk.

Do not recommend moving files just to satisfy folder naming. Dependency
direction matters more than cosmetic structure.
