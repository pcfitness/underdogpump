export const SITE = {
  ticker: "$UNDERDOG",
  name: "Underdog",
  tagline: "Bet on the Dog",
  title: "$UNDERDOG · Bet on the Dog",
  description:
    "OzGaming long-term project for prediction markets, long shots, and underdogs. Live on Pump.fun.",
  url: "https://www.underdogpump.xyz",
  domain: "underdogpump.xyz",
  builder: "OzGaming.net",
  builderUrl: "https://ozgaming.net",
  ozUrl: "https://ozgaming.net",
  pumpUrl: "https://pump.fun",
  status: "Launched · Sep 4, 2026",
  platform: "Pump.fun",
  platformUrl: "https://pump.fun",
  contract: "6sPM9rtfbwsNv3mmRFcasr74ACYmVNBV8LMfV5ztpump",
  mindsetTitle: "On the record",
  mindset:
    "The name on this project is public, and OzGaming.net has been online since 2008. $UNDERDOG is meant to remain live and keep improving after launch. Come back for new lessons, live odds, and a contract that only lives on this page.",
  mission:
    "This project was built to help beginners understand odds and prediction markets across Polymarket, Kalshi, DraftKings and FanDuel.",
} as const;

export function pumpLink() {
  const ca = SITE.contract.trim();
  return ca ? `https://pump.fun/coin/${ca}` : SITE.platformUrl;
}

export const DISCLAIMER =
  "$UNDERDOG is for education and entertainment only. Nothing on this site is betting or financial advice, a recommendation, or a promise of profit. You can lose money. 18+ only. Live odds, when shown, are from public sources. $UNDERDOG is not affiliated with Polymarket, Kalshi, DraftKings, FanDuel. Do your own research.";
