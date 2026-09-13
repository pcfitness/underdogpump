import type { SportKey } from "./types";

export const SPORTS: Array<{
  key: SportKey;
  label: string;
  league: string;
  oddsApiKey: string | null;
  kind: "combat" | "racket" | "board" | "team";
}> = [
  { key: "ufc", label: "UFC", league: "UFC", oddsApiKey: "mma_mixed_martial_arts", kind: "combat" },
  { key: "boxing", label: "Boxing", league: "Boxing", oddsApiKey: "boxing_boxing", kind: "combat" },
  { key: "darts_pdc", label: "Darts · PDC", league: "PDC", oddsApiKey: null, kind: "board" },
  { key: "darts_modus", label: "Darts · MODUS", league: "MODUS", oddsApiKey: null, kind: "board" },
  { key: "tennis", label: "Tennis", league: "Tennis", oddsApiKey: "tennis_atp", kind: "racket" },
  { key: "nba", label: "NBA", league: "NBA", oddsApiKey: "basketball_nba", kind: "team" },
  { key: "nfl", label: "NFL", league: "NFL", oddsApiKey: "americanfootball_nfl", kind: "team" },
  { key: "mlb", label: "MLB", league: "MLB", oddsApiKey: "baseball_mlb", kind: "team" },
  { key: "nhl", label: "NHL", league: "NHL", oddsApiKey: "icehockey_nhl", kind: "team" },
];

export function sportMeta(key: SportKey) {
  return SPORTS.find((s) => s.key === key) ?? SPORTS[0];
}
