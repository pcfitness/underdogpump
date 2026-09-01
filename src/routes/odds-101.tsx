import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/chrome";
import { OddsBoard } from "@/components/odds-board";
import { OddsTranslator } from "@/components/translator";
import { LESSONS, UNDERDOG_MEANS } from "@/lib/site";

export const Route = createFileRoute("/odds-101")({ component: Odds101 });

function Odds101() {
  return (
    <div className="min-h-screen bg-bg/80 text-fg">
      <SiteHeader />
      <main>
        <div className="mx-auto max-w-5xl px-4 pt-6 pb-8 sm:pt-8 sm:pb-10">
          <OddsBoard />
        </div>
        <WhatUnderdogMeans />
        <OddsTranslator />
        <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
          <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-accent">
            The six moves
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LESSONS.map((lesson) => (
              <article
                key={lesson.id}
                className="rounded-lg border border-line bg-surface/80 px-4 py-4 shadow-[inset_3px_0_0_var(--color-accent)]"
              >
                <p className="font-display text-2xl tracking-wide text-fg">
                  <span className="text-accent">{lesson.n}</span> {lesson.label}
                </p>
                <p className="text-base font-medium text-fg">{lesson.title}</p>
                <p className="mt-1 text-base leading-relaxed text-muted">{lesson.body}</p>
              </article>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function WhatUnderdogMeans() {
  return (
    <section className="border-y border-line">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
        <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-accent">
          Classroom
        </p>
        <h2 className="font-display text-5xl tracking-wide text-fg sm:text-6xl">
          What an underdog is
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
          You put up the same dollar. If the favorite hits, you take a little extra. If the dog
          hits, you take a lot extra. That bigger bag is the whole word. You get paid more because
          most nights the dog loses.
        </p>
        <ul className="mt-6 grid w-full max-w-lg grid-cols-3 gap-2">
          <Stat n="$1" label="Out of pocket" />
          <Stat n="$12" label="If the 12-to-1 hits" />
          <Stat n="1/12" label="How often it should" />
        </ul>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {UNDERDOG_MEANS.map((item) => (
            <article
              key={item.n}
              className="rounded-lg border border-line bg-surface/80 px-4 py-4 shadow-[inset_3px_0_0_var(--color-accent)]"
            >
              <p className="font-mono text-xs text-accent">{item.n}</p>
              <p className="mt-1 font-display text-2xl tracking-wide text-fg">{item.label}</p>
              <p className="text-base font-medium text-fg">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
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