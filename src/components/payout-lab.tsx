import { useMemo, useState } from "react";

function parseMoney(raw: string) {
  const n = Number(String(raw).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function parseAmerican(raw: string) {
  const cleaned = String(raw).replace(/[^0-9+\-]/g, "");
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n === 0) return null;
  if (n > -100 && n < 100) return null;
  return n;
}

function money(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  });
}

export function PayoutLab() {
  const [stakeText, setStakeText] = useState("10");
  const [oddsText, setOddsText] = useState("-150");

  const stake = parseMoney(stakeText);
  const odds = parseAmerican(oddsText);

  const result = useMemo(() => {
    if (!stake || odds == null) return null;
    const profit = odds < 0 ? stake * (100 / Math.abs(odds)) : stake * (odds / 100);
    return {
      side: odds < 0 ? "Favorite" : "Underdog",
      sign: odds < 0 ? "minus money" : "plus money",
      profit,
      back: stake + profit,
    };
  }, [stake, odds]);

  return (
    <section className="border-b border-line" id="payout-lab">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
        <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
          Play money
        </p>
        <h2 className="font-display text-5xl tracking-wide text-fg sm:text-6xl">Try a number</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
          Type how much you want to bet. Type a plus or minus number like the ones on FanDuel or
          DraftKings. This is practice money. Not a real bet.
        </p>

        <article className="mt-8 overflow-hidden rounded-xl border border-line bg-elevated">
          <div className="grid gap-6 px-5 py-6 sm:grid-cols-2 sm:px-8">
            <label className="block">
              <span className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
                Your bet
              </span>
              <input
                value={stakeText}
                onChange={(event) => setStakeText(event.target.value)}
                inputMode="decimal"
                autoComplete="off"
                spellCheck={false}
                className="mt-2 h-14 w-full rounded-md border border-line bg-bg px-3 font-display text-3xl tracking-wide text-accent outline-none focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
                Plus or minus number
              </span>
              <input
                value={oddsText}
                onChange={(event) => setOddsText(event.target.value)}
                inputMode="text"
                autoComplete="off"
                spellCheck={false}
                placeholder="-150 or +150"
                className="mt-2 h-14 w-full rounded-md border border-line bg-bg px-3 font-display text-3xl tracking-wide text-accent outline-none focus:border-accent"
              />
            </label>
          </div>

          <div className="grid gap-0 border-t border-line sm:grid-cols-3">
            <div className="border-b border-line px-5 py-5 sm:border-r sm:border-b-0 sm:px-8">
              <p className="text-[0.7rem] font-semibold tracking-widest text-muted uppercase">This is</p>
              <p className="mt-1 font-display text-3xl tracking-wide text-fg">
                {result ? result.side : "—"}
              </p>
              <p className="mt-1 text-sm text-muted">{result ? result.sign : "Need a real number"}</p>
            </div>
            <div className="border-b border-line px-5 py-5 sm:border-r sm:border-b-0 sm:px-8">
              <p className="text-[0.7rem] font-semibold tracking-widest text-muted uppercase">
                If it wins you get back
              </p>
              <p className="mt-1 font-display text-4xl leading-none tracking-wide text-accent">
                {result ? money(result.back) : "—"}
              </p>
              <p className="mt-2 text-sm text-muted">
                {result ? `${money(result.profit)} profit` : "Try -150 or +200"}
              </p>
            </div>
            <div className="bg-accent/10 px-5 py-5 sm:px-8">
              <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
                If it loses
              </p>
              <p className="mt-1 font-display text-4xl leading-none tracking-wide text-accent">$0</p>
              <p className="mt-2 text-sm text-fg">The bet is gone.</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
