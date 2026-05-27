# Architecture

See `docs/ARCHITECTURE.md` for the full architecture.

Core rule: deterministic cognition belongs in `core/`; provider adaptation belongs in `providers/`.

The public compatibility files in `core/*.js` are intentional. They keep current
imports stable while the focused subdirectories hold the final architecture.
