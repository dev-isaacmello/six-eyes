# Spec-Driven Examples

## API Behavior Change

Spec:

```txt
When creating an order, return 409 if the account has an unpaid invoice.
```

Execution:

1. Search ranked context for order creation, account billing, and response mapping.
2. Add the domain/application rule where billing decisions already live.
3. Keep controller changes limited to status mapping.
4. Verify with a focused test around the conflict path.

## Agent Map Output

Spec:

```txt
The context command must emit top files, risk counts, and operational guidance.
```

Execution:

1. Validate output shape against `contracts/context-window.schema.json`.
2. Add or update a `node:test` assertion for the context builder.
3. Avoid provider-specific formatting inside `core/context-engine/`.
