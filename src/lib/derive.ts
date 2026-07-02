/**
 * Derived stats — streak, weekly counts, chart series. Nothing here is stored;
 * it's all computed from movement / weight entries at read time.
 */
import { addDays, dayKey, dayUTC, startOfWeek } from "./dates";

type DayLike = { day: Date };
type WeightLike = { day: Date; weightLb: number | null };

/** Set of yyyy-mm-dd keys that have at least one movement entry. */
export function movementDaySet(moves: DayLike[]): Set<string> {
  return new Set(moves.map((m) => dayKey(m.day)));
}

/**
 * Consecutive movement days ending today. Today not-yet-logged doesn't break
 * the streak (grace for the current day) — it counts back from yesterday.
 */
export function streak(days: Set<string>, today: Date = new Date()): number {
  let count = 0;
  let cursor = dayUTC(today);
  if (!days.has(dayKey(cursor))) cursor = addDays(cursor, -1);
  while (days.has(dayKey(cursor))) {
    count++;
    cursor = addDays(cursor, -1);
  }
  return count;
}

/** Distinct movement days in the current (Mon-start) week. */
export function weekMoveCount(days: Set<string>, today: Date = new Date()): number {
  const mon = startOfWeek(today);
  let n = 0;
  for (let i = 0; i < 7; i++) {
    if (days.has(dayKey(addDays(mon, i)))) n++;
  }
  return n;
}

export type WeekDot = {
  label: string;
  moved: boolean;
  isToday: boolean;
  isFuture: boolean;
};

/** 7-day dot row (Mon–Sun) for the current week. */
export function weekDots(days: Set<string>, today: Date = new Date()): WeekDot[] {
  const mon = startOfWeek(today);
  const todayKey = dayKey(today);
  const labels = ["M", "T", "W", "T", "F", "S", "S"];
  return labels.map((label, i) => {
    const d = addDays(mon, i);
    const key = dayKey(d);
    return {
      label,
      moved: days.has(key),
      isToday: key === todayKey,
      isFuture: key > todayKey,
    };
  });
}

export type WeeklyWeight = {
  weeks: { avg: number }[]; // oldest → newest, one per week
  latestAvg: number | null;
  deltaAbs: number; // absolute change across the window
  down: boolean; // trending down?
  weeksCount: number;
};

/**
 * Weekly-average weight over the last `windowWeeks` weeks. Smooths daily noise —
 * the primary trend signal on the Progress screen.
 */
export function weeklyWeight(
  weights: WeightLike[],
  today: Date = new Date(),
  windowWeeks = 6,
): WeeklyWeight {
  const mon = startOfWeek(today);
  const buckets: number[][] = Array.from({ length: windowWeeks }, () => []);
  for (const w of weights) {
    if (w.weightLb == null) continue;
    // which week bucket (0 = oldest in window) does this fall in?
    const weeksAgo = Math.floor(
      (mon.getTime() - startOfWeek(w.day).getTime()) / (7 * 86400_000),
    );
    const idx = windowWeeks - 1 - weeksAgo;
    if (idx >= 0 && idx < windowWeeks) buckets[idx].push(w.weightLb);
  }
  const weeks = buckets
    .map((vals) =>
      vals.length ? { avg: vals.reduce((a, b) => a + b, 0) / vals.length } : null,
    )
    .filter((x): x is { avg: number } => x !== null);

  const latestAvg = weeks.length ? weeks[weeks.length - 1].avg : null;
  const firstAvg = weeks.length ? weeks[0].avg : null;
  const delta =
    latestAvg != null && firstAvg != null ? latestAvg - firstAvg : 0;

  return {
    weeks,
    latestAvg,
    deltaAbs: Math.abs(delta),
    down: delta < 0,
    weeksCount: weeks.length,
  };
}

/** Movement sessions per week for the last `windowWeeks` weeks (oldest → now). */
export function sessionsPerWeek(
  moves: DayLike[],
  today: Date = new Date(),
  windowWeeks = 6,
): { count: number; isCurrent: boolean }[] {
  const mon = startOfWeek(today);
  const counts = Array.from({ length: windowWeeks }, () => 0);
  for (const m of moves) {
    const weeksAgo = Math.floor(
      (mon.getTime() - startOfWeek(m.day).getTime()) / (7 * 86400_000),
    );
    const idx = windowWeeks - 1 - weeksAgo;
    if (idx >= 0 && idx < windowWeeks) counts[idx]++;
  }
  return counts.map((count, i) => ({
    count,
    isCurrent: i === windowWeeks - 1,
  }));
}
