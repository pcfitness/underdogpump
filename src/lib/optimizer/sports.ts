import type { SportKey } from "./types";

export const SPORTS: Array<{
  key: SportKey;
  label: string;
  league: string;
  oddsApiKey: string | null;
  kind: "combat" | "racket" | "board" | "team";
  sampleOnly: boolean;
}> = [
  { key: "ufc", label: "UFC", league: "UFC", oddsApiKey: "mma_mixed_martial_arts", kind: "combat", sampleOnly: false },
  { key: "boxing", label: "Boxing", league: "Boxing", oddsApiKey: "boxing_boxing", kind: "combat", sampleOnly: false },
  { key: "nba", label: "NBA", league: "NBA", oddsApiKey: "basketball_nba", kind: "team", sampleOnly: false },
  { key: "nfl", label: "NFL", league: "NFL", oddsApiKey: "americanfootball_nfl", kind: "team", sampleOnly: false },
  { key: "mlb", label: "MLB", league: "MLB", oddsApiKey: "baseball_mlb", kind: "team", sampleOnly: false },
  { key: "nhl", label: "NHL", league: "NHL", oddsApiKey: "icehockey_nhl", kind: "team", sampleOnly: false },
];

export function sportMeta(key: SportKey) {
  return SPORTS.find((s) => s.key === key) ?? SPORTS[0];
}
