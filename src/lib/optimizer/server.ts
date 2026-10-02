import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { readUnderdog } from "./ai";
import { analyzeEvent } from "./engine";
import { loadSportEvents } from "./providers";
import { SPORTS } from "./sports";
import type { OptimizerAnalysis, SportKey } from "./types";

const sportSchema = z.enum(["ufc", "boxing", "nba", "nfl", "mlb", "nhl"]);

const cache = new Map<SportKey, { at: number; payload: Awaited<ReturnType<typeof loadSportEvents>> }>();
const TTL = 60_000;

async function eventsFresh(sport: SportKey) {
  const hit = cache.get(sport);
  if (hit && Date.now() - hit.at < TTL) return hit.payload;
  const payload = await loadSportEvents(sport);
  cache.set(sport, { at: Date.now(), payload });
  return payload;
}

function pct(n: number) {
  return `${Math.round(n * 100)}%`;
}

export const loadOptimizerBoard = createServerFn({ method: "GET" })
  .validator(z.object({ sport: sportSchema.optional() }))
  .handler(async ({ data }) => {
    const sport = data.sport ?? "ufc";
    const board = await eventsFresh(sport);
    return {
      sports: SPORTS.map((s) => ({ key: s.key, label: s.label, sampleOnly: s.sampleOnly })),
      sport: board.sport,
      live: board.live,
      provider: board.provider,
      note: board.note,
      events: board.events.map((event) => ({
        id: event.id,
        sport: event.sport,
        eventName: event.eventName,
        league: event.league,
        startTime: event.startTime,
        dataStatus: event.dataStatus,
        source: event.source,
        bookCount: event.bookCount,
        favorite: event.favorite.name,
        underdog: event.underdog.name,
        favoriteOdds: event.favorite.americanOdds,
        underdogOdds: event.underdog.americanOdds,
      })),
    };
  });

export const analyzeOptimizerFight = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().min(1), sport: sportSchema }))
  .handler(async ({ data }): Promise<OptimizerAnalysis | null> => {
    const board = await eventsFresh(data.sport);
    const event = board.events.find((row) => row.id === data.id);
    if (!event) return null;
    const base = analyzeEvent(event);
    const ai = await readUnderdog(event, base.underdogImplied);
    if (!ai || base.underdogImplied === null) return base;

    const edge = ai.modelWin - base.underdogImplied;
    const score = Math.round(Math.min(92, Math.max(8, 50 + edge * 200)));
    const rating: OptimizerAnalysis["rating"] =
      score >= 72 ? "Value look" : score >= 58 ? "Lean" : score < 36 ? "Pass" : "Watch";
    const reason = {
      kind: edge >= 0 ? ("for" as const) : ("against" as const),
      basedOn: "stats" as const,
      text: ai.reason,
    };

    return {
      ...base,
      score,
      rating,
      modelWin: ai.modelWin,
      edge,
      explanationKind: "ai",
      explanation: `${event.underdog.name}: books ${pct(base.underdogImplied)}, model ${pct(ai.modelWin)}, edge ${edge >= 0 ? "+" : ""}${pct(edge)}. ${ai.reason}`,
      reasonsFor: edge >= 0 ? [reason, ...base.reasonsFor] : base.reasonsFor,
      reasonsAgainst: edge < 0 ? [reason, ...base.reasonsAgainst] : base.reasonsAgainst,
    };
  });
