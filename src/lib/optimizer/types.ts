export type DataStatus = "live" | "sample" | "unavailable";

export type SportKey =
  | "ufc"
  | "boxing"
  | "darts_pdc"
  | "darts_modus"
  | "tennis"
  | "nba"
  | "nfl"
  | "mlb"
  | "nhl";

export type SideCard = {
  name: string;
  americanOdds: number | null;
  record: string | null;
  stance: string | null;
  reachInches: number | null;
  age: number | null;
  notes: string[];
};

export type OptimizerEvent = {
  id: string;
  sport: SportKey;
  league: string;
  eventName: string;
  startTime: string | null;
  dataStatus: DataStatus;
  source: string;
  sourceNote: string;
  favorite: SideCard;
  underdog: SideCard;
};

export type Reason = {
  kind: "for" | "against" | "risk";
  text: string;
  basedOn: "odds" | "stats" | "structure" | "missing-data";
};

export type OptimizerAnalysis = {
  event: OptimizerEvent;
  favoriteOdds: string;
  underdogOdds: string;
  favoriteImplied: number | null;
  underdogImplied: number | null;
  favoriteNoVig: number | null;
  underdogNoVig: number | null;
  vigPercent: number | null;
  score: number;
  rating: "Watch" | "Lean" | "Value look" | "Pass" | "Incomplete";
  reasonsFor: Reason[];
  reasonsAgainst: Reason[];
  riskFactors: Reason[];
  explanation: string;
  explanationKind: "rule-based" | "ai";
  missing: string[];
};
