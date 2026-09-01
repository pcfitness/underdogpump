import { useEffect, useState } from "react";
import { FALLBACK_CLASHPICKS, type Longshot } from "@/lib/content";
import { getClashPicks } from "@/lib/clashpicks";
import { formatAmerican } from "@/lib/odds";
import { splitQuestion } from "@/lib/moment";

export function ClashTicker() {
  const [rows, setRows] = useState<Longshot[]>(FALLBACK_CLASHPICKS);

  useEffect(() => {
    let cancelled = false;
    const pull = () => {
      getClashPicks()
        .then((data) => {
          if (cancelled) return;
          if (data.length) setRows(data);
        })
        .catch(() => {
          /* keep whatever is on screen */
        });
    };
    pull();
    const timer = window.setInterval(pull, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  const loop = rows.length ? [...rows, ...rows, ...rows] : [];

  return (
    <div className="flex items-stretch border-b border-line bg-bg text-fg">
      <p className="z-10 flex shrink-0 items-center border-r border-line bg-bg px-3 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-accent">
        Live · ClashPicks
      </p>
      <div className="ticker-mask min-w-0 flex-1 overflow-hidden">
        <ul className="ticker-track flex w-max items-center gap-0 py-2">
          {loop.map((row, i) => {
            const parts = splitQuestion(row.question);
            const american =
              row.impliedValue && row.impliedValue > 0 && row.impliedValue < 1
                ? formatAmerican(
                    1 / row.impliedValue >= 2
                      ? 100 * (1 / row.impliedValue - 1)
                      : -100 / (1 / row.impliedValue - 1),
                  )
                : "";
            const inner = (
              <>
                <span className="max-w-[14rem] truncate font-medium normal-case tracking-normal text-fg">
                  {parts.pick !== "Long shot" ? parts.pick : parts.event}
                </span>
                <span className="font-display text-sm tracking-wide text-accent">{row.implied}</span>
                {american ? <span className="text-muted">{american}</span> : null}
              </>
            );
            const className =
              "inline-flex shrink-0 items-center gap-2 border-r border-line px-5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-fg no-underline hover:text-accent";
            return row.href ? (
              <li key={`${row.id}-${i}`}>
                <a href={row.href} target="_blank" rel="noreferrer" className={className}>
                  {inner}
                </a>
              </li>
            ) : (
              <li key={`${row.id}-${i}`} className={className}>
                {inner}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
