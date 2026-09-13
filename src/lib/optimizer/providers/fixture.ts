import type { OptimizerEvent } from "../types";

/**
 * Labeled development cards only. These are not live bookmaker odds and not
 * a claim that these fighters are booked. They exist so the pipeline can be
 * tested before a paid odds provider is connected.
 */
export const UFC_FIXTURE_EVENTS: OptimizerEvent[] = [
  {
    id: "ufc-sample-carter-miles",
    sport: "ufc",
    league: "UFC",
    eventName: "DEV SAMPLE · Alex Carter vs Jordan Miles",
    startTime: null,
    dataStatus: "sample",
    source: "Development fixture",
    sourceNote: "Not live odds. Sample card for pipeline testing only.",
    favorite: {
      name: "Alex Carter",
      americanOdds: -210,
      record: null,
      stance: "Orthodox",
      reachInches: 72,
      age: null,
      notes: [],
    },
    underdog: {
      name: "Jordan Miles",
      americanOdds: 175,
      record: null,
      stance: "Southpaw",
      reachInches: 76,
      age: null,
      notes: ["Reach listed on sample card only"],
    },
  },
  {
    id: "ufc-sample-reid-volkov",
    sport: "ufc",
    league: "UFC",
    eventName: "DEV SAMPLE · Maya Reid vs Elena Volkov",
    startTime: null,
    dataStatus: "sample",
    source: "Development fixture",
    sourceNote: "Not live odds. Sample card for pipeline testing only.",
    favorite: {
      name: "Maya Reid",
      americanOdds: -145,
      record: null,
      stance: "Orthodox",
      reachInches: 66,
      age: null,
      notes: [],
    },
    underdog: {
      name: "Elena Volkov",
      americanOdds: 125,
      record: null,
      stance: "Orthodox",
      reachInches: 67,
      age: null,
      notes: [],
    },
  },
  {
    id: "ufc-sample-longshot",
    sport: "ufc",
    league: "UFC",
    eventName: "DEV SAMPLE · Titus Grant vs Noah Pell",
    startTime: null,
    dataStatus: "sample",
    source: "Development fixture",
    sourceNote: "Not live odds. Sample card for pipeline testing only.",
    favorite: {
      name: "Titus Grant",
      americanOdds: -450,
      record: null,
      stance: null,
      reachInches: null,
      age: null,
      notes: [],
    },
    underdog: {
      name: "Noah Pell",
      americanOdds: 340,
      record: null,
      stance: null,
      reachInches: null,
      age: null,
      notes: [],
    },
  },
];
