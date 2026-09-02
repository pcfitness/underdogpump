export type OddsKind = "american" | "decimal" | "percent";

export type OddsQuote = {
  american: number;
  decimal: number;
  implied: number;
  kind: OddsKind;
};

export function payoutFromImplied(implied: number) {
  return implied > 0 ? Math.max(2, Math.round(1 / implied)) : 10;
}

export function formatOneIn(implied: number) {
  return `1 in ${payoutFromImplied(implied)}`;
}

export function formatAmerican(n: number) {
  const rounded = Math.round(n);
  return rounded > 0 ? `+${rounded}` : `${rounded}`;
}

export function formatDecimal(n: number) {
  return n.toFixed(2);
}

export function formatPercent(implied: number) {
  const pct = implied * 100;
  return pct < 10
    ? `${pct.toFixed(1)}%`
    : `${Math.round(pct * 10) / 10}%`.replace(/\.0%/, "%");
}

export function explainQuote(quote: OddsQuote) {
  const x =
    quote.decimal >= 10
      ? `${Math.round(quote.decimal)}x`
      : `${quote.decimal.toFixed(quote.decimal < 2 ? 2 : 1)}x`;
  return `A ${x} is not free money. The market is saying ${formatOneIn(quote.implied)} (${formatPercent(quote.implied)}).`;
}

function detectKind(raw: string): OddsKind {
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

function fromImplied(implied: number, kind: OddsKind): OddsQuote {
  const decimal = 1 / implied;
  return {
    american: decimal >= 2 ? 100 * (decimal - 1) : -100 / (decimal - 1),
    decimal,
    implied,
    kind,
  };
}

export function parseOdds(input: string, kind: OddsKind | "auto" = "auto"): OddsQuote | null {
  const raw = input.trim().toLowerCase().replace(/,/g, "").replace(/\s+/g, "");
  if (!raw) return null;
  if (raw === "even" || raw === "evens" || raw === "evenmoney") {
    return fromImplied(0.5, "decimal");
  }
  const resolved = kind === "auto" ? detectKind(raw) : kind;
  if (resolved === "percent") {
    const n = Number(raw.replace(/%/g, ""));
    if (!Number.isFinite(n) || n <= 0 || n >= 100) return null;
    return fromImplied(n / 100, "percent");
  }
  if (resolved === "american") {
    const n = Number(raw.replace(/^\+/, ""));
    if (!Number.isFinite(n) || n === 0) return null;
    return fromImplied(americanToImplied(n), "american");
  }
  const n = Number(raw.replace(/x$/i, ""));
  if (!Number.isFinite(n) || n <= 1) return null;
  return fromImplied(1 / n, "decimal");
}

export const DEFAULT_QUOTE = parseOdds("+300", "american")!;

export function formatFields(quote: OddsQuote, draft?: { kind: OddsKind; value: string }) {
  const fields = {
    american: formatAmerican(quote.american),
    decimal: formatDecimal(quote.decimal),
    percent: formatPercent(quote.implied),
  };
  if (draft?.kind === "american") fields.american = draft.value;
  if (draft?.kind === "decimal") fields.decimal = draft.value;
  if (draft?.kind === "percent") fields.percent = draft.value;
  return fields;
}

export function americanFromImplied(implied: number) {
  if (!(implied > 0 && implied < 1)) return "";
  const decimal = 1 / implied;
  const american = decimal >= 2 ? 100 * (decimal - 1) : -100 / (decimal - 1);
  return formatAmerican(american);
}
