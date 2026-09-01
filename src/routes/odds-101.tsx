import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/chrome";
import { OddsBoard } from "@/components/odds-board";
import { OddsTranslator } from "@/components/translator";
import { LESSONS } from "@/lib/site";

export const Route = createFileRoute("/odds-101")({ component: Odds101 });

function Odds101() {
  return (
    <div className="min-h-screen bg-bg/80 text-fg">
      <SiteHeader />
      <main>
        <section className="border-b border-line">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
            <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-accent">
              Classroom
            </p>
            <h1 className="font-display text-6xl leading-none tracking-wide text-fg sm:text-7xl">
              Odds 101
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
              How a long shot is priced — on Polymarket, Kalshi, DraftKings, FanDuel, crypto, and
              futures. Tap the red markers.
            </p>
          </div>
        </section>
        <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
          <OddsBoard />
        </div>
        <OddsTranslator />
        <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
          <div className="mt-2">
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
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
