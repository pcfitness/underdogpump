import { createServerFn } from "@tanstack/react-start";
import { CLASHPICKS_EXAMPLES, marketsFromGamma, type Market } from "./markets";

export const loadClashPicks = createServerFn({ method: "GET" }).handler(
  async (): Promise<Market[]> => CLASHPICKS_EXAMPLES,
);

export const loadPolymarket = createServerFn({ method: "GET" }).handler(
  async (): Promise<Market[]> => {
    try {
      const res = await fetch(
        "https://gamma-api.polymarket.com/markets?closed=false&limit=80&order=volume24hr&ascending=false",
        { headers: { Accept: "application/json" } },
      );
      if (!res.ok) return [];
      const data: unknown = await res.json();
      return marketsFromGamma(data);
    } catch {
      return [];
    }
  },
);
