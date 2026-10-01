import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { CLASSROOM_PICK } from "@/lib/markets";
import { loadMarkets } from "@/lib/load-markets";
import { formatAmerican, formatPercent } from "@/lib/odds";
import { analyzeOptimizerFight, loadOptimizerBoard } from "@/lib/optimizer/server";
import type { OptimizerAnalysis, SportKey } from "@/lib/optimizer/types";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/optimizer")({
  loader: async () => {
    const [markets, board] = await Promise.all([
      loadMarkets({ data: {} }),
      loadOptimizerBoard({ data: { sport: "ufc" } }),
    ]);
    return { markets, board };
  },
  head: () => ({
    meta: [{ title: "$UNDERDOG · AI Underdog Optimizer" }],
  }),
  component: OptimizerPage,
});

function pct(n: number | null) {
  return n === null ? "Unavailable" : formatPercent(n);
}

function when(iso: string | null) {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(t);
}

function OptimizerPage() {
  const { markets, board: firstBoard } = Route.useLoaderData();
  const ticker = markets.kalshi.length ? markets.kalshi : [CLASSROOM_PICK];
  const [board, setBoard] = useState(firstBoard);
  const [sport, setSport] = useState<SportKey>(firstBoard.sport);
  const [selected, setSelected] = useState(topPayoutIds(firstBoard.events)[0] ?? firstBoard.events[0]?.id ?? "");
  const [analysis, setAnalysis] = useState<OptimizerAnalysis | null>(null);
  const [busy, setBusy] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [parlay, setParlay] = useState<ParlayLeg[]>([]);

  function addToParlay(id = selected) {
    const event = board.events.find((row) => row.id === id);
    if (!event || event.underdogOdds === null) {
      setError("That card has no price to add.");
      return;
    }
    if (parlay.some((leg) => leg.id === event.id)) {
      setError("That dog is already on the slip.");
      return;
    }
    if (parlay.length >= 3) {
      setError("Three dogs is the limit. Remove one to add another.");
      return;
    }
    setError(null);
    setAnalysis(null);
    setSelected(event.id);
    setParlay((legs) => [
      ...legs,
      {
        id: event.id,
        underdog: event.underdog,
        favorite: event.favorite,
        americanOdds: event.underdogOdds as number,
      },
    ]);
  }

  async function chooseSport(next: SportKey) {
    setSport(next);
    setSwitching(true);
    setError(null);
    setAnalysis(null);
    setCopied(false);
    try {
      const nextBoard = await loadOptimizerBoard({ data: { sport: next } });
      setBoard(nextBoard);
      setSelected(topPayoutIds(nextBoard.events)[0] ?? nextBoard.events[0]?.id ?? "");
    } catch {
      setError("Could not load that sport board.");
    } finally {
      setSwitching(false);
    }
  }

  async function run() {
    if (!selected) return;
    setBusy(true);
    setError(null);
    setCopied(false);
    try {
      const result = await analyzeOptimizerFight({ data: { id: selected, sport } });
      if (!result) {
        setAnalysis(null);
        setError("That card is no longer on the board.");
        return;
      }
      setAnalysis(result);
    } catch {
      setError("The AI Optimizer could not finish this card.");
    } finally {
      setBusy(false);
    }
  }

  async function share() {
    if (!analysis) return;
    const text = [
      `${SITE.ticker} AI Underdog Optimizer`,
      `${analysis.event.underdog.name} ${analysis.underdogOdds} vs ${analysis.event.favorite.name} ${analysis.favoriteOdds}`,
      `Score ${analysis.score} · ${analysis.rating}`,
      "Education only. Not a pick.",
      `${SITE.url}/optimizer`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
      setError("Copy failed. Select the read and copy it by hand.");
    }
  }

  return (
    <PageShell picks={ticker}>
      <main>
        <section className="border-b border-line">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
            <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">Price read</p>
            <h1 className="mt-2 font-display text-5xl leading-none tracking-wide text-fg sm:text-7xl">
              AI <span className="text-accent">&ldquo;Underdog&rdquo;</span> Optimizer
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
              Pick a sport, then a matchup. The score comes from the underdog price, the vig, and any
              confirmed notes. It does not invent a record, and a high score is not a bet.
            </p>
            <p className="mt-4 rounded-lg border border-line bg-surface/80 px-4 py-3 text-sm leading-relaxed text-muted shadow-[inset_3px_0_0_var(--color-accent)]">
              {board.note}
            </p>
          </div>
        </section>

        <section className="bg-surface">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
            <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">Sports</p>
            <h2 className="font-display text-4xl tracking-wide text-fg sm:text-5xl">Choose a board</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {board.sports.map((item) => {
                const active = item.key === sport;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => chooseSport(item.key)}
                    className={`min-h-11 rounded-md border px-3 py-2 text-sm font-semibold ${
                      active
                        ? "border-accent bg-accent text-accent-fg"
                        : "border-line bg-bg/60 text-fg hover:border-accent hover:bg-accent/20"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <p className="mt-8 text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
              {board.sports.find((s) => s.key === sport)?.label ?? "Board"}
            </p>
            <h3 className="font-display text-3xl tracking-wide text-fg">Select a matchup</h3>
            <p className="mt-2 text-sm text-muted">Biggest payouts first. The rest of the card follows.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {switching ? (
                <p className="text-sm text-muted">Loading that sport…</p>
              ) : board.events.length ? (
                rankedEvents(board.events).map((event) => {
                  const active = event.id === selected;
                  const start = when(event.startTime);
                  const rank = payoutRank(event.id, board.events);
                  const onSlip = parlay.some((leg) => leg.id === event.id);
                  return (
                    <div
                      key={event.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelected(event.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") setSelected(event.id);
                      }}
                      className={`relative min-w-0 rounded-lg border px-4 py-4 text-left ${
                        rank
                          ? "border-accent bg-accent/10 shadow-[inset_3px_0_0_var(--color-accent)]"
                          : "border-line bg-surface/80"
                      }`}
                    >
                      <span className="absolute top-3 right-3">
                        {active ? (
                          <span className="rounded-full border border-accent/40 bg-accent/20 px-2 py-0.5 text-[0.6rem] font-semibold tracking-widest text-accent uppercase">
                            Selected
                          </span>
                        ) : null}
                      </span>
                      <p className="pr-20 text-[0.65rem] font-semibold tracking-widest text-accent uppercase">
                        {rank ? payoutLabel(rank) : "Dog"} · {event.league}
                        {event.dataStatus === "live" ? " · Live" : ""}
                        {event.bookCount ? ` · ${event.bookCount} books` : ""}
                        {start ? ` · ${start}` : ""}
                      </p>
                      <p className="mt-1 flex items-baseline justify-between gap-3">
                        <span className="font-display text-xl tracking-wide text-accent sm:text-2xl">{event.underdog}</span>
                        <span className="shrink-0 font-display text-2xl tracking-wide text-accent sm:text-3xl">
                          {event.underdogOdds === null ? "—" : formatAmerican(event.underdogOdds)}
                        </span>
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        Favorite {event.favorite}{" "}
                        {event.favoriteOdds === null ? "" : formatAmerican(event.favoriteOdds)}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToParlay(event.id);
                        }}
                        className="mt-3 inline-flex min-h-9 items-center rounded-md border border-accent/40 bg-bg/50 px-3 py-1.5 text-xs font-semibold tracking-wide text-accent uppercase hover:bg-accent/20"
                      >
                        {onSlip ? `On slip · ${parlay.length} of 3` : "Add to parlay"}
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="rounded-lg border border-line bg-bg/50 px-4 py-4 text-sm leading-relaxed text-muted">
                  No open cards on this board right now. Started events are hidden.
                </p>
              )}
            </div>
            {parlay.length ? (
              <ParlaySlip legs={parlay} onRemove={(id) => setParlay((legs) => legs.filter((leg) => leg.id !== id))} />
            ) : null}
            <div className="mt-6">
              {parlay.length ? (
                <p className="rounded-lg border border-line bg-surface/80 px-4 py-3 text-sm leading-relaxed text-muted shadow-[inset_3px_0_0_var(--color-accent)]">
                  When a parlay is selected, the AI Optimizer button is hidden. Remove the selected parlays for the button to reappear.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={run}
                  disabled={!selected || busy || switching}
                  className="inline-flex min-h-11 items-center rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg hover:bg-accent-dim disabled:opacity-50"
                >
                  {busy ? "Scoring…" : selected ? "Run AI Optimizer" : "Select a fighter"}
                </button>
              )}
            </div>
            {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}
          </div>
        </section>

        {analysis ? <AnalysisPanel analysis={analysis} copied={copied} onShare={share} /> : null}
      </main>
    </PageShell>
  );
}

function payoutLabel(rank: number) {
  if (rank === 1) return "Biggest payout";
  if (rank === 2) return "2nd payout";
  return "3rd payout";
}

function topPayoutIds(events: Array<{ id: string; underdogOdds: number | null }>) {
  return events
    .filter((event) => (event.underdogOdds ?? 0) > 0)
    .sort((a, b) => (b.underdogOdds ?? 0) - (a.underdogOdds ?? 0))
    .slice(0, 3)
    .map((event) => event.id);
}

function payoutRank(id: string, events: Array<{ id: string; underdogOdds: number | null }>) {
  const index = topPayoutIds(events).indexOf(id);
  return index === -1 ? 0 : index + 1;
}

function rankedEvents<T extends { id: string; underdogOdds: number | null }>(events: T[]) {
  const top = new Set(topPayoutIds(events));
  return [...events.filter((event) => top.has(event.id)).sort((a, b) => payoutRank(a.id, events) - payoutRank(b.id, events)), ...events.filter((event) => !top.has(event.id))];
}

function Stat({ n, label, hint }: { n: string; label: string; hint: string }) {
  return (
    <li className="min-w-0 rounded-md border border-line bg-bg/55 px-2 py-3">
      <p className="font-display text-xl leading-none tracking-wide text-accent sm:text-2xl">{n}</p>
      <p className="mt-1 text-[0.6rem] font-semibold tracking-wide text-muted uppercase">{label}</p>
      <p className="mt-1 text-[0.7rem] leading-snug text-muted">{hint}</p>
    </li>
  );
}

function ratingHint(rating: OptimizerAnalysis["rating"]) {
  if (rating === "Pass") return "Long shot. Big payout, unlikely win.";
  if (rating === "Watch") return "Ordinary price. Nothing special.";
  if (rating === "Lean") return "Closer dog. Worth a look.";
  if (rating === "Value look") return "Price looks better than most dogs.";
  return "No price yet, so no score.";
}

function winOn(stake: number, american: number | null) {
  if (american === null || american === 0) return null;
  const profit = american > 0 ? (stake * american) / 100 : (stake * 100) / Math.abs(american);
  return profit;
}

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

type ParlayLeg = { id: string; underdog: string; favorite: string; americanOdds: number };

function decimalOdds(american: number) {
  return american > 0 ? american / 100 + 1 : 100 / Math.abs(american) + 1;
}

function parlayProfit(legs: ParlayLeg[], stake: number) {
  const decimal = legs.reduce((product, leg) => product * decimalOdds(leg.americanOdds), 1);
  return stake * (decimal - 1);
}

function ParlaySlip({ legs, onRemove }: { legs: ParlayLeg[]; onRemove: (id: string) => void }) {
  if (!legs.length) return null;
  const five = parlayProfit(legs, 5);
  const ten = parlayProfit(legs, 10);
  return (
    <article className="mt-6 rounded-lg border border-line bg-surface/80 px-4 py-4 shadow-[inset_3px_0_0_var(--color-accent)]">
      <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">Underdog parlay</p>
      {legs.length < 2 ? (
        <p className="mt-2 text-sm text-muted">Add a dog from a different fight. The payout shows once there are two.</p>
      ) : (
        <>
          <p className="mt-2 font-display text-2xl tracking-wide text-accent">$10 wins {money(ten)}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {money(ten + 10)} back. A $5 bet wins {money(five)}. All {legs.length} have to hit. Estimate, not a sportsbook ticket.
          </p>
        </>
      )}
      <ul className="mt-3 space-y-2">
        {legs.map((leg) => (
          <li key={leg.id} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-fg">
              {leg.underdog} {formatAmerican(leg.americanOdds)}
              <span className="text-muted"> vs {leg.favorite}</span>
            </span>
            <button type="button" onClick={() => onRemove(leg.id)} className="text-xs font-semibold text-muted hover:text-accent">
              Remove
            </button>
          </li>
        ))}
      </ul>
    </article>
  );
}

function AnalysisPanel({
  analysis,
  copied,
  onShare,
}: {
  analysis: OptimizerAnalysis;
  copied: boolean;
  onShare: () => void;
}) {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
        <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">The dog</p>
        <h2 className="font-display text-4xl tracking-wide text-accent sm:text-5xl">
          {analysis.event.underdog.name} {analysis.underdogOdds}
        </h2>
        <p className="mt-2 text-sm text-muted">
          Favorite {analysis.event.favorite.name} {analysis.favoriteOdds}. {analysis.event.sourceNote}
        </p>

        <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat n={String(analysis.score)} label="AI score" hint="Out of 100. Low means a long shot." />
          <Stat n={analysis.rating} label="Rating" hint={ratingHint(analysis.rating)} />
          <Stat
            n={analysis.underdogOdds}
            label="If he wins"
            hint={
              winOn(10, analysis.event.underdog.americanOdds) === null
                ? "No price on this dog."
                : `$10 wins ${money(winOn(10, analysis.event.underdog.americanOdds) ?? 0)}.`
            }
          />
          <Stat
            n={pct(analysis.underdogImplied)}
            label="Chance to win"
            hint={
              analysis.underdogImplied === null
                ? "The books have not posted a chance."
                : `Books say about ${Math.max(1, Math.round(analysis.underdogImplied * 100))} wins in 100.`
            }
          />
        </ul>

        <div className="mt-8 grid gap-3 lg:grid-cols-3">
          <article className="rounded-lg border border-line bg-surface/80 px-4 py-4 shadow-[inset_3px_0_0_var(--color-accent)]">
            <p className="font-display text-2xl tracking-wide text-fg">Current odds</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Favorite {analysis.event.favorite.name}: {analysis.favoriteOdds} ({pct(analysis.favoriteImplied)} implied)
              <br />
              Underdog {analysis.event.underdog.name}: {analysis.underdogOdds} ({pct(analysis.underdogImplied)} implied)
            </p>
          </article>
          <article className="rounded-lg border border-accent/50 bg-accent/10 px-4 py-4 shadow-[inset_3px_0_0_var(--color-accent)]">
            <p className="font-display text-2xl tracking-wide text-fg">If the dog hits</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {winOn(5, analysis.event.underdog.americanOdds) === null ? (
                "Odds unavailable."
              ) : (
                <>
                  $5 wins {money(winOn(5, analysis.event.underdog.americanOdds) ?? 0)}, {money((winOn(5, analysis.event.underdog.americanOdds) ?? 0) + 5)} back
                  <br />
                  $10 wins {money(winOn(10, analysis.event.underdog.americanOdds) ?? 0)}, {money((winOn(10, analysis.event.underdog.americanOdds) ?? 0) + 10)} back
                  <br />
                  Wins is profit. Back includes the stake.
                </>
              )}
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
          <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">Price read</p>
          <p className="mt-2 text-base leading-relaxed text-muted">{analysis.explanation}</p>
          {analysis.missing.length ? (
            <p className="mt-4 text-sm text-muted">Unavailable: {analysis.missing.join(" · ")}</p>
          ) : null}
          <button
            type="button"
            onClick={onShare}
            className="mt-5 inline-flex min-h-11 items-center rounded-md border border-line px-4 py-2 text-sm font-semibold text-fg hover:border-accent"
          >
            {copied ? "Copied" : "Copy this read"}
          </button>
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
