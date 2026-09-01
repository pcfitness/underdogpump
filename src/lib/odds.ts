import { oneInN } from "@/lib/moment";

export type OddsKind = "american" | "decimal" | "percent";

export type Odds = {
  american: number;
  decimal: number;
  implied: number;
  kind: OddsKind;
};

export function parseOdds(raw: string, force: OddsKind | "auto" = "auto"): Odds | null {
  const text = raw.trim().toLowerCase().replace(/,/g, "").replace(/\s+/g, "");
  if (!text) return null;
  if (text === "even" || text === "evens" || text === "evenmoney") {
    return fromImplied(0.5, "decimal");
  }

  const kind = force === "auto" ? detectKind(text) : force;
  if (kind === "percent") {
    const n = Number(text.replace(/%/g, ""));
    if (!Number.isFinite(n) || n <= 0 || n >= 100) return null;
    return fromImplied(n / 100, "percent");
  }
  if (kind === "american") {
    const n = Number(text.replace(/^\+/, ""));
    if (!Number.isFinite(n) || n === 0) return null;
    return fromImplied(impliedFromAmerican(n), "american");
  }
  const n = Number(text.replace(/x$/i, ""));
  if (!Number.isFinite(n) || n <= 1) return null;
  return fromImplied(1 / n, "decimal");
}

export function formatAmerican(n: number): string {
  const rounded = Math.round(n);
  return rounded > 0 ? `+${rounded}` : `${rounded}`;
}

export function formatDecimal(n: number): string {
  return n.toFixed(2);
}

export function formatPercent(p: number): string {
  const pct = p * 100;
  if (pct < 10) return `${pct.toFixed(1)}%`;
  return `${Math.round(pct * 10) / 10}%`.replace(/\.0%/, "%");
}

export function lessonLine(odds: Odds): string {
  const x = odds.decimal >= 10 ? `${Math.round(odds.decimal)}x` : `${odds.decimal.toFixed(odds.decimal < 2 ? 2 : 1)}x`;
  return `A ${x} is not free money. The market is saying ${oneInN(odds.implied)} (${formatPercent(odds.implied)}).`;
}

function detectKind(text: string): OddsKind {
  if (text.includes("%")) return "percent";
  if (/x$/i.test(text)) return "decimal";
  if (text.startsWith("+") || text.startsWith("-")) return "american";
  const n = Number(text);
  if (!Number.isFinite(n)) return "decimal";
  if (Number.isInteger(n) && Math.abs(n) >= 101) return "american";
  if (Number.isInteger(n) && n >= 21 && n <= 99) return "percent";
  return "decimal";
}

function impliedFromAmerican(a: number): number {
  if (a > 0) return 100 / (a + 100);
  const abs = Math.abs(a);
  return abs / (abs + 100);
}

function fromImplied(p: number, kind: OddsKind): Odds {
  const decimal = 1 / p;
  const american = decimal >= 2 ? 100 * (decimal - 1) : -100 / (decimal - 1);
  return { american, decimal, implied: p, kind };
}
