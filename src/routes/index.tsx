import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { LongShotsBoard } from "@/components/long-shots";
import { PageShell } from "@/components/page-shell";
import { Ticket } from "@/components/ticket";
import { CLASSROOM_PICK } from "@/lib/markets";
import { loadMarkets } from "@/lib/load-markets";
import { pumpLink, SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): { dog?: string } =>
    typeof s.dog === "string" && s.dog ? { dog: s.dog } : {},
  loaderDeps: ({ search }) => ({ dog: search.dog }),
  loader: ({ deps }) => loadMarkets({ data: { dog: deps.dog } }),
  component: Home,
});

function Home() {
  const data = Route.useLoaderData();
  const ticker = data.kalshi.length ? data.kalshi : [CLASSROOM_PICK];
  const featured = data.featured;

  return (
    <PageShell picks={ticker}>
      <Hero />
      <Ticket pick={featured} />
      <LongShotsBoard
        kicker="Kalshi live"
        title="Long shots on Kalshi"
        liveLabel="Live · Kalshi"
        pausedLabel="Feed paused · open Kalshi"
        footnote="Public implied probabilities from Kalshi, not financial advice. Each row opens the contract."
        picks={data.kalshi}
        live={data.kalshiLive}
      />
      <LongShotsBoard
        kicker="Polymarket live"
        title="Long shots on Polymarket"
        liveLabel="Live · Polymarket"
        pausedLabel="Feed paused · open Polymarket"
        footnote="Public implied probabilities from Polymarket, not financial advice. Each row opens the market."
        picks={data.poly}
        live={data.polyLive}
      />
      <HowToBuy />
    </PageShell>
  );
}

function Chip({ children }: { children: string }) {
  return (
    <span className="rounded-sm border border-line bg-bg/70 px-2.5 py-1 font-mono text-[0.7rem] tracking-widest text-fg uppercase">
      {children}
    </span>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <li className="min-w-0 rounded-md border border-line bg-bg/55 px-2 py-3">
      <p className="font-display text-xl leading-none tracking-wide text-accent sm:text-2xl">{n}</p>
      <p className="mt-1 text-[0.6rem] font-semibold tracking-wide text-muted uppercase">{label}</p>
    </li>
  );
}

function HeroCopy() {
  return (
    <>
      <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
        An OzGaming.net project · Pump.fun
      </p>
      <h1 className="mt-3 font-display text-6xl leading-[0.85] tracking-wide text-fg sm:text-8xl">
        {SITE.ticker}
        <span className="block text-4xl text-accent sm:text-6xl">{SITE.tagline}</span>
      </h1>
      <p className="mt-5 font-display text-3xl leading-none tracking-wide text-fg sm:text-4xl">
        A Pump.fun coin that teaches you why long shots pay.
      </p>
      <p className="mt-4 text-base leading-relaxed text-muted">
        A 12× underdog pays $12 on a $1 bet because it is
        <br />
        only expected to win about 1 time in 12.
      </p>
      <ul className="mt-6 grid w-full grid-cols-3 gap-2">
        <Stat n="12×" label="Payout if it hits" />
        <Stat n="1/12" label="How often it should win" />
        <Stat n="$12" label="Total payout on a $1 bet" />
      </ul>
      <div className="mt-6 flex flex-wrap justify-start gap-2">
        <Chip>{SITE.platform}</Chip>
        <Chip>Contract TBA</Chip>
      </div>
      <div className="mt-8 flex flex-wrap justify-start gap-3">
        <Link
          to="/odds-101"
          className="inline-flex min-h-11 items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg no-underline hover:bg-accent-dim"
        >
          Open Odds 101
          <ArrowRight className="size-4" />
        </Link>
        <a
          href={pumpLink()}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center rounded-md border border-line bg-bg/60 px-5 py-2.5 text-sm font-semibold text-fg no-underline hover:border-accent hover:bg-accent/20"
        >
          BUY $UNDERDOG
        </a>
      </div>
    </>
  );
}

function Hero() {
  return (
    <section className="overflow-hidden border-b border-line">
      <div className="relative aspect-video overflow-hidden md:hidden">
        <img
          src="/hero-dog-v11.jpg"
          alt="Black Cane Corso in glasses, spiked collar"
          className="size-full object-cover object-center"
        />
      </div>
      <div className="px-4 py-8 md:hidden">
        <HeroCopy />
      </div>
      <div className="relative isolate hidden md:block md:aspect-video">
        <img
          src="/hero-dog-v11.jpg"
          alt=""
          className="absolute inset-0 size-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-bg/70 via-bg/20 to-transparent to-55%" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/35 via-transparent to-transparent" />
        <div className="relative mx-auto flex h-full max-w-5xl flex-col justify-center px-4 py-12">
          <div className="w-full max-w-lg text-left md:ml-auto md:translate-x-[100px]">
            <HeroCopy />
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <li className="rounded-lg border border-line bg-surface/80 px-4 py-4 shadow-[inset_3px_0_0_var(--color-accent)]">
      <p className="font-mono text-xs text-accent">{n}</p>
      <p className="mt-1 font-display text-2xl tracking-wide text-fg">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">{children}</p>
    </li>
  );
}

function TickerWord() {
  return <span className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">{SITE.ticker}</span>;
}

function HowToBuy() {
  return (
    <section id="how-to-buy" className="mx-auto max-w-5xl scroll-mt-28 px-4 py-8">
      <div className="rounded-xl border border-line bg-surface px-5 py-6 sm:px-8 sm:py-8">
        <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
          The second we go live
        </p>
        <h2 className="mt-2 font-display text-4xl tracking-wide text-fg">How to buy $UNDERDOG</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Get the official contract from this site only. Open Pump.fun and use the CA to find <TickerWord />. Review
          the page and chart, choose your amount, and complete your purchase. Then give the project time to grow and
          check back anytime to follow the progress.
        </p>
        <ol className="mt-6 grid gap-5 sm:grid-cols-3">
          <Step n="01" title="Get the contract">
            The official contract address (CA) will appear at the top of this page and in the footer at launch. Click
            it to copy. Copy it only from underdogpump.xyz. If it came from anywhere else, do not use it.
          </Step>
          <Step n="02" title="Open Pump.fun">
            Open Pump.fun and paste in the official CA. Confirm you are on the correct <TickerWord /> page, review the
            chart, choose your amount, and complete your purchase.
          </Step>
          <Step n="03" title="Long term mindset">
            Give the project time to grow and evolve. <TickerWord /> is built to stay active, maintained, and visible
            long after launch. Check back anytime to follow the progress.
          </Step>
        </ol>
      </div>
    </section>
  );
}
