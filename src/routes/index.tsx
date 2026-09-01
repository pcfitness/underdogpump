import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/chrome";
import { LongshotBoards } from "@/components/longshots";
import { DogTicket } from "@/components/ticket";
import { OddsTranslator } from "@/components/translator";
import { SITE, buyUrl } from "@/lib/site";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="min-h-screen bg-bg/80 text-fg">
      <SiteHeader />
      <main>
        <Hero />
        <DogTicket />
        <OddsTranslator />
        <LongshotBoards />
        <HowToBuy />
      </main>
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="overflow-hidden border-b border-line">
      <div className="relative h-80 overflow-hidden md:hidden">
        <img
          src="/hero-mobile.jpg"
          alt="Black Cane Corso, crimson eyes, spiked collar"
          className="size-full object-cover object-[center_10%] brightness-75 contrast-110"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-bg to-transparent" />
      </div>
      <div className="relative isolate md:min-h-[46rem]">
        <img
          src="/hero-dog-v4.jpg"
          alt=""
          className="absolute inset-0 hidden size-full object-cover object-[82%_8%] md:block"
        />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-bg from-0% via-bg/70 to-transparent to-45% md:block" />
        <div className="relative mx-auto max-w-5xl px-4 py-8 md:flex md:min-h-[46rem] md:flex-col md:justify-end md:pb-12 md:pt-28">
          <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-accent">
            An OzGaming.net project · Pump.fun
          </p>
          <h1 className="mt-3 font-display text-6xl leading-[0.85] tracking-wide text-fg sm:text-8xl">
            {SITE.ticker}
            <span className="block text-4xl text-accent sm:text-6xl">{SITE.tagline}</span>
          </h1>
          <p className="mt-5 max-w-md font-display text-3xl leading-none tracking-wide text-fg sm:text-4xl">
            Favorites are priced in. The dog still pays.
          </p>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
            Long shots are where the money is. Worse odds, bigger bag if you win. A 12-to-1 dog
            pays because it usually loses.
          </p>
          <ul className="mt-6 grid w-full max-w-md grid-cols-3 gap-2">
            <Stat n="12×" label="If it hits" />
            <Stat n="1/12" label="How often" />
            <Stat n="$12" label="Back on $1" />
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">
            <Chip>{SITE.status}</Chip>
            <Chip>{SITE.platform}</Chip>
            <Chip>Contract TBA</Chip>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/odds-101"
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg no-underline hover:bg-accent-dim"
            >
              Open Odds 101
              <ArrowRight className="size-4" />
            </Link>
            <a
              href={buyUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center rounded-md border border-line bg-bg/60 px-5 py-2.5 text-sm font-semibold text-fg no-underline hover:border-accent hover:bg-accent/20"
            >
              BUY $UNDERDOG
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Chip({ children }: { children: string }) {
  return (
    <span className="rounded-sm border border-line bg-bg/70 px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-widest text-fg">
      {children}
    </span>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <li className="min-w-0 rounded-md border border-line bg-bg/55 px-2 py-3">
      <p className="font-display text-xl leading-none tracking-wide text-accent sm:text-2xl">{n}</p>
      <p className="mt-1 text-[0.6rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
    </li>
  );
}

function HowToBuy() {
  const contract = SITE.contract.trim();
  return (
    <section className="mx-auto max-w-5xl px-4 pb-8">
      <div className="rounded-xl border border-line bg-surface px-5 py-6 sm:px-8 sm:py-8">
        <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-accent">
          The second we go live
        </p>
        <h2 className="mt-2 font-display text-4xl tracking-wide text-fg">How to buy $UNDERDOG</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Get the official contract from this site only. Open Pump.fun and use the CA to find{" "}
          <span className="text-[0.7rem] font-semibold uppercase tracking-widest text-accent">
            {SITE.ticker}
          </span>
          . Review the page and chart, choose your amount, and complete your purchase. Then give
          the project time to grow and check back anytime to follow the progress.
        </p>
        <ol className="mt-6 grid gap-5 sm:grid-cols-3">
          <Step n="01" title="Get the contract">
            The official contract address (CA) will appear here and in the footer at launch. Copy
            it only from underdogpump.xyz. If it came from anywhere else, do not use it.
          </Step>
          <Step n="02" title="Open Pump.fun">
            Open Pump.fun and paste in the official CA. Confirm you are on the correct{" "}
            <span className="text-[0.7rem] font-semibold uppercase tracking-widest text-accent">
              {SITE.ticker}
            </span>{" "}
            page, review the chart, choose your amount, and complete your purchase.
          </Step>
          <Step n="03" title="Long term mindset">
            Give the project time to grow and evolve.{" "}
            <span className="text-[0.7rem] font-semibold uppercase tracking-widest text-accent">
              {SITE.ticker}
            </span>{" "}
            is built to stay active, maintained, and visible long after launch. Check back
            anytime to follow the progress.
          </Step>
        </ol>
        <div className="mt-6">
          {contract ? (
            <a
              href={buyUrl()}
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
              <span className="text-[0.7rem] font-semibold uppercase tracking-widest text-accent">
                Contract drops in this button
              </span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <li>
      <p className="font-mono text-xs text-accent">{n}</p>
      <p className="mt-1 font-display text-2xl tracking-wide text-fg">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">{children}</p>
    </li>
  );
}
