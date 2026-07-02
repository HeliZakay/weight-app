/**
 * A labelled −/+ stepper card. `down`/`up` are (pre-bound) server actions, so
 * the whole control works without client JS.
 */
type Props = {
  label: string;
  value: string;
  suffix: string;
  footer?: string;
  footerClass?: string;
  down: () => Promise<void>;
  up: () => Promise<void>;
};

export default function Stepper({
  label,
  value,
  suffix,
  footer,
  footerClass = "text-ink-muted",
  down,
  up,
}: Props) {
  return (
    <div className="bg-surface border-hairline-card rounded-card-lg border p-5">
      <div className="text-ink-muted text-[13px] font-semibold tracking-[0.04em] uppercase">
        {label}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <form action={down}>
          <button
            type="submit"
            className="bg-surface-alt text-stepper flex h-11 w-11 items-center justify-center rounded-full text-[22px]"
            aria-label={`Decrease ${label}`}
          >
            −
          </button>
        </form>
        <div className="text-center">
          <span className="text-ink font-serif text-[44px]">{value}</span>
          <span className="text-ink-muted ml-1 text-base">{suffix}</span>
        </div>
        <form action={up}>
          <button
            type="submit"
            className="bg-surface-alt text-stepper flex h-11 w-11 items-center justify-center rounded-full text-[22px]"
            aria-label={`Increase ${label}`}
          >
            +
          </button>
        </form>
      </div>
      {footer && (
        <div className={`mt-2.5 text-center text-[13px] font-semibold ${footerClass}`}>
          {footer}
        </div>
      )}
    </div>
  );
}
