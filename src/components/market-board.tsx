import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { Market } from "@/lib/markets";

type Status = "live" | "examples";

export function MarketBoard({
  kicker,
  title,
  liveLabel,
  pausedLabel,
  footnote,
  fallback,
  initial,
  initialLive,
  load,
}: {
  kicker: string;
  title: string;
  liveLabel: string;
  pausedLabel: string;
  footnote: string;
  fallback: Market[];
  initial: Market[];
  initialLive: boolean;
  load: () => Promise<Market[]>;
}) {
  const [rows, setRows] = useState<Market[]>(initial.length ? initial : fallback);
  const [status, setStatus] = useState<Status>(initialLive ? "live" : "examples");

  useEffect(() => {
    let cancelled = false;
    const pull = () => {
      load()
        .then((next) => {
          if (cancelled) return;
          const incoming = Array.isArray(next) ? next : [];
          if (incoming.length >= 3) {
            setRows(incoming);
            setStatus("live");
          }
        })
        .catch(() => {});
    };
    pull();
    const timer = window.setInterval(pull, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [load]);

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">{kicker}</p>
          <h2 className="font-display text-4xl tracking-wide text-fg">{title}</h2>
        </div>
        <p className="font-mono text-xs tracking-widest text-muted uppercase">
          {status === "live" ? liveLabel : pausedLabel}
        </p>
      </div>
      <ul className="mt-6 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
        {rows.map((item) => {
          const body = (
            <>
              <div className="min-w-0">
                <p className="text-sm leading-snug font-medium text-fg">{item.question}</p>
                <p className="mt-1 text-[0.7rem] tracking-wide text-subtle uppercase">
                  {item.source}
                  {item.href ? " · open market" : ""}
                </p>
              </div>
              <p className="flex shrink-0 items-center gap-2 font-display text-3xl leading-none text-accent">
                {item.implied}
                {item.href ? <ArrowUpRight className="size-4 text-muted" /> : null}
              </p>
            </>
          );
          return (
            <li key={item.id}>
              {item.href ? (
                <a
                  href={item.href}
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
