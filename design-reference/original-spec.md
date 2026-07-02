# Weight & Movement Companion — Design Brief

## Concept
A personal daily companion built around **weight trends over time**, supported by movement and food logging, with an AI coach that gives one calm daily check-in. Mobile-first (used on a phone every day), single user, private. The goal is sustainable progress and consistency — not aggressive cutting.

## Screens

### 1. Today (default view)
- One-tap access to log weight, a workout/dance session, and a meal.
- Today's snapshot: latest weight, current movement streak, whether today's items are logged.
- The daily coach check-in appears here once per day (see Coach).

### 2. Log
- **Weight** — single number, once a day, timestamped.
- **Movement** — type (dance / salsa / structured workout / other), duration, optional note. Counts toward the streak.
- **Meals** — gram-level logging supported (item + grams, optional calories/macros if she wants them). Data is captured but never scored or judged.

### 3. Progress
A mix of three views:
- **Weekly-average weight line** — smooths daily noise; the primary trend signal.
- **Consistency** — movement streaks and logging history.
- **Charts** — breakdowns over time (movement frequency, weight range, meals logged) for when she wants detail.

### 4. Goals & Settings
- She sets her own targets (goal weight, weekly movement target). The app imposes no numbers and prescribes no calorie targets or deficits.
- Units, coach tone, data export.

## AI Coach (character)
- **Persona:** a steady, honest daily companion. Warm but direct — reflects trends back plainly, no performative cheerleading.
- **Cadence:** one check-in per day, on the Today screen.
- **What it reacts to:** weight *direction* (weekly trend), movement consistency and streaks. It celebrates showing up and gently names drift when the trend stalls.
- **What it does NOT do:** comment on or police individual meals, count calories back at her, or push restriction/deficits. Food logs are context, not a scoreboard.
- **Powered by:** Claude API (system prompt defines the persona). In the real build, called from the Next.js backend.

## Data model (rough)
- `entries` — { date, type: weight | movement | meal, value, note, grams?, macros? }
- `goals` — { metric, target, cadence }
- `coach_checkins` — { date, message } (cached daily so it's stable)
- Streaks derived from movement entries.

## Tech
- **Stack:** Next.js 15, React, TypeScript, Postgres/Neon/Prisma, Vercel — same as theatre-in-israel.
- **Delivery:** installable PWA for daily phone use.
- **Coach:** server-side call to Claude API; persona in the system prompt.

## Build path
1. This spec → paste into first Claude Design prompt.
2. Iterate screens on the canvas (Today, Log, Progress, Goals).
3. Hand off the Design bundle to Claude Code.
4. Build as a Next.js project, deploy on Vercel.
