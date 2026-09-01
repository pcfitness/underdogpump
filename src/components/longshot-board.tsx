import { useCallback } from "react";
import { MarketBoard } from "@/components/market-board";
import { FALLBACK_CLASHPICKS, FALLBACK_LONGSHOTS } from "@/lib/content";
import { getLongshots } from "@/lib/polymarket";
import { getClashPicks } from "@/lib/clashpicks";

export function LongshotBoard() {
  const loadClash = useCallback(() => getClashPicks(), []);
  const loadPoly = useCallback(() => getLongshots(), []);

  return (
    <div>
      <MarketBoard
        kicker="ClashPicks live"
        title="Long shots on ClashPicks"
        liveLabel="Live · ClashPicks"
        pausedLabel="Feed paused · open ClashPicks"
        footnote="Public implied probabilities from ClashPicks, not financial advice. Each row opens the pick."
        fallback={FALLBACK_CLASHPICKS}
        load={loadClash}
      />
      <MarketBoard
        kicker="Polymarket live"
        title="Long shots on Polymarket"
        liveLabel="Live · Polymarket"
        pausedLabel="Feed paused · open Polymarket"
        footnote="Public implied probabilities from Polymarket, not financial advice. Each row opens the market."
        fallback={FALLBACK_LONGSHOTS}
        load={loadPoly}
      />
    </div>
  );
}
