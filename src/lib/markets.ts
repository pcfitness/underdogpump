import { payoutFromImplied } from "./odds";

export type MarketRow = {
  id: string;
  question: string;
  implied: string;
  impliedValue: number;
  source: "ClashPicks" | "Polymarket";
  href?: string;
};

export const POLY_FALLBACK: MarketRow[] = [
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

export const CLASH_FALLBACK: MarketRow[] = [
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
    question:
      "Whale Watch: Will any bid >700K $CLASH occur by end of August? — Yes",
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
];

export function splitQuestion(question: string) {
  const i = question.indexOf(" — ");
  if (i < 0) return { event: question, pick: "Long shot" };
  return { event: question.slice(0, i), pick: question.slice(i + 3) };
}

export function pickDog(rows: MarketRow[], id?: string | null) {
  if (id) {
    const match = rows.find((row) => row.id === id);
    if (match) return match;
  }
  const clash = rows.filter((row) => row.source === "ClashPicks");
  const pool = clash.length ? clash : rows;
  const ranged = pool.filter((row) => {
    const v = row.impliedValue ?? 0;
    return v >= 0.04 && v <= 0.18 && !/— Other$/i.test(row.question);
  });
  const ranked = [...(ranged.length ? ranged : pool)].sort(
    (a, b) => (a.impliedValue ?? 1) - (b.impliedValue ?? 1),
  );
  return ranked[0] ?? null;
}

export function shareTicket(row: MarketRow, url: string) {
  const n = payoutFromImplied(row.impliedValue ?? 0);
  return [
    `$UNDERDOG · Dog of the moment`,
    row.question,
    `${row.source} pays $${n} for every $1 if this hits.`,
    `Things priced like this hit about 1 time in ${n}. That's why it pays — it usually loses.`,
    url,
  ].join("\n");
}

export function formatImplied(value: number) {
  const pct = value * 100;
  if (pct < 10) return `${pct.toFixed(1)}%`;
  return `${Math.round(pct * 10) / 10}%`.replace(/\.0%/, "%");
}
