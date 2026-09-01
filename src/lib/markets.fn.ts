import { createServerFn } from "@tanstack/react-start";
import {
  CLASH_FALLBACK,
  formatImplied,
  POLY_FALLBACK,
  type MarketRow,
} from "./markets";

function parseJsonArray(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function toNumber(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export const loadClashPicks = createServerFn({ method: "GET" }).handler(
  async () => CLASH_FALLBACK satisfies MarketRow[],
);

export const loadPolymarket = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const url =
        "https://gamma-api.polymarket.com/events?closed=false&active=true&limit=40&order=volume24hr&ascending=false";
      const res = await fetch(url, {
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) return POLY_FALLBACK;
      const events = (await res.json()) as Array<{
        title?: string;
        slug?: string;
        markets?: Array<{
          id?: string;
          question?: string;
          slug?: string;
          outcomes?: unknown;
          outcomePrices?: unknown;
          active?: boolean;
          closed?: boolean;
        }>;
      }>;
      const rows: MarketRow[] = [];
      for (const event of events) {
        for (const market of event.markets ?? []) {
          if (market.closed || market.active === false) continue;
          const outcomes = parseJsonArray(market.outcomes).map(String);
          const prices = parseJsonArray(market.outcomePrices)
            .map(toNumber)
            .filter((n): n is number => n != null);
          let best = 1;
          let label = market.question ?? event.title ?? "Long shot";
          for (let i = 0; i < prices.length; i++) {
            const p = prices[i]!;
            if (p > 0.005 && p < best) {
              best = p;
              const outcome = outcomes[i];
              const question = market.question ?? event.title ?? "Market";
              label = outcome && outcome !== "Yes" ? `${question} — ${outcome}` : question;
            }
          }
          if (best >= 0.18 || best <= 0.005) continue;
          const slug = market.slug ?? event.slug;
          rows.push({
            id: `pm-${market.id ?? slug ?? rows.length}`,
            question: label,
            implied: formatImplied(best),
            impliedValue: best,
            source: "Polymarket",
            href: slug ? `https://polymarket.com/event/${event.slug ?? slug}` : undefined,
          });
        }
      }
      rows.sort((a, b) => a.impliedValue - b.impliedValue);
      const unique: MarketRow[] = [];
      const seen = new Set<string>();
      for (const row of rows) {
        if (seen.has(row.question)) continue;
        seen.add(row.question);
        unique.push(row);
        if (unique.length >= 8) break;
      }
      return unique.length >= 3 ? unique : POLY_FALLBACK;
    } catch {
      return POLY_FALLBACK;
    }
  },
);
