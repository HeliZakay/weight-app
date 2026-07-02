"use server";

import type { CoachTone, MoveType, Units } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { dayUTC } from "./dates";
import { fromInput, toDisplay } from "./units";
import { getSettings } from "./data";

async function currentUnits(): Promise<Units> {
  return (await getSettings()).units;
}

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/log");
  revalidatePath("/progress");
  revalidatePath("/goals");
}

// ---------------------------------------------------------------- Weight

export async function saveWeight(formData: FormData) {
  const raw = parseFloat(String(formData.get("weight") ?? ""));
  if (isNaN(raw) || raw <= 0) return; // invalid input: no-op
  const units = await currentUnits();
  const weightLb = fromInput(raw, units);
  const day = dayUTC();

  // One weight per day: replace today's if it exists.
  const existing = await prisma.entry.findFirst({
    where: { type: "WEIGHT", day },
  });
  if (existing) {
    await prisma.entry.update({
      where: { id: existing.id },
      data: { weightLb, createdAt: new Date() },
    });
  } else {
    await prisma.entry.create({ data: { type: "WEIGHT", day, weightLb } });
  }

  revalidateAll();
  redirect("/");
}

// ---------------------------------------------------------------- Movement

export async function logMovement(formData: FormData) {
  const moveType = (String(formData.get("moveType") ?? "DANCE") as MoveType) ?? "DANCE";
  const durParsed = parseInt(String(formData.get("duration") ?? ""), 10);
  const durationMin = isNaN(durParsed) ? 30 : durParsed;
  const note = String(formData.get("note") ?? "").trim() || null;

  await prisma.entry.create({
    data: { type: "MOVEMENT", day: dayUTC(), moveType, durationMin, note },
  });

  revalidateAll();
  redirect("/");
}

// ---------------------------------------------------------------- Meals

export async function addMeal(formData: FormData) {
  const item = String(formData.get("item") ?? "").trim();
  if (!item) return; // item is required
  const g = parseInt(String(formData.get("grams") ?? ""), 10);
  const k = parseInt(String(formData.get("kcal") ?? ""), 10);

  await prisma.entry.create({
    data: {
      type: "MEAL",
      day: dayUTC(),
      item,
      grams: isNaN(g) ? null : g,
      kcal: isNaN(k) ? null : k,
    },
  });

  revalidateAll();
}

export async function quickAddPreset(presetId: string) {
  const preset = await prisma.savedFood.findUnique({ where: { id: presetId } });
  if (!preset) return;
  await prisma.entry.create({
    data: {
      type: "MEAL",
      day: dayUTC(),
      item: preset.item,
      grams: preset.grams,
      kcal: preset.kcal,
    },
  });
  revalidateAll();
}

// ---------------------------------------------------------------- Goals / settings

async function patchSettings(data: Parameters<typeof prisma.settings.update>[0]["data"]) {
  await getSettings(); // ensure singleton exists
  await prisma.settings.update({ where: { id: "singleton" }, data });
  revalidateAll();
}

/** Step goal weight by ±1 in the user's display units (stored canonically). */
export async function adjustGoalWeight(delta: number) {
  const s = await getSettings();
  const nextDisplay = Math.round(toDisplay(s.goalWeightLb, s.units)) + delta;
  await patchSettings({ goalWeightLb: fromInput(nextDisplay, s.units) });
}

export async function adjustCalorieTarget(delta: number) {
  const s = await getSettings();
  const next = Math.max(800, s.calorieTarget + delta);
  await patchSettings({ calorieTarget: next });
}

export async function adjustMoveTarget(delta: number) {
  const s = await getSettings();
  const next = Math.min(7, Math.max(1, s.weeklyMoveTarget + delta));
  await patchSettings({ weeklyMoveTarget: next });
}

export async function setUnits(units: Units) {
  await patchSettings({ units });
}

export async function setCoachTone(tone: CoachTone) {
  await patchSettings({ coachTone: tone });
}
