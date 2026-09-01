import type { ReactNode } from "react";
import { PROJECT } from "@/lib/content";

export function SiteFooter() {
  const ca = PROJECT.contract.trim();

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent">
            An OzGaming.net project
          </p>
          <h2 className="mt-2 font-display text-4xl leading-none tracking-wide text-fg">
            Built by <span className="text-accent">OzGaming</span>
            <span className="text-fg">.net</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">{PROJECT.mission}</p>
        </div>
        <aside className="border-l-0 border-t border-line pt-6 md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent">
            Project mindset
          </p>
          <p className="mt-3 text-sm leading-relaxed text-fg">{PROJECT.mindset}</p>
        </aside>
      </div>

      <div className="mx-auto grid max-w-5xl gap-3 px-4 pb-8 sm:grid-cols-3">
        <MetaBlock label="Launch platform">
          <a
            href={PROJECT.platformUrl}
            target="_blank"
            rel="noreferrer"
            className="text-fg no-underline hover:text-accent"
          >
            {PROJECT.platform}
          </a>
        </MetaBlock>
        <MetaBlock label="Project status">{PROJECT.status}</MetaBlock>
        <MetaBlock label="Contract">{ca ? ca : "To be announced"}</MetaBlock>
      </div>

      <p className="mx-auto max-w-5xl px-4 pb-10 text-xs leading-relaxed text-subtle">
        {PROJECT.ticker} is an educational and entertainment project. Nothing on this site is
        financial advice or a promise of value or return. DYOR. 18+ only. Built for speculators,
        traders, believers. Live market data, when shown, is public information. Not affiliated
        with Polymarket, Kalshi, DraftKings, FanDuel, or ClashPicks.
      </p>
    </footer>
  );
}

function MetaBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-bg px-4 py-3">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent">{label}</p>
      <p className="mt-1 truncate font-mono text-sm text-fg">{children}</p>
    </div>
  );
}
