import { getProgressData } from "@/lib/data";
import { formatWeight, toDisplay, unitLabel } from "@/lib/units";
import TrendChart from "@/components/TrendChart";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const d = await getProgressData();
  const units = d.settings.units;
  const unit = unitLabel(units);

  const latestDisplay =
    d.weekly.latestAvg != null ? d.weekly.latestAvg : d.settings.goalWeightLb;
  const deltaDisplay = toDisplay(d.weekly.deltaAbs, units).toFixed(1);
  const goalLabel = Math.round(
    toDisplay(d.settings.goalWeightLb, units),
  ).toString();

  // sessions-per-week bar heights (px), scaled to the busiest week
  const maxCount = Math.max(1, ...d.bars.map((b) => b.count));

  return (
    <div className="flex flex-col gap-4 px-6 pt-4 pb-7">
      <h1 className="text-ink font-serif text-[30px]">Progress</h1>

      {/* Weekly average weight */}
      <div className="bg-surface border-hairline-card rounded-card-lg border p-5">
        <div className="flex items-baseline justify-between">
          <div className="text-ink-muted text-[13px] font-semibold tracking-[0.04em] uppercase">
            Weekly average
          </div>
          <div className="text-sage text-[13px] font-bold">
            {d.weekly.down ? "↓" : "↑"} {deltaDisplay} {unit} ·{" "}
            {d.weekly.weeksCount} wks
          </div>
        </div>
        <div className="my-2 mb-3.5 flex items-baseline gap-1.5">
          <span className="text-ink font-serif text-[44px] leading-none">
            {formatWeight(latestDisplay, units)}
          </span>
          <span className="text-ink-muted text-[15px]">{unit}</span>
        </div>
        <TrendChart
          valuesLb={d.weekly.weeks.map((w) => w.avg)}
          goalLb={d.settings.goalWeightLb}
          goalLabel={goalLabel}
        />
        <div className="text-ink-faint mt-1.5 flex justify-between text-[11px]">
          <span>{d.weekly.weeksCount} weeks ago</span>
          <span className="text-clay font-semibold">goal {goalLabel}</span>
          <span>now</span>
        </div>
      </div>

      {/* Consistency */}
      <div className="bg-ink text-paper rounded-card-lg p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-[12px] font-semibold tracking-[0.05em] uppercase opacity-60">
              Movement streak
            </div>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <span className="font-serif text-[40px] leading-none">
                {d.streak}
              </span>
              <span className="text-sm opacity-70">days</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[12px] font-semibold opacity-60">This week</div>
            <div className="mt-0.5 font-serif text-2xl">
              {d.weekMoveCount} / {d.settings.weeklyMoveTarget}
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-1.5">
          {d.weekDots.map((dot, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <span
                className={
                  dot.isToday
                    ? dot.moved
                      ? "bg-clay h-[26px] w-[26px] rounded-full shadow-[0_0_0_3px_rgba(192,107,78,0.3)]"
                      : "h-[26px] w-[26px] rounded-full border-2 border-dashed border-[rgba(244,238,228,0.35)]"
                    : dot.moved
                      ? "bg-sage h-[26px] w-[26px] rounded-full"
                      : "h-[26px] w-[26px] rounded-full bg-[rgba(244,238,228,0.14)]"
                }
              />
              <span className="text-[11px] opacity-60">{dot.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sessions per week */}
      <div className="bg-surface border-hairline-card rounded-card-lg border p-5">
        <div className="text-ink-muted mb-4 text-[13px] font-semibold tracking-[0.04em] uppercase">
          Sessions per week
        </div>
        <div className="flex h-24 items-end justify-between gap-2.5">
          {d.bars.map((b, i) => {
            const h = Math.max(10, Math.round((b.count / maxCount) * 72));
            return (
              <div
                key={i}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div
                  className={`w-full rounded-[7px] ${b.isCurrent ? "bg-clay" : "bg-sand"}`}
                  style={{ height: `${h}px` }}
                />
                <span
                  className={`text-[11px] ${b.isCurrent ? "text-clay font-semibold" : "text-ink-faint"}`}
                >
                  {b.isCurrent ? "now" : `W${i + 1}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
