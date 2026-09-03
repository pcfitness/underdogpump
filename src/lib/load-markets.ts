import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  CLASSROOM_PICK,
  pickFeatured,
  type LiveBoard,
  type LivePick,
} from "./markets";
import { formatPercent } from "./odds";

const KALSHI_API = "https://external-api.kalshi.com/trade-api/v2";
const POLY_API = "https://gamma-api.polymarket.com/markets";

const SKIP =
  /temp in |°|close price be above|usd\/ounce|dewpoint|wind speed|precipitation|hourly|stolen bases|\d\+\s*(hits|home runs|strikeouts|rbis?)\b|rotten tomatoes|what will donald trump say|mention|by 2025/i;

const SKIP_SERIES =
  /MENTION|SPREAD|TOTAL|15M|HOURLY|HIGHNY|DEWPOINT|PRECIP|WEATHER|WIND|GOAL$|SCORE$|POPVOTE|ECMOV/i;

const HEADLINE_SERIES = [
  "KXSB",
  "KXNBA",
  "KXMLB",
  "KXNHL",
  "KXUCL",
  "KXUSOMENSINGLES",
  "KXF1RACE",
  "KXMLSGAME",
  "KXEPLGAME",
  "KXUFCFIGHT",
  "KXNBAMVP",
  "KXOSCARPIC",
  "KXPRESNOMD",
  "KXNCAAF",
];

const KALSHI_FALLBACK: LivePick[] = [
  {
    id: "ks-elon-mars",
    question: "Will Elon Musk visit Mars in his lifetime? — Before 2099",
    implied: "12%",
    impliedValue: 0.12,
    source: "Kalshi",
    href: "https://kalshi.com/markets/kxelonmars/kxelonmars-99",
  },
  {
    id: "ks-sb-baltimore",
    question: "2027 Pro Football Champion — Baltimore",
    implied: "7%",
    impliedValue: 0.07,
    source: "Kalshi",
    href: "https://kalshi.com/markets/kxsb/kxsb",
    favorite: "Buffalo",
  },
];

type Cache = { at: number; data: LiveBoard };
let cache: Cache | null = null;
const TTL = 90_000;

function num(v: unknown) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

function yesPrice(m: {
  last_price_dollars?: string;
  yes_bid_dollars?: string;
  yes_ask_dollars?: string;
}) {
  const last = num(m.last_price_dollars);
  const bid = num(m.yes_bid_dollars);
  const ask = num(m.yes_ask_dollars);
  if (last > 0) return last;
  if (bid && ask) return (bid + ask) / 2;
  return ask || bid || 0;
}

function kalshiHref(series: string, eventTicker: string) {
  const s = (series || eventTicker.split("-")[0] || eventTicker).toLowerCase();
  return `https://kalshi.com/markets/${s}/${eventTicker.toLowerCase()}`;
}

async function getJson(url: string) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, {
      headers: { accept: "application/json", "user-agent": "underdogpump/1.0" },
      signal: AbortSignal.timeout(12_000),
    });
    if (res.status === 429) {
      await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
      continue;
    }
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    return res.json();
  }
  throw new Error(`429 ${url}`);
}

type KalshiEvent = {
  event_ticker?: string;
  series_ticker?: string;
  title?: string;
  category?: string;
  markets?: Array<Record<string, unknown>>;
};

function toPick(
  m: Record<string, unknown>,
  series: string,
  eventTicker: string,
  eventTitle: string,
): LivePick | null {
  if (m.mve_collection_ticker) return null;
  const status = String(m.status || "active");
  if (status && status !== "active" && status !== "open") return null;
  const title = String(m.title || eventTitle || "");
  const sub = String(m.yes_sub_title || "");
  if (SKIP.test(title) || SKIP.test(sub) || /— Other$/i.test(sub)) return null;
  const px = yesPrice(m as never);
  if (px < 0.012 || px > 0.12) return null;
  const vol = num(m.volume_24h_fp);
  const oi = num(m.open_interest_fp);
  const volAll = num(m.volume_fp);
  if (vol < 5 && oi < 80 && volAll < 200) return null;
  const question =
    sub && eventTitle && !eventTitle.includes(sub)
      ? `${eventTitle} — ${sub}`
      : sub && title && !title.includes(sub)
        ? `${title} — ${sub}`
        : title;
  return {
    id: `ks-${String(m.ticker || eventTicker)}`,
    question,
    implied: formatPercent(px),
    impliedValue: px,
    source: "Kalshi",
    href: kalshiHref(series, eventTicker),
    volume: vol * 8 + oi + volAll * 0.02,
  };
}

function score(p: LivePick) {
  const vol = Math.log10(1 + (p.volume ?? 0));
  const px = p.impliedValue;
  const band = px < 0.02 ? 0.45 : px <= 0.09 ? 1.7 : 1;
  return vol * band;
}

function rank(picks: LivePick[]) {
  const byId = new Map<string, LivePick>();
  for (const p of picks) {
    const prev = byId.get(p.id);
    if (!prev || score(p) > score(prev)) byId.set(p.id, p);
  }
  const byEvent = new Map<string, LivePick>();
  for (const p of byId.values()) {
    const eventKey = p.question.split(" — ")[0] ?? p.question;
    const prev = byEvent.get(eventKey);
    if (!prev || score(p) > score(prev)) byEvent.set(eventKey, p);
  }
  return [...byEvent.values()]
    .sort((a, b) => score(b) - score(a))
    .slice(0, 6)
    .sort((a, b) => a.impliedValue - b.impliedValue);
}

async function fetchEventsPage(
  url: string,
): Promise<{ events: KalshiEvent[]; cursor?: string }> {
  const data = (await getJson(url)) as { events?: KalshiEvent[]; cursor?: string };
  return { events: data.events ?? [], cursor: data.cursor };
}

function collectFromEvents(events: KalshiEvent[]): LivePick[] {
  const collected: LivePick[] = [];
  for (const ev of events) {
    const eventTicker = String(ev.event_ticker || "");
    const series = String(ev.series_ticker || "");
    if (SKIP_SERIES.test(series)) continue;
    const eventTitle = String(ev.title || "");
    const markets = ev.markets ?? [];
    let best: LivePick | null = null;
    let favName = "";
    let favPx = -1;
    for (const m of markets) {
      const sub = String(m.yes_sub_title || "");
      const px = yesPrice(m as never);
      if (sub && px > favPx) {
        favPx = px;
        favName = sub;
      }
      const p = toPick(m, series, eventTicker, eventTitle);
      if (!p) continue;
      if (!best || score(p) > score(best)) best = p;
    }
    if (best) {
      if (favName && !best.question.includes(favName)) best = { ...best, favorite: favName };
      collected.push(best);
    }
  }
  return collected;
}

async function fetchKalshi(): Promise<LivePick[]> {
  const collected: LivePick[] = [];
  let cursor = "";
  for (let page = 0; page < 3; page++) {
    const url = `${KALSHI_API}/events?status=open&limit=200&with_nested_markets=true${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`;
    const data = await fetchEventsPage(url);
    collected.push(...collectFromEvents(data.events));
    if (!data.cursor || !data.events.length) break;
    cursor = data.cursor;
  }
  for (const ticker of HEADLINE_SERIES.slice(0, 6)) {
    try {
      const data = await fetchEventsPage(
        `${KALSHI_API}/events?status=open&limit=8&with_nested_markets=true&series_ticker=${encodeURIComponent(ticker)}`,
      );
      collected.push(...collectFromEvents(data.events));
    } catch {
      break;
    }
  }
  const ranked = rank(collected);
  if (ranked.length) return ranked;

  const page = (await getJson(
    `${KALSHI_API}/markets?status=open&limit=200&mve_filter=exclude`,
  )) as { markets?: Array<Record<string, unknown>> };
  const fromMarkets: LivePick[] = [];
  for (const m of page.markets ?? []) {
    const event = String(m.event_ticker || m.ticker || "");
    const p = toPick(m, event.split("-")[0] || event, event, String(m.title || ""));
    if (p) fromMarkets.push(p);
  }
  return rank(fromMarkets);
}

function parseJsonArr(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === "string") {
    try {
      const p = JSON.parse(v);
      return Array.isArray(p) ? p.map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
}

async function fetchPoly(): Promise<LivePick[]> {
  const data = (await getJson(
    `${POLY_API}?closed=false&limit=80&order=volume24hr&ascending=false`,
  )) as Array<Record<string, unknown>>;
  const out: LivePick[] = [];
  for (const m of data) {
    if (m.closed || m.archived) continue;
    const outcomes = parseJsonArr(m.outcomes);
    const prices = parseJsonArr(m.outcomePrices).map(Number);
    const events = m.events as Array<{ slug?: string }> | undefined;
    const slug = events?.[0]?.slug || String(m.slug || "");
    const href = slug ? `https://polymarket.com/event/${slug}` : undefined;
    const question = String(m.question || m.groupItemTitle || "Market");
    for (let i = 0; i < outcomes.length; i++) {
      const px = prices[i];
      if (!Number.isFinite(px) || px < 0.008 || px >= 0.12) continue;
      const label = outcomes[i];
      const q =
        outcomes.length > 2 || (label && label.toLowerCase() !== "yes")
          ? `${question} — ${label}`
          : question;
      out.push({
        id: `pm-${String(m.id || slug)}-${i}`,
        question: q,
        implied: formatPercent(px),
        impliedValue: px,
        source: "Polymarket",
        href,
        volume: num(m.volume24hr),
      });
    }
  }
  out.sort((a, b) => a.impliedValue - b.impliedValue);
  const seen = new Set<string>();
  const uniq: LivePick[] = [];
  for (const p of out) {
    const key = p.question.slice(0, 48);
    if (seen.has(key)) continue;
    seen.add(key);
    uniq.push(p);
    if (uniq.length >= 6) break;
  }
  return uniq;
}

async function loadLive(dogId: string | null): Promise<LiveBoard> {
  let kalshi: LivePick[] = [];
  let poly: LivePick[] = [];
  let kalshiLive = false;
  let polyLive = false;
  const settled = await Promise.allSettled([fetchKalshi(), fetchPoly()]);
  if (settled[0].status === "fulfilled" && settled[0].value.length) {
    kalshi = settled[0].value;
    kalshiLive = true;
  } else {
    kalshi = KALSHI_FALLBACK;
  }
  if (settled[1].status === "fulfilled" && settled[1].value.length) {
    poly = settled[1].value;
    polyLive = true;
  }
  const featured = pickFeatured(kalshi, dogId);
  return { kalshi, kalshiLive, poly, polyLive, featured };
}

export const loadMarkets = createServerFn({ method: "GET" })
  .validator(z.object({ dog: z.string().optional() }))
  .handler(async ({ data }) => {
    const dog = data.dog ?? null;
    if (cache && Date.now() - cache.at < TTL) {
      if (!dog) return cache.data;
      return { ...cache.data, featured: pickFeatured(cache.data.kalshi, dog) };
    }
    try {
      const board = await loadLive(dog);
      cache = { at: Date.now(), data: board };
      return board;
    } catch {
      return {
        kalshi: KALSHI_FALLBACK,
        kalshiLive: false,
        poly: [],
        polyLive: false,
        featured: pickFeatured(KALSHI_FALLBACK, dog),
      } satisfies LiveBoard;
    }
  });
