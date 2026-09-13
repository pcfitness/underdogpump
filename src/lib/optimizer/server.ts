import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { analyzeEvent } from "./engine";
import { loadUfcEvents } from "./providers";
import type { OptimizerAnalysis } from "./types";

let cache: { at: number; payload: Awaited<ReturnType<typeof loadUfcEvents>> } | null = null;
const TTL = 60_000;

async function eventsFresh() {
  if (cache && Date.now() - cache.at < TTL) return cache.payload;
  const payload = await loadUfcEvents();
  cache = { at: Date.now(), payload };
  return payload;
}

export const loadOptimizerBoard = createServerFn({ method: "GET" }).handler(async () => {
  const board = await eventsFresh();
  return {
    sport: "ufc" as const,
    live: board.live,
    provider: board.provider,
    note: board.note,
    events: board.events.map((event) => ({
      id: event.id,
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
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }): Promise<OptimizerAnalysis | null> => {
    const board = await eventsFresh();
    const event = board.events.find((row) => row.id === data.id);
    if (!event) return null;
    return analyzeEvent(event);
  });
