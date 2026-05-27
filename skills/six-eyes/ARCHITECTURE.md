# Architecture Cognition Rules

Six Eyes separates evidence from inference.

Read:

- `.sixeyes/maps/semantic-map.json` for framework and architecture inference
- `.sixeyes/memory/architecture-memory.json` for layer and entrypoint memory
- `.sixeyes/maps/domain-map.json` for bounded context candidates
- `.sixeyes/graph/dependency-graph.json` for dependency reality

Detect and preserve:

- Clean Architecture
- Hexagonal Architecture
- Vertical Slice
- DDD
- Feature-first Flutter
- Next.js server/client boundaries
- FastAPI dependency injection boundaries
- ASP.NET Core API/application/domain/infrastructure boundaries

Do not treat folder names as truth by themselves. Validate layer intent against
imports, symbols, entrypoints, and hotspots.
