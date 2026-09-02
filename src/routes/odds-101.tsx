import { createFileRoute } from "@tanstack/react-router";
import { Classroom } from "@/components/classroom";
import { OddsInfographic } from "@/components/odds-infographic";
import { Parlays } from "@/components/parlays";
import { PayoutLab } from "@/components/payout-lab";
import { SiteChrome } from "@/components/site-chrome";
import { OddsTranslator } from "@/components/translator";
import { LESSONS } from "@/lib/site";

export const Route = createFileRoute("/odds-101")({
  component: Odds101,
  head: () => ({
    meta: [{ title: "$UNDERDOG \u00b7 Odds 101" }],
  }),
});

function Odds101() {
  return (
    <SiteChrome>
      <main>
        <div className="mx-auto max-w-5xl px-4 pt-6 pb-8 sm:pt-8 sm:pb-10">
          <OddsInfographic />
        </div>
        <Classroom />
        <Parlays />
        <PayoutLab />
        <OddsTranslator />
        <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
          <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
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
    </SiteChrome>
  );
}
