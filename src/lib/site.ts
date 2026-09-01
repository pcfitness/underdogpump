export const SITE = {
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
  mindsetTitle: "Built to stay",
  mindset:
    "As a webmaster, I build projects with longevity in mind. I put my name, my work, and decades of online history behind what I create. $UNDERDOG is for people who prefer to buy, hold, check back later, and trust that their investment is in good hands.",
  mission:
    "This project was built to educate those new at navigating prediction markets. ClashPicks, Polymarket, Kalshi, DraftKings, FanDuel, as well as the crypto and futures trading markets.",
} as const;

export function buyUrl() {
  const ca = SITE.contract.trim();
  return ca ? `https://pump.fun/coin/${ca}` : SITE.platformUrl;
}

export const PUMP_LAUNCH = {
  name: "Underdog",
  symbol: "UNDERDOG",
  website: "https://www.underdogpump.xyz",
  avatarFile: "pump-avatar.jpg",
  avatarSpec: "1200×1200 · 1:1 square · JPG · ~470 KB",
  description:
    "Bet on the Dog. Long shots pay because they usually lose. $UNDERDOG is an OzGaming.net classroom for prediction markets — ClashPicks, Polymarket, Kalshi, DraftKings, FanDuel — sized like a 12-to-1. Learn the price as a percent before you ape. DYOR. 18+. underdogpump.xyz",
};

export const LESSONS = [
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
] as const;
