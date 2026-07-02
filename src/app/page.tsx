import Link from "next/link";
import { getTodayData } from "@/lib/data";
import { formatWeight, unitLabel } from "@/lib/units";
import { dayName, dateLabel, timeLabel } from "@/lib/dates";
import {
  CheckIcon,
  ScaleIcon,
  MovePlusIcon,
  ForkKnifeIcon,
  ChevronIcon,
} from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const d = await getTodayData();
  const units = d.settings.units;
  const unit = unitLabel(units);

  const target = d.settings.calorieTarget;
  const left = target - d.consumed;
  const over = left < 0;
  const leftAbs = Math.abs(left);
  const pct = Math.min(100, Math.round((d.consumed / target) * 100));

  return (
    <div className="flex flex-col gap-[14px] px-6 pt-4 pb-7">
      {/* Header + streak */}
      <div className="flex items-end justify-between">
        <div>
          <div className="text-ink font-serif text-[32px] leading-none">
            {dayName()}
          </div>
          <div className="text-ink-muted mt-1 text-sm font-medium">
            {dateLabel()} · close out your day
          </div>
        </div>
        <div className="bg-ink text-paper rounded-[18px] px-[15px] py-[10px] text-center">
          <div className="font-serif text-[26px] leading-none">{d.streak}</div>
          <div className="mt-0.5 text-[10px] tracking-[0.08em] uppercase opacity-70">
            day streak
          </div>
        </div>
      </div>

      {/* Weigh card */}
      {d.weightLoggedToday ? (
        <Link
          href="/log?tab=weight"
          className="bg-surface border-hairline-card flex items-center gap-[14px] rounded-card border p-[16px_18px]"
        >
          <span className="bg-sage text-paper inline-flex h-[38px] w-[38px] items-center justify-center rounded-full">
            <CheckIcon />
          </span>
          <div className="flex-1">
            <div className="text-ink text-[15px] font-semibold">Weighed in</div>
            <div className="text-ink-muted text-[13px]">
              {d.weightLb != null ? formatWeight(d.weightLb, units) : "—"} {unit}
              {d.weightAt ? ` · ${timeLabel(d.weightAt)}` : ""}
            </div>
          </div>
          <span className="text-sage font-serif text-[14px] font-medium">
            done
          </span>
        </Link>
      ) : (
        <Link
          href="/log?tab=weight"
          className="bg-surface flex items-center gap-[14px] rounded-card border border-dashed border-[#D8CDB8] p-[16px_18px]"
        >
          <span className="bg-surface-alt text-ink-muted inline-flex h-[38px] w-[38px] items-center justify-center rounded-full">
            <ScaleIcon />
          </span>
          <div className="flex-1">
            <div className="text-ink text-[15px] font-semibold">
              Weigh in — not yet
            </div>
            <div className="text-ink-muted text-[13px]">
              Tap to log today&apos;s weight
            </div>
          </div>
          <span className="text-chevron">
            <ChevronIcon />
          </span>
        </Link>
      )}

      {/* Move card */}
      {d.movementLoggedToday ? (
        <Link
          href="/log?tab=movement"
          className="bg-surface border-hairline-card flex items-center gap-[14px] rounded-card border p-[16px_18px]"
        >
          <span className="bg-sage text-paper inline-flex h-[38px] w-[38px] items-center justify-center rounded-full">
            <CheckIcon />
          </span>
          <div className="flex-1">
            <div className="text-ink text-[15px] font-semibold">Moved today</div>
            <div className="text-ink-muted text-[13px]">{d.moveSummary}</div>
          </div>
          <span className="text-sage font-serif text-[14px] font-medium">
            done
          </span>
        </Link>
      ) : (
        <Link
          href="/log?tab=movement"
          className="bg-clay text-paper shadow-move flex items-center gap-[14px] rounded-card p-[18px]"
        >
          <span className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[rgba(244,238,228,0.22)]">
            <MovePlusIcon />
          </span>
          <div className="flex-1">
            <div className="text-[15px] font-bold">Move — not yet</div>
            <div className="text-[13px] opacity-85">Tap to log a session</div>
          </div>
          <ChevronIcon />
        </Link>
      )}

      {/* Eat card */}
      <Link
        href="/log?tab=meals"
        className="bg-surface border-hairline-card flex items-center gap-[14px] rounded-card border p-[16px_18px]"
      >
        <span className="bg-surface-alt text-ink-muted inline-flex h-[38px] w-[38px] items-center justify-center rounded-full">
          <ForkKnifeIcon />
        </span>
        <div className="flex-1">
          <div className="text-ink text-[15px] font-semibold">Meals logged</div>
          <div className="text-ink-muted text-[13px]">
            {d.mealsCount} today · {d.consumed} kcal
          </div>
        </div>
        <span className="text-chevron text-2xl font-light">+</span>
      </Link>

      {/* Calories today */}
      <div className="bg-surface border-hairline-card rounded-card border p-[18px_20px]">
        <div className="mb-2.5 flex items-baseline justify-between">
          <span className="text-ink-muted text-xs font-semibold tracking-[0.04em] uppercase">
            Calories today
          </span>
          <span className="text-ink-muted text-[13px]">
            {d.consumed} of {target} kcal
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span
            className={`font-serif text-[36px] leading-none ${over ? "text-clay" : "text-ink"}`}
          >
            {leftAbs}
          </span>
          <span className="text-ink-muted text-sm">
            kcal {over ? "over" : "left"}
          </span>
        </div>
        <div className="bg-surface-alt mt-3 h-2 overflow-hidden rounded-full">
          <div
            className={`h-full rounded-full ${over ? "bg-clay" : "bg-sage"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Coach check-in */}
      <div className="bg-surface-alt mt-1.5 rounded-card p-[18px_20px]">
        <div className="mb-2 flex items-center gap-2">
          <span className="bg-ink text-paper inline-flex h-6 w-6 items-center justify-center rounded-full font-serif text-[13px]">
            C
          </span>
          <span className="text-ink-muted text-xs font-semibold tracking-[0.03em] uppercase">
            Today&apos;s check-in
          </span>
        </div>
        <div className="text-ink font-serif text-[19px] leading-[1.42]">
          {d.coachMessage}
        </div>
      </div>
    </div>
  );
}
