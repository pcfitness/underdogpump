import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { pumpUrl, SITE } from "@/lib/site";

function Step({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <li>
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
  const contract = SITE.contract.trim();
  return (
    <section className="mx-auto max-w-5xl px-4 py-8">
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
            The official contract address (CA) will appear here and in the footer at launch. Copy it
            only from underdogpump.xyz. If it came from anywhere else, do not use it.
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
        <div className="mt-6">
          {contract ? (
            <a
              href={pumpUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg no-underline hover:bg-accent-dim"
            >
              Buy $UNDERDOG on Pump.fun
              <ArrowRight className="size-4" />
            </a>
          ) : (
            <p className="inline-flex min-h-11 flex-col justify-center rounded-md border border-line bg-bg px-5 py-3 sm:flex-row sm:items-center sm:gap-3">
              <span className="text-sm font-semibold text-fg">Buy $UNDERDOG on Pump.fun</span>
              <span className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
                Contract drops in this button
              </span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
