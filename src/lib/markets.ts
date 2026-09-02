import { formatPercent, payoutFromImplied } from "./odds";

export type Market = {
  id: string;
  question: string;
  implied: string;
  impliedValue: number;
  source: string;
  href?: string;
};

export const POLYMARKET_EXAMPLES: Market[] = [
  {
    id: "ex-1",
    question: "Will Bitcoin dip to $75,000 in August?",
    implied: "1.4%",
    impliedValue: 0.014,
    source: "Polymarket",
    href: "https://polymarket.com/event/what-price-will-bitcoin-hit-in-august-2026",
  },
  {
    id: "ex-2",
    question: "Will the U.S. invade Iran before 2027?",
    implied: "16%",
    impliedValue: 0.16,
    source: "Polymarket",
    href: "https://polymarket.com/event/will-the-us-invade-iran-before-2027",
  },
  {
    id: "ex-3",
    question: "Will Wes Moore win the 2028 US Presidential Election?",
    implied: "0.9%",
    impliedValue: 0.009,
    source: "Polymarket",
    href: "https://polymarket.com/event/presidential-election-winner-2028",
  },
  {
    id: "ex-4",
    question: "Fed rate hike in 2026?",
    implied: "26%",
    impliedValue: 0.26,
    source: "Polymarket",
    href: "https://polymarket.com/event/fed-rate-hike-in-2026",
  },
];

export const CLASHPICKS_EXAMPLES: Market[] = [
  {
    id: "cp-1",
    question: "U.S. Tornado Count - August 2026 — 76–100 Tornadoes",
    implied: "6.7%",
    impliedValue: 0.067,
    source: "ClashPicks",
    href: "https://www.clashpicks.com/event/us-tornado-count-august-2026-pclash",
  },
  {
    id: "cp-2",
    question: "Whale Watch: Will any bid >700K $CLASH occur by end of August? — Yes",
    implied: "8%",
    impliedValue: 0.08,
    source: "ClashPicks",
    href: "https://www.clashpicks.com/event/whale-watch-will-any-bid-700k-clash-occur-by-end-of-august-pclash",
  },
  {
    id: "cp-3",
    question: "EPL: Arsenal vs Aston Villa — Tie",
    implied: "9.2%",
    impliedValue: 0.092,
    source: "ClashPicks",
    href: "https://www.clashpicks.com/event/epl-arsenal-vs-aston-villa-pclash",
  },
  {
    id: "cp-4",
    question: "What Will Be $CLASH’s Highest Price in 2026? — $0.060 – $0.074",
    implied: "4.2%",
    impliedValue: 0.042,
    source: "ClashPicks",
    href: "https://www.clashpicks.com/event/what-will-be-clashs-highest-price-in-2026-pclash",
  },
  {
    id: "cp-5",
    question: "EPL: Liverpool vs Ipswich Town — Ipswich Town Win",
    implied: "2.4%",
    impliedValue: 0.024,
    source: "ClashPicks",
    href: "https://www.clashpicks.com/event/epl-liverpool-vs-ipswich-town-pclash",
  },
  {
    id: "cp-6",
    question: "F1: Italian GP Winner — Charles Leclerc",
    implied: "9.3%",
    impliedValue: 0.093,
    source: "ClashPicks",
    href: "https://www.clashpicks.com/event/f1-italian-gp-winner-pclash",
  },
  {
    id: "cp-7",
    question: "Who Will Be the Next James Bond? — Jacob Elordi",
    implied: "1.3%",
    impliedValue: 0.013,
    source: "ClashPicks",
    href: "https://www.clashpicks.com/event/who-will-be-the-next-james-bond",
  },
  {
    id: "cp-8",
    question: "When Will Anthropic Launch Its IPO? — Q3 2026",
    implied: "7.6%",
    impliedValue: 0.076,
    source: "ClashPicks",
    href: "https://www.clashpicks.com/event/when-will-anthropic-launch-its-ipo",
  },
];

export function splitQuestion(question: string) {
  const at = question.indexOf(" — ");
  if (at < 0) return { event: question, pick: "Long shot" };
  return { event: question.slice(0, at), pick: question.slice(at + 3) };
}

export function pickDog(list: Market[], id: string | null) {
  if (id) {
    const found = list.find((item) => item.id === id);
    if (found) return found;
  }
  const clash = list.filter((item) => item.source === "ClashPicks");
  const pool = clash.length ? clash : list;
  const valued = pool.filter((item) => {
    const implied = item.impliedValue ?? 0;
    return implied >= 0.04 && implied <= 0.18 && !/— Other$/i.test(item.question);
  });
  const ranked = [...(valued.length ? valued : pool)].sort(
    (a, b) => (a.impliedValue ?? 1) - (b.impliedValue ?? 1),
  );
  return ranked[0] ?? null;
}

export function shareTicketText(market: Market, url: string) {
  const payout = payoutFromImplied(market.impliedValue ?? 0);
  return [
    "$UNDERDOG · Dog of the moment",
    market.question,
    `${market.source} pays $${payout} for every $1 if this hits.`,
    `Things priced like this hit about 1 time in ${payout}. That's why it pays — it usually loses.`,
    url,
  ].join("\n");
}

export function clockLabel(date: Date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

type GammaMarket = {
  id?: string;
  question?: string;
  slug?: string;
  closed?: boolean;
  outcomePrices?: string | string[];
  outcomes?: string | string[];
  groupItemTitle?: string;
  events?: Array<{ slug?: string; title?: string }>;
};

function parseJsonList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      return [];
    }
  }
  return [];
}

export function marketsFromGamma(raw: unknown): Market[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: Market[] = [];
  for (const item of raw as GammaMarket[]) {
    if (!item || item.closed) continue;
    const prices = parseJsonList(item.outcomePrices).map(Number);
    const outcomes = parseJsonList(item.outcomes);
    let best = Infinity;
    let pick = "";
    prices.forEach((price, index) => {
      if (Number.isFinite(price) && price > 0 && price < best) {
        best = price;
        pick = outcomes[index] ?? "";
      }
    });
    if (!(best >= 0.008 && best <= 0.12)) continue;
    const question = item.question?.trim();
    if (!question) continue;
    const label = pick && pick.toLowerCase() !== "yes" ? `${question} — ${pick}` : question;
    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const eventSlug = item.events?.[0]?.slug || item.slug;
    out.push({
      id: `pm-${item.id ?? out.length}`,
      question: label,
      implied: formatPercent(best),
      impliedValue: best,
      source: "Polymarket",
      href: eventSlug ? `https://polymarket.com/event/${eventSlug}` : undefined,
    });
  }
  return out.sort((a, b) => a.impliedValue - b.impliedValue).slice(0, 8);
}
