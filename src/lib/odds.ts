export type OddsKind = "american" | "decimal" | "percent";

export type Odds = {
  american: number;
  decimal: number;
  implied: number;
  kind: OddsKind;
};

export function payoutFromImplied(implied: number) {
  if (implied > 0) return Math.max(2, Math.round(1 / implied));
  return 10;
}

export function inN(implied: number) {
  return `1 in ${payoutFromImplied(implied)}`;
}

export function formatAmerican(value: number) {
  const rounded = Math.round(value);
  return rounded > 0 ? `+${rounded}` : `${rounded}`;
}

export function formatDecimal(value: number) {
  return value.toFixed(2);
}

export function formatPercent(implied: number) {
  const pct = implied * 100;
  if (pct < 10) return `${pct.toFixed(1)}%`;
  return `${Math.round(pct * 10) / 10}%`.replace(/\.0%/, "%");
}

export function oddsCaption(odds: Odds) {
  const label =
    odds.decimal >= 10
      ? `${Math.round(odds.decimal)}x`
      : `${odds.decimal.toFixed(odds.decimal < 2 ? 2 : 1)}x`;
  return `A ${label} is not free money. The market is saying ${inN(odds.implied)} (${formatPercent(odds.implied)}).`;
}

function guessKind(raw: string): OddsKind {
  if (raw.includes("%")) return "percent";
  if (/x$/i.test(raw)) return "decimal";
  if (raw.startsWith("+") || raw.startsWith("-")) return "american";
  const n = Number(raw);
  if (!Number.isFinite(n)) return "decimal";
  if (Number.isInteger(n) && Math.abs(n) >= 101) return "american";
  if (Number.isInteger(n) && n >= 21 && n <= 99) return "percent";
  return "decimal";
}

function americanToImplied(american: number) {
  if (american > 0) return 100 / (american + 100);
  const abs = Math.abs(american);
  return abs / (abs + 100);
}

function fromImplied(implied: number, kind: OddsKind): Odds {
  const decimal = 1 / implied;
  return {
    american: decimal >= 2 ? 100 * (decimal - 1) : -100 / (decimal - 1),
    decimal,
    implied,
    kind,
  };
}

export function parseOdds(input: string, kind: OddsKind | "auto" = "auto"): Odds | null {
  const n = input.trim().toLowerCase().replace(/,/g, "").replace(/\s+/g, "");
  if (!n) return null;
  if (n === "even" || n === "evens" || n === "evenmoney") return fromImplied(0.5, "decimal");
  const resolved = kind === "auto" ? guessKind(n) : kind;
  if (resolved === "percent") {
    const pct = Number(n.replace(/%/g, ""));
    if (!Number.isFinite(pct) || pct <= 0 || pct >= 100) return null;
    return fromImplied(pct / 100, "percent");
  }
  if (resolved === "american") {
    const am = Number(n.replace(/^\+/, ""));
    if (!Number.isFinite(am) || am === 0) return null;
    return fromImplied(americanToImplied(am), "american");
  }
  const decimal = Number(n.replace(/x$/i, ""));
  if (!Number.isFinite(decimal) || decimal <= 1) return null;
  return fromImplied(1 / decimal, "decimal");
}

export const DEFAULT_ODDS = parseOdds("+300", "american")!;
