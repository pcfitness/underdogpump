import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowUpRight,
  Check,
  Copy,
  Minus,
  Plus,
  Share2,
  X,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { OddsTranslator } from "@/components/translator";
import { CLASSROOM_PICK } from "@/lib/markets";
import { loadMarkets } from "@/lib/load-markets";

export const Route = createFileRoute("/odds-101")({
  loader: () => loadMarkets({ data: {} }),
  head: () => ({
    meta: [{ title: "$UNDERDOG · Odds 101" }],
  }),
  component: Odds101,
});

type Spot = {
  id: string;
  n: number;
  label: string;
  kicker: string;
  title: string;
  body: string;
  top: string;
};

const SPOTS: Spot[] = [
  {
    id: "implied",
    n: 1,
    label: "Implied odds",
    kicker: "Price is a probability",
    title: "Every price is a percent",
    body: "A price shows the sportsbook’s estimated chance. If it works out to 1 in 4, that side is priced at 25%. You can disagree. If you think it wins more often, the bet may have value. If you just like the story, you are donating.",
    top: "28%",
  },
  {
    id: "longshot",
    n: 2,
    label: "Long shots",
    kicker: "Big number, thin ice",
    title: "A big payout is not free money",
    body: "A long shot pays a lot because it is expected to lose more often. That is the trade. A huge payout does not make it a good bet. Bet small. Be patient. If you need that ticket to hit tonight, it is the wrong ticket.",
    top: "38%",
  },
  {
    id: "vig",
    n: 3,
    label: "The vig",
    kicker: "The cut you never see",
    title: "The house takes a cut",
    body: "Sportsbooks are not charities. Their edge is built into the odds. That means the prices are tilted slightly in their favor. Convert the odds back into a simple chance, then decide if the bet still looks good after the house gets its cut.",
    top: "48%",
  },
  {
    id: "value",
    n: 4,
    label: "Underdog value",
    kicker: "When the crowd is loud",
    title: "When the underdog is a smart bet",
    body: "An underdog is only interesting if you think it wins more often than the price says. Favorites can get overbet because they feel safer. Long shots can get overbet because they feel exciting. The gap between those feelings is where a price can be wrong.",
    top: "58%",
  },
  {
    id: "bankroll",
    n: 5,
    label: "Bankroll",
    kicker: "Stay in the game",
    title: "Never bet the rent",
    body: "Only bet money you can lose and still sleep. Use a small piece of a separate pile, not the bills. If one loss would change your week, the bet is too big — even if you love the pick. Good bets still lose, so protect the bankroll first.",
    top: "68%",
  },
  {
    id: "dyor",
    n: 6,
    label: "DYOR",
    kicker: "Entertainment, not advice",
    title: "This is a classroom, not a tip sheet",
    body: "$UNDERDOG is for education and entertainment. Nothing here is financial advice, a guaranteed pick, or a promise of profit. Betting involves risk, and you can lose the entire stake. Odds and outcomes can change. Do your own research.",
    top: "78%",
  },
];

const LESSONS = [
  {
    n: "01",
    label: "Minus money",
    title: "What the minus number means.",
    body: "Minus money is the − minus sign next to a name or team, like −150. That's the favorite. At −150, you bet/risk $150 to win/make $100 profit. Since favorites are expected to win, they cost more to bet and pay less when they win.",
  },
  {
    n: "02",
    label: "Plus money",
    title: "What the plus number means.",
    body: "Plus money is the + plus sign next to a name or team, like +150. That is the underdog. At +150, you bet/risk $100 to win/make $150 profit. Underdogs are expected to lose, so they cost less to bet and pay more when they win.",
  },
  {
    n: "03",
    label: "The moneyline",
    title: "One fight. You pick who wins.",
    body: "The moneyline is a bet on who wins. No score or point spread to figure out. The minus number is the favorite and pays less. The plus number is the underdog and pays more. You simply choose who you think will win.",
  },
];

function Odds101() {
  const data = Route.useLoaderData();
  const ticker = data.kalshi.length ? data.kalshi : [CLASSROOM_PICK];

  return (
    <PageShell picks={ticker}>
      <main>
        <Infographic />
        <Classroom />
        <PayoutLab />
        <Parlays />
        <OddsTranslator />
        <div className="mx-auto max-w-5xl px-4 pt-10 pb-8 sm:pt-12 sm:pb-10">
          <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
            The six moves
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SPOTS.map((e) => (
              <article
                key={e.id}
                className="rounded-lg border border-line bg-surface/80 px-4 py-4 shadow-[inset_3px_0_0_var(--color-accent)]"
              >
                <p className="font-display text-2xl tracking-wide text-fg">
                  <span className="text-accent">{e.n}</span> {e.label}
                </p>
                <p className="text-base font-medium text-fg">{e.title}</p>
                <p className="mt-1 text-base leading-relaxed text-muted">{e.body}</p>
              </article>
            ))}
          </div>
        </div>
      </main>
    </PageShell>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <li className="min-w-0 rounded-md border border-line bg-bg/55 px-2 py-3">
      <p className="font-display text-xl leading-none tracking-wide text-accent sm:text-2xl">{n}</p>
      <p className="mt-1 text-[0.6rem] font-semibold tracking-wide text-muted uppercase">{label}</p>
    </li>
  );
}

function Classroom() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
        <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">Classroom</p>
        <h2 className="font-display text-5xl tracking-wide text-fg sm:text-6xl">Favorites pay less</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
          A favorite is the fighter or team expected to win. Because the favorite has the better chance on paper, the
          payout is smaller. You usually have to risk more money to win the same amount you could win by betting less
          on an underdog.
        </p>
        <ul className="mt-6 grid w-full max-w-lg grid-cols-3 gap-2">
          <Stat n="$10" label="Your bet" />
          <Stat n="+$$" label="If the favorite wins" />
          <Stat n="+$$$$" label="If the underdog wins" />
        </ul>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {LESSONS.map((e) => (
            <article
              key={e.n}
              className="rounded-lg border border-line bg-surface/80 px-4 py-4 shadow-[inset_3px_0_0_var(--color-accent)]"
            >
              <p className="font-mono text-xs text-accent">{e.n}</p>
              <p className="mt-1 font-display text-2xl tracking-wide text-fg">{e.label}</p>
              <p className="text-base font-medium text-fg">{e.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{e.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SpotCopy({ spot }: { spot: Spot }) {
  return (
    <div className="min-w-0 pr-8">
      <p className="text-xs font-semibold tracking-widest text-accent uppercase">
        {spot.n.toString().padStart(2, "0")} · {spot.kicker}
      </p>
      <h3 className="mt-1 font-display text-4xl leading-none tracking-wide text-fg">{spot.label}</h3>
      <p className="mt-1.5 text-sm leading-snug font-medium text-fg">{spot.title}</p>
      <p className="mt-1.5 text-sm leading-snug text-muted">{spot.body}</p>
    </div>
  );
}

function Hotspot({
  spot,
  open,
  onOpen,
  compact = false,
}: {
  spot: Spot;
  open: boolean;
  onOpen: (spot: Spot, el: HTMLElement) => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onOpen(spot, e.currentTarget);
      }}
      className="flex items-center gap-2"
      aria-expanded={open}
      data-hotspot=""
      aria-label={`${spot.n}. ${spot.label}`}
    >
      <span
        className={`flex items-center justify-center rounded-full border-2 border-fg bg-accent font-display text-accent-fg shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-bg)_55%,transparent)] ${compact ? "size-10 text-lg" : "size-12 text-xl"}`}
      >
        {spot.n}
      </span>
      <span className="rounded-sm bg-bg/85 px-2 py-1 font-display text-lg tracking-wide text-fg">{spot.label}</span>
    </button>
  );
}

function Infographic() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const [mobile, setMobile] = useState(true);
  const lock = useRef(0);
  const widthRef = useRef(0);

  const close = () => {
    if (Date.now() < lock.current) return;
    setOpenId(null);
    setPos(null);
  };

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setMobile(mq.matches);
    sync();
    widthRef.current = window.innerWidth;
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onResize = () => {
      if (window.innerWidth !== widthRef.current) {
        widthRef.current = window.innerWidth;
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    if (mobile) {
      return () => {
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("resize", onResize);
      };
    }
    const onDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.closest("[data-lesson-tip]") || t.closest("[data-hotspot]"))) return;
      close();
    };
    const t = window.setTimeout(() => document.addEventListener("mousedown", onDown), 400);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousedown", onDown);
    };
  }, [openId, mobile]);

  const open = SPOTS.find((s) => s.id === openId) ?? null;

  const onOpen = (spot: Spot, el: HTMLElement) => {
    lock.current = Date.now() + 500;
    setOpenId((cur) => (cur === spot.id ? null : spot.id));
    if (openId === spot.id) {
      setPos(null);
      return;
    }
    const r = el.getBoundingClientRect();
    const w = Math.min(380, window.innerWidth - 24);
    let left = r.left;
    if (left + w > window.innerWidth - 12) left = window.innerWidth - w - 12;
    if (left < 12) left = 12;
    let top = r.bottom + 10;
    if (top + 240 > window.innerHeight) top = Math.max(12, r.top - 250);
    setPos({ top, left, width: w });
  };

  return (
    <section className="overflow-hidden border-b border-line">
      <div className="relative h-[32rem] overflow-hidden bg-bg md:hidden">
        <img
          src="/odds-101-hero-mobile.jpg"
          alt=""
          className="pointer-events-none absolute inset-0 size-full object-cover object-[center_18%]"
          draggable={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/70 via-bg/20 to-bg/30" />
        <div className="pointer-events-none absolute inset-x-0 top-0 px-4 pt-5">
          <p className="text-[0.65rem] font-semibold tracking-widest text-accent uppercase">Infographic</p>
          <h2 className="font-display text-5xl leading-none tracking-wide text-fg">Odds 101</h2>
        </div>
        <div className="absolute inset-x-0 top-[7.25rem] bottom-3 z-10 flex flex-col justify-between px-4">
          {SPOTS.map((s) => (
            <Hotspot key={s.id} spot={s} open={openId === s.id} onOpen={onOpen} compact />
          ))}
        </div>
      </div>
      <div className="relative isolate hidden md:block md:aspect-video">
        <img
          src="/odds-101-hero.jpg"
          alt="Cane Corso in glasses teaching Odds 101"
          className="pointer-events-none absolute inset-0 size-full object-cover object-center"
          draggable={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg/80 via-bg/25 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/40 via-transparent to-bg/15" />
        <div className="pointer-events-none absolute inset-x-0 top-0 px-4 pt-8 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <p className="text-[0.65rem] font-semibold tracking-widest text-accent uppercase">Infographic</p>
            <h2 className="font-display text-5xl leading-none tracking-wide text-fg sm:text-6xl">Odds 101</h2>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0">
          <div className="relative mx-auto h-full max-w-5xl">
            {SPOTS.map((s) => (
              <div
                key={s.id}
                className={`pointer-events-auto absolute z-10 ${s.n % 2 === 0 ? "left-[46%]" : "left-5"}`}
                style={{ top: s.top }}
              >
                <Hotspot spot={s} open={openId === s.id} onOpen={onOpen} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {open && mobile && typeof document !== "undefined"
        ? createPortal(
            <>
              <button type="button" className="fixed inset-0 z-40 bg-bg/60" aria-label="Dismiss lesson" onClick={close} />
              <div
                data-lesson-tip=""
                className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-elevated px-4 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-xl"
              >
                <div className="relative mx-auto max-w-lg pr-10">
                  <SpotCopy spot={open} />
                  <button
                    type="button"
                    className="absolute top-0 right-0 inline-flex size-11 items-center justify-center rounded-sm text-muted hover:text-fg"
                    aria-label="Close"
                    onClick={close}
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>
            </>,
            document.body,
          )
        : null}
      {open && !mobile && pos && typeof document !== "undefined"
        ? createPortal(
            <div
              data-lesson-tip=""
              className="fixed z-50 rounded-lg border border-line bg-elevated p-4 shadow-xl"
              style={{ top: pos.top, left: pos.left, width: pos.width }}
            >
              <SpotCopy spot={open} />
              <button
                type="button"
                className="absolute top-2 right-2 inline-flex size-8 items-center justify-center rounded-sm text-muted hover:text-fg"
                aria-label="Close"
                onClick={close}
              >
                <X className="size-4" />
              </button>
            </div>,
            document.body,
          )
        : null}
    </section>
  );
}

const PARLAY_SHARE = "/odds-101#parlays";
const PARLAY_OPEN = "https://kalshi.com/";
const PARLAY_STAKE = 10;
const PARLAY_MIN = 2;
const PARLAY_MAX = 5;
const FAV_MULT = 1 + 100 / 150;
const DOG_MULT = 2.5;

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function Parlays() {
  const [count, setCount] = useState(3);
  const [sides, setSides] = useState<( "favorite" | "underdog")[]>([
    "favorite",
    "favorite",
    "favorite",
    "favorite",
    "favorite",
  ]);
  const [copied, setCopied] = useState<"card" | "link" | null>(null);
  const picks = sides.slice(0, count);
  const favs = picks.filter((s) => s === "favorite").length;
  const dogs = picks.length - favs;
  const payout = useMemo(
    () => Math.round(picks.reduce((acc, s) => acc * (s === "favorite" ? FAV_MULT : DOG_MULT), PARLAY_STAKE)),
    [picks],
  );
  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}${PARLAY_SHARE}` : `https://underdogpump.xyz${PARLAY_SHARE}`;
  const shareText =
    "A parlay is more than one pick on the same ticket. Every pick has to win. If one pick loses, you get nothing. " +
    shareUrl;

  function flash(kind: "card" | "link") {
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1600);
  }

  return (
    <section className="border-t border-line bg-surface" id="parlays">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
        <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">Next lesson</p>
        <h2 className="font-display text-5xl tracking-wide text-fg sm:text-6xl">Parlays</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
          A parlay is more than one pick on the same ticket. Every pick has to win. If one pick loses, the whole ticket
          pays $0. Tap the buttons. Watch the payout move.
        </p>
        <article className="mt-8 overflow-hidden rounded-xl border border-line bg-elevated">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line px-5 py-4 sm:px-8">
            <div>
              <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">Play with a ticket</p>
              <p className="font-display text-2xl tracking-wide text-fg">
                {count} {count === 1 ? "pick" : "picks"} · ${PARLAY_STAKE} bet
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Fewer picks"
                disabled={count <= PARLAY_MIN}
                onClick={() => setCount((n) => Math.max(PARLAY_MIN, n - 1))}
                className="inline-flex size-11 items-center justify-center rounded-md border border-line bg-bg text-fg disabled:opacity-30 hover:border-accent"
              >
                <Minus className="size-4" />
              </button>
              <span className="min-w-16 text-center font-mono text-xs tracking-widest text-muted uppercase">
                {count} of {PARLAY_MAX}
              </span>
              <button
                type="button"
                aria-label="More picks"
                disabled={count >= PARLAY_MAX}
                onClick={() => setCount((n) => Math.min(PARLAY_MAX, n + 1))}
                className="inline-flex size-11 items-center justify-center rounded-md border border-line bg-bg text-fg disabled:opacity-30 hover:border-accent"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>
          <ol className="divide-y divide-line">
            {picks.map((side, i) => (
              <li key={i} className="flex flex-wrap items-center gap-3 px-5 py-4 sm:px-8">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-line bg-bg font-display text-lg text-muted">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-xl tracking-wide text-fg">Fight {i + 1}</p>
                  <p className="text-sm text-muted">{side === "favorite" ? "Favorite · -150" : "Underdog · +150"}</p>
                </div>
                <div className="flex rounded-md border border-line p-1">
                  <button
                    type="button"
                    onClick={() =>
                      setSides((prev) => prev.map((s, idx) => (idx === i ? "favorite" : s)))
                    }
                    className={`min-h-10 rounded-sm px-3 text-sm font-semibold ${side === "favorite" ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"}`}
                  >
                    Favorite
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSides((prev) => prev.map((s, idx) => (idx === i ? "underdog" : s)))
                    }
                    className={`min-h-10 rounded-sm px-3 text-sm font-semibold ${side === "underdog" ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"}`}
                  >
                    Underdog
                  </button>
                </div>
              </li>
            ))}
          </ol>
          <div className="grid gap-0 border-t border-line sm:grid-cols-2">
            <div className="border-b border-line px-5 py-5 sm:border-r sm:border-b-0 sm:px-8">
              <p className="text-[0.7rem] font-semibold tracking-widest text-muted uppercase">If every pick wins</p>
              <p className="mt-1 font-display text-5xl leading-none tracking-wide text-accent">{money(payout)}</p>
              <p className="mt-2 text-sm text-muted">
                {favs} {favs === 1 ? "favorite" : "favorites"} · {dogs} {dogs === 1 ? "underdog" : "underdogs"}
              </p>
            </div>
            <div className="bg-accent/10 px-5 py-5 sm:px-8">
              <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">If one pick loses</p>
              <p className="mt-1 font-display text-5xl leading-none tracking-wide text-accent">$0</p>
              <p className="mt-2 text-sm text-fg">The other wins do not count.</p>
            </div>
          </div>
          <p className="border-t border-line px-5 py-4 text-base leading-relaxed text-fg sm:px-8">
            More picks can pay more. They also need more things to go right. This ticket uses the same classroom
            numbers: -150 on a favorite, +150 on an underdog. Real apps change those numbers every fight.
          </p>
          <div className="flex flex-wrap gap-2 border-t border-line px-5 py-4 sm:px-8">
            <button
              type="button"
              onClick={async () => {
                if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
                  try {
                    await navigator.share({ title: "$UNDERDOG · Parlays", text: shareText, url: shareUrl });
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
              href={PARLAY_OPEN}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line px-4 py-2.5 text-sm font-semibold text-fg no-underline hover:border-accent"
            >
              Open Kalshi
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}

function parseStake(raw: string) {
  const n = Number(String(raw).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function dollars(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  });
}

function profit(stake: number, american: number) {
  return american < 0 ? (100 / Math.abs(american)) * stake : (american / 100) * stake;
}

function signed(n: number) {
  return n > 0 ? `+${n}` : `${n}`;
}

function PayoutLab() {
  const [raw, setRaw] = useState("10");
  const [line, setLine] = useState(150);
  const [lost, setLost] = useState<"favorite" | "underdog" | null>(null);
  const stake = parseStake(raw) || 10;
  const fav = -line;
  const dog = line;
  const favPays = useMemo(() => Math.round((stake + profit(stake, fav)) * 100) / 100, [stake, fav]);
  const dogPays = useMemo(() => Math.round((stake + profit(stake, dog)) * 100) / 100, [stake, dog]);

  return (
    <section className="border-t border-line bg-surface" id="payout-lab">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12 max-md:py-6">
        <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">Play money</p>
        <h2 className="font-display text-5xl tracking-wide text-fg sm:text-6xl max-md:text-4xl">Favorite vs Underdog</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted max-md:hidden">
          Type a bet. Drag the line. Watch the favorite pay less and the underdog pay more. Tap a ticket to see a
          loss. Practice money only.
        </p>
        <div className="mt-8 rounded-xl border border-line bg-elevated px-5 py-6 sm:px-8 max-md:mt-4 max-md:px-3 max-md:py-3">
          <div className="flex flex-wrap items-end justify-between gap-6 max-md:gap-2">
            <label className="block min-w-56 flex-1 max-md:min-w-0">
              <span className="block text-sm font-semibold tracking-widest text-accent uppercase max-md:text-[0.65rem]">
                Your bet on each side
              </span>
              <span className="mt-3 flex h-14 max-w-xs items-center rounded-md border border-line bg-bg px-3 max-md:mt-1.5 max-md:h-11">
                <span className="pr-2 font-display text-3xl text-accent max-md:text-2xl">$</span>
                <input
                  value={raw}
                  onChange={(e) => {
                    setRaw(e.target.value);
                    setLost(null);
                  }}
                  inputMode="decimal"
                  autoComplete="off"
                  className="h-full min-w-0 flex-1 bg-transparent font-display text-3xl tracking-wide text-accent outline-none max-md:text-2xl"
                />
              </span>
            </label>
            <p className="pb-2 font-mono text-sm tracking-widest text-muted uppercase max-md:pb-0 max-md:text-[0.65rem]">
              Favorite {signed(fav)} · Underdog {signed(dog)}
            </p>
          </div>
          <label className="mt-6 block max-md:mt-3">
            <span className="flex justify-between text-sm font-semibold tracking-widest text-muted uppercase max-md:text-[0.65rem]">
              <span>Bigger favorite</span>
              <span>Bigger underdog</span>
            </span>
            <input
              type="range"
              min={100}
              max={500}
              step={10}
              value={line}
              onChange={(e) => {
                setLine(Number(e.target.value));
                setLost(null);
              }}
              className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-line accent-[var(--color-accent)] max-md:mt-2"
            />
          </label>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 max-md:mt-2 max-md:grid-cols-2 max-md:gap-2">
          <button
            type="button"
            onClick={() => setLost((v) => (v === "favorite" ? null : "favorite"))}
            className={`rounded-xl border px-5 py-6 text-left transition max-md:px-3 max-md:py-3 ${lost === "favorite" ? "border-accent bg-accent/10" : "border-line bg-elevated hover:border-accent"}`}
          >
            <p className="text-sm font-semibold tracking-widest text-muted uppercase max-md:text-[0.6rem]">
              The favorite · {signed(fav)}
            </p>
            <p className="mt-2 font-display text-4xl tracking-wide text-fg sm:text-5xl max-md:mt-1 max-md:text-xl">
              Expected to win
            </p>
            <p className="mt-6 text-sm font-semibold tracking-widest text-muted uppercase max-md:mt-2 max-md:text-[0.6rem]">
              If this side wins
            </p>
            <p
              className={`font-display text-6xl leading-none tracking-wide max-md:text-3xl ${lost === "favorite" ? "text-muted line-through" : "text-fg"}`}
            >
              {lost === "favorite" ? "$0" : dollars(favPays)}
            </p>
            <p className="mt-4 text-base text-muted max-md:mt-1.5 max-md:text-xs">
              {lost === "favorite" ? "Tapped lose. The bet is gone." : "Tap this ticket to mark a loss."}
            </p>
          </button>
          <button
            type="button"
            onClick={() => setLost((v) => (v === "underdog" ? null : "underdog"))}
            className={`rounded-xl border px-5 py-6 text-left transition max-md:px-3 max-md:py-3 ${lost === "underdog" ? "border-accent bg-accent/10" : "border-accent/60 bg-accent/10 hover:border-accent"}`}
          >
            <p className="text-sm font-semibold tracking-widest text-accent uppercase max-md:text-[0.6rem]">
              The underdog · {signed(dog)}
            </p>
            <p className="mt-2 font-display text-4xl tracking-wide text-accent sm:text-5xl max-md:mt-1 max-md:text-xl">
              Expected to lose
            </p>
            <p className="mt-6 text-sm font-semibold tracking-widest text-muted uppercase max-md:mt-2 max-md:text-[0.6rem]">
              If this side wins
            </p>
            <p
              className={`font-display text-6xl leading-none tracking-wide max-md:text-3xl ${lost === "underdog" ? "text-muted line-through" : "text-accent"}`}
            >
              {lost === "underdog" ? "$0" : dollars(dogPays)}
            </p>
            <p className="mt-4 text-base text-fg max-md:mt-1.5 max-md:text-xs">
              {lost === "underdog" ? "Tapped lose. The bet is gone." : "Tap this ticket to mark a loss."}
            </p>
          </button>
        </div>
      </div>
    </section>
  );
}
