import { sportMeta } from "../sports";
import type { OptimizerEvent, SportKey } from "../types";

type OddsOutcome = { name: string; price: number };
type OddsEvent = {
  id: string;
  sport_title?: string;
  commence_time?: string;
  home_team: string;
  away_team: string;
  bookmakers?: Array<{
    title?: string;
    markets?: Array<{ key?: string; outcomes?: OddsOutcome[] }>;
  }>;
};

function americanFromPair(outcomes: OddsOutcome[]) {
  if (outcomes.length < 2) return null;
  const sorted = [...outcomes].sort((a, b) => a.price - b.price);
  return { favorite: sorted[0], underdog: sorted[sorted.length - 1] };
}

export async function fetchOddsApiSport(apiKey: string, sport: SportKey): Promise<OptimizerEvent[]> {
  const meta = sportMeta(sport);
  if (!meta.oddsApiKey) return [];

  const url =
    `https://api.the-odds-api.com/v4/sports/${meta.oddsApiKey}/odds` +
    `?regions=us&markets=h2h&oddsFormat=american&apiKey=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    headers: { accept: "application/json", "user-agent": "underdogpump-optimizer/0.2" },
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) throw new Error(`Odds API ${res.status} ${meta.oddsApiKey}`);
  const rows = (await res.json()) as OddsEvent[];
  if (!Array.isArray(rows)) return [];

  const events: OptimizerEvent[] = [];
  for (const row of rows.slice(0, 12)) {
    const market = row.bookmakers?.find((b) =>
      b.markets?.some((m) => m.key === "h2h" && (m.outcomes?.length ?? 0) >= 2),
    );
    const h2h = market?.markets?.find((m) => m.key === "h2h");
    const pair = americanFromPair(h2h?.outcomes ?? []);
    if (!pair) continue;

    events.push({
      id: `oddsapi-${sport}-${row.id}`,
      sport,
      league: row.sport_title || meta.league,
      eventName: `${pair.favorite.name} vs ${pair.underdog.name}`,
      startTime: row.commence_time ?? null,
      dataStatus: "live",
      source: market?.title ? `The Odds API · ${market.title}` : "The Odds API",
      sourceNote: "Live moneyline from The Odds API. Form, injuries, and film notes are not in this feed.",
      favorite: {
        name: pair.favorite.name,
        americanOdds: pair.favorite.price,
        record: null,
        stance: null,
        reachInches: null,
        age: null,
        notes: [],
      },
      underdog: {
        name: pair.underdog.name,
        americanOdds: pair.underdog.price,
        record: null,
        stance: null,
        reachInches: null,
        age: null,
        notes: [],
      },
    });
  }
  return events;
}
