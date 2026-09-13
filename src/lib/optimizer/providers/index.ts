import type { OptimizerEvent, SportKey } from "../types";
import { fixturesFor } from "./fixture";
import { fetchOddsApiSport } from "./odds-api";
import { sportMeta } from "../sports";

export type ProviderResult = {
  sport: SportKey;
  events: OptimizerEvent[];
  provider: "the-odds-api" | "fixture";
  live: boolean;
  note: string;
};

export async function loadSportEvents(sport: SportKey): Promise<ProviderResult> {
  const samples = fixturesFor(sport);
  const meta = sportMeta(sport);
  const key = process.env.ODDS_API_KEY?.trim();

  if (key && meta.oddsApiKey) {
    try {
      const events = await fetchOddsApiSport(key, sport);
      if (events.length) {
        return {
          sport,
          events,
          provider: "the-odds-api",
          live: true,
          note: `Live ${meta.label} moneylines from The Odds API. Records and extra stats are still unavailable.`,
        };
      }
    } catch {
      return {
        sport,
        events: samples,
        provider: "fixture",
        live: false,
        note: `The Odds API request for ${meta.label} failed. Showing labeled development samples so you can still test.`,
      };
    }
  }

  if (!meta.oddsApiKey) {
    return {
      sport,
      events: samples,
      provider: "fixture",
      live: false,
      note: `${meta.label} does not have a live odds provider wired yet. These cards are labeled development samples.`,
    };
  }

  return {
    sport,
    events: samples,
    provider: "fixture",
    live: false,
    note: `No ODDS_API_KEY in Vercel preview env yet. ${meta.label} cards are labeled development samples, not live tickets.`,
  };
}
