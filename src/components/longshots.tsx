import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { MarketRow } from "@/lib/markets";
import { loadClashPicks, loadPolymarket } from "@/lib/markets.fn";
import { CLASH_FALLBACK, POLY_FALLBACK } from "@/lib/markets";

export function LongshotBoards() {
  const loadClash = useCallback(() => loadClashPicks(), []);
  const loadPoly = useCallback(() => loadPolymarket(), []);
  return (
    <div>
      <LongshotBoard
        kicker="ClashPicks live"
        title="Long shots on ClashPicks"
        liveLabel="Live · ClashPicks"
        pausedLabel="Feed paused · open ClashPicks"
        footnote="Public implied probabilities from ClashPicks, not financial advice. Each row opens the pick."
        fallback={CLASH_FALLBACK}
        load={loadClash}
      />
      <LongshotBoard
        kicker="Polymarket live"
        title="Long shots on Polymarket"
        liveLabel="Live · Polymarket"
        pausedLabel="Feed paused · open Polymarket"
        footnote="Public implied probabilities from Polymarket, not financial advice. Each row opens the market."
        fallback={POLY_FALLBACK}
        load={loadPoly}
      />
    </div>
  );
}

function LongshotBoard({
  kicker,
  title,
  liveLabel,
  pausedLabel,
  footnote,
  fallback,
  load,
}: {
  kicker: string;
  title: string;
  liveLabel: string;
  pausedLabel: string;
  footnote: string;
  fallback: MarketRow[];
  load: () => Promise<MarketRow[]>;
}) {
  const [rows, setRows] = useState<MarketRow[]>([]);
  const [status, setStatus] = useState<"loading" | "live" | "examples">("loading");

  useEffect(() => {
    let cancelled = false;
    const pull = () => {
      load()
        .then((next) => {
          if (cancelled) return;
          if (next.length >= 3) {
            setRows(next);
            setStatus("live");
          } else {
            setRows((prev) => (prev.length ? prev : fallback));
            setStatus((prev) => (prev === "loading" ? "examples" : prev));
          }
        })
        .catch(() => {
          if (cancelled) return;
          setRows((prev) => (prev.length ? prev : fallback));
          setStatus((prev) => (prev === "loading" ? "examples" : prev));
        });
    };
    pull();
    const id = window.setInterval(pull, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [fallback, load]);

  const shown = status === "loading" ? [] : rows;

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-accent">{kicker}</p>
          <h2 className="font-display text-4xl tracking-wide text-fg">{title}</h2>
        </div>
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          {status === "loading" && "Pulling markets…"}
          {status === "live" && liveLabel}
          {status === "examples" && pausedLabel}
        </p>
      </div>
      <ul className="mt-6 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
        {status === "loading" &&
          [0, 1, 2, 3].map((i) => (
            <li key={i} className="flex items-center justify-between gap-4 px-4 py-4">
              <span className="h-4 w-2/3 rounded-sm bg-elevated" />
              <span className="h-7 w-14 rounded-sm bg-elevated" />
            </li>
          ))}
        {shown.map((row) => {
          const body = (
            <>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug text-fg">{row.question}</p>
                <p className="mt-1 text-[0.7rem] uppercase tracking-wide text-subtle">
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
                  {body}
                </a>
              ) : (
                <div className="flex items-center justify-between gap-4 px-4 py-4">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-subtle">{footnote}</p>
    </section>
  );
}
