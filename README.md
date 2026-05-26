# Six Eyes

<!-- Cover image: replace the src below with your hosted image URL or local asset path -->

![Six Eyes Cover](./assets/cover.png)

Runtime-aware Cognitive Constraint Shaping for AI coding agents.

Six Eyes provides a lightweight cognitive runtime that helps agents reason with architectural context before code generation.

- semantic project scanning
- dependency intelligence (cycles, hotspots, layer violations)
- incremental indexing with persisted cognitive maps
- adaptive context ranking for token efficiency
- provider adapters for Claude, Cursor, OpenAI/Codex, Aider, and generic runtimes

## Why Six Eyes

Most coding agents fail when architectural context is missing. Six Eyes improves decision quality by persisting project cognition to `.sixeyes/` and using deterministic scan, graph, and context passes.

## Installation

Use via npm or npx:

```bash
npm i -D six-eyes
# or
npx six-eyes install --provider claude
```

## Quick Start

Initialize and create first cognitive maps:

```bash
npx six-eyes init --provider claude
```

Run deterministic review:

```bash
npx six-eyes review
```

## Command Reference

```bash
six-eyes install --provider <claude|cursor|openai|aider|codex|generic>
six-eyes init --provider <provider>
six-eyes scan
six-eyes graph
six-eyes context --top 12
six-eyes review
six-eyes maps
```

## Provider Targets

- `claude`: `~/.claude/skills/six-eyes`
- `cursor`: `~/.cursor/rules/six-eyes`
- `openai`: `~/.config/openai/skills/six-eyes`
- `aider`: `~/.aider/skills/six-eyes`
- `codex`: `~/.codex/skills/six-eyes`
- `generic`: `~/.six-eyes/skills/six-eyes`

## Cognitive Maps

The runtime persists architecture memory into `.sixeyes/`:

- `.sixeyes/architecture.json`
- `.sixeyes/dependency-graph.json`
- `.sixeyes/semantic-map.json`
- `.sixeyes/domain-map.json`
- `.sixeyes/context-rankings.json`
- `.sixeyes/agent-memory.json`
- `.sixeyes/index-state.json`

These maps support incremental cognition and change-impact awareness.

## Cognitive Constraint Shaping Flow

1. `scan` infers framework + architecture + domain boundaries.
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
