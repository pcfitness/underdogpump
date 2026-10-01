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

function impliedFromAmerican(american: number): number | null {
  if (!Number.isFinite(american) || american === 0) return null;
  return american > 0 ? 100 / (american + 100) : -american / (-american + 100);
}

function americanFromImplied(implied: number): number | null {
  if (!Number.isFinite(implied) || implied <= 0.01 || implied >= 0.99) return null;
  const decimal = 1 / implied;
  const american = decimal >= 2 ? 100 * (decimal - 1) : -100 / (decimal - 1);
  return Math.round(american);
}

function stillOpen(commence: string | undefined, now: number) {
  if (!commence) return true;
  const start = Date.parse(commence);
  return Number.isNaN(start) || start > now;
}

export async function fetchOddsApiSport(
  apiKey: string,
  sport: SportKey,
  now = Date.now(),
): Promise<OptimizerEvent[]> {
  const meta = sportMeta(sport);
  if (!meta.oddsApiKey) return [];

  const url =
    `https://api.the-odds-api.com/v4/sports/${meta.oddsApiKey}/odds` +
    `?regions=us&markets=h2h&oddsFormat=american&apiKey=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    headers: { accept: "application/json", "user-agent": "underdogpump-optimizer/0.3" },
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) throw new Error(`Odds API ${res.status} ${meta.oddsApiKey}`);
  const rows = (await res.json()) as OddsEvent[];
  if (!Array.isArray(rows)) return [];

  const events: OptimizerEvent[] = [];
  for (const row of rows) {
    if (!stillOpen(row.commence_time, now)) continue;
    const quotes = new Map<string, number[]>();
    const books: string[] = [];
    for (const book of row.bookmakers ?? []) {
      const h2h = book.markets?.find((m) => m.key === "h2h" && (m.outcomes?.length ?? 0) >= 2);
      if (!h2h?.outcomes) continue;
      const titled = book.title?.trim();
      if (titled) books.push(titled);
      for (const outcome of h2h.outcomes) {
        if (outcome.name === "Draw") continue;
        const implied = impliedFromAmerican(outcome.price);
        if (implied === null) continue;
        const bag = quotes.get(outcome.name) ?? [];
        bag.push(implied);
        quotes.set(outcome.name, bag);
      }
    }
    const sides = [...quotes.entries()]
      .map(([name, implieds]) => ({
        name,
        implied: implieds.reduce((sum, n) => sum + n, 0) / implieds.length,
      }))
      .filter((side) => side.name === row.home_team || side.name === row.away_team)
      .sort((a, b) => b.implied - a.implied);
    if (sides.length < 2) continue;
    const favorite = sides[0];
    const underdog = sides[sides.length - 1];
    const favoriteOdds = americanFromImplied(favorite.implied);
    const underdogOdds = americanFromImplied(underdog.implied);
    if (favoriteOdds === null || underdogOdds === null) continue;

    events.push({
      id: `oddsapi-${sport}-${row.id}`,
      sport,
      league: row.sport_title || meta.league,
      eventName: `${favorite.name} vs ${underdog.name}`,
      startTime: row.commence_time ?? null,
      dataStatus: "live",
      source: books.length ? `Consensus · ${books.length} books` : "The Odds API",
      sourceNote:
        books.length > 1
          ? `Consensus moneyline from ${books.slice(0, 4).join(", ")}${books.length > 4 ? ` +${books.length - 4}` : ""}. Records and film notes are not in this feed.`
          : "Live moneyline from The Odds API. Form, injuries, and film notes are not in this feed.",
      bookCount: books.length,
      books,
      favorite: {
        name: favorite.name,
        americanOdds: favoriteOdds,
        record: null,
        stance: null,
        reachInches: null,
        age: null,
        notes: [],
      },
      underdog: {
        name: underdog.name,
        americanOdds: underdogOdds,
        record: null,
        stance: null,
        reachInches: null,
        age: null,
        notes: [],
      },
    });
    if (events.length >= 12) break;
  }
  return events;
}
