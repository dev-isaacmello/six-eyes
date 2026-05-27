# Safe Refactor Skill

Use this skill for behavior-preserving edits that must keep public contracts stable.

Required gates:

1. Create or identify a pre-change snapshot.
2. Keep public exports, routes, schemas, and provider contracts stable.
3. Preserve dependency direction or reduce violations.
4. Run focused verification before and after the refactor.
5. Compare semantic or dependency snapshots when moving files.

Abort the refactor if behavior cannot be verified and the changed area is high
fan-in or security-sensitive.
