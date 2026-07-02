import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/data";
import { getOrCreateDailyCheckin } from "@/lib/coach";
import { dayUTC } from "@/lib/dates";

// Stubbed AI-coach endpoint. Returns today's cached daily check-in, generating
// it from the deterministic tone×band templates in lib/coach.ts if absent.
//
// TODO: this is the seam for the real Claude API. lib/coach.ts holds the
// persona/logic; swap coachMessage() there for a server-side Claude call.
export async function GET() {
  const settings = await getSettings();
  const meals = await prisma.entry.findMany({
    where: { type: "MEAL", day: dayUTC() },
    select: { kcal: true },
  });
  const consumed = meals.reduce((a, m) => a + (m.kcal ?? 0), 0);

  const { message, band } = await getOrCreateDailyCheckin({
    tone: settings.coachTone,
    target: settings.calorieTarget,
    consumed,
  });

  return NextResponse.json({
    date: dayUTC().toISOString().slice(0, 10),
    tone: settings.coachTone,
    band,
    target: settings.calorieTarget,
    consumed,
    left: settings.calorieTarget - consumed,
    message,
  });
}
