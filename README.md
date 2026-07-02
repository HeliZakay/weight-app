# Weight & Movement Companion

A personal, private, mobile-first daily companion built around **weight trends over
time**, supported by movement and meal logging, with a steady, honest AI coach that
gives one calm check-in a day. Single user, no auth. Installable as a PWA.

Built to the design in [`design-reference/`](./design-reference) and the brief in
[`weight-app-spec.md`](./weight-app-spec.md).

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** (design tokens defined in [`src/app/globals.css`](./src/app/globals.css))
- **Prisma** + **Postgres** (Neon in production)
- Server Components + **Server Actions** for all reads/writes
- Fonts: **Newsreader** (display / numbers / coach voice) + **Hanken Grotesk** (UI)

## Screens

| Route | Screen | Notes |
|---|---|---|
| `/` | **Today** | day snapshot, three ritual cards (weigh / move / eat), calories-today, daily coach check-in |
| `/log?tab=weight\|movement\|meals` | **Log** | once-a-day weight, movement sessions (streak), meals + quick-add saved foods |
| `/progress` | **Progress** | weekly-average weight trend, movement consistency, sessions-per-week |
| `/goals` | **Goals & Settings** | goal weight, calorie target, weekly movement target, units, coach tone, CSV export |

## Project layout

```
prisma/
  schema.prisma        # Entry (polymorphic), Settings (singleton), SavedFood, CoachCheckin
  migrations/          # 0001_init — ready for `prisma migrate deploy`
  seed.ts              # ~6 wks of demo data so the app looks alive on first run
src/
  app/                 # routes + layout (phone-frame shell)
    api/coach/route.ts # STUBBED coach endpoint (Claude API seam)
    api/export/route.ts# CSV export
  components/          # BottomNav, Stepper, TrendChart, ExportCard, icons…
  lib/
    prisma.ts  data.ts  actions.ts   # client, read helpers, server actions
    coach.ts                          # STUB coach copy + daily cache (swap for Claude)
    derive.ts  units.ts  dates.ts     # streak/week/chart math, lb↔kg, day helpers
```

## Data model

Weight is stored **canonically in pounds**; kg is a display/input conversion
([`src/lib/units.ts`](./src/lib/units.ts)). **Streak** and **weekly movement count**
are always **derived** from movement entries ([`src/lib/derive.ts`](./src/lib/derive.ts)),
never stored. The coach message is cached once per day in `CoachCheckin` so it's stable
across reloads.

## The AI coach (stubbed)

The coach is **not wired to Claude yet** — deliberately. All persona/logic lives in
[`src/lib/coach.ts`](./src/lib/coach.ts): `coachMessage()` returns deterministic copy
from the tone × calorie-band table (verbatim from the prototype — strong few-shot
examples of the target voice). To go live, replace the body of `coachMessage()` with a
server-side Claude API call (persona in the system prompt; pass `consumed`/`target`/`left`
+ `tone`); `getOrCreateDailyCheckin()` already handles daily caching, and
`GET /api/coach` is the ready HTTP seam.

## Local development

Requires a Postgres database. Copy the env template and point it at your DB:

```bash
cp .env.example .env        # set DATABASE_URL (and DIRECT_URL)
npm install
npm run db:migrate          # applies prisma/migrations
npm run db:seed             # loads demo data
npm run dev                 # http://localhost:3000
```

Scripts: `db:migrate` · `db:deploy` · `db:seed` · `db:studio` · `lint` · `typecheck` · `build`.

## Deploy (Vercel + Neon)

1. Create a Neon Postgres database. Copy the **pooled** connection string to
   `DATABASE_URL` and the **direct** string to `DIRECT_URL` in Vercel → Project →
   Settings → Environment Variables.
2. Deploy. `postinstall` runs `prisma generate`; `build` runs `prisma generate && next build`.
3. Apply the schema and seed once (from local, with the Neon URLs in `.env`):
   ```bash
   npm run db:deploy
   npm run db:seed        # optional — omit for an empty start
   ```

## PWA

Installable: [`public/manifest.webmanifest`](./public/manifest.webmanifest) +
a lightweight offline-first service worker ([`public/sw.js`](./public/sw.js),
registered in production only). Icons in `public/icons/` are generated placeholders
(clay "C") — swap for real artwork via `node scripts/gen-icons.mjs` or your own PNGs.
