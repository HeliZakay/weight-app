# Agent notes

Stack: **Next.js 15** (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 ·
Prisma + Postgres. Standard Next.js 15 conventions apply.

- Reads go through `src/lib/data.ts`; writes are Server Actions in `src/lib/actions.ts`.
- Weight is stored in **lb**; convert for display via `src/lib/units.ts`.
- Streak / weekly counts are **derived** (`src/lib/derive.ts`), never stored.
- The coach is **stubbed** in `src/lib/coach.ts` — that file is the only seam to wire
  up the Claude API. Do not scatter coach logic elsewhere.
- Design tokens live in `src/app/globals.css`; match `design-reference/` for any UI work.
