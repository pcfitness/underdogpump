export const PROJECT = {
  ticker: "$UNDERDOG",
  name: "Underdog",
  tagline: "Bet on the Dog",
  domain: "underdogpump.xyz",
  builder: "OzGaming.net",
  builderUrl: "https://ozgaming.net",
  status: "Pre-launch",
  platform: "Pump.fun",
  platformUrl: "https://pump.fun",
  contract: "",
  mindset:
    "Learn the mechanics. Understand the risk. Make informed decisions. The greatest opportunities often exist when the odds are against you.",
  mission:
    "This project was built to educate those new at navigating prediction markets. ClashPicks, Polymarket, Kalshi, DraftKings, FanDuel, as well as the crypto and futures trading markets.",
};

export const SOURCES = [
  { name: "ClashPicks", href: "https://www.clashpicks.com" },
  { name: "Polymarket", href: "https://polymarket.com" },
  { name: "Kalshi", href: "https://kalshi.com" },
  { name: "DraftKings", href: "https://www.draftkings.com" },
  { name: "FanDuel", href: "https://www.fanduel.com" },
];

export type Hotspot = {
  id: string;
  n: number;
  label: string;
  kicker: string;
  title: string;
  body: string;
  top: string;
};

export const HOTSPOTS: Hotspot[] = [
  {
    id: "implied",
    n: 1,
    label: "Implied odds",
    kicker: "Price is a probability",
    title: "Every price is a percent",
    body: "Decimal 4.00 means the market is pricing a 25% chance (1 ÷ 4). American +300 is the same math. If you think it hits more often than that, you found an underdog with value. If you just like the story, you found a donation.",
    top: "28%",
  },
  {
    id: "longshot",
    n: 2,
    label: "Long shots",
    kicker: "Big number, thin ice",
    title: "A 12x is not free money",
    body: "Long shots pay because they usually lose. A 12.00 price implies about an 8% chance before fees. You need that event to be more likely than the market says — not merely exciting. Underdogs are a study in patience, not a lottery ticket.",
    top: "38%",
  },
  {
    id: "vig",
    n: 3,
    label: "The vig",
    kicker: "The cut you never see",
    title: "Books and pools take a slice",
    body: "Sportsbooks build juice into both sides so the implied probabilities add up to more than 100%. Prediction pools take a fee or spread. Always convert the posted price back to a percent, then ask what you are paying for the privilege of being wrong.",
    top: "48%",
  },
  {
    id: "value",
    n: 4,
    label: "Underdog value",
    kicker: "When the crowd is loud",
    title: "Value is a disagreement",
    body: "An underdog is only a bet when your number is higher than the market’s. Favorites get overbet because they feel safe. Long shots get overbet because they feel cinematic. The edge, when it exists, is in the boring gap between those two feelings.",
    top: "58%",
  },
  {
    id: "bankroll",
    n: 5,
    label: "Bankroll",
    kicker: "Stay in the game",
    title: "Never bet the bag",
    body: "Size so a losing streak is survivable. One or two percent of a dedicated bankroll per opinion is a starting point, not a promise. If a loss would change how you sleep, the size is wrong — even if the price is right.",
    top: "68%",
  },
  {
    id: "dyor",
    n: 6,
    label: "DYOR",
    kicker: "Entertainment, not advice",
    title: "This is a classroom, not a tip sheet",
    body: "$UNDERDOG is an educational and entertainment project. Nothing here is financial advice or a promise of value or return. Markets can go to zero. You can lose the whole stake. 18+ only. Do your own work.",
    top: "78%",
  },
];

export type Longshot = {
  id: string;
  question: string;
  implied: string;
  impliedValue?: number;
  source: string;
  href?: string;
};

export const FALLBACK_LONGSHOTS: Longshot[] = [
  {
    id: "ex-1",
    question: "Will Bitcoin dip to $75,000 in August?",
    implied: "1.4%",
    source: "Polymarket",
    href: "https://polymarket.com/event/what-price-will-bitcoin-hit-in-august-2026",
  },
  {
    id: "ex-2",
    question: "Will the U.S. invade Iran before 2027?",
    implied: "16%",
    source: "Polymarket",
    href: "https://polymarket.com/event/will-the-us-invade-iran-before-2027",
  },
  {
    id: "ex-3",
    question: "Will Wes Moore win the 2028 US Presidential Election?",
    implied: "0.9%",
    source: "Polymarket",
    href: "https://polymarket.com/event/presidential-election-winner-2028",
  },
  {
    id: "ex-4",
    question: "Fed rate hike in 2026?",
    implied: "26%",
    source: "Polymarket",
    href: "https://polymarket.com/event/fed-rate-hike-in-2026",
  },
];

export const FALLBACK_CLASHPICKS: Longshot[] = [
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
];
