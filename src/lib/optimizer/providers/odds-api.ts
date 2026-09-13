import type { OptimizerEvent } from "../types";

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

export async function fetchOddsApiMma(apiKey: string): Promise<OptimizerEvent[]> {
  const url =
    "https://api.the-odds-api.com/v4/sports/mma_mixed_martial_arts/odds" +
    `?regions=us&markets=h2h&oddsFormat=american&apiKey=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    headers: { accept: "application/json", "user-agent": "underdogpump-optimizer/0.1" },
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) throw new Error(`Odds API ${res.status}`);
  const rows = (await res.json()) as OddsEvent[];
  if (!Array.isArray(rows)) return [];

  const events: OptimizerEvent[] = [];
  for (const row of rows.slice(0, 12)) {
    const market = row.bookmakers?.find((b) => b.markets?.some((m) => m.key === "h2h" && (m.outcomes?.length ?? 0) >= 2));
    const h2h = market?.markets?.find((m) => m.key === "h2h");
    const pair = americanFromPair(h2h?.outcomes ?? []);
    if (!pair) continue;

    events.push({
      id: `oddsapi-${row.id}`,
      sport: "ufc",
      league: row.sport_title || "MMA",
      eventName: `${pair.favorite.name} vs ${pair.underdog.name}`,
      startTime: row.commence_time ?? null,
      dataStatus: "live",
      source: market?.title ? `The Odds API · ${market.title}` : "The Odds API",
      sourceNote: "Live moneyline from The Odds API. Fighter records and camp notes are not included in this feed.",
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
