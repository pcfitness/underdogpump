import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { analyzeEvent } from "./engine";
import { loadSportEvents } from "./providers";
import { SPORTS } from "./sports";
import type { OptimizerAnalysis, SportKey } from "./types";

const sportSchema = z.enum([
  "ufc",
  "boxing",
  "darts_pdc",
  "darts_modus",
  "tennis",
  "nba",
  "nfl",
  "mlb",
  "nhl",
]);

const cache = new Map<SportKey, { at: number; payload: Awaited<ReturnType<typeof loadSportEvents>> }>();
const TTL = 60_000;

async function eventsFresh(sport: SportKey) {
  const hit = cache.get(sport);
  if (hit && Date.now() - hit.at < TTL) return hit.payload;
  const payload = await loadSportEvents(sport);
  cache.set(sport, { at: Date.now(), payload });
  return payload;
}

export const loadOptimizerBoard = createServerFn({ method: "GET" })
  .validator(z.object({ sport: sportSchema.optional() }))
  .handler(async ({ data }) => {
    const sport = data.sport ?? "ufc";
    const board = await eventsFresh(sport);
    return {
      sports: SPORTS.map((s) => ({ key: s.key, label: s.label })),
      sport: board.sport,
      live: board.live,
      provider: board.provider,
      note: board.note,
      events: board.events.map((event) => ({
        id: event.id,
        sport: event.sport,
        eventName: event.eventName,
        league: event.league,
        dataStatus: event.dataStatus,
        source: event.source,
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
    return analyzeEvent(event);
  });
