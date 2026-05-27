# Agent Coordination

Six Eyes coordinates agents through shared maps instead of shared vibes.

Planner:

- loads `.sixeyes/runtime/context-window.json`
- selects protocol and skill
- keeps work inside one bounded context unless dependency evidence says otherwise

Implementer:

- reads ranked files before editing
- validates dependency direction after edits
- avoids adding abstractions not justified by current architecture memory

Reviewer:

- compares implementation against `.sixeyes/graph/violations.json`
- checks hotspots before approving broad changes
- reports concrete file-level findings

Security Auditor:

- expands context around auth, secrets, tokens, cookies, MCP/tool execution, and
  permission checks
- blocks secret leakage and privilege-boundary regressions
