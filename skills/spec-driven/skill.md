# Spec-Driven Skill

Use this skill when implementation should be anchored to an explicit behavior specification.

Inputs:

- requested behavior
- existing contracts
- ranked context files

Outputs:

- implementation notes
- changed files
- verification evidence

Method:

1. Convert the user request into observable behavior.
2. Check `contracts/` for structured output or map requirements.
3. Read ranked files from `.sixeyes/runtime/context-window.json`.
4. Implement the smallest behavior delta.
5. Verify with tests, type checks, or a focused command.
6. Record a decision only when the behavior changes architecture boundaries.
