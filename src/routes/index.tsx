import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LongshotBoard } from "@/components/longshot-board";
import { UnderdogCard } from "@/components/underdog-card";
import { OddsTranslator } from "@/components/odds-translator";
import { PROJECT } from "@/lib/content";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="min-h-screen bg-bg/80 text-fg">
      <SiteHeader />
      <main>
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
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-accent">
                An OzGaming.net project · Pump.fun
              </p>
              <h1 className="mt-3 font-display text-6xl leading-[0.85] tracking-wide text-fg sm:text-8xl">
                {PROJECT.ticker}
                <span className="block text-4xl text-accent sm:text-6xl">{PROJECT.tagline}</span>
              </h1>
              <p className="mt-5 max-w-lg font-display text-3xl leading-none tracking-wide text-fg sm:text-4xl">
                Favorites are priced in. The dog still pays.
              </p>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
                Most of this board loses. That's why a dollar can come back twelve. If you
                can't say the price as a percent, you're hoping — not betting.
              </p>
              <ul className="mt-6 grid max-w-lg grid-cols-3 gap-2">
                <HeroStat n="12x" label="If it hits" />
                <HeroStat n="1 in 12" label="How often" />
                <HeroStat n="$1 → $12" label="The only math" />
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                <Chip>{PROJECT.status}</Chip>
                <Chip>{PROJECT.platform}</Chip>
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
                  href={PROJECT.platformUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center rounded-md border border-line bg-bg/60 px-5 py-2.5 text-sm font-semibold text-fg no-underline hover:border-accent"
                >
                  Launch on {PROJECT.platform}
                </a>
              </div>
            </div>
          </div>
        </section>

        <UnderdogCard />

        <OddsTranslator />

        <LongshotBoard />

        <section className="mx-auto max-w-5xl px-4 pb-16">
          <div className="rounded-xl border border-line bg-surface px-5 py-6 sm:px-8">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent">
              How to buy when we go live
            </p>
            <ol className="mt-4 grid gap-4 sm:grid-cols-3">
              <Step n="01" title="Wait for the contract">
                The official CA will land in the footer. Anything else is not {PROJECT.ticker}.
              </Step>
              <Step n="02" title="Open Pump.fun">
                Paste the contract. Read the chart. Size like a long shot — not like a sure thing.
              </Step>
              <Step n="03" title="Then do the 101">
                If you cannot explain the price as a percent, you are not betting. You are guessing.
              </Step>
            </ol>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Chip({ children }: { children: string }) {
  return (
    <span className="rounded-sm border border-line bg-bg/70 px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-fg">
      {children}
    </span>
  );
}

function HeroStat({ n, label }: { n: string; label: string }) {
  return (
    <li className="rounded-md border border-line bg-bg/55 px-3 py-3">
      <p className="font-display text-2xl leading-none tracking-wide text-accent sm:text-3xl">{n}</p>
      <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
    </li>
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
