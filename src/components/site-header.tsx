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
  const seen = new Set<string>();
  const items = picks.filter((pick) => {
    const key = pick.id || pick.question;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const loop = items.length ? [...items, ...items, ...items] : [];

  return (
    <div className="sticky top-0 z-40">
      <header className="overflow-x-clip border-b border-line bg-bg/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-1 px-2 sm:h-18 sm:gap-3 sm:px-4">
          <Link
            to="/"
            search={{}}
            className="relative z-10 flex shrink-0 items-center gap-1.5 no-underline sm:gap-2.5"
          >
            <img
              src="/token-avatar.png?v=13"
              alt={SITE.ticker}
              className="size-8 min-h-8 min-w-8 shrink-0 rounded-full object-cover sm:size-14 sm:min-h-14 sm:min-w-14"
            />
            <span className="font-display text-base tracking-wide text-accent sm:text-2xl">
              {SITE.ticker}
            </span>
            <span className="hidden text-xs font-medium tracking-widest text-muted uppercase sm:inline">
              {SITE.tagline}
            </span>
          </Link>
          <nav aria-label="Site" className="flex min-w-0 items-center justify-end">
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
            <Link to="/optimizer" className="nav-link">
              AI Optimizer
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
      <div className="dog-tape flex items-stretch border-b border-accent/40 bg-bg text-fg">
        <p className="flex w-14 shrink-0 flex-col items-center justify-center gap-0 bg-accent px-1.5 text-accent-fg sm:w-16">
          <span className="font-display text-lg leading-none tracking-wide sm:text-xl">DOGS</span>
          <span className="-mt-0.5 text-[0.55rem] leading-none font-semibold tracking-widest uppercase">Kalshi</span>
        </p>
        <div className="ticker-mask min-w-0 flex-1 overflow-hidden">
          <ul className="ticker-track flex h-14 w-max items-center gap-2 px-3">
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
                  <span className="relative top-0.5 max-w-44 truncate font-display text-sm leading-none tracking-wide text-fg normal-case sm:max-w-64 sm:text-base">
                    {name}
                  </span>
                  <span className="inline-flex h-5 items-center rounded-sm bg-accent px-1.5 font-display text-sm leading-none tracking-wide text-accent-fg">
                    <span className="relative top-px -left-px">{american}</span>
                  </span>
                  <span className="relative top-0.5 text-[0.65rem] leading-none font-bold text-accent">{pick.implied}</span>
                </>
              );
              return (
                <li key={`${pick.id}-${i}`} className="flex items-center gap-2">
                  {pick.href ? (
                    <a
                      href={pick.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-9 shrink-0 items-center gap-2 px-2 no-underline hover:text-accent"
                    >
                      {inner}
                    </a>
                  ) : (
                    <span className="inline-flex h-9 shrink-0 items-center gap-2 px-2">
                      {inner}
                    </span>
                  )}
                  <span aria-hidden="true" className="text-accent">
                    ·
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
