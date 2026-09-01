import { useEffect, useState, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Longshot } from "@/lib/content";

type LoadState = "loading" | "live" | "examples";

type Props = {
  kicker: string;
  title: string;
  liveLabel: string;
  pausedLabel: string;
  footnote: ReactNode;
  fallback: Longshot[];
  load: () => Promise<Longshot[]>;
};

export function MarketBoard({ kicker, title, liveLabel, pausedLabel, footnote, fallback, load }: Props) {
  const [rows, setRows] = useState<Longshot[]>([]);
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    let cancelled = false;
    const pull = () => {
      load()
        .then((data) => {
          if (cancelled) return;
          if (data.length >= 3) {
            setRows(data);
            setState("live");
          } else {
            setRows((prev) => (prev.length ? prev : fallback));
            setState((s) => (s === "loading" ? "examples" : s));
          }
        })
        .catch(() => {
          if (cancelled) return;
          setRows((prev) => (prev.length ? prev : fallback));
          setState((s) => (s === "loading" ? "examples" : s));
        });
    };
    pull();
    const timer = window.setInterval(pull, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [fallback, load]);

  const shown = state === "loading" ? [] : rows;

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent">{kicker}</p>
          <h2 className="font-display text-4xl tracking-wide text-fg">{title}</h2>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
          {state === "loading" && "Pulling markets…"}
          {state === "live" && liveLabel}
          {state === "examples" && pausedLabel}
        </p>
      </div>

      <ul className="mt-6 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
        {state === "loading" &&
          [0, 1, 2, 3].map((i) => (
            <li key={i} className="flex items-center justify-between gap-4 px-4 py-4">
              <span className="h-4 w-2/3 rounded-sm bg-elevated" />
              <span className="h-7 w-14 rounded-sm bg-elevated" />
            </li>
          ))}
        {shown.map((row) => {
          const inner = (
            <>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug text-fg">{row.question}</p>
                <p className="mt-1 text-[0.7rem] uppercase tracking-[0.14em] text-subtle">
                  {row.source}
                  {row.href ? " · open market" : ""}
                </p>
              </div>
              <p className="flex shrink-0 items-center gap-2 font-display text-3xl leading-none text-accent">
                {row.implied}
                {row.href ? <ArrowUpRight className="size-4 text-muted" /> : null}
              </p>
            </>
          );
          return (
            <li key={row.id}>
              {row.href ? (
                <a
                  href={row.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-4 px-4 py-4 no-underline hover:bg-elevated"
                >
                  {inner}
                </a>
              ) : (
                <div className="flex items-center justify-between gap-4 px-4 py-4">{inner}</div>
              )}
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-xs leading-relaxed text-subtle">{footnote}</p>
    </section>
  );
}
