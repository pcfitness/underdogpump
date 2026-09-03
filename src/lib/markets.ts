export type MarketSource = "Kalshi" | "Polymarket" | "Classroom";

export type LivePick = {
  id: string;
  question: string;
  implied: string;
  impliedValue: number;
  source: MarketSource;
  href?: string;
  favorite?: string;
  volume?: number;
};

export type LiveBoard = {
  kalshi: LivePick[];
  kalshiLive: boolean;
  poly: LivePick[];
  polyLive: boolean;
  featured: LivePick;
};

export const CLASSROOM_PICK: LivePick = {
  id: "classroom-ufc",
  question: "UFC main event — the underdog",
  implied: "8.3%",
  impliedValue: 1 / 12,
  source: "Classroom",
};

export function isFight(q: string) {
  return /\bufc\b|\bmma\b|fight night|octagon|bellator|\bpfl\b/i.test(q);
}

export function isOpen(q: string) {
  return /us open|u\.s\. open/i.test(q);
}

export function longShotsOf(picks: LivePick[]) {
  return [...picks]
    .filter((p) => {
      const t = p.impliedValue ?? 0;
      return t >= 0.01 && t < 0.5 && !/— Other$/i.test(p.question);
    })
    .sort((a, b) => a.impliedValue - b.impliedValue);
}

export function pickFeatured(picks: LivePick[], dogId: string | null = null): LivePick {
  if (dogId === CLASSROOM_PICK.id) return CLASSROOM_PICK;
  if (dogId) {
    const hit = picks.find((p) => p.id === dogId);
    if (hit) return hit;
  }
  const pool = picks.filter((p) => p.source === "Kalshi");
  const src = pool.length ? pool : picks;
  const fight = longShotsOf(src.filter((p) => isFight(p.question)));
  if (fight[0]) return fight[0];
  const open = longShotsOf(src.filter((p) => isOpen(p.question)));
  if (open[0]) return open[0];
  const vs = longShotsOf(src.filter((p) => /\bvs\.?\b/i.test(p.question)));
  if (vs[0]) return vs[0];
  return longShotsOf(src)[0] ?? CLASSROOM_PICK;
}

export function ticketShareText(url: string, pick?: LivePick) {
  const q = pick?.question;
  const line = q ? q : "UFC · the underdog";
  return [
    "$UNDERDOG · Dog of the moment",
    line,
    "The favorite is expected to win. The underdog is expected to lose.",
    "Same $5 wager. If the underdog wins, you win more money.",
    "That’s what an underdog is: the side expected to lose, with a bigger potential reward if they win.",
    url,
  ].join("\n");
}
