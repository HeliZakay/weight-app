import { prisma } from "@/lib/prisma";

/** Escape a CSV field (quote if it contains a comma, quote, or newline). */
function csv(value: unknown): string {
  if (value == null) return "";
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Downloads all entries as a CSV file. Wired to the "Export my data" card.
export async function GET() {
  const entries = await prisma.entry.findMany({
    orderBy: [{ day: "asc" }, { createdAt: "asc" }],
  });

  const header = [
    "date",
    "logged_at",
    "type",
    "weight_lb",
    "move_type",
    "duration_min",
    "note",
    "item",
    "grams",
    "kcal",
  ];
  const rows = entries.map((e) =>
    [
      e.day.toISOString().slice(0, 10),
      e.createdAt.toISOString(),
      e.type,
      e.weightLb ?? "",
      e.moveType ?? "",
      e.durationMin ?? "",
      e.note ?? "",
      e.item ?? "",
      e.grams ?? "",
      e.kcal ?? "",
    ]
      .map(csv)
      .join(","),
  );

  const body = [header.join(","), ...rows].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="companion-entries.csv"',
    },
  });
}
