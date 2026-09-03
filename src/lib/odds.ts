export type OddsKind = "american" | "decimal" | "percent";

export type OddsTriple = {
  american: number;
  decimal: number;
  implied: number;
  kind: OddsKind;
};

export function fromImplied(implied: number, kind: OddsKind = "percent"): OddsTriple {
  const p = Math.min(0.99, Math.max(0.01, implied));
  const decimal = 1 / p;
  const american = decimal >= 2 ? 100 * (decimal - 1) : -100 / (decimal - 1);
  return { american, decimal, implied: p, kind };
}

export function parseOdds(raw: string, hint: OddsKind | "auto" = "auto"): OddsTriple | null {
  const n = raw.trim().toLowerCase().replace(/,/g, "").replace(/\s+/g, "");
  if (!n) return null;
  const kind: OddsKind =
    hint !== "auto"
      ? hint
      : n.includes("%")
        ? "percent"
        : /x$/i.test(n)
          ? "decimal"
          : n.startsWith("+") || n.startsWith("−") || n.startsWith("-")
            ? "american"
            : "auto" as OddsKind;

  if (kind === "percent" || (kind as string) === "auto" && n.includes("%")) {
    const v = Number(n.replace("%", ""));
    if (!Number.isFinite(v) || v <= 0 || v >= 100) return null;
    return fromImplied(v / 100, "percent");
  }
  if (kind === "decimal" || /x$/.test(n)) {
    const v = Number(n.replace(/x$/i, ""));
    if (!Number.isFinite(v) || v <= 1) return null;
    return fromImplied(1 / v, "decimal");
  }
  if (kind === "american" || n.startsWith("+") || n.startsWith("-") || n.startsWith("−")) {
    const v = Number(n.replace("−", "-").replace("+", ""));
    if (!Number.isFinite(v) || v === 0) return null;
    const implied = v > 0 ? 100 / (v + 100) : -v / (-v + 100);
    return fromImplied(implied, "american");
  }
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return null;
  if (v > 1 && v < 100) return fromImplied(v / 100, "percent");
  if (v > 1) return fromImplied(1 / v, "decimal");
  return fromImplied(v, "percent");
}

export function formatAmerican(n: number) {
  const r = Math.round(n);
  return r > 0 ? `+${r}` : `${r}`;
}

export function formatDecimal(n: number) {
  const digits = n < 2 ? 2 : 1;
  return `${n.toFixed(digits)}x`;
}

export function formatPercent(p: number) {
  const pct = p * 100;
  if (pct < 10) return `${pct.toFixed(1)}%`.replace(/\.0%$/, "%");
  return `${Math.round(pct * 10) / 10}%`.replace(/\.0%$/, "%");
}

export function formatChance(p: number) {
  const n = Math.max(2, Math.round(1 / p));
  return `1 in ${n}`;
}

export function splitQuestion(question: string) {
  const t = question.indexOf(" — ");
  if (t < 0) return { event: question, pick: "Long shot" };
  return { event: question.slice(0, t), pick: question.slice(t + 3) };
}
