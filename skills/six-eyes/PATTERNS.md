# Pattern Enforcement

Respect existing architectural patterns.

Never introduce:
- inconsistent abstractions
- mixed patterns
- duplicated logic
- business logic leakage

---

# Repository Pattern

Repositories:
- only access persistence
- never contain business rules
- never return UI models

---

# Service Layer

Services:
- orchestrate business rules
- coordinate repositories
- remain framework-agnostic

---

# Controllers

Controllers:
- must remain thin
- validate requests
- delegate logic

Never:
- embed business logic
- access database directly

---

# Frontend Patterns

React:
- separate UI and business logic
- avoid excessive prop drilling
- prefer composition

Next.js:
- prefer server components when possible
- minimize client-side state
- optimize data fetching

---

# AI Agent Patterns

Agents must:
- isolate responsibilities
- minimize overlapping context
- synchronize architecture decisions
- persist durable decisions to `.sixeyes/memory/decisions.json`
- use `protocols/` for operating flow and `skills/` for applied expertise

---

# Six Eyes Map Usage

Use maps as follows:

- `runtime/context-window.json` answers "what should I read first?"
- `maps/semantic-map.json` answers "what kind of system is this?"
- `graph/dependency-graph.json` answers "what depends on what?"
- `graph/hotspots.json` answers "where is change risk concentrated?"
- `graph/violations.json` answers "what boundaries are already broken?"
- `memory/architecture-memory.json` answers "what architecture should persist?"
