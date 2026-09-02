import { ArrowUpRight, Check, Copy, Minus, Plus, Share2 } from "lucide-react";
import { useMemo, useState } from "react";

const SHARE_PATH = "/odds-101#parlays";
const CLASHPICKS_URL = "https://www.clashpicks.com/";
const STAKE = 10;
const MIN_PICKS = 2;
const MAX_PICKS = 5;

const FAVORITE_DECIMAL = 1 + 100 / 150;
const UNDERDOG_DECIMAL = 1 + 150 / 100;

type Side = "favorite" | "underdog";

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function Parlays() {
  const [count, setCount] = useState(3);
  const [sides, setSides] = useState<Side[]>(["favorite", "favorite", "favorite", "favorite", "favorite"]);
  const [copied, setCopied] = useState<"card" | "link" | null>(null);

  const picks = sides.slice(0, count);
  const favCount = picks.filter((side) => side === "favorite").length;
  const dogCount = picks.length - favCount;

  const ifAllWin = useMemo(() => {
    const payout = picks.reduce(
      (total, side) => total * (side === "favorite" ? FAVORITE_DECIMAL : UNDERDOG_DECIMAL),
      STAKE,
    );
    return Math.round(payout);
  }, [picks]);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${SHARE_PATH}`
      : `https://underdogpump.xyz${SHARE_PATH}`;

  const shareText =
    "A parlay is more than one pick on the same ticket. Every pick has to win. If one pick loses, you get nothing. " +
    shareUrl;

  const flash = (kind: "card" | "link") => {
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1600);
  };

  const setSide = (index: number, side: Side) => {
    setSides((prev) => prev.map((item, i) => (i === index ? side : item)));
  };

  return (
    <section className="border-y border-line" id="parlays">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
        <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
          Next lesson
        </p>
        <h2 className="font-display text-5xl tracking-wide text-fg sm:text-6xl">Parlays</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
          A parlay is more than one pick on the same ticket. Every pick has to win. If one pick
          loses, the whole ticket pays $0. Tap the buttons. Watch the payout move.
        </p>

        <article className="mt-8 overflow-hidden rounded-xl border border-line bg-elevated">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line px-5 py-4 sm:px-8">
            <div>
              <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
                Play with a ticket
              </p>
              <p className="font-display text-2xl tracking-wide text-fg">
                {count} {count === 1 ? "pick" : "picks"} · ${STAKE} bet
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Fewer picks"
                disabled={count <= MIN_PICKS}
                onClick={() => setCount((n) => Math.max(MIN_PICKS, n - 1))}
                className="inline-flex size-11 items-center justify-center rounded-md border border-line bg-bg text-fg disabled:opacity-30 hover:border-accent"
              >
                <Minus className="size-4" />
              </button>
              <span className="min-w-16 text-center font-mono text-xs tracking-widest text-muted uppercase">
                {count} of {MAX_PICKS}
              </span>
              <button
                type="button"
                aria-label="More picks"
                disabled={count >= MAX_PICKS}
                onClick={() => setCount((n) => Math.min(MAX_PICKS, n + 1))}
                className="inline-flex size-11 items-center justify-center rounded-md border border-line bg-bg text-fg disabled:opacity-30 hover:border-accent"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          <ol className="divide-y divide-line">
            {picks.map((side, index) => (
              <li key={index} className="flex flex-wrap items-center gap-3 px-5 py-4 sm:px-8">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-line bg-bg font-display text-lg text-muted">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-xl tracking-wide text-fg">Fight {index + 1}</p>
                  <p className="text-sm text-muted">
                    {side === "favorite" ? "Favorite \u00b7 \u2212150" : "Underdog \u00b7 +150"}
                  </p>
                </div>
                <div className="flex rounded-md border border-line p-1">
                  <button
                    type="button"
                    onClick={() => setSide(index, "favorite")}
                    className={`min-h-10 rounded-sm px-3 text-sm font-semibold ${
                      side === "favorite" ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"
                    }`}
                  >
                    Favorite
                  </button>
                  <button
                    type="button"
                    onClick={() => setSide(index, "underdog")}
                    className={`min-h-10 rounded-sm px-3 text-sm font-semibold ${
                      side === "underdog" ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"
                    }`}
                  >
                    Underdog
                  </button>
                </div>
              </li>
            ))}
          </ol>

          <div className="grid gap-0 border-t border-line sm:grid-cols-2">
            <div className="border-b border-line px-5 py-5 sm:border-r sm:border-b-0 sm:px-8">
              <p className="text-[0.7rem] font-semibold tracking-widest text-muted uppercase">
                If every pick wins
              </p>
              <p className="mt-1 font-display text-5xl leading-none tracking-wide text-accent">
                {money(ifAllWin)}
              </p>
              <p className="mt-2 text-sm text-muted">
                {favCount} {favCount === 1 ? "favorite" : "favorites"}
                {" \u00b7 "}
                {dogCount} {dogCount === 1 ? "underdog" : "underdogs"}
              </p>
            </div>
            <div className="bg-accent/10 px-5 py-5 sm:px-8">
              <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
                If one pick loses
              </p>
              <p className="mt-1 font-display text-5xl leading-none tracking-wide text-accent">$0</p>
              <p className="mt-2 text-sm text-fg">The other wins do not count.</p>
            </div>
          </div>

          <p className="border-t border-line px-5 py-4 text-base leading-relaxed text-fg sm:px-8">
            More picks can pay more. They also need more things to go right. This ticket uses the
            same classroom numbers: \u2212150 on a favorite, +150 on an underdog. Real apps change those
            numbers every fight.
          </p>

          <div className="flex flex-wrap gap-2 border-t border-line px-5 py-4 sm:px-8">
            <button
              type="button"
              onClick={async () => {
                if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
                  try {
                    await navigator.share({
                      title: "$UNDERDOG \u00b7 Parlays",
                      text: shareText,
                      url: shareUrl,
                    });
                    return;
                  } catch {
                    /* fall through */
                  }
                }
                await navigator.clipboard.writeText(shareText);
                flash("card");
              }}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg hover:bg-accent-dim"
            >
              <Share2 className="size-4" />
              {copied === "card" ? "Copied" : "Share this ticket"}
            </button>
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(shareUrl);
                flash("link");
              }}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line bg-bg/60 px-4 py-2.5 text-sm font-semibold text-fg hover:border-accent"
            >
              {copied === "link" ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied === "link" ? "Link copied" : "Copy link"}
            </button>
            <a
              href={CLASHPICKS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line px-4 py-2.5 text-sm font-semibold text-fg no-underline hover:border-accent"
            >
              Open ClashPicks
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
