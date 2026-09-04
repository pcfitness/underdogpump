import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { pumpUrl, SITE } from "@/lib/site";

function Chip({ children }: { children: ReactNode }) {
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

export function Hero() {
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
        <div className="relative mx-auto max-w-5xl px-4 py-8 md:flex md:min-h-[46rem] md:flex-col md:justify-end md:pt-28 md:pb-12">
          <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
            An OzGaming.net project · Pump.fun
          </p>
          <h1 className="mt-3 font-display text-6xl leading-[0.85] tracking-wide text-fg sm:text-8xl">
            {SITE.ticker}
            <span className="block text-4xl text-accent sm:text-6xl">{SITE.tagline}</span>
          </h1>
          <p className="mt-5 max-w-md font-display text-3xl leading-none tracking-wide text-fg sm:text-4xl">
            Favorites are expected to win. Underdogs pay more.
          </p>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
            A 12× underdog pays $12 on a $1 bet because it is
            <br />
            only expected to win about 1 time in 12.
          </p>
          <ul className="mt-6 grid w-full max-w-md grid-cols-3 gap-2">
            <Stat n="12×" label="Payout if it hits" />
            <Stat n="1/12" label="How often it should win" />
            <Stat n="$12" label="Earned on a $1 bet" />
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">
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
              href={pumpUrl()}
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
