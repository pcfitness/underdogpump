import { useState } from "react";
import {
  formatAmerican,
  formatDecimal,
  formatPercent,
  lessonLine,
  parseOdds,
  type Odds,
  type OddsKind,
} from "@/lib/odds";

const START = parseOdds("+300", "american") as Odds;

type Draft = {
  american: string;
  decimal: string;
  percent: string;
};

function draftFrom(odds: Odds, keep?: { kind: OddsKind; value: string }): Draft {
  const next: Draft = {
    american: formatAmerican(odds.american),
    decimal: formatDecimal(odds.decimal),
    percent: formatPercent(odds.implied),
  };
  if (keep) {
    if (keep.kind === "american") next.american = keep.value;
    if (keep.kind === "decimal") next.decimal = keep.value;
    if (keep.kind === "percent") next.percent = keep.value;
  }
  return next;
}

export function OddsTranslator() {
  const [odds, setOdds] = useState<Odds>(START);
  const [draft, setDraft] = useState<Draft>(draftFrom(START));

  const onType = (kind: OddsKind, value: string) => {
    const parsed = parseOdds(value, kind);
    if (parsed) {
      setOdds(parsed);
      setDraft(draftFrom(parsed, { kind, value }));
      return;
    }
    setDraft((current) =>
      kind === "american"
        ? { ...current, american: value }
        : kind === "decimal"
          ? { ...current, decimal: value }
          : { ...current, percent: value },
    );
  };

  const onBlur = (kind: OddsKind) => {
    setDraft(draftFrom(odds));
    void kind;
  };

  return (
    <section className="border-b border-line bg-surface">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent">
          Bookmark this
        </p>
        <h2 className="font-display text-4xl tracking-wide text-fg">Odds translator</h2>
        <p className="mt-2 max-w-xl text-base leading-relaxed text-muted">
          Type the number you’re looking at. The other two fill in.
        </p>

        <div className="mt-6 rounded-xl border border-line bg-elevated px-5 py-6 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field
              id="odds-american"
              label="Sportsbook"
              hint="DraftKings, FanDuel"
              value={draft.american}
              placeholder="+300"
              onChange={(v) => onType("american", v)}
              onBlur={() => onBlur("american")}
            />
            <Field
              id="odds-decimal"
              label="Payout"
              hint="ClashPicks 12x"
              value={draft.decimal}
              placeholder="4.00"
              onChange={(v) => onType("decimal", v)}
              onBlur={() => onBlur("decimal")}
            />
            <Field
              id="odds-percent"
              label="Chance"
              hint="Polymarket %"
              value={draft.percent}
              placeholder="25%"
              onChange={(v) => onType("percent", v)}
              onBlur={() => onBlur("percent")}
            />
          </div>
          <p className="mt-6 text-base leading-relaxed text-muted">{lessonLine(odds)}</p>
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
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-[0.16em] text-subtle">
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
