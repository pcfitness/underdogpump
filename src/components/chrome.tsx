import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { formatAmerican } from "@/lib/odds";
import { CLASH_FALLBACK, splitQuestion, type MarketRow } from "@/lib/markets";
import { loadClashPicks } from "@/lib/markets.fn";
import { SITE } from "@/lib/site";

export function SiteHeader() {
  return (
    <div className="sticky top-0 z-40">
      <header className="border-b border-line bg-bg/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <img
              src="/token-avatar.jpg"
              alt="$UNDERDOG"
              className="size-10 rounded-full border border-accent bg-bg object-contain p-px"
            />
            <span className="font-display text-2xl tracking-wide text-accent">{SITE.ticker}</span>
            <span className="hidden text-xs font-medium uppercase tracking-widest text-muted sm:inline">
              {SITE.tagline}
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm font-medium">
            <Link
              to="/"
              className="rounded-sm px-3 py-2 text-muted no-underline hover:text-fg"
              activeProps={{ className: "text-fg" }}
            >
              Live
            </Link>
            <Link
              to="/odds-101"
              className="rounded-sm px-3 py-2 text-muted no-underline hover:text-fg"
              activeProps={{ className: "text-fg" }}
            >
              Odds 101
            </Link>
          </nav>
        </div>
      </header>
      <Ticker />
    </div>
  );
}

function Ticker() {
  const [rows, setRows] = useState<MarketRow[]>(CLASH_FALLBACK);

  useEffect(() => {
    let cancelled = false;
    const pull = () => {
      loadClashPicks()
        .then((next) => {
          if (!cancelled && next.length) setRows(next);
        })
        .catch(() => {});
    };
    pull();
    const id = window.setInterval(pull, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const loop = rows.length ? [...rows, ...rows, ...rows] : [];

  return (
    <div className="flex items-center border-b border-line bg-bg text-fg">
      <p className="flex h-12 shrink-0 items-center border-r border-line px-3 font-mono text-[0.65rem] font-semibold uppercase leading-none tracking-widest text-accent">
        Live · ClashPicks
      </p>
      <div className="ticker-mask min-w-0 flex-1 overflow-hidden">
        <ul className="ticker-track flex h-12 w-max items-center">
          {loop.map((row, i) => {
            const parts = splitQuestion(row.question);
            const american =
              row.impliedValue > 0 && row.impliedValue < 1
                ? formatAmerican(
                    1 / row.impliedValue >= 2
                      ? 100 * (1 / row.impliedValue - 1)
                      : -100 / (1 / row.impliedValue - 1),
                  )
                : "";
            const inner = (
              <>
                <span className="max-w-56 truncate font-medium leading-none normal-case tracking-normal text-fg">
                  {parts.pick === "Long shot" ? parts.event : parts.pick}
                </span>
                <span className="font-display text-base leading-none tracking-wide text-accent">
                  {row.implied}
                </span>
                {american ? <span className="leading-none text-muted">{american}</span> : null}
              </>
            );
            const className =
              "inline-flex h-12 shrink-0 items-center gap-2.5 border-r border-line px-5 font-mono text-[0.7rem] uppercase leading-none tracking-wide text-fg no-underline hover:text-accent";
            return row.href ? (
              <li key={`${row.id}-${i}`} className="flex h-12 items-center">
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

export function SiteFooter() {
  const contract = SITE.contract.trim();
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 md:grid-cols-[1.2fr_1fr]">
        <div>
          <a
            href={SITE.builderUrl}
            target="_blank"
            rel="noreferrer"
            className="oz-chip mb-3 mr-4 size-24 overflow-hidden rounded-full border-2 border-accent no-underline sm:size-28"
          >
            <img
              src="/oz-doxxed.jpg"
              alt="Oz, founder of OzGaming.net"
              className="size-full object-cover object-[center_18%]"
            />
          </a>
          <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-accent">
            Doxxed
          </p>
          <h2 className="mt-1 font-display text-4xl leading-none tracking-wide text-fg [text-wrap:unset]">
            Built by{" "}
            <a
              href={SITE.builderUrl}
              target="_blank"
              rel="noreferrer"
              className="text-fg no-underline hover:text-accent"
            >
              <span className="text-accent">OzGaming</span>
              <span className="text-fg">.net</span>
            </a>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{SITE.mission}</p>
          <div className="clear-both" />
        </div>
        <aside className="border-l-0 border-t border-line pt-6 md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-accent">
            {SITE.mindsetTitle}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {SITE.mindset.split("$UNDERDOG").map((part, i) =>
              i === 0 ? (
                part
              ) : (
                <span key="ticker">
                  <span className="text-[0.7rem] font-semibold uppercase tracking-widest text-accent">{SITE.ticker}</span>
                  {part}
                </span>
              ),
            )}
          </p>
        </aside>
      </div>
      <div className="mx-auto grid max-w-5xl gap-3 px-4 pb-8 sm:grid-cols-3">
        <MetaCard label="Launch platform">
          <a
            href={SITE.platformUrl}
            target="_blank"
            rel="noreferrer"
            className="text-fg no-underline hover:text-accent"
          >
            {SITE.platform}
          </a>
        </MetaCard>
        <MetaCard label="Project status">{SITE.status}</MetaCard>
        <MetaCard label="Contract">{contract || "To be announced"}</MetaCard>
      </div>
      <p className="mx-auto max-w-5xl px-4 pb-10 text-xs leading-relaxed text-subtle">
        {SITE.ticker} is an educational and entertainment project. Nothing on this site is
        financial advice or a promise of value or return. DYOR. 18+ only. Built for speculators,
        traders, believers. Live market data, when shown, is public information. Not affiliated
        with Polymarket, Kalshi, DraftKings, FanDuel, or ClashPicks.
      </p>
    </footer>
  );
}

function MetaCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-bg px-4 py-3">
      <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-accent">{label}</p>
      <p className="mt-1 truncate font-mono text-sm text-fg">{children}</p>
    </div>
  );
}
