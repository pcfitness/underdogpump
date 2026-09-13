import type { OptimizerEvent } from "../types";
import { UFC_FIXTURE_EVENTS } from "./fixture";
import { fetchOddsApiMma } from "./odds-api";

export type ProviderResult = {
  events: OptimizerEvent[];
  provider: "the-odds-api" | "fixture";
  live: boolean;
  note: string;
};

/**
 * Swap or add providers here. Credentials stay on the server.
 * ODDS_API_KEY → The Odds API (mma_mixed_martial_arts).
 */
export async function loadUfcEvents(): Promise<ProviderResult> {
  const key = process.env.ODDS_API_KEY?.trim();
  if (key) {
    try {
      const events = await fetchOddsApiMma(key);
      if (events.length) {
        return {
          events,
          provider: "the-odds-api",
          live: true,
          note: "Live MMA moneylines loaded from The Odds API. Records and film notes are still unavailable.",
        };
      }
    } catch {
      return {
        events: UFC_FIXTURE_EVENTS,
        provider: "fixture",
        live: false,
        note: "The Odds API request failed. Showing labeled development samples so the Optimizer can still be tested.",
      };
    }
  }

  return {
    events: UFC_FIXTURE_EVENTS,
    provider: "fixture",
    live: false,
    note: "No ODDS_API_KEY in Vercel env yet. These UFC cards are labeled development samples, not live tickets.",
  };
}
