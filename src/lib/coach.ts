import "server-only";
import type { CoachTone } from "@prisma/client";
import { prisma } from "./prisma";
import { dayUTC } from "./dates";

export type Band = "room" | "tight" | "over";

/** Calorie band: room (>200 left), tight (0–200), over (<0). */
export function calorieBand(left: number): Band {
  if (left < 0) return "over";
  if (left <= 200) return "tight";
  return "room";
}

/**
 * STUBBED coach copy — deterministic tone × band templates lifted verbatim
 * from the design prototype. These are strong few-shot examples of the target
 * voice.
 *
 * TODO: replace the body of this function with a server-side call to the
 * Claude API (persona in the system prompt; pass consumed/target/left + tone).
 * Cache the generated line via getOrCreateDailyCheckin so it stays stable.
 */
export function coachMessage(args: {
  tone: CoachTone;
  target: number;
  consumed: number;
}): { message: string; band: Band } {
  const { tone, target, consumed } = args;
  const left = target - consumed;
  const over = Math.abs(left);
  const band = calorieBand(left);

  const lines: Record<Lowercase<CoachTone>, Record<Band, string>> = {
    gentle: {
      room: `${left} kcal left of your ${target} today. Nice pace — no pressure, just keep logging what you eat.`,
      tight: `About ${left} kcal left. Getting close — a lighter evening will land you right on target.`,
      over: `A little over today (${over} kcal). No guilt — tomorrow's a fresh ${target}.`,
    },
    steady: {
      room: `${left} of ${target} kcal still yours today. Good room — keep logging and stay mindful tonight.`,
      tight: `${left} kcal left. You're near the line — ease off from here and you've got it.`,
      over: `${over} over today. It happens. Note it and aim for ${target} tomorrow.`,
    },
    strict: {
      room: `${left} kcal left of ${target}. Plenty of room — don't waste it and don't overshoot. Log every bite.`,
      tight: `Only ${left} kcal left today. You're on the line — hold it. No late-night discounts.`,
      over: `${over} over budget. That's the math, and the math doesn't negotiate. Reset tomorrow at ${target}. No excuses.`,
    },
  };

  const key = tone.toLowerCase() as Lowercase<CoachTone>;
  return { message: lines[key][band], band };
}

/**
 * Returns today's cached check-in, generating + storing it if absent. Because
 * the message depends on live calorie state (which changes as meals are logged)
 * and the selected tone, we key the cache on day+tone+consumed and refresh the
 * row when any of those change — so it's stable across reloads but honest.
 */
export async function getOrCreateDailyCheckin(args: {
  tone: CoachTone;
  target: number;
  consumed: number;
}): Promise<{ message: string; band: Band }> {
  const day = dayUTC();
  const { message, band } = coachMessage(args);

  const existing = await prisma.coachCheckin.findUnique({ where: { day } });
  if (existing && existing.message === message) {
    return { message: existing.message, band: existing.band as Band };
  }

  await prisma.coachCheckin.upsert({
    where: { day },
    create: { day, message, tone: args.tone, band },
    update: { message, tone: args.tone, band },
  });
  return { message, band };
}
