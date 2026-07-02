import { getGoalsData } from "@/lib/data";
import {
  adjustGoalWeight,
  adjustCalorieTarget,
  adjustMoveTarget,
  setUnits,
  setCoachTone,
} from "@/lib/actions";
import { toDisplay, unitLabel } from "@/lib/units";
import Stepper from "@/components/Stepper";
import ExportCard from "@/components/ExportCard";
import type { CoachTone } from "@prisma/client";

export const dynamic = "force-dynamic";

const TONES: { key: CoachTone; label: string }[] = [
  { key: "GENTLE", label: "Gentle" },
  { key: "STEADY", label: "Steady" },
  { key: "STRICT", label: "Strict" },
];

export default async function GoalsPage() {
  const d = await getGoalsData();
  const units = d.settings.units;
  const unit = unitLabel(units);

  const goalDisplay = Math.round(toDisplay(d.settings.goalWeightLb, units));
  const toGoal =
    d.latestWeightLb != null
      ? Math.abs(
          toDisplay(d.latestWeightLb, units) -
            toDisplay(d.settings.goalWeightLb, units),
        ).toFixed(1)
      : null;

  return (
    <div className="flex flex-col gap-4 px-6 pt-4 pb-7">
      <h1 className="text-ink font-serif text-[30px]">Goals &amp; Settings</h1>

      <Stepper
        label="Goal weight"
        value={goalDisplay.toString()}
        suffix={unit}
        footer={
          toGoal != null
            ? `${toGoal} ${unit} to go · your target, your pace`
            : "Your target, your pace"
        }
        footerClass="text-sage"
        down={adjustGoalWeight.bind(null, -1)}
        up={adjustGoalWeight.bind(null, 1)}
      />

      <Stepper
        label="Weekly movement target"
        value={d.settings.weeklyMoveTarget.toString()}
        suffix="/ week"
        down={adjustMoveTarget.bind(null, -1)}
        up={adjustMoveTarget.bind(null, 1)}
      />

      <Stepper
        label="Daily calorie target"
        value={d.settings.calorieTarget.toString()}
        suffix="kcal"
        footer="Your number — adjust it anytime."
        down={adjustCalorieTarget.bind(null, -50)}
        up={adjustCalorieTarget.bind(null, 50)}
      />

      {/* Units */}
      <div className="bg-surface border-hairline-card rounded-card-lg flex items-center justify-between border p-[18px_20px]">
        <div className="text-ink text-[15px] font-semibold">Units</div>
        <div className="bg-surface-alt flex gap-1 rounded-[12px] p-1">
          {(["LB", "KG"] as const).map((u) => {
            const active = units === u;
            return (
              <form key={u} action={setUnits.bind(null, u)}>
                <button
                  type="submit"
                  className={`rounded-[9px] px-[18px] py-2 text-[13px] font-semibold ${
                    active ? "bg-surface text-ink" : "text-ink-muted"
                  }`}
                >
                  {u.toLowerCase()}
                </button>
              </form>
            );
          })}
        </div>
      </div>

      {/* Coach tone */}
      <div className="bg-surface border-hairline-card rounded-card-lg border p-[18px_20px]">
        <div className="text-ink mb-1 text-[15px] font-semibold">Coach tone</div>
        <div className="text-ink-muted mb-3.5 text-[13px]">
          How direct should your daily check-in be?
        </div>
        <div className="flex gap-2">
          {TONES.map((t) => {
            const active = d.settings.coachTone === t.key;
            return (
              <form
                key={t.key}
                action={setCoachTone.bind(null, t.key)}
                className="flex-1"
              >
                <button
                  type="submit"
                  className={`w-full rounded-[12px] border py-[11px] text-center text-[13px] font-semibold ${
                    active
                      ? "bg-surface border-clay text-ink"
                      : "border-hairline text-ink-muted"
                  }`}
                >
                  {t.label}
                </button>
              </form>
            );
          })}
        </div>
      </div>

      <ExportCard />

      <div className="text-ink-faint px-2.5 py-1 text-center text-xs leading-[1.5]">
        This app sets no calorie targets and prescribes no deficits. The numbers
        are yours.
      </div>
    </div>
  );
}
