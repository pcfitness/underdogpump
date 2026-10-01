import { formatAmerican } from "@/lib/odds";
import { sportMeta } from "./sports";
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

function sportRisk(event: OptimizerEvent): string {
  const kind = sportMeta(event.sport).kind;
  if (kind === "combat") return "One punch, one cut, or one bad weight cut can flip a fight the price never sees.";
  if (kind === "board") return "One hot visit or a sudden collapse can erase a session lead in a few minutes.";
  if (kind === "racket") return "A tight set, a bad service game, or an error burst can flip a match fast.";
  return "Injuries, rest days, and travel can move a team after the price is already posted.";
}

export function analyzeEvent(event: OptimizerEvent): OptimizerAnalysis {
  const meta = sportMeta(event.sport);
  const favImp = impliedFromAmerican(event.favorite.americanOdds);
  const dogImp = impliedFromAmerican(event.underdog.americanOdds);
  const fair = noVigPair(favImp, dogImp);

  const missing: string[] = [];
  if (event.favorite.americanOdds === null || event.underdog.americanOdds === null) {
    missing.push("Bookmaker odds");
  }
  if (!event.favorite.record) missing.push(`${event.favorite.name} record`);
  if (!event.underdog.record) missing.push(`${event.underdog.name} record`);
  if (meta.kind === "combat") {
    if (!event.favorite.stance && !event.underdog.stance) missing.push("Stance");
    if (event.favorite.reachInches === null && event.underdog.reachInches === null) missing.push("Reach");
  }
  if (event.dataStatus !== "live") missing.push("Confirmed live market");

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
    } else if (dogImp < 0.28 && payout < 400) {
      score -= 6;
      reasonsAgainst.push({
        kind: "against",
        basedOn: "odds",
        text: `${event.underdog.name} at ${formatAmerican(payout)} is priced around ${Math.round(dogImp * 100)}%. A real dog, but the payout is only modest for how often the market expects a loss.`,
      });
    } else if (dogImp > 0.48) {
      score -= 4;
      reasonsAgainst.push({
        kind: "against",
        basedOn: "odds",
        text: `${event.underdog.name} is only a slight dog at ${formatAmerican(payout)}. The price does not pay like an underdog.`,
      });
    }

    if (payout >= 400) {
      score -= 10;
      reasonsAgainst.push({
        kind: "against",
        basedOn: "odds",
        text: `${formatAmerican(payout)} is a deep long shot. The payout is large because ${event.underdog.name} is priced to lose most of the time.`,
      });
    } else if (payout >= 260) {
      score -= 4;
      reasonsAgainst.push({
        kind: "against",
        basedOn: "odds",
        text: `${event.underdog.name} at ${formatAmerican(payout)} pays well, and the market is saying that price exists for a reason.`,
      });
    }

    if (payout >= 150 && payout <= 260) {
      score += 10;
      reasonsFor.push({
        kind: "for",
        basedOn: "odds",
        text: `${formatAmerican(payout)} pays enough to matter if the dog is only a little worse than the favorite.`,
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
        text: "After stripping the vig, the underdog's share looks a bit better than the raw ticket.",
      });
    }
    if (fair.vig !== null && fair.vig >= 0.045) {
      reasonsAgainst.push({
        kind: "against",
        basedOn: "structure",
        text: `The two-way vig on this fight is about ${Math.round(fair.vig * 100)}%. Part of ${event.underdog.name}'s price is the house cut.`,
      });
    }
  }

  const favPrice = event.favorite.americanOdds;
  if (favPrice !== null && favPrice <= -400) {
    reasonsAgainst.push({
      kind: "against",
      basedOn: "odds",
      text: `${event.favorite.name} is a heavy favorite at ${formatAmerican(favPrice)}. ${event.underdog.name} needs an upset, not a close fight, to cash.`,
    });
  }

  if (event.bookCount >= 3) {
    score += 4;
    reasonsFor.push({
      kind: "for",
      basedOn: "structure",
      text: `The line is a consensus of ${event.bookCount} books, not a single ticket.`,
    });
  }

  if (meta.kind === "combat") {
    if (event.underdog.stance && event.favorite.stance && event.underdog.stance !== event.favorite.stance) {
      score += 4;
      reasonsFor.push({
        kind: "for",
        basedOn: "stats",
        text: `${event.underdog.name} is listed as ${event.underdog.stance} against a ${event.favorite.stance} favorite.`,
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
        text: `${event.underdog.name} has a reach edge (${event.underdog.reachInches}" vs ${event.favorite.reachInches}").`,
      });
    }
  }

  riskFactors.push({ kind: "risk", basedOn: "missing-data", text: sportRisk(event) });
  riskFactors.push({
    kind: "risk",
    basedOn: "structure",
    text: "Education only. A high score is not a bet recommendation.",
  });

  if (event.dataStatus !== "live") {
    riskFactors.push({
      kind: "risk",
      basedOn: "missing-data",
      text: "This card is not a live bookmaker price. Treat it as a pipeline test.",
    });
    score -= 8;
  }

  score = Math.round(clamp(score, 8, 92));

  let rating: OptimizerAnalysis["rating"] = "Watch";
  if (event.favorite.americanOdds === null || event.underdog.americanOdds === null) rating = "Incomplete";
  else if (score >= 72) rating = "Value look";
  else if (score >= 58) rating = "Lean";
  else if (score < 36) rating = "Pass";

  const dogOdds = event.underdog.americanOdds === null ? "Unavailable" : formatAmerican(event.underdog.americanOdds);
  const favOdds = event.favorite.americanOdds === null ? "Unavailable" : formatAmerican(event.favorite.americanOdds);

  const explanation =
    rating === "Incomplete"
      ? `${event.eventName} cannot be scored yet. Odds are missing, so the Optimizer will not invent a finish.`
      : `${event.underdog.name} is the ${meta.label} underdog at ${dogOdds} against ${event.favorite.name} at ${favOdds}. ` +
        `This read uses the price, the vig, and any confirmed notes. It does not invent a record. ` +
        `Score ${score} / 100 is a ${rating.toLowerCase()}. ` +
        (event.dataStatus === "live"
          ? `Odds are a live consensus${event.bookCount ? ` from ${event.bookCount} books` : ""}.`
          : "This card is a labeled sample. It proves the pipeline. It is not a live ticket.");

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
