import { formatAmerican, fromImplied } from "@/lib/odds";
import type { OptimizerAnalysis, OptimizerEvent, Reason } from "./types";

function impliedFromAmerican(american: number | null): number | null {
  if (american === null || american === 0) return null;
  return american > 0 ? 100 / (american + 100) : -american / (-american + 100);
}

function noVigPair(fav: number | null, dog: number | null) {
  if (fav === null || dog === null) return { fav: null, dog: null, vig: null };
  const sum = fav + dog;
  if (sum <= 0) return { fav: null, dog: null, vig: null };
  return {
    fav: fav / sum,
    dog: dog / sum,
    vig: Math.max(0, sum - 1),
  };
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function analyzeEvent(event: OptimizerEvent): OptimizerAnalysis {
  const favImp = impliedFromAmerican(event.favorite.americanOdds);
  const dogImp = impliedFromAmerican(event.underdog.americanOdds);
  const fair = noVigPair(favImp, dogImp);

  const missing: string[] = [];
  if (event.favorite.americanOdds === null || event.underdog.americanOdds === null) {
    missing.push("Live bookmaker odds");
  }
  if (!event.favorite.record) missing.push(`${event.favorite.name} record`);
  if (!event.underdog.record) missing.push(`${event.underdog.name} record`);
  if (!event.favorite.stance && !event.underdog.stance) missing.push("Stance data");
  if (event.favorite.reachInches === null && event.underdog.reachInches === null) {
    missing.push("Reach measurements");
  }
  if (event.dataStatus !== "live") missing.push("Confirmed live market feed");

  const reasonsFor: Reason[] = [];
  const reasonsAgainst: Reason[] = [];
  const riskFactors: Reason[] = [];

  let score = 40;

  if (dogImp !== null) {
    const payout = event.underdog.americanOdds ?? 0;
    if (dogImp >= 0.28 && dogImp <= 0.48) {
      score += 16;
      reasonsFor.push({
        kind: "for",
        basedOn: "odds",
        text: "This is a live underdog, not a lottery ticket. The market still gives the dog a real chance.",
      });
    } else if (dogImp < 0.16) {
      score -= 14;
      reasonsAgainst.push({
        kind: "against",
        basedOn: "odds",
        text: "The price is a deep long shot. Big payout, thin ice. That is entertainment more than value unless you have a strong independent read.",
      });
    }

    if (payout >= 150 && payout <= 260) {
      score += 10;
      reasonsFor.push({
        kind: "for",
        basedOn: "odds",
        text: `Plus-money payout of ${formatAmerican(payout)} pays enough to matter if the dog is only a little worse than the favorite.`,
      });
    }
  }

  if (fair.dog !== null && dogImp !== null) {
    const gap = fair.dog - dogImp;
    if (gap >= 0.03) {
      score += 8;
      reasonsFor.push({
        kind: "for",
        basedOn: "structure",
        text: "After stripping the vig, the underdog's share of the two-way price looks a bit better than the raw ticket implies.",
      });
    }
    if (fair.vig !== null && fair.vig >= 0.05) {
      score += 4;
      reasonsAgainst.push({
        kind: "against",
        basedOn: "structure",
        text: "The two-way market is juiced. Part of what you pay is the house cut, not a true chance.",
      });
    }
  }

  if (event.underdog.stance && event.favorite.stance && event.underdog.stance !== event.favorite.stance) {
    score += 4;
    reasonsFor.push({
      kind: "for",
      basedOn: "stats",
      text: `${event.underdog.name} is listed as ${event.underdog.stance} against a ${event.favorite.stance} favorite. Style mismatch can help a dog if the favorite has not seen that look lately.`,
    });
  }

  if (
    event.underdog.reachInches !== null &&
    event.favorite.reachInches !== null &&
    event.underdog.reachInches - event.favorite.reachInches >= 3
  ) {
    score += 5;
    reasonsFor.push({
      kind: "for",
      basedOn: "stats",
      text: `${event.underdog.name} has a reach edge (${event.underdog.reachInches}" vs ${event.favorite.reachInches}"). That only matters if the dog can keep the fight at range.`,
    });
  }

  if (missing.length >= 3) {
    score -= 12;
    reasonsAgainst.push({
      kind: "against",
      basedOn: "missing-data",
      text: "Too many inputs are still unavailable. The score is a market-structure first pass, not a finished scout report.",
    });
  }

  riskFactors.push({
    kind: "risk",
    basedOn: "missing-data",
    text: "One punch, one cut, or one bad weight cut can flip a fight the model never sees.",
  });
  riskFactors.push({
    kind: "risk",
    basedOn: "structure",
    text: "This is education, not a pick. A high score is not a bet recommendation.",
  });

  if (event.dataStatus !== "live") {
    riskFactors.push({
      kind: "risk",
      basedOn: "missing-data",
      text: "This card is not confirmed live bookmaker data. Treat every number as a pipeline test until a live provider is wired.",
    });
    score -= 8;
  }

  score = Math.round(clamp(score, 8, 92));

  let rating: OptimizerAnalysis["rating"] = "Watch";
  if (event.favorite.americanOdds === null || event.underdog.americanOdds === null) rating = "Incomplete";
  else if (score >= 72) rating = "Value look";
  else if (score >= 58) rating = "Lean";
  else if (score < 36) rating = "Pass";

  const dogOdds =
    event.underdog.americanOdds === null ? "Unavailable" : formatAmerican(event.underdog.americanOdds);
  const favOdds =
    event.favorite.americanOdds === null ? "Unavailable" : formatAmerican(event.favorite.americanOdds);

  const explanation =
    rating === "Incomplete"
      ? `${event.eventName} cannot be scored cleanly yet. Odds or identity data is missing, so the Optimizer will not invent a finish.`
      : `${event.underdog.name} is the underdog at ${dogOdds} against ${event.favorite.name} at ${favOdds}. ` +
        `Version one scores market structure: implied chance, vig, and any confirmed style notes. ` +
        `Score ${score} / 100 is a ${rating.toLowerCase()}. ` +
        (event.dataStatus === "live"
          ? "Odds came from the live provider. Fighter stats are only used when present."
          : "This card is a labeled development sample. It proves the pipeline. It is not a live ticket.");

  return {
    event,
    favoriteOdds: favOdds,
    underdogOdds: dogOdds,
    favoriteImplied: favImp,
    underdogImplied: dogImp,
    favoriteNoVig: fair.fav,
    underdogNoVig: fair.dog,
    vigPercent: fair.vig,
    score,
    rating,
    reasonsFor,
    reasonsAgainst,
    riskFactors,
    explanation,
    explanationKind: "rule-based",
    missing,
  };
}

export function summarizeOdds(implied: number | null) {
  if (implied === null) return "Unavailable";
  return fromImplied(implied).implied;
}
