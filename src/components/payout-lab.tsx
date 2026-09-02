import { useMemo, useState } from "react";

function parseMoney(raw: string) {
  const n = Number(String(raw).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function money(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  });
}

function profitFrom(stake: number, american: number) {
  return american < 0 ? stake * (100 / Math.abs(american)) : stake * (american / 100);
}

function formatAmerican(n: number) {
  return n > 0 ? `+${n}` : `${n}`;
}

export function PayoutLab() {
  const [stakeText, setStakeText] = useState("10");
  const [plus, setPlus] = useState(150);
  const [lost, setLost] = useState<"favorite" | "underdog" | null>(null);

  const stake = parseMoney(stakeText) || 10;
  const favOdds = -plus;
  const dogOdds = plus;

  const favBack = useMemo(() => Math.round((stake + profitFrom(stake, favOdds)) * 100) / 100, [stake, favOdds]);
  const dogBack = useMemo(() => Math.round((stake + profitFrom(stake, dogOdds)) * 100) / 100, [stake, dogOdds]);

  return (
    <section className="border-b border-line" id="payout-lab">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
        <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
          Play money
        </p>
        <h2 className="font-display text-5xl tracking-wide text-fg sm:text-6xl">Same fight. Two pays.</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
          Type a bet. Drag the line. Watch the favorite pay less and the underdog pay more. Tap a
          ticket to see a loss. Practice money only.
        </p>

        <div className="mt-8 rounded-xl border border-line bg-elevated px-5 py-6 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <label className="block min-w-40 flex-1">
              <span className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
                Your bet on each side
              </span>
              <input
                value={stakeText}
                onChange={(event) => {
                  setStakeText(event.target.value);
                  setLost(null);
                }}
                inputMode="decimal"
                autoComplete="off"
                className="mt-2 h-14 w-full max-w-xs rounded-md border border-line bg-bg px-3 font-display text-3xl tracking-wide text-accent outline-none focus:border-accent"
              />
            </label>
            <p className="font-mono text-xs tracking-widest text-muted uppercase">
              Favorite {formatAmerican(favOdds)} · Underdog {formatAmerican(dogOdds)}
            </p>
          </div>

          <label className="mt-6 block">
            <span className="flex justify-between text-[0.7rem] font-semibold tracking-widest text-muted uppercase">
              <span>Bigger favorite</span>
              <span>Bigger underdog</span>
            </span>
            <input
              type="range"
              min={100}
              max={500}
              step={10}
              value={plus}
              onChange={(event) => {
                setPlus(Number(event.target.value));
                setLost(null);
              }}
              className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-line accent-[var(--color-accent)]"
            />
          </label>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <button
            type="button"
            onClick={() => setLost((now) => (now === "favorite" ? null : "favorite"))}
            className={`rounded-xl border px-5 py-6 text-left transition ${
              lost === "favorite"
                ? "border-accent bg-accent/10"
                : "border-line bg-elevated hover:border-accent"
            }`}
          >
            <p className="text-[0.7rem] font-semibold tracking-widest text-muted uppercase">
              The favorite · {formatAmerican(favOdds)}
            </p>
            <p className="mt-2 font-display text-3xl tracking-wide text-fg">Expected to win</p>
            <p className="mt-6 text-[0.7rem] font-semibold tracking-widest text-muted uppercase">
              If this side wins
            </p>
            <p
              className={`font-display text-5xl leading-none tracking-wide ${
                lost === "favorite" ? "text-muted line-through" : "text-fg"
              }`}
            >
              {lost === "favorite" ? "$0" : money(favBack)}
            </p>
            <p className="mt-4 text-sm text-muted">
              {lost === "favorite" ? "Tapped lose. The bet is gone." : "Tap this ticket to mark a loss."}
            </p>
          </button>

          <button
            type="button"
            onClick={() => setLost((now) => (now === "underdog" ? null : "underdog"))}
            className={`rounded-xl border px-5 py-6 text-left transition ${
              lost === "underdog"
                ? "border-accent bg-accent/10"
                : "border-accent/60 bg-accent/10 hover:border-accent"
            }`}
          >
            <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
              The underdog · {formatAmerican(dogOdds)}
            </p>
            <p className="mt-2 font-display text-3xl tracking-wide text-accent">Expected to lose</p>
            <p className="mt-6 text-[0.7rem] font-semibold tracking-widest text-muted uppercase">
              If this side wins
            </p>
            <p
              className={`font-display text-5xl leading-none tracking-wide ${
                lost === "underdog" ? "text-muted line-through" : "text-accent"
              }`}
            >
              {lost === "underdog" ? "$0" : money(dogBack)}
            </p>
            <p className="mt-4 text-sm text-fg">
              {lost === "underdog" ? "Tapped lose. The bet is gone." : "Tap this ticket to mark a loss."}
            </p>
          </button>
        </div>
      </div>
    </section>
  );
}
