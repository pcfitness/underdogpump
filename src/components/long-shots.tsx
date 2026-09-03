import { ArrowUpRight } from "lucide-react";
import type { LivePick } from "@/lib/markets";

export function LongShotsBoard({
  kicker,
  title,
  liveLabel,
  pausedLabel,
  footnote,
  picks,
  live,
}: {
  kicker: string;
  title: string;
  liveLabel: string;
  pausedLabel: string;
  footnote: string;
  picks: LivePick[];
  live: boolean;
}) {
  const rows = picks.slice(0, 6);
  return (
    <section className="border-b border-line bg-surface">
      <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">{kicker}</p>
          <h2 className="font-display text-4xl tracking-wide text-fg">{title}</h2>
        </div>
        <p className="font-mono text-xs tracking-widest text-muted uppercase">
          {live ? liveLabel : pausedLabel}
        </p>
      </div>
      <ul className="mt-6 divide-y divide-line overflow-hidden rounded-xl border border-line bg-elevated">
        {rows.length === 0 ? (
          <li className="px-4 py-4 text-sm text-muted">Live feed is quiet right now. Check back in a minute.</li>
        ) : (
          rows.map((p) => {
            const row = (
              <>
                <div className="min-w-0">
                  <p className="text-sm leading-snug font-medium text-fg">{p.question}</p>
                  <p className="mt-1 text-[0.7rem] tracking-wide text-subtle uppercase">
                    {p.source}
                    {p.href ? " · open market" : ""}
                  </p>
                </div>
                <p className="flex shrink-0 items-center gap-2 font-display text-3xl leading-none text-accent">
                  {p.implied}
                  {p.href ? <ArrowUpRight className="size-4 text-muted" /> : null}
                </p>
              </>
            );
            return (
              <li key={p.id}>
                {p.href ? (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-4 px-4 py-4 no-underline hover:bg-elevated"
                  >
                    {row}
                  </a>
                ) : (
                  <div className="flex items-center justify-between gap-4 px-4 py-4">{row}</div>
                )}
              </li>
            );
          })
        )}
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-subtle">{footnote}</p>
      </div>
    </section>
  );
}
