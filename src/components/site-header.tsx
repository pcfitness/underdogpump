import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/site";
import { formatAmerican, splitQuestion } from "@/lib/odds";
import { type LivePick } from "@/lib/markets";

export function SiteHeader({
  picks,
  liveLabel = "Live · Kalshi",
}: {
  picks: LivePick[];
  liveLabel?: string;
}) {
  const items = picks.length ? picks : [];
  const loop = items.length ? [...items, ...items, ...items] : [];

  return (
    <div className="sticky top-0 z-40">
      <header className="overflow-x-clip border-b border-line bg-bg/90 backdrop-blur-sm">
        <div className="mx-auto flex h-18 max-w-5xl items-center justify-between gap-2 px-3 sm:gap-3 sm:px-4">
          <Link
            to="/"
            search={{}}
            className="flex min-w-0 items-center gap-2 no-underline sm:gap-2.5"
          >
            <img
              src="/token-avatar.png?v=4"
              alt={SITE.ticker}
              className="size-10 shrink-0 rounded-full bg-bg object-cover sm:size-14"
            />
            <span className="font-display text-xl tracking-wide text-accent sm:text-2xl">
              {SITE.ticker}
            </span>
            <span className="hidden text-xs font-medium tracking-widest text-muted uppercase sm:inline">
              {SITE.tagline}
            </span>
          </Link>
          <nav aria-label="Site" className="flex shrink-0 items-center">
            <Link
              to="/"
              search={{}}
              className="nav-link"
              activeProps={{ className: "nav-link active" }}
            >
              <span className="nav-pip" aria-hidden="true" />
              Live
            </Link>
            <span className="nav-rule" aria-hidden="true">
              |
            </span>
            <Link to="/odds-101" className="nav-link">
              Odds 101
            </Link>
            <span className="nav-rule" aria-hidden="true">
              |
            </span>
            <a href="/#how-to-buy" className="nav-link">
              How to buy
            </a>
          </nav>
        </div>
      </header>
      <div className="flex items-center border-b border-line bg-bg text-fg">
        <p className="flex h-12 shrink-0 items-center border-r border-line px-3 font-mono text-[0.65rem] font-semibold uppercase leading-none tracking-widest text-accent">
          {liveLabel}
        </p>
        <div className="ticker-mask min-w-0 flex-1 overflow-hidden">
          <ul className="ticker-track flex h-12 w-max items-center">
            {loop.map((pick, i) => {
              const { pick: label, event } = splitQuestion(pick.question);
              const name = label === "Long shot" ? event : label;
              const american = formatAmerican(
                (() => {
                  const d = 1 / Math.min(0.99, Math.max(0.01, pick.impliedValue));
                  return d >= 2 ? 100 * (d - 1) : -100 / (d - 1);
                })(),
              );
              const inner = (
                <>
                  <span className="max-w-56 truncate font-medium leading-none tracking-normal text-fg normal-case">
                    {name}
                  </span>
                  <span className="font-display text-base leading-none tracking-wide text-accent">
                    {pick.implied}
                  </span>
                  <span className="leading-none text-muted">{american}</span>
                </>
              );
              return (
                <li key={`${pick.id}-${i}`} className="flex h-12 items-center">
                  {pick.href ? (
                    <a
                      href={pick.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-12 shrink-0 items-center gap-2.5 border-r border-line px-5 font-mono text-[0.7rem] uppercase leading-none tracking-wide text-fg no-underline hover:text-accent"
                    >
                      {inner}
                    </a>
                  ) : (
                    <span className="inline-flex h-12 shrink-0 items-center gap-2.5 border-r border-line px-5 font-mono text-[0.7rem] uppercase leading-none tracking-wide text-fg">
                      {inner}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
