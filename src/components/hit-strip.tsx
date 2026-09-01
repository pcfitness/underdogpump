type HitStripProps = {
  payout: number;
};

export function HitStrip({ payout }: HitStripProps) {
  const total = Math.max(2, Math.round(payout));
  const shown = Math.min(total, 32);
  const misses = total - 1;

  return (
    <div className="mt-8">
      <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-subtle">
        1 red hit · {misses} {misses === 1 ? "miss" : "misses"}
      </p>
      <div
        className="mt-3 grid h-2 w-full gap-px sm:h-2.5"
        style={{ gridTemplateColumns: `repeat(${shown}, minmax(0, 1fr))` }}
        aria-hidden="true"
      >
        {Array.from({ length: shown }, (_, i) => (
          <span
            key={i}
            className={
              i === 0
                ? "hit-pip rounded-sm bg-accent"
                : "rounded-sm bg-line"
            }
          />
        ))}
      </div>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
        {shown} pips. One red. That is a {total}x. It hits about{" "}
        <span className="text-fg">1 time in {total}</span>
        {total > shown ? ` — strip shows the first ${shown}.` : "."} That is why it pays.
      </p>
    </div>
  );
}
