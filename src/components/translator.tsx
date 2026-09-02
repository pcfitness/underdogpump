import { useState } from "react";
import {
  DEFAULT_QUOTE,
  explainQuote,
  formatFields,
  parseOdds,
  type OddsKind,
  type OddsQuote,
} from "@/lib/odds";

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
      <label htmlFor={id} className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
        {label}
      </label>
      <p className="mt-1 text-sm font-medium text-muted">{hint}</p>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
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

export function OddsTranslator() {
  const [quote, setQuote] = useState<OddsQuote>(DEFAULT_QUOTE);
  const [fields, setFields] = useState(formatFields(DEFAULT_QUOTE));

  const handleChange = (kind: OddsKind, value: string) => {
    const next = parseOdds(value, kind);
    if (next) {
      setQuote(next);
      setFields(formatFields(next, { kind, value }));
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

  const commit = () => setFields(formatFields(quote));

  return (
    <section className="border-b border-line bg-surface" id="translator">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
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
              value={fields.american}
              placeholder="+300"
              onChange={(value) => handleChange("american", value)}
              onBlur={commit}
            />
            <Field
              id="odds-decimal"
              label="Payout"
              hint="ClashPicks 12x"
              value={fields.decimal}
              placeholder="4.00"
              onChange={(value) => handleChange("decimal", value)}
              onBlur={commit}
            />
            <Field
              id="odds-percent"
              label="Chance"
              hint="Polymarket %"
              value={fields.percent}
              placeholder="25%"
              onChange={(value) => handleChange("percent", value)}
              onBlur={commit}
            />
          </div>
          <p className="mt-6 text-base leading-relaxed text-muted">{explainQuote(quote)}</p>
        </div>
      </div>
    </section>
  );
}
