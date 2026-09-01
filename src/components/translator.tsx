import { useState } from "react";
import {
  DEFAULT_ODDS,
  formatAmerican,
  formatDecimal,
  formatPercent,
  oddsCaption,
  parseOdds,
  type Odds,
  type OddsKind,
} from "@/lib/odds";

type Fields = {
  american: string;
  decimal: string;
  percent: string;
};

function fieldsFrom(odds: Odds, typed?: { kind: OddsKind; value: string }): Fields {
  const next: Fields = {
    american: formatAmerican(odds.american),
    decimal: formatDecimal(odds.decimal),
    percent: formatPercent(odds.implied),
  };
  if (typed?.kind === "american") next.american = typed.value;
  if (typed?.kind === "decimal") next.decimal = typed.value;
  if (typed?.kind === "percent") next.percent = typed.value;
  return next;
}

export function OddsTranslator() {
  const [odds, setOdds] = useState<Odds>(DEFAULT_ODDS);
  const [fields, setFields] = useState<Fields>(fieldsFrom(DEFAULT_ODDS));

  const onChange = (kind: OddsKind, value: string) => {
    const parsed = parseOdds(value, kind);
    if (parsed) {
      setOdds(parsed);
      setFields(fieldsFrom(parsed, { kind, value }));
      return;
    }
    setFields((prev) =>
      kind === "american"
        ? { ...prev, american: value }
        : kind === "decimal"
          ? { ...prev, decimal: value }
          : { ...prev, percent: value },
    );
  };

  const onBlur = () => setFields(fieldsFrom(odds));

  return (
    <section className="border-b border-line bg-surface" id="translator">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-accent">
          Bookmark this
        </p>
        <h2 className="font-display text-4xl tracking-wide text-fg">Odds translator</h2>
        <p className="mt-2 max-w-xl text-base leading-relaxed text-muted">
          Type the number you’re looking at. The other two fill in.
        </p>
        <div className="mt-6 rounded-xl border border-line bg-elevated px-5 py-6 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <OddsField
              id="odds-american"
              label="Sportsbook"
              hint="DraftKings, FanDuel"
              value={fields.american}
              placeholder="+300"
              onChange={(v) => onChange("american", v)}
              onBlur={onBlur}
            />
            <OddsField
              id="odds-decimal"
              label="Payout"
              hint="ClashPicks 12x"
              value={fields.decimal}
              placeholder="4.00"
              onChange={(v) => onChange("decimal", v)}
              onBlur={onBlur}
            />
            <OddsField
              id="odds-percent"
              label="Chance"
              hint="Polymarket %"
              value={fields.percent}
              placeholder="25%"
              onChange={(v) => onChange("percent", v)}
              onBlur={onBlur}
            />
          </div>
          <p className="mt-6 text-base leading-relaxed text-muted">{oddsCaption(odds)}</p>
        </div>
      </div>
    </section>
  );
}

function OddsField({
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
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-widest text-subtle">
        {label}
      </label>
      <p className="text-xs text-subtle">{hint}</p>
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
      />
    </div>
  );
}
