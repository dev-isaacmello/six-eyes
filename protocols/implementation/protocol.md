# Implementation Protocol

Purpose: guide an agent from intent to code while preserving architecture.

1. Load `.sixeyes/runtime/context-window.json`.
2. Identify the smallest bounded context that can satisfy the request.
3. Read ranked files before editing.
4. Apply changes inside the existing layer direction.
5. Run the relevant verification command.
6. Persist useful architectural decisions when the change alters boundaries.
