import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { CLASSROOM_PICK } from "@/lib/markets";
import { loadMarkets } from "@/lib/load-markets";
import { formatAmerican, formatPercent } from "@/lib/odds";
import { analyzeOptimizerFight, loadOptimizerBoard } from "@/lib/optimizer/server";
import type { OptimizerAnalysis } from "@/lib/optimizer/types";

export const Route = createFileRoute("/optimizer")({
  loader: async () => {
    const [markets, board] = await Promise.all([
      loadMarkets({ data: {} }),
      loadOptimizerBoard(),
    ]);
    return { markets, board };
  },
  head: () => ({
    meta: [{ title: "$UNDERDOG · AI Optimizer" }],
  }),
  component: OptimizerPage,
});

function pct(n: number | null) {
  return n === null ? "Unavailable" : formatPercent(n);
}

function OptimizerPage() {
  const { markets, board } = Route.useLoaderData();
  const ticker = markets.kalshi.length ? markets.kalshi : [CLASSROOM_PICK];
  const [selected, setSelected] = useState(board.events[0]?.id ?? "");
  const [analysis, setAnalysis] = useState<OptimizerAnalysis | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (!selected) return;
    setBusy(true);
    setError(null);
    try {
      const result = await analyzeOptimizerFight({ data: { id: selected } });
      if (!result) {
        setAnalysis(null);
        setError("That card is no longer on the board.");
        return;
      }
      setAnalysis(result);
    } catch {
      setError("The server-side Optimizer could not finish this card.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell picks={ticker}>
      <main>
        <section className="border-b border-line">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
            <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
              Preview · UFC first slice
            </p>
            <h1 className="mt-2 font-display text-5xl leading-none tracking-wide text-fg sm:text-7xl">
              Underdog AI Optimizer
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
              Pick a UFC card. The server scores whether the underdog looks like value from the
              price, the vig, and any confirmed notes. Missing stats stay missing. Nothing here is a
              bet recommendation.
            </p>
            <p className="mt-4 rounded-lg border border-line bg-surface/80 px-4 py-3 text-sm leading-relaxed text-muted shadow-[inset_3px_0_0_var(--color-accent)]">
              {board.note}
            </p>
          </div>
        </section>

        <section className="bg-surface">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
            <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">UFC board</p>
            <h2 className="font-display text-4xl tracking-wide text-fg sm:text-5xl">Select a fight</h2>
            <div className="mt-6 grid gap-3">
              {board.events.map((event) => {
                const active = event.id === selected;
                return (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => setSelected(event.id)}
                    className={`rounded-lg border px-4 py-4 text-left shadow-[inset_3px_0_0_var(--color-accent)] ${
                      active ? "border-accent bg-accent/10" : "border-line bg-surface/80"
                    }`}
                  >
                    <p className="text-[0.65rem] font-semibold tracking-widest text-accent uppercase">
                      {event.league} · {event.dataStatus === "live" ? "Live feed" : "Development sample"}
                    </p>
                    <p className="mt-1 font-display text-2xl tracking-wide text-fg">{event.eventName}</p>
                    <p className="mt-1 text-sm text-muted">
                      Favorite {event.favorite}{" "}
                      {event.favoriteOdds === null ? "odds unavailable" : formatAmerican(event.favoriteOdds)}
                      {" · "}Underdog {event.underdog}{" "}
                      {event.underdogOdds === null ? "odds unavailable" : formatAmerican(event.underdogOdds)}
                    </p>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={run}
              disabled={!selected || busy}
              className="mt-6 inline-flex min-h-11 items-center rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg hover:bg-accent-dim disabled:opacity-50"
            >
              {busy ? "Scoring…" : "Run Optimizer"}
            </button>
            {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}
          </div>
        </section>

        {analysis ? <AnalysisPanel analysis={analysis} /> : null}
      </main>
    </PageShell>
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

function AnalysisPanel({ analysis }: { analysis: OptimizerAnalysis }) {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
        <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">Result</p>
        <h2 className="font-display text-4xl tracking-wide text-fg sm:text-5xl">{analysis.event.eventName}</h2>
        <p className="mt-2 text-sm text-muted">{analysis.event.sourceNote}</p>

        <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat n={String(analysis.score)} label="Optimizer score" />
          <Stat n={analysis.rating} label="Rating" />
          <Stat n={analysis.underdogOdds} label={`${analysis.event.underdog.name} odds`} />
          <Stat n={pct(analysis.underdogImplied)} label="Dog implied" />
        </ul>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <article className="rounded-lg border border-line bg-surface/80 px-4 py-4 shadow-[inset_3px_0_0_var(--color-accent)]">
            <p className="font-display text-2xl tracking-wide text-fg">Current odds</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Favorite {analysis.event.favorite.name}: {analysis.favoriteOdds} ({pct(analysis.favoriteImplied)} implied)
              <br />
              Underdog {analysis.event.underdog.name}: {analysis.underdogOdds} ({pct(analysis.underdogImplied)} implied)
            </p>
          </article>
          <article className="rounded-lg border border-line bg-surface/80 px-4 py-4 shadow-[inset_3px_0_0_var(--color-accent)]">
            <p className="font-display text-2xl tracking-wide text-fg">No-vig look</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Favorite share {pct(analysis.favoriteNoVig)}
              <br />
              Underdog share {pct(analysis.underdogNoVig)}
              <br />
              Two-way vig {pct(analysis.vigPercent)}
            </p>
          </article>
        </div>

        <div className="mt-8 grid gap-3 lg:grid-cols-3">
          <ReasonList title="Reasons for the dog" items={analysis.reasonsFor.map((r) => r.text)} />
          <ReasonList title="Reasons against" items={analysis.reasonsAgainst.map((r) => r.text)} />
          <ReasonList title="Risk factors" items={analysis.riskFactors.map((r) => r.text)} />
        </div>

        <article className="mt-8 rounded-xl border border-line bg-surface px-5 py-6 sm:px-8">
          <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
            {analysis.explanationKind === "ai" ? "AI explanation" : "Rule-based explanation"}
          </p>
          <p className="mt-2 text-base leading-relaxed text-muted">{analysis.explanation}</p>
          {analysis.missing.length ? (
            <p className="mt-4 text-sm text-muted">
              Unavailable / unconfirmed: {analysis.missing.join(" · ")}
            </p>
          ) : null}
        </article>
      </div>
    </section>
  );
}

function ReasonList({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="rounded-lg border border-line bg-surface/80 px-4 py-4 shadow-[inset_3px_0_0_var(--color-accent)]">
      <p className="font-display text-2xl tracking-wide text-fg">{title}</p>
      {items.length ? (
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted">Nothing confirmed on this side yet.</p>
      )}
    </article>
  );
}
