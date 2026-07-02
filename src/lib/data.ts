import "server-only";
import type { Settings } from "@prisma/client";
import { prisma } from "./prisma";
import { addDays, dayUTC } from "./dates";
import {
  movementDaySet,
  sessionsPerWeek,
  streak,
  weekDots,
  weekMoveCount,
  weeklyWeight,
} from "./derive";
import { getOrCreateDailyCheckin } from "./coach";

/** The settings singleton, creating it with defaults on first run. */
export async function getSettings(): Promise<Settings> {
  const existing = await prisma.settings.findUnique({
    where: { id: "singleton" },
  });
  if (existing) return existing;
  return prisma.settings.create({ data: { id: "singleton" } });
}

/** Most-recent weight entry (canonical lb), or null if none logged yet. */
async function latestWeightLb(): Promise<number | null> {
  const w = await prisma.entry.findFirst({
    where: { type: "WEIGHT" },
    orderBy: { createdAt: "desc" },
  });
  return w?.weightLb ?? null;
}

function sumKcal(meals: { kcal: number | null }[]): number {
  return meals.reduce((a, m) => a + (m.kcal ?? 0), 0);
}

// ---------------------------------------------------------------- Today

export async function getTodayData() {
  const today = dayUTC();
  const settings = await getSettings();

  const [weightEntry, todayMoves, meals, moves90] = await Promise.all([
    prisma.entry.findFirst({
      where: { type: "WEIGHT", day: today },
      orderBy: { createdAt: "desc" },
    }),
    prisma.entry.findMany({
      where: { type: "MOVEMENT", day: today },
      orderBy: { createdAt: "asc" },
    }),
    prisma.entry.findMany({
      where: { type: "MEAL", day: today },
      orderBy: { createdAt: "asc" },
    }),
    prisma.entry.findMany({
      where: { type: "MOVEMENT", day: { gte: addDays(today, -90) } },
      select: { day: true },
    }),
  ]);

  const days = movementDaySet(moves90);
  const consumed = sumKcal(meals);
  const lastMove = todayMoves[todayMoves.length - 1];
  const moveSummary = lastMove
    ? `${moveTypeLabel(lastMove.moveType)} · ${lastMove.durationMin ?? 0} min`
    : "Session logged";

  const coach = await getOrCreateDailyCheckin({
    tone: settings.coachTone,
    target: settings.calorieTarget,
    consumed,
  });

  return {
    settings,
    weightLb: weightEntry?.weightLb ?? null,
    weightAt: weightEntry?.createdAt ?? null,
    weightLoggedToday: !!weightEntry,
    movementLoggedToday: todayMoves.length > 0,
    moveSummary,
    mealsCount: meals.length,
    consumed,
    streak: streak(days, today),
    coachMessage: coach.message,
  };
}

// ---------------------------------------------------------------- Log

export async function getLogData() {
  const today = dayUTC();
  const settings = await getSettings();

  const [sessions, meals, presets, lastWeight] = await Promise.all([
    prisma.entry.findMany({
      where: { type: "MOVEMENT", day: today },
      orderBy: { createdAt: "asc" },
    }),
    prisma.entry.findMany({
      where: { type: "MEAL", day: today },
      orderBy: { createdAt: "asc" },
    }),
    prisma.savedFood.findMany({ orderBy: { sortOrder: "asc" } }),
    latestWeightLb(),
  ]);

  return {
    settings,
    sessions: sessions.map((s) => ({
      id: s.id,
      typeLabel: moveTypeLabel(s.moveType),
      duration: s.durationMin ?? 0,
      note: s.note ?? "",
    })),
    meals: meals.map((m) => ({
      id: m.id,
      item: m.item ?? "",
      grams: m.grams,
      kcal: m.kcal,
      at: m.createdAt,
    })),
    presets,
    lastWeightLb: lastWeight,
  };
}

// ---------------------------------------------------------------- Progress

export async function getProgressData() {
  const today = dayUTC();
  const settings = await getSettings();

  const [weights, moves90] = await Promise.all([
    prisma.entry.findMany({
      where: { type: "WEIGHT", day: { gte: addDays(today, -7 * 8) } },
      select: { day: true, weightLb: true },
      orderBy: { day: "asc" },
    }),
    prisma.entry.findMany({
      where: { type: "MOVEMENT", day: { gte: addDays(today, -90) } },
      select: { day: true },
    }),
  ]);

  const days = movementDaySet(moves90);

  return {
    settings,
    weekly: weeklyWeight(weights, today),
    streak: streak(days, today),
    weekMoveCount: weekMoveCount(days, today),
    weekDots: weekDots(days, today),
    bars: sessionsPerWeek(moves90, today),
  };
}

// ---------------------------------------------------------------- Goals

export async function getGoalsData() {
  const settings = await getSettings();
  const latest = await latestWeightLb();
  return {
    settings,
    latestWeightLb: latest,
  };
}

// ---------------------------------------------------------------- helpers

function moveTypeLabel(t: "DANCE" | "WORKOUT" | "OTHER" | null): string {
  switch (t) {
    case "DANCE":
      return "Dance";
    case "WORKOUT":
      return "Workout";
    case "OTHER":
      return "Other";
    default:
      return "Session";
  }
}
