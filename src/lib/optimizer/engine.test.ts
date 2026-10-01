import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { analyzeEvent } from "./engine.ts";
import type { OptimizerEvent } from "./types.ts";

function card(over: Partial<OptimizerEvent> = {}): OptimizerEvent {
  return {
    id: "t",
    sport: "ufc",
    league: "UFC",
    eventName: "Fav vs Dog",
    startTime: null,
    dataStatus: "live",
    source: "test",
    sourceNote: "test",
    bookCount: 1,
    books: ["Test"],
    favorite: {
      name: "Fav",
      americanOdds: -150,
      record: null,
      stance: null,
      reachInches: null,
      age: null,
      notes: [],
    },
    underdog: {
      name: "Dog",
      americanOdds: 130,
      record: null,
      stance: null,
      reachInches: null,
      age: null,
      notes: [],
    },
    ...over,
  };
}

describe("optimizer engine", () => {
  it("marks missing odds incomplete", () => {
    const result = analyzeEvent(
      card({
        favorite: { ...card().favorite, americanOdds: null },
        underdog: { ...card().underdog, americanOdds: null },
      }),
    );
    assert.equal(result.rating, "Incomplete");
    assert.equal(result.favoriteImplied, null);
  });

  it("strips vig into shares that add to 1", () => {
    const result = analyzeEvent(card());
    assert.ok(result.favoriteNoVig !== null && result.underdogNoVig !== null);
    assert.ok(Math.abs(result.favoriteNoVig + result.underdogNoVig - 1) < 0.001);
    assert.ok((result.vigPercent ?? 0) > 0);
  });

  it("leans a live plus-money dog and passes a deep long shot", () => {
    const lean = analyzeEvent(card({ bookCount: 4, books: ["A", "B", "C", "D"] }));
    const pass = analyzeEvent(
      card({
        favorite: { ...card().favorite, americanOdds: -900 },
        underdog: { ...card().underdog, americanOdds: 650 },
        dataStatus: "sample",
      }),
    );
    assert.ok(lean.score > pass.score);
    assert.notEqual(pass.rating, "Value look");
    assert.equal(lean.explanationKind, "rule-based");
  });

  it("uses a confirmed reach edge without inventing one", () => {
    const edged = analyzeEvent(
      card({
        favorite: { ...card().favorite, stance: "Orthodox", reachInches: 70 },
        underdog: { ...card().underdog, stance: "Southpaw", reachInches: 76 },
      }),
    );
    assert.ok(edged.reasonsFor.some((r) => r.text.includes("reach edge")));
  });
});
