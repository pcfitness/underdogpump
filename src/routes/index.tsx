import { createFileRoute } from "@tanstack/react-router";
import { useCallback } from "react";
import { Hero } from "@/components/hero";
import { HowToBuy } from "@/components/how-to-buy";
import { MarketBoard } from "@/components/market-board";
import { SiteChrome } from "@/components/site-chrome";
import { DogTicket } from "@/components/ticket";
import { OddsTranslator } from "@/components/translator";
import { CLASHPICKS_EXAMPLES, POLYMARKET_EXAMPLES, type Market } from "@/lib/markets";
import { loadClashPicks, loadPolymarket } from "@/lib/load-markets";

async function safeLoad(load: () => Promise<Market[]>, fallback: Market[]) {
  try {
    const rows = await load();
    return Array.isArray(rows) && rows.length >= 3 ? rows : fallback;
  } catch {
    return fallback;
  }
}

export const Route = createFileRoute("/")({
  loader: async () => {
    const [clash, poly] = await Promise.all([
      safeLoad(() => loadClashPicks(), CLASHPICKS_EXAMPLES),
      safeLoad(() => loadPolymarket(), POLYMARKET_EXAMPLES),
    ]);
    return {
      clash,
      poly,
      clashLive: clash.length >= 3,
      polyLive: poly.length >= 3,
    };
  },
  component: Home,
  head: () => ({
    meta: [{ title: "$UNDERDOG · Bet on the Dog" }],
  }),
});

function LiveBoards() {
  const data = Route.useLoaderData();
  const loadClash = useCallback(() => loadClashPicks(), []);
  const loadPoly = useCallback(() => loadPolymarket(), []);
  return (
    <div>
      <MarketBoard
        kicker="ClashPicks live"
        title="Long shots on ClashPicks"
        liveLabel="Live · ClashPicks"
        pausedLabel="Feed paused · open ClashPicks"
        footnote="Public implied probabilities from ClashPicks, not financial advice. Each row opens the pick."
        fallback={CLASHPICKS_EXAMPLES}
        initial={data.clash}
        initialLive={data.clashLive}
        load={loadClash}
      />
      <MarketBoard
        kicker="Polymarket live"
        title="Long shots on Polymarket"
        liveLabel="Live · Polymarket"
        pausedLabel="Feed paused · open Polymarket"
        footnote="Public implied probabilities from Polymarket, not financial advice. Each row opens the market."
        fallback={POLYMARKET_EXAMPLES}
        initial={data.poly}
        initialLive={data.polyLive}
        load={loadPoly}
      />
    </div>
  );
}

function Home() {
  return (
    <SiteChrome>
      <main>
        <Hero />
        <DogTicket />
        <OddsTranslator />
        <LiveBoards />
        <HowToBuy />
      </main>
    </SiteChrome>
  );
}
