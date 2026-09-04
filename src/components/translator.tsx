import { useMemo, useState } from "react";
import {
  formatAmerican,
  formatChance,
  formatDecimal,
  formatPercent,
  parseOdds,
  type OddsKind,
  type OddsTriple,
} from "@/lib/odds";

const START = parseOdds("+300", "american")!;

function display(odds: OddsTriple, draft?: { kind: OddsKind; value: string }) {
  const next = {
    american: formatAmerican(odds.american),
    decimal: formatDecimal(odds.decimal),
    percent: formatPercent(odds.implied),
  };
  if (draft?.kind === "american") next.american = draft.value;
  if (draft?.kind === "decimal") next.decimal = draft.value;
  if (draft?.kind === "percent") next.percent = draft.value;
  return next;
}

function line(odds: OddsTriple) {
  const x =
    odds.decimal >= 10
      ? `${Math.round(odds.decimal)}x`
      : `${odds.decimal.toFixed(odds.decimal < 2 ? 2 : 1)}x`;
  return `A ${x} is not free money. The market is saying ${formatChance(odds.implied)} (${formatPercent(odds.implied)}).`;
}

export function OddsTranslator({ ruled = true }: { ruled?: boolean }) {
  const [odds, setOdds] = useState(START);
  const [raw, setRaw] = useState(display(START));

  function onChange(kind: OddsKind, value: string) {
    const parsed = parseOdds(value, kind);
    if (parsed) {
      setOdds(parsed);
      setRaw(display(parsed, { kind, value }));
      return;
    }
    setRaw((r) =>
      kind === "american" ? { ...r, american: value } : kind === "decimal" ? { ...r, decimal: value } : { ...r, percent: value },
    );
  }

  const shown = useMemo(() => raw, [raw]);

  return (
    <section className={`${ruled ? "border-b border-line " : ""}bg-surface`} id="translator">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">Bookmark this</p>
        <h2 className="font-display text-5xl tracking-wide text-fg sm:text-6xl">Odds translator</h2>
        <p className="mt-2 max-w-xl text-base leading-relaxed text-muted">
          Type the number you’re looking at. The other two fill in.
        </p>
        <div className="mt-6 rounded-xl border border-line bg-elevated px-5 py-6 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field
              id="odds-american"
              label="Sportsbook"
              hint="DraftKings, FanDuel"
              value={shown.american}
              placeholder="+300"
              onChange={(v) => onChange("american", v)}
              onBlur={() => setRaw(display(odds))}
            />
            <Field
              id="odds-decimal"
              label="Payout"
              hint="Decimal 12x"
              value={shown.decimal}
              placeholder="4.00"
              onChange={(v) => onChange("decimal", v)}
              onBlur={() => setRaw(display(odds))}
            />
            <Field
              id="odds-percent"
              label="Chance"
              hint="Polymarket %"
              value={shown.percent}
              placeholder="25%"
              onChange={(v) => onChange("percent", v)}
              onBlur={() => setRaw(display(odds))}
            />
          </div>
          <p className="mt-6 text-base leading-relaxed text-muted">{line(odds)}</p>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  hint,
  value,
  placeholder,
  onChange,
  onBlur,
}: {
  id: string;
  label: string;
  hint: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
        {label}
      </label>
      <p className="mt-1 text-sm font-medium text-muted">{hint}</p>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        inputMode="decimal"
        autoComplete="off"
        spellCheck={false}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-md border border-line bg-bg px-3 font-display text-3xl tracking-wide text-accent outline-none placeholder:text-subtle focus:border-accent"
        suppressHydrationWarning
      />
    </div>
  );
}
