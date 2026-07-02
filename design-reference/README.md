# Handoff: Weight & Movement Companion

## Overview
A personal, private, mobile-first daily companion built around **weight trends over time**, supported by movement and food logging, plus a strict-but-honest AI coach that gives one daily check-in. Single user. The goal is sustainable consistency, not aggressive cutting.

This bundle covers the **four main screens**: Today, Log, Progress, and Goals & Settings — fully clickable, with real logging state and a coach whose message responds to what's been logged.

## About the Design Files
The files in this bundle are **design references created in HTML** — a prototype showing the intended look and behavior. They are **not production code to copy directly**.

The task is to **recreate these designs in the target codebase** using its established patterns. Per the project spec the target stack is **Next.js 15, React, TypeScript, Postgres/Neon/Prisma, deployed on Vercel, delivered as an installable PWA** (same setup as "theatre-in-israel"). Rebuild the UI as React components with that stack's conventions; use the HTML only as the visual/behavioral source of truth.

The prototype is a single Design Component file (`Weight Companion.dc.html`) using a lightweight in-house template runtime. **Ignore the runtime/framework** — read it for layout, styling, copy, and interaction logic, then reimplement idiomatically.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, radii, and interactions are all specified below and present in the file. Recreate pixel-closely using the codebase's own component/styling libraries. All layout values are in CSS px at a 402px-wide phone viewport.

---

## Design Tokens

### Colors
| Token | Hex | Use |
|---|---|---|
| Canvas (behind phone) | `#E8DFCF` | app background / device backdrop |
| Paper (screen bg) | `#F4EEE4` | screen background |
| Surface | `#FBF7F0` | cards, inputs, bottom nav |
| Surface alt / chip | `#EFE7D8` | secondary cards, segmented-control track, stepper buttons |
| Hairline | `#E4DBCB` | borders / dividers |
| Hairline (card) | `#EDE4D4` | card borders |
| Ink (primary text) | `#33302B` | headings, primary text, dark cards |
| Ink muted | `#8A8172` | secondary text, labels |
| Ink faint | `#A69C8A` | tertiary text, inactive nav |
| Placeholder | `#B9AF9C` | input placeholders |
| Clay (accent / primary action) | `#C06B4E` | primary CTA, active states, "over budget", streak accent |
| Clay light | `#E0A88F` | coach emphasis text on dark card |
| Sage (positive / done) | `#7C8B6F` | completed states, downward-trend positive, calorie bar |
| Sand (bar track fill) | `#DFD3BE` | inactive chart bars |
| Stepper text | `#5A5347` | +/− glyphs |

Dark-card text opacities over `#33302B`: primary `#F4EEE4`; secondary `rgba(244,238,228,0.6–0.7)`; faint fills `rgba(244,238,228,0.14–0.22)`.

### Typography
- **Display / numbers / coach voice:** `Newsreader` (Google Fonts), a warm literary serif. Weights 400–500; italic used for the "data-first" coach whisper only. Used for: screen titles, big weight numbers, streak count, coach check-in message.
- **UI / body:** `Hanken Grotesk` (Google Fonts), weights 400/500/600/700. Everything else.
- `-webkit-font-smoothing: antialiased` on body.

Type scale (px): screen title 30 (Newsreader) · Today day-name 32 · hero weight number 44 (Progress) / 64 (weight input) · streak 26 · section labels 12–13 uppercase 600 letter-spacing ~0.04em · body 14–15 · captions 11–13 · calorie "left" number 36.

### Spacing / Radius / Shadow
- Screen padding: `16px 24px 28px`.
- Card padding: 16–20px. Card gap in a column: 14–16px.
- Radii: phone shell `44`; large cards `22–24`; buttons/inputs `14–16`; chips/pills `100` (full) or `12`; segmented track `12–14`, thumb `9–11`; icon circles 50%.
- Primary-CTA shadow (clay): `0 10px 22px -10px rgba(192,107,78,0.6)`; move card: `0 12px 24px -10px rgba(192,107,78,0.6)`.
- Phone shell shadow: `0 40px 80px -24px rgba(60,50,35,0.4)`.
- Icons: inline SVG, 22×22 in nav, 18×18 in circles, `stroke-width` 1.6–2.4, `stroke="currentColor"` in nav so active color drives them.

---

## App Shell
- Centered phone frame: **402×874px**, `border-radius:44`, `overflow:hidden`, column flex. (Design was specified "no device bezel — just the screen at phone width"; in the real PWA this is simply the full viewport.)
- Structure top→bottom: **status bar** (fixed) → **scrollable screen area** (`flex:1; overflow-y:auto`, scrollbar hidden) → **bottom tab nav** (fixed).
- **Status bar:** `9:41` left; signal + battery glyphs right (decorative — use the real device status bar in the PWA).
- **Bottom nav:** 4 tabs — Today (home icon), Log (plus icon), Progress (line-chart icon), Goals (target icon). Active tab = clay `#C06B4E`; inactive = faint `#A69C8A`. Label 11px/600 under a 22px icon. `justify-content:space-around`, padding `12px 20px 26px`, bg `#FBF7F0`, top border `#E4DBCB`.

---

## Screens / Views

### 1. Today (default)
**Purpose:** one glance at the day + one-tap access to log; the daily coach check-in.

Layout: column, gap 14px. Order:
1. **Header row:** left = day name (`Wednesday`, Newsreader 32) + date/subtitle (`July 2 · close out your day`, 14 muted). Right = **streak badge**: dark `#33302B` rounded-18 chip, Newsreader streak number 26 + "DAY STREAK" 10px uppercase.
2. **Three ritual cards** (the day as things to close out), each a full-width row: 38px circle icon + title + subtitle + trailing status/chevron.
   - **Weigh card** — two states: *done* (sage circle with check, "Weighed in", "148.2 lb · 7:12 am", trailing "done" in Newsreader sage) / *open* (dashed border, "Weigh in — not yet", "Tap to log today's weight", chevron). Tapping → Log ▸ Weight tab.
   - **Move card** — two states: *open* is the **primary/accent card** (clay bg `#C06B4E`, white text, translucent icon circle, "Move — not yet", "Tap to log a session", white chevron, clay shadow) / *done* (sage circle + check, "Moved today", subtitle = last session summary e.g. "Dance · 45 min", trailing "done"). Tapping → Log ▸ Movement tab.
   - **Eat card** — surface card, "Meals logged", subtitle "{n} today · {kcal consumed} kcal", trailing `+`. Tapping → Log ▸ Meals tab.
3. **Calories today card** (surface): label "CALORIES TODAY" + "{consumed} of {target} kcal" right-aligned; big number = **kcal left** (Newsreader 36) + "kcal left"; horizontal progress bar (track `#EFE7D8`, fill = consumed/target %). When over budget: number and bar turn clay `#C06B4E` and the word becomes "over".
4. **Coach check-in card** (surface-alt `#EFE7D8`): 24px dark avatar circle with serif "C" + "TODAY'S CHECK-IN" label; message in Newsreader 19/1.42 ink. Message text is computed — see Coach.

### 2. Log
**Purpose:** capture weight, movement, meals.

- Title "Log" (Newsreader 30).
- **Segmented tabs** Weight / Movement / Meals: track `#EFE7D8` radius 14 padding 4; active thumb = surface `#FBF7F0` with ink text; inactive = muted text, transparent.

**Weight tab:** centered "TODAY'S WEIGHT" label; large numeric input (Newsreader 64, transparent, bottom-border `#E4DBCB`, center-aligned, width 190) + unit; helper "Once a day. It gets timestamped automatically."; primary dark button "Save today's weight"; footer "Last logged: {weight} {unit}, 7:12 am". Save parses the number, updates today's weight, marks weigh done, returns to Today.

**Movement tab:** "Type" pills — **Dance / Workout / Other** (Salsa was removed). Selected pill = surface bg + clay border + ink text; unselected = transparent + hairline border + muted text. Duration input (number, minutes) + Note input (text, optional), both surface inputs radius 14. Primary **clay** button "Log session · counts toward streak". Below, if any sessions logged today: "Today's sessions" list — sage dot + "{Type} · {n} min" + note. Logging: appends session, marks movement done; if it was the first movement today, **streak +1** and **week movement count +1**; returns to Today.

**Meals tab:**
- **Quick add · saved items** — a vertical list of preset rows (surface card, radius 14): title + "{grams} g · {kcal} kcal" + trailing `+` in a 28px `#EFE7D8` circle. **One tap logs that item (with its calories) to today** immediately. Presets: Oatmeal & berries 320g/280 · Greek yogurt 170g/150 · Chicken salad 410g/520 · Rice & veg bowl 350g/480 · Banana 120g/105 · Coffee w/ milk 240g/40. (In production these should be user-editable/saveable — see State.)
- Divider "or add your own".
- Manual entry: Item (text, flex 2) + grams (number) on one row; calories (number, optional) below; dark button "Add to today".
- "Today · {n} logged" list of meals: item + "{grams} g · {kcal} kcal" (kcal omitted if none) + time.

### 3. Progress
**Purpose:** the trend and consistency; detail charts on demand.

- Title "Progress" (Newsreader 30). Column gap 16.
- **Weekly-average weight card** (surface): "WEEKLY AVERAGE" label + "↓ 2.8 {unit} · 6 wks" (sage); current avg = Newsreader 44 + unit; **smoothed line chart** (SVG, single ink line, `stroke-width:3`, rounded) with a **dashed clay goal line** and an end dot; x-axis captions "6 weeks ago" / "goal {goalWeight}" (clay) / "now". Intentionally minimal — smooths daily noise; no daily dots.
- **Consistency card** (dark `#33302B`): left = "MOVEMENT STREAK" + streak number (Newsreader 40) + "days"; right = "This week" + "{done} / {target}" (Newsreader 24). Below, a **7-day dot row** (M–S): filled sage `#7C8B6F` = moved; empty = translucent circle; today reflects live state — clay filled with glow ring if moved, dashed ring if not.
- **Sessions-per-week card** (surface): "SESSIONS PER WEEK" + 6 bars (W1–W5 sand `#DFD3BE`, current week clay `#C06B4E` labelled "now").

*(Chart data in the prototype is representative/static except today's consistency dot. In production, derive all of it from `entries`.)*

### 4. Goals & Settings
**Purpose:** user sets her own targets; app imposes none. Units, coach tone, export.

Cards, column gap 16, title "Goals & Settings" (Newsreader 30):
- **Goal weight** — stepper: round `#EFE7D8` −/+ buttons (44px) flanking Newsreader 44 value + unit; footer "{distance} {unit} to go · your target, your pace".
- **Daily calorie target** — stepper (**±50**, min 800), Newsreader 44 + "kcal"; footer "Your number — adjust it anytime." Drives the Today calories card.
- **Weekly movement target** — stepper (±1, clamp 1–7), value + "/ week".
- **Units** — row with "Units" label + segmented **lb / kg** control (active = surface thumb + ink; inactive = muted). *(Note: the prototype swaps the unit label only; production must convert stored values.)*
- **Coach tone** — "Coach tone" + helper "How direct should your daily check-in be?" + 3 pills **Gentle / Steady / Strict** (default **Strict**). Selection changes the coach copy (see Coach).
- **Export my data** — card, "Download all entries as CSV"; on tap label becomes "Exported ✓ — check your files".
- Footer note: "This app sets no calorie targets and prescribes no deficits. The numbers are yours."

---

## Interactions & Behavior
- **Navigation:** bottom nav switches the four screens; ritual cards and eat card deep-link into the matching Log tab.
- **Save weight:** validates a positive number → sets today's weight, marks weigh card done, returns to Today.
- **Log movement:** appends a session; first-of-day marks move done, increments streak + week count; returns to Today. Move card + streak badge + coach message all update.
- **Quick-add meal:** one tap appends the preset (with calories) to today; Today calorie card + eat-card subtitle recompute instantly.
- **Manual meal:** requires a non-empty item; grams/calories optional.
- **Steppers:** goal weight (±1), calorie target (±50, min 800), movement target (±1, 1–7).
- **Units / coach tone:** segmented selects; coach tone re-renders the check-in text.
- **Export:** stub that flips its label to a confirmation; wire to a real CSV export server-side.
- No page transitions/animations beyond instant state swaps; keep it calm. Hover/press affordances via `cursor:pointer` on all tappable cards.

## State Management
Prototype state (reimplement with DB-backed data + React state / server actions):
- `screen` (today | log | progress | goals), `logTab` (weight | movement | meals) — UI only.
- `units` (lb | kg), `goalWeight`, `calorieTarget`, `weeklyMoveTarget`, `coachTone` (gentle | steady | strict) → **`goals` / settings** table.
- `weightToday` + `weightLoggedToday`, `movementLoggedToday`, `sessions[]` (type, duration, note), `meals[]` (item, grams, kcal?, time) → **`entries`** (`{date, type: weight|movement|meal, value, note, grams?, macros?}`).
- `streak`, `weekMoveCount` → **derived** from movement entries, not stored.
- Meal **presets** are static in the prototype → production should persist a user-editable saved-foods list (item, grams, kcal) that "quick add" reads from and that manual entries can be saved into.
- Coach message → **`coach_checkins` `{date, message}`**, cached once per day so it's stable across reloads.

### Coach (persona & logic)
One check-in per day on Today. Persona: steady, honest, direct.

**The coach is focused on the daily calorie budget** (this is a deliberate product decision by the user that supersedes the original spec's "coach does not count calories" note). The message reacts to **calories left vs. the daily target** and adapts to the selected tone. It may still acknowledge trend/streak, but calories are the subject.

Logic: `consumed` = sum of today's logged meal calories; `left = calorieTarget − consumed`. Three bands:
- **room** — `left > 200`
- **tight** — `0 ≤ left ≤ 200`
- **over** — `left < 0` (report `over = |left|`)

Prototype copy by tone × band:
- **Gentle**
  - room: "{left} kcal left of your {target} today. Nice pace — no pressure, just keep logging what you eat."
  - tight: "About {left} kcal left. Getting close — a lighter evening will land you right on target."
  - over: "A little over today ({over} kcal). No guilt — tomorrow's a fresh {target}."
- **Steady**
  - room: "{left} of {target} kcal still yours today. Good room — keep logging and stay mindful tonight."
  - tight: "{left} kcal left. You're near the line — ease off from here and you've got it."
  - over: "{over} over today. It happens. Note it and aim for {target} tomorrow."
- **Strict** (default)
  - room: "{left} kcal left of {target}. Plenty of room — don't waste it and don't overshoot. Log every bite."
  - tight: "Only {left} kcal left today. You're on the line — hold it. No late-night discounts."
  - over: "{over} over budget. That's the math, and the math doesn't negotiate. Reset tomorrow at {target}. No excuses."

In production, generate the daily message via Claude from the calorie budget (consumed/target/left) + tone (these are strong few-shot examples of the target voice), then cache it in `coach_checkins`.

## Assets
No external image assets. All icons are inline SVG (home, plus, line-chart, target, check, arrow/chevron, clock, fork/knife, info, download). Fonts: **Newsreader** and **Hanken Grotesk** from Google Fonts. Replace icons with the codebase's existing icon set if one exists; match stroke weight and rounding.

## Files
- `Weight Companion.dc.html` — the four-screen clickable prototype (template markup + logic class). Read the template for exact markup/inline styles and the `class Component` logic for all interaction + coach logic. This is the source of truth.
- `Today Directions.dc.html` — the three explored Today directions; **1c (Daily ritual)** was chosen and is what's built. Included for context only.
