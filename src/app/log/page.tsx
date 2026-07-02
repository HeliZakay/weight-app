import Link from "next/link";
import { getLogData } from "@/lib/data";
import { saveWeight, logMovement, addMeal, quickAddPreset } from "@/lib/actions";
import { formatWeight, toDisplay, unitLabel } from "@/lib/units";
import { timeLabel } from "@/lib/dates";

export const dynamic = "force-dynamic";

type Tab = "weight" | "movement" | "meals";

const TABS: { key: Tab; label: string }[] = [
  { key: "weight", label: "Weight" },
  { key: "movement", label: "Movement" },
  { key: "meals", label: "Meals" },
];

export default async function LogPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab: tabParam } = await searchParams;
  const tab: Tab =
    tabParam === "movement" || tabParam === "meals" ? tabParam : "weight";

  const d = await getLogData();
  const units = d.settings.units;
  const unit = unitLabel(units);

  return (
    <div className="px-6 pt-4 pb-7">
      <h1 className="text-ink font-serif text-[30px]">Log</h1>

      {/* Segmented tabs */}
      <div className="bg-surface-alt mt-3.5 mb-5 flex gap-1 rounded-[14px] p-1">
        {TABS.map((t) => {
          const active = t.key === tab;
          return (
            <Link
              key={t.key}
              href={`/log?tab=${t.key}`}
              className={`flex-1 rounded-[10px] py-[9px] text-center text-[13px] font-semibold ${
                active ? "bg-surface text-ink" : "text-ink-muted bg-transparent"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      {tab === "weight" && (
        <form action={saveWeight} className="flex flex-col gap-[18px]">
          <div className="py-2.5 text-center">
            <div className="text-ink-muted text-[13px] font-semibold tracking-[0.05em] uppercase">
              Today&apos;s weight
            </div>
            <div className="mt-3.5 flex items-baseline justify-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                name="weight"
                placeholder={
                  d.lastWeightLb != null
                    ? toDisplay(d.lastWeightLb, units).toFixed(1)
                    : "148.2"
                }
                className="text-ink border-hairline w-[190px] border-b-2 bg-transparent pb-1.5 text-center font-serif text-[64px] outline-none"
              />
              <span className="text-ink-muted font-serif text-2xl">{unit}</span>
            </div>
            <div className="text-ink-faint mt-3.5 text-[13px]">
              Once a day. It gets timestamped automatically.
            </div>
          </div>
          <button
            type="submit"
            className="bg-ink text-paper rounded-button py-4 text-center text-[15px] font-semibold"
          >
            Save today&apos;s weight
          </button>
          {d.lastWeightLb != null && (
            <div className="text-ink-muted text-center text-[13px]">
              Last logged: {formatWeight(d.lastWeightLb, units)} {unit}
            </div>
          )}
        </form>
      )}

      {tab === "movement" && (
        <div className="flex flex-col gap-[18px]">
          <form action={logMovement} className="flex flex-col gap-[18px]">
            <div>
              <div className="text-ink-muted mb-2.5 text-[13px] font-semibold">
                Type
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { v: "DANCE", label: "Dance" },
                  { v: "WORKOUT", label: "Workout" },
                  { v: "OTHER", label: "Other" },
                ].map((o, i) => (
                  <label key={o.v} className="cursor-pointer">
                    <input
                      type="radio"
                      name="moveType"
                      value={o.v}
                      defaultChecked={i === 0}
                      className="peer sr-only"
                    />
                    <span className="border-hairline text-ink-muted peer-checked:bg-surface peer-checked:border-clay peer-checked:text-ink inline-block rounded-full border px-[18px] py-2.5 text-sm font-semibold">
                      {o.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <div className="text-ink-muted mb-2 text-[13px] font-semibold">
                Duration (minutes)
              </div>
              <input
                type="number"
                inputMode="numeric"
                name="duration"
                placeholder="45"
                className="border-hairline bg-surface text-ink w-full rounded-[14px] border px-4 py-3.5 text-base outline-none"
              />
            </div>
            <div>
              <div className="text-ink-muted mb-2 text-[13px] font-semibold">
                Note (optional)
              </div>
              <input
                type="text"
                name="note"
                placeholder="Felt strong today"
                className="border-hairline bg-surface text-ink w-full rounded-[14px] border px-4 py-3.5 text-base outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-clay text-paper shadow-cta rounded-button py-4 text-center text-[15px] font-semibold"
            >
              Log session · counts toward streak
            </button>
          </form>

          {d.sessions.length > 0 && (
            <div>
              <div className="text-ink-muted mt-1.5 mb-2.5 text-[13px] font-semibold">
                Today&apos;s sessions
              </div>
              {d.sessions.map((s) => (
                <div
                  key={s.id}
                  className="bg-surface border-hairline-card mb-2 flex items-center gap-3 rounded-[14px] border px-3.5 py-3"
                >
                  <span className="bg-sage h-2 w-2 rounded-full" />
                  <div className="flex-1 text-sm">
                    <span className="text-ink font-semibold">
                      {s.typeLabel}
                    </span>{" "}
                    <span className="text-ink-muted">· {s.duration} min</span>
                  </div>
                  <span className="text-ink-faint text-[13px]">{s.note}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "meals" && (
        <div className="flex flex-col gap-4">
          {/* Quick add */}
          <div>
            <div className="text-ink-muted mb-2.5 text-[13px] font-semibold">
              Quick add · saved items
            </div>
            <div className="flex flex-col gap-2">
              {d.presets.map((p) => (
                <form key={p.id} action={quickAddPreset.bind(null, p.id)}>
                  <button
                    type="submit"
                    className="bg-surface border-hairline flex w-full items-center gap-3 rounded-[14px] border px-3.5 py-[11px] text-left"
                  >
                    <div className="flex-1">
                      <div className="text-ink text-sm font-semibold">
                        {p.item}
                      </div>
                      <div className="text-ink-muted text-xs">
                        {p.grams} g · {p.kcal} kcal
                      </div>
                    </div>
                    <span className="bg-surface-alt text-stepper flex h-7 w-7 flex-none items-center justify-center rounded-full text-[19px]">
                      +
                    </span>
                  </button>
                </form>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="my-0.5 flex items-center gap-3">
            <span className="bg-hairline h-px flex-1" />
            <span className="text-ink-faint text-xs font-semibold">
              or add your own
            </span>
            <span className="bg-hairline h-px flex-1" />
          </div>

          {/* Manual entry */}
          <form action={addMeal} className="flex flex-col gap-4">
            <div className="flex gap-2.5">
              <input
                type="text"
                name="item"
                placeholder="Item"
                className="border-hairline bg-surface text-ink flex-[2] rounded-[14px] border px-4 py-3.5 text-base outline-none"
              />
              <input
                type="number"
                inputMode="numeric"
                name="grams"
                placeholder="grams"
                className="border-hairline bg-surface text-ink min-w-0 flex-1 rounded-[14px] border px-3 py-3.5 text-base outline-none"
              />
            </div>
            <input
              type="number"
              inputMode="numeric"
              name="kcal"
              placeholder="calories (optional)"
              className="border-hairline bg-surface text-ink w-full rounded-[14px] border px-4 py-3.5 text-base outline-none"
            />
            <button
              type="submit"
              className="bg-ink text-paper rounded-button py-4 text-center text-[15px] font-semibold"
            >
              Add to today
            </button>
          </form>

          {/* Today's meals */}
          <div>
            <div className="text-ink-muted mt-1.5 mb-2.5 text-[13px] font-semibold">
              Today · {d.meals.length} logged
            </div>
            {d.meals.map((m) => (
              <div
                key={m.id}
                className="bg-surface border-hairline-card mb-2 flex items-center gap-3 rounded-[14px] border px-[15px] py-[13px]"
              >
                <div className="flex-1">
                  <div className="text-ink text-sm font-semibold">{m.item}</div>
                  <div className="text-ink-muted text-[13px]">
                    {m.grams != null ? `${m.grams} g` : "—"}
                    {m.kcal != null ? ` · ${m.kcal} kcal` : ""}
                  </div>
                </div>
                <span className="text-placeholder text-xs">
                  {timeLabel(m.at)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
