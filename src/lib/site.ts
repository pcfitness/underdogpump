export const SITE = {
  ticker: "$UNDERDOG",
  name: "Underdog",
  tagline: "Bet on the Dog",
  title: "$UNDERDOG · Bet on the Dog",
  description:
    "OzGaming long-term project for prediction markets, long shots, and underdogs. Pre-launch on Pump.fun.",
  url: "https://www.underdogpump.xyz",
  domain: "underdogpump.xyz",
  builder: "OzGaming.net",
  builderUrl: "https://ozgaming.net",
  ozUrl: "https://ozgaming.net",
  pumpUrl: "https://pump.fun",
  status: "Pre-launch",
  platform: "Pump.fun",
  platformUrl: "https://pump.fun",
  contract: "",
  mindsetTitle: "Built to stay",
  mindset:
    "I put my name and a long public track record on what I build. $UNDERDOG is meant to stay up, stay updated, and have a real person behind it long after launch.",
  mission:
    "This project was built to help beginners understand odds and prediction markets across ClashPicks, Polymarket, Kalshi, DraftKings and FanDuel.",
} as const;

export function pumpLink() {
  const ca = SITE.contract.trim();
  return ca ? `https://pump.fun/coin/${ca}` : SITE.platformUrl;
}

export const DISCLAIMER =
  "$UNDERDOG is for education and entertainment only. Nothing on this site is betting or financial advice, a recommendation, or a promise of profit. You can lose money. 18+ only. Live odds, when shown, are from public sources. $UNDERDOG is not affiliated with Polymarket, Kalshi, DraftKings, FanDuel, or ClashPicks. Do your own research.";
