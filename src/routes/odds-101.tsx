import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HotspotPoster } from "@/components/hotspot-poster";
import { OddsTranslator } from "@/components/odds-translator";
import { HOTSPOTS } from "@/lib/content";

export const Route = createFileRoute("/odds-101")({ component: Odds101 });

function Odds101() {
  return (
    <div className="min-h-screen bg-bg/80 text-fg">
      <SiteHeader />
      <main>
        <section className="border-b border-line">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent">
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
          <HotspotPoster />
        </div>

        <section className="border-y border-line">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent">
              The dog
            </p>
            <h2 className="font-display text-4xl tracking-wide text-fg">Same long shot. In the rain.</h2>
            <div className="mt-5 overflow-hidden rounded-xl border border-line">
              <img
                src="/hero-mobile.jpg"
                alt="Black Cane Corso, crimson eyes, spiked collar"
                className="aspect-[9/16] max-h-[32rem] w-full object-cover object-[center_12%] md:hidden"
              />
              <img
                src="/hero-dog-v4.jpg"
                alt="Cane Corso in the rain, crimson rim light, spiked collar"
                className="hidden aspect-[16/9] w-full object-cover object-[82%_8%] md:block"
              />
            </div>
          </div>
        </section>

        <OddsTranslator />

        <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
          <div className="mt-2">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent">
              The six moves
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {HOTSPOTS.map((spot) => (
                <article
                  key={spot.id}
                  className="rounded-lg border border-line bg-surface/80 px-4 py-4 shadow-[inset_3px_0_0_var(--color-accent)]"
                >
                  <p className="font-display text-2xl tracking-wide text-fg">
                    <span className="text-accent">{spot.n}</span> {spot.label}
                  </p>
                  <p className="text-base font-medium text-fg">{spot.title}</p>
                  <p className="mt-1 text-base leading-relaxed text-muted">{spot.body}</p>
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
