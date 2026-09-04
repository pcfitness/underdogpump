import type { ReactNode } from "react";
import { SITE } from "@/lib/site";

function Step({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <li className="rounded-lg border border-line bg-surface/80 px-4 py-4 shadow-[inset_3px_0_0_var(--color-accent)]">
      <p className="font-mono text-xs text-accent">{n}</p>
      <p className="mt-1 font-display text-2xl tracking-wide text-fg">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">{children}</p>
    </li>
  );
}

function TickerMark() {
  return (
    <span className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
      {SITE.ticker}
    </span>
  );
}

export function HowToBuy() {
  return (
    <section id="how-to-buy" className="mx-auto max-w-5xl scroll-mt-28 px-4 py-8">
      <div className="rounded-xl border border-line bg-surface px-5 py-6 sm:px-8 sm:py-8">
        <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
          The second we go live
        </p>
        <h2 className="mt-2 font-display text-4xl tracking-wide text-fg">How to buy $UNDERDOG</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Get the official contract from this site only. Open Pump.fun and use the CA to find{" "}
          <TickerMark />. Review the page and chart, choose your amount, and complete your purchase.
          Then give the project time to grow and check back anytime to follow the progress.
        </p>
        <ol className="mt-6 grid gap-5 sm:grid-cols-3">
          <Step n="01" title="Get the contract">
            The official contract address (CA) is at the top of this page and in the footer. Click it
            to copy. Copy it only from underdogpump.xyz. If it came from anywhere else, do not use it.
          </Step>
          <Step n="02" title="Open Pump.fun">
            Open Pump.fun and paste in the official CA. Confirm you are on the correct <TickerMark />{" "}
            page, review the chart, choose your amount, and complete your purchase.
          </Step>
          <Step n="03" title="Long term mindset">
            Give the project time to grow and evolve. <TickerMark /> is built to stay active,
            maintained, and visible long after launch. Check back anytime to follow the progress.
          </Step>
        </ol>
      </div>
    </section>
  );
}
