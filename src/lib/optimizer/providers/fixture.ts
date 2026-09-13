import type { OptimizerEvent, SideCard, SportKey } from "../types";

function side(name: string, americanOdds: number, extra: Partial<SideCard> = {}): SideCard {
  return {
    name,
    americanOdds,
    record: null,
    stance: extra.stance ?? null,
    reachInches: extra.reachInches ?? null,
    age: extra.age ?? null,
    notes: extra.notes ?? [],
  };
}

function sample(
  sport: SportKey,
  league: string,
  id: string,
  eventName: string,
  favorite: SideCard,
  underdog: SideCard,
): OptimizerEvent {
  return {
    id,
    sport,
    league,
    eventName: `DEV SAMPLE · ${eventName}`,
    startTime: null,
    dataStatus: "sample",
    source: "Development fixture",
    sourceNote: "Not live odds. Sample card so every sport can be tested before a live feed is connected.",
    favorite,
    underdog,
  };
}

export const ALL_SPORT_FIXTURES: OptimizerEvent[] = [
  sample(
    "ufc",
    "UFC",
    "ufc-carter-miles",
    "Alex Carter vs Jordan Miles",
    side("Alex Carter", -210, { stance: "Orthodox", reachInches: 72 }),
    side("Jordan Miles", 175, { stance: "Southpaw", reachInches: 76 }),
  ),
  sample(
    "ufc",
    "UFC",
    "ufc-reid-volkov",
    "Maya Reid vs Elena Volkov",
    side("Maya Reid", -145),
    side("Elena Volkov", 125),
  ),
  sample(
    "boxing",
    "Boxing",
    "box-okoye-brennan",
    "Daniel Okoye vs Liam Brennan",
    side("Daniel Okoye", -280, { stance: "Orthodox" }),
    side("Liam Brennan", 225, { stance: "Southpaw" }),
  ),
  sample(
    "boxing",
    "Boxing",
    "box-cruz-patel",
    "Sofia Cruz vs Priya Patel",
    side("Sofia Cruz", -160),
    side("Priya Patel", 140),
  ),
  sample(
    "darts_pdc",
    "PDC",
    "pdc-hart-nolan",
    "PDC · Callum Hart vs Ben Nolan",
    side("Callum Hart", -190),
    side("Ben Nolan", 160),
  ),
  sample(
    "darts_modus",
    "MODUS",
    "modus-cole-vickers",
    "MODUS · Ryan Cole vs Tom Vickers",
    side("Ryan Cole", -130),
    side("Tom Vickers", 110),
  ),
  sample(
    "tennis",
    "ATP",
    "ten-moreau-silva",
    "ATP · Luc Moreau vs Diego Silva",
    side("Luc Moreau", -175),
    side("Diego Silva", 150),
  ),
  sample(
    "tennis",
    "WTA",
    "ten-kline-nadeau",
    "WTA · Harper Kline vs Anya Nadeau",
    side("Harper Kline", -240),
    side("Anya Nadeau", 195),
  ),
  sample(
    "nba",
    "NBA",
    "nba-harbor-wolves",
    "Harbor vs Wolves",
    side("Harbor", -165),
    side("Wolves", 145),
  ),
  sample(
    "nfl",
    "NFL",
    "nfl-iron-outlaws",
    "Iron vs Outlaws",
    side("Iron", -190),
    side("Outlaws", 165),
  ),
  sample(
    "mlb",
    "MLB",
    "mlb-pines-tide",
    "Pines vs Tide",
    side("Pines", -140),
    side("Tide", 120),
  ),
  sample(
    "nhl",
    "NHL",
    "nhl-forge-rapids",
    "Forge vs Rapids",
    side("Forge", -155),
    side("Rapids", 135),
  ),
];

export function fixturesFor(sport: SportKey) {
  return ALL_SPORT_FIXTURES.filter((event) => event.sport === sport);
}
