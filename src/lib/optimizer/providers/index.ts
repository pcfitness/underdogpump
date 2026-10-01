import type { OptimizerEvent, SportKey } from "../types";
import { fixturesFor } from "./fixture";
import { fetchOddsApiSport } from "./odds-api";
import { sportMeta } from "../sports";

export type ProviderResult = {
  sport: SportKey;
  events: OptimizerEvent[];
  provider: "the-odds-api" | "fixture" | "unconfigured";
  live: boolean;
  note: string;
};

export async function loadSportEvents(sport: SportKey): Promise<ProviderResult> {
  const samples = fixturesFor(sport);
  const meta = sportMeta(sport);
  const key = process.env.ODDS_API_KEY?.trim();
  const allowSamples = process.env.OPTIMIZER_ALLOW_SAMPLES === "1";

  if (meta.sampleOnly) {
    return {
      sport,
      events: samples,
      provider: "fixture",
      live: false,
      note: `${meta.label} has no live odds feed yet. These cards are labeled samples so the board can be tested. They are not tickets.`,
    };
  }

  if (key && meta.oddsApiKey) {
    try {
      const events = await fetchOddsApiSport(key, sport);
      if (events.length) {
        return {
          sport,
          events,
          provider: "the-odds-api",
          live: true,
          note: `Live ${meta.label} moneylines. Each price is a consensus across the books that posted a head-to-head line. Records are not in this feed.`,
        };
      }
      return {
        sport,
        events: [],
        provider: "the-odds-api",
        live: true,
        note: `No open ${meta.label} moneylines right now. Started events are hidden. Check back when the next card is posted.`,
      };
    } catch {
      return {
        sport,
        events: allowSamples ? samples : [],
        provider: allowSamples ? "fixture" : "unconfigured",
        live: false,
        note: allowSamples
          ? `The Odds API request for ${meta.label} failed. Showing labeled samples because OPTIMIZER_ALLOW_SAMPLES is on.`
          : `The Odds API request for ${meta.label} failed. No sample cards are shown on a launch board.`,
      };
    }
  }

  if (allowSamples) {
    return {
      sport,
      events: samples,
      provider: "fixture",
      live: false,
      note: `No ODDS_API_KEY yet. ${meta.label} is showing labeled samples because OPTIMIZER_ALLOW_SAMPLES is on.`,
    };
  }

  return {
    sport,
    events: [],
    provider: "unconfigured",
    live: false,
    note: `Live ${meta.label} odds need ODDS_API_KEY on this deploy. The board stays empty instead of inventing a card.`,
  };
}
