# Six Eyes

![Six Eyes Cover](assets/cover.png)

Runtime-aware Cognitive Constraint Shaping for AI coding agents.

Six Eyes provides a lightweight cognitive runtime that helps agents reason with architectural context before code generation.

It runs deterministic analysis passes and persists "cognitive maps" into `.sixeyes/` so your agent can operate with stable, project-specific context.

## What you get

- Semantic project scan across JS/TS, Python, Dart/Flutter, and other stacks
- Dependency intelligence (cycles, hotspots, and layer violations)
- Persisted maps in `.sixeyes/` for incremental, repeatable reasoning
- Ranked context windows to spend tokens on the right files first
- Provider adapters for Claude, Cursor, OpenAI/Codex, Aider, and generic runtimes

## Why Six Eyes

Most coding agents fail when architectural context is missing. Six Eyes improves decision quality by persisting project cognition to `.sixeyes/` and using deterministic scan, graph, and context passes.

## Installation

Install as a dev dependency (recommended):

```bash
npm i -D @dev-isaacmello/six-eyes
```

Then run:

```bash
npx six-eyes review
```

## Quick Start

1) Install provider assets and initialize maps:

```bash
npx @dev-isaacmello/six-eyes init --provider claude
```

2) Run a deterministic review (scan + graph + context):

```bash
npx @dev-isaacmello/six-eyes review --top 12
```

## Commands

```bash
six-eyes install --provider <claude|cursor|openai|aider|codex|generic>
six-eyes init --provider <provider>
six-eyes scan
six-eyes graph
six-eyes context --top 12
six-eyes enforce
six-eyes protocols
six-eyes skills
six-eyes review
six-eyes maps
```

## Providers (where assets are installed)

- `claude`: `~/.claude/skills/six-eyes`
- `cursor`: `~/.cursor/rules/six-eyes`
- `openai`: `~/.config/openai/skills/six-eyes`
- `aider`: `~/.aider/skills/six-eyes`
- `codex`: `~/.codex/skills/six-eyes`
- `generic`: `~/.six-eyes/skills/six-eyes`

## Cognitive Maps

The runtime persists architecture memory into `.sixeyes/`:

- `.sixeyes/maps/semantic-map.json`
- `.sixeyes/maps/domain-map.json`
- `.sixeyes/maps/symbol-map.json`
- `.sixeyes/graph/dependency-graph.json`
- `.sixeyes/graph/hotspots.json`
- `.sixeyes/graph/violations.json`
- `.sixeyes/memory/project-memory.json`
- `.sixeyes/memory/architecture-memory.json`
- `.sixeyes/memory/decisions.json`
- `.sixeyes/runtime/context-window.json`
- `.sixeyes/runtime/session.json`

These maps support incremental cognition and change-impact awareness.

## Architecture

Six Eyes is organized around five pillars:

- Cognitive Runtime in `core/`
- AI Protocol System in `protocols/`
- Architectural Governance in `core/enforce-engine/` and `contracts/`
- Provider Adapters in `providers/`
- Semantic Persistence in `.sixeyes/`

The intended runtime path is:

```txt
scan -> understand -> enforce -> remember -> guide -> constrain
```

## Protocols, Skills, and Contracts

- `protocols/` defines how an agent operates.
- `skills/` defines which expertise an agent applies.
- `contracts/` defines machine-readable schemas for maps, providers, and protocols.

## Cognitive Constraint Shaping Flow

1. `scan` infers framework + architecture + domain boundaries, including Dart/Flutter workspaces.
2. `graph` detects coupling risks (cycles, hotspots, boundary leaks).
3. `context` ranks files by impact and relevance.
4. `review` combines all layers into one deterministic pass.

Use this flow before large refactors, security-sensitive changes, and multi-agent execution.

## Troubleshooting

- If maps look stale, run `six-eyes review` again.
- If provider files are missing, run `six-eyes install --provider <name>`.
- If command resolution fails in CI, use `node bin/six-eyes.js <command>`.

## Requirements

- Node.js `>=18.18.0`

## Maintainer

Isaac Mello | Full Stack Software Engineer

## License

MIT
