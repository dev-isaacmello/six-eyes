# Next.js Monorepo Example

This fixture represents a small Next.js workspace with a shared domain package.

Expected Six Eyes signals:

- framework: Next.js
- architecture hint: presentation plus domain separation
- entrypoints: `apps/web/app/page.tsx`, `package.json`
- domain candidate: `packages/domain/user.ts`

Use it to validate scanner, semantic, and context behavior without relying on a
large external repository.
