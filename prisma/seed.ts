import { PrismaClient, EntryType, MoveType } from "@prisma/client";

const prisma = new PrismaClient();

/** UTC-midnight Date for the given local calendar day. Matches lib/dates.ts. */
function dayUTC(d: Date): Date {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}
function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setUTCDate(c.getUTCDate() + n);
  return c;
}

const PRESETS = [
  { item: "Oatmeal & berries", grams: 320, kcal: 280 },
  { item: "Greek yogurt", grams: 170, kcal: 150 },
  { item: "Chicken salad", grams: 410, kcal: 520 },
  { item: "Rice & veg bowl", grams: 350, kcal: 480 },
  { item: "Banana", grams: 120, kcal: 105 },
  { item: "Coffee w/ milk", grams: 240, kcal: 40 },
];

async function main() {
  // Clean slate so re-seeding is idempotent.
  await prisma.entry.deleteMany();
  await prisma.savedFood.deleteMany();
  await prisma.coachCheckin.deleteMany();

  // Settings singleton.
  await prisma.settings.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      units: "LB",
      goalWeightLb: 142,
      calorieTarget: 1800,
      weeklyMoveTarget: 5,
      coachTone: "STRICT",
    },
    update: {},
  });

  // Saved-food presets.
  await prisma.savedFood.createMany({
    data: PRESETS.map((p, i) => ({ ...p, sortOrder: i })),
  });

  const today = dayUTC(new Date());

  // --- Weight: ~6 weeks trending 151.0 -> 148.2 with gentle daily noise. ---
  const DAYS = 42;
  const start = 151.0;
  const end = 148.2;
  const weightEntries = [];
  for (let i = DAYS; i >= 0; i--) {
    const day = addDays(today, -i);
    const t = (DAYS - i) / DAYS; // 0..1
    // deterministic pseudo-noise so the smoothed line looks natural
    const noise = Math.sin(i * 1.7) * 0.35 + Math.cos(i * 0.9) * 0.2;
    const value =
      i === 0 ? end : Math.round((start + (end - start) * t + noise) * 10) / 10;
    weightEntries.push({
      day,
      createdAt: new Date(day.getTime() + 7 * 3600 * 1000 + 12 * 60 * 1000), // ~7:12 am
      type: EntryType.WEIGHT,
      weightLb: value,
    });
  }
  await prisma.entry.createMany({ data: weightEntries });

  // --- Movement: last 12 days before today are consecutive (streak = 12),
  // today is intentionally left OPEN so the accent "Move — not yet" card shows.
  // Earlier weeks get a realistic ~4-5x/week pattern. ---
  const moveEntries = [];
  const types: MoveType[] = [MoveType.DANCE, MoveType.WORKOUT, MoveType.OTHER];
  const notes = ["Felt strong today", "Easy pace", "", "Good energy", ""];
  for (let i = 1; i <= 12; i++) {
    const day = addDays(today, -i);
    moveEntries.push({
      day,
      createdAt: new Date(day.getTime() + 18 * 3600 * 1000),
      type: EntryType.MOVEMENT,
      moveType: types[i % 3],
      durationMin: 30 + ((i * 7) % 40),
      note: notes[i % notes.length],
    });
  }
  // older pattern: days 13..42 back, skip roughly 2 per week
  for (let i = 13; i <= 42; i++) {
    if (i % 7 === 0 || i % 7 === 3) continue; // two rest days a week
    const day = addDays(today, -i);
    moveEntries.push({
      day,
      createdAt: new Date(day.getTime() + 18 * 3600 * 1000),
      type: EntryType.MOVEMENT,
      moveType: types[i % 3],
      durationMin: 30 + ((i * 5) % 35),
      note: "",
    });
  }
  await prisma.entry.createMany({ data: moveEntries });

  // --- Today's meals (weight done, 2 meals logged, movement open). ---
  await prisma.entry.createMany({
    data: [
      {
        day: today,
        createdAt: new Date(today.getTime() + 7 * 3600 * 1000 + 40 * 60 * 1000),
        type: EntryType.MEAL,
        item: "Oatmeal & berries",
        grams: 320,
        kcal: 280,
      },
      {
        day: today,
        createdAt: new Date(today.getTime() + 13 * 3600 * 1000 + 15 * 60 * 1000),
        type: EntryType.MEAL,
        item: "Chicken salad",
        grams: 410,
        kcal: 520,
      },
    ],
  });

  console.log("Seed complete.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
