import { createServerFn } from "@tanstack/react-start";
import type { Longshot } from "@/lib/content";
import { diverseLongshots } from "@/lib/feed";

export const getLongshots = createServerFn({ method: "GET" }).handler(async (): Promise<Longshot[]> => {
  const url =
    "https://gamma-api.polymarket.com/markets?closed=false&active=true&limit=200&order=volume24hr&ascending=false";
  const res = await fetch(url, { cache: "no-store", headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`polymarket ${res.status}`);
  const data: unknown = await res.json();
  return parsePolymarket(data);
});

function parsePolymarket(data: unknown): Longshot[] {
  if (!Array.isArray(data)) return [];
  const out: Longshot[] = [];
  const seen = new Set<string>();

  for (const raw of data) {
    if (!raw || typeof raw !== "object") continue;
    const m = raw as Record<string, unknown>;
    const question = String(m.question ?? "").trim();
    if (!question) continue;
    const prices = coercePrices(m.outcomePrices);
    const min = prices.length ? Math.min(...prices) : NaN;
    // Real underdogs, not dust (0.05%) that rounds to 0%
    if (!(min >= 0.012) || min >= 0.28) continue;

    const eventSlug = eventSlugOf(m);
    const slug = String(m.slug ?? eventSlug ?? "").trim();
    const href = eventSlug
      ? `https://polymarket.com/event/${eventSlug}`
      : slug
        ? `https://polymarket.com/market/${slug}`
        : "https://polymarket.com";
    const key = question.toLowerCase().slice(0, 80);
    if (seen.has(key)) continue;
    seen.add(key);

    out.push({
      id: String(m.id ?? slug ?? question),
      question,
      implied: formatImplied(min),
      impliedValue: min,
      source: "Polymarket",
      href,
    });
  }

  return diverseLongshots(out, 8);
}

function formatImplied(p: number): string {
  const pct = p * 100;
  if (pct < 10) return `${pct.toFixed(1)}%`;
  return `${Math.round(pct)}%`;
}

function coercePrices(value: unknown): number[] {
  if (Array.isArray(value)) return value.map(Number).filter((n) => Number.isFinite(n));
  if (typeof value === "string") {
    try {
      return coercePrices(JSON.parse(value) as unknown);
    } catch {
      return [];
    }
  }
  return [];
}

function eventSlugOf(m: Record<string, unknown>): string {
  const events = m.events;
  if (Array.isArray(events) && events[0] && typeof events[0] === "object") {
    const slug = String((events[0] as Record<string, unknown>).slug ?? "").trim();
    if (slug) return slug;
  }
  return "";
}
