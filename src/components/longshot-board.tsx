import { useCallback } from "react";
import { MarketBoard } from "@/components/market-board";
import { FALLBACK_CLASHPICKS, FALLBACK_LONGSHOTS, SOURCES } from "@/lib/content";
import { getLongshots } from "@/lib/polymarket";
import { getClashPicks } from "@/lib/clashpicks";

export function LongshotBoard() {
  const loadClash = useCallback(() => getClashPicks(), []);
  const loadPoly = useCallback(() => getLongshots(), []);

  const sourceLine = (
    <>
      Other desks we study:
      {SOURCES.map((s, i) => (
        <span key={s.name}>
          {i === 0 ? " " : i === SOURCES.length - 1 ? " and " : ", "}
          <a
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className="text-muted underline-offset-2 hover:text-fg hover:underline"
          >
            {s.name}
          </a>
        </span>
      ))}
      . $UNDERDOG is not affiliated with any of them.
    </>
  );

  return (
    <div>
      <MarketBoard
        kicker="ClashPicks live"
        title="Long shots on ClashPicks"
        liveLabel="Live · ClashPicks"
        pausedLabel="Feed paused · open ClashPicks"
        footnote={
          <>
            Public market information from ClashPicks. $UNDERDOG is not affiliated with ClashPicks,
            Clash, or Cryptos R Us. Built by a $CLASH holder. Each row opens the pick. {sourceLine}
          </>
        }
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
