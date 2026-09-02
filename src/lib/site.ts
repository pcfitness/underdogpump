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
    "As a webmaster, I build projects with longevity in mind. I put my name, my work, and decades of online history behind what I create. $UNDERDOG is for people who prefer to buy, hold, check back later, and know there’s a real person with a long online history standing behind the project.",
  mission:
    "This project was built to help beginners understand odds and prediction markets across ClashPicks, Polymarket, Kalshi, DraftKings and FanDuel.",
} as const;

export function pumpUrl() {
  const ca = SITE.contract.trim();
  return ca ? `https://pump.fun/coin/${ca}` : SITE.platformUrl;
}

export type Lesson = {
  id: string;
  n: number;
  label: string;
  kicker: string;
  title: string;
  body: string;
  top: string;
};

export const LESSONS: Lesson[] = [
  {
    id: "implied",
    n: 1,
    label: "Implied odds",
    kicker: "Price is a probability",
    title: "Every price is a percent",
    body: "A price shows the sportsbook’s estimated chance. If it works out to 1 in 4, that side is priced at 25%. You can disagree. If you think it wins more often, the bet may have value. If you just like the story, you are donating.",
    top: "28%",
  },
  {
    id: "longshot",
    n: 2,
    label: "Long shots",
    kicker: "Big number, thin ice",
    title: "A big payout is not free money",
    body: "A long shot pays a lot because it is expected to lose more often. That is the trade. A huge payout does not make it a good bet. Bet small. Be patient. If you need that ticket to hit tonight, it is the wrong ticket.",
    top: "38%",
  },
  {
    id: "vig",
    n: 3,
    label: "The vig",
    kicker: "The cut you never see",
    title: "The house takes a cut",
    body: "Sportsbooks are not charities. Their edge is built into the odds. That means the prices are tilted slightly in their favor. Convert the odds back into a simple chance, then decide if the bet still looks good after the house gets its cut.",
    top: "48%",
  },
  {
    id: "value",
    n: 4,
    label: "Underdog value",
    kicker: "When the crowd is loud",
    title: "When the underdog is a smart bet",
    body: "An underdog is only interesting if you think it wins more often than the price says. Favorites can get overbet because they feel safer. Long shots can get overbet because they feel exciting. The gap between those feelings is where a price can be wrong.",
    top: "58%",
  },
  {
    id: "bankroll",
    n: 5,
    label: "Bankroll",
    kicker: "Stay in the game",
    title: "Never bet the rent",
    body: "Only bet money you can lose and still sleep. Use a small piece of a separate pile, not the bills. If one loss would change your week, the bet is too big — even if you love the pick. Good bets still lose, so protect the bankroll first.",
    top: "68%",
  },
  {
    id: "dyor",
    n: 6,
    label: "DYOR",
    kicker: "Entertainment, not advice",
    title: "This is a classroom, not a tip sheet",
    body: "$UNDERDOG is for education and entertainment. Nothing here is financial advice, a guaranteed pick, or a promise of profit. Betting involves risk, and you can lose the entire stake. Odds and outcomes can change. Do your own research.",
    top: "78%",
  },
];

export const CLASSROOM = [
  {
    n: "01",
    label: "Minus money",
    title: "What the minus number means.",
    body: "Minus money is the − minus sign next to a name or team, like −150. That's the favorite. At −150, you bet/risk $150 to win/make $100 profit. Since favorites are expected to win, they cost more to bet and pay less when they win.",
  },
  {
    n: "02",
    label: "Plus money",
    title: "What the plus number means.",
    body: "Plus money is the + plus sign next to a name or team, like +150. That is the underdog. At +150, you bet/risk $100 to win/make $150 profit. Underdogs are expected to lose, so they cost less to bet and pay more when they win.",
  },
  {
    n: "03",
    label: "The moneyline",
    title: "One fight. You pick who wins.",
    body: "The moneyline is a bet on who wins. No score or point spread to figure out. The minus number is the favorite and pays less. The plus number is the underdog and pays more. You simply choose who you think will win.",
  },
];
