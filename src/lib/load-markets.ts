import { createServerFn } from "@tanstack/react-start";
import {
  CLASHPICKS_EXAMPLES,
  marketsFromGamma,
  type Market,
} from "./markets";
import { formatPercent } from "./odds";

type ClashEvent = {
  id?: number | string;
  title?: string;
  slug?: string;
  category?: string;
  active?: boolean;
  closed?: boolean;
  markets?: Array<{ title?: string; yesPercentage?: number }>;
};

function toImplied(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n > 1 ? n / 100 : n;
}

function marketsFromClash(events: ClashEvent[]): Market[] {
  const rows: Market[] = [];
  const seen = new Set<string>();
  for (const event of events) {
    if (event.closed || event.active === false) continue;
    const title = event.title?.trim();
    if (!title) continue;
    for (const market of event.markets ?? []) {
      const implied = toImplied(market.yesPercentage);
      const pick = market.title?.trim() ?? "";
      if (implied == null || !pick || /other$/i.test(pick)) continue;
      if (implied < 0.01 || implied >= 0.5) continue;
      const question = pick && pick !== title ? `${title} — ${pick}` : title;
      const key = question.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      const slug = event.slug;
      rows.push({
        id: `cp-${event.id ?? slug ?? rows.length}-${pick}`,
        question,
        implied: formatPercent(implied),
        impliedValue: implied,
        source: "ClashPicks",
        href: slug ? `https://www.clashpicks.com/event/${slug}` : undefined,
      });
    }
  }
  return rows.sort((a, b) => a.impliedValue - b.impliedValue);
}

async function fetchClashEvents(): Promise<ClashEvent[]> {
  const input = JSON.stringify({
    "0": {
      json: {
        status: "active",
        sortBy: "hot",
        bookmarks: false,
        boosted: false,
        clashBack: false,
        limit: 40,
      },
    },
  });
  const url = `https://www.clashpicks.com/api/trpc/events.getAll?batch=1&input=${encodeURIComponent(input)}`;
  const res = await fetch(url, {
    headers: { accept: "application/json", "user-agent": "underdogpump.xyz" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return [];
  const payload = (await res.json()) as Array<{
    result?: { data?: { json?: { events?: ClashEvent[] } } };
  }>;
  return payload[0]?.result?.data?.json?.events ?? [];
}

export const loadClashPicks = createServerFn({ method: "GET" }).handler(
  async (): Promise<Market[]> => {
    try {
      const rows = marketsFromClash(await fetchClashEvents());
      const unique: Market[] = [];
      const events = new Set<string>();
      for (const row of rows) {
        const event = row.question.split(" — ")[0] ?? row.question;
        if (events.has(event)) continue;
        events.add(event);
        unique.push(row);
        if (unique.length >= 8) break;
      }
      return unique.length >= 3 ? unique : CLASHPICKS_EXAMPLES;
    } catch {
      return CLASHPICKS_EXAMPLES;
    }
  },
);

export const loadPolymarket = createServerFn({ method: "GET" }).handler(
  async (): Promise<Market[]> => {
    try {
      const res = await fetch(
        "https://gamma-api.polymarket.com/markets?closed=false&limit=80&order=volume24hr&ascending=false",
        { headers: { Accept: "application/json" } },
      );
      if (!res.ok) return [];
      const data: unknown = await res.json();
      return marketsFromGamma(data);
    } catch {
      return [];
    }
  },
);
