import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUp } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { loadClashPicks } from "@/lib/load-markets";
import { CLASHPICKS_EXAMPLES, splitQuestion, type Market } from "@/lib/markets";
import { americanFromImplied } from "@/lib/odds";
import { SITE } from "@/lib/site";
import { VisitorClock } from "@/components/visitor-clock";

function Fog() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 isolate overflow-hidden"
      aria-hidden="true"
    >
      <div className="fog-wash absolute inset-0 max-md:opacity-40" />
      <div className="fog-shift absolute inset-y-[-8%] -right-[8%] hidden w-[min(34vw,26rem)] md:block">
        <img src="/red-fog.jpg" alt="" className="size-full object-cover object-right opacity-30" />
      </div>
    </div>
  );
}

function Ticker() {
  const [items, setItems] = useState<Market[]>(CLASHPICKS_EXAMPLES);

  useEffect(() => {
    let cancelled = false;
    const pull = () => {
      loadClashPicks()
        .then((next) => {
          if (!cancelled && Array.isArray(next) && next.length) setItems(next);
        })
        .catch(() => {});
    };
    pull();
    const timer = window.setInterval(pull, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  const loop = items.length ? [...items, ...items, ...items] : [];
  const itemClass =
    "inline-flex h-12 shrink-0 items-center gap-2.5 border-r border-line px-5 font-mono text-[0.7rem] uppercase leading-none tracking-wide text-fg no-underline hover:text-accent";

  return (
    <div className="flex items-center border-b border-line bg-bg text-fg">
      <p className="flex h-12 shrink-0 items-center border-r border-line px-3 font-mono text-[0.65rem] font-semibold uppercase leading-none tracking-widest text-accent">
        Live · ClashPicks
      </p>
      <div className="ticker-mask min-w-0 flex-1 overflow-hidden">
        <ul className="ticker-track flex h-12 w-max items-center">
          {loop.map((item, index) => {
            const parts = splitQuestion(item.question);
            const american = americanFromImplied(item.impliedValue);
            const inner = (
              <>
                <span className="max-w-56 truncate font-medium leading-none tracking-normal text-fg normal-case">
                  {parts.pick === "Long shot" ? parts.event : parts.pick}
                </span>
                <span className="font-display text-base leading-none tracking-wide text-accent">
                  {item.implied}
                </span>
                {american ? <span className="leading-none text-muted">{american}</span> : null}
              </>
            );
            return (
              <li key={`${item.id}-${index}`} className="flex h-12 items-center">
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noreferrer" className={itemClass}>
                    {inner}
                  </a>
                ) : (
                  <span className={itemClass}>{inner}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function SiteHeader() {
  return (
    <div className="sticky top-0 z-40">
      <header className="overflow-x-clip border-b border-line bg-bg/90 backdrop-blur-sm">
        <div className="mx-auto flex h-18 max-w-5xl items-center justify-between gap-2 px-3 sm:gap-3 sm:px-4">
          <Link to="/" className="flex min-w-0 items-center gap-2 no-underline sm:gap-2.5">
            <img
              src="/token-avatar.jpg"
              alt="$UNDERDOG"
              className="size-10 shrink-0 rounded-full border border-accent bg-bg object-contain p-px sm:size-14"
            />
            <span className="font-display text-xl tracking-wide text-accent sm:text-2xl">{SITE.ticker}</span>
            <span className="hidden text-xs font-medium tracking-widest text-muted uppercase sm:inline">
              {SITE.tagline}
            </span>
          </Link>
          <nav aria-label="Site" className="flex shrink-0 items-center">
            <Link to="/" className="nav-link" activeOptions={{ exact: true }}>
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
      <Ticker />
    </div>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="to-top fixed right-4 bottom-5 z-50 inline-flex size-12 items-center justify-center rounded-full border border-accent bg-accent text-accent-fg hover:bg-accent-dim sm:right-6 sm:bottom-6"
    >
      <span className="to-top-ring" aria-hidden="true" />
      <span className="to-top-ring to-top-ring-2" aria-hidden="true" />
      <ArrowUp className="relative size-5" />
    </button>
  );
}

function MetaCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-bg px-4 py-3">
      <p className="text-[0.65rem] font-semibold tracking-widest text-accent uppercase">{label}</p>
      <p className="mt-1 truncate font-mono text-sm text-fg">{children}</p>
    </div>
  );
}

function SiteFooter() {
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
          <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">Doxxed</p>
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
        <aside className="border-t border-l-0 border-line pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-6">
          <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
            {SITE.mindsetTitle}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {SITE.mindset.split("$UNDERDOG").map((chunk, index) =>
              index === 0 ? (
                chunk
              ) : (
                <span key="ticker">
                  <span className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
                    {SITE.ticker}
                  </span>
                  {chunk}
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
        {SITE.ticker} is for education and entertainment only. Nothing on this site is betting or financial advice, a recommendation, or a promise of profit. You can lose money. 18+ only. Live odds, when shown, are from public sources. $UNDERDOG is not affiliated with Polymarket, Kalshi, DraftKings, FanDuel, or ClashPicks. Do your own research.
      </p>
    </footer>
  );
}

export function SiteChrome({ children }: { children: ReactNode }) {
  const hash = useRouterState({ select: (s) => s.location.hash });

  useEffect(() => {
    if (hash !== "how-to-buy") return;
    const jump = () => document.getElementById("how-to-buy")?.scrollIntoView({ behavior: "smooth" });
    const timer = window.setTimeout(jump, 50);
    return () => window.clearTimeout(timer);
  }, [hash]);

  return (
    <>
      <Fog />
      <div className="relative z-10">
        <div className="min-h-screen bg-bg/80 text-fg">
          <SiteHeader />
          {children}
          <SiteFooter />
          <VisitorClock />
          <BackToTop />
        </div>
      </div>
    </>
  );
}
