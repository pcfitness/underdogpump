import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { HOTSPOTS, type Hotspot } from "@/lib/content";

type TipPos = { top: number; left: number; width: number };

export function HotspotPoster() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [tip, setTip] = useState<TipPos | null>(null);
  const [narrow, setNarrow] = useState(true);
  const ignoreCloseUntil = useRef(0);
  const widthRef = useRef(0);

  const close = () => {
    if (Date.now() < ignoreCloseUntil.current) return;
    setOpenId(null);
    setTip(null);
  };

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setNarrow(media.matches);
    sync();
    widthRef.current = window.innerWidth;
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
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

    if (narrow) {
      return () => {
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("resize", onResize);
      };
    }

    const onDoc = (e: MouseEvent) => {
      const node = e.target as HTMLElement | null;
      if (!node) return;
      if (node.closest("[data-lesson-tip]") || node.closest("[data-hotspot]")) return;
      close();
    };
    const timer = window.setTimeout(() => {
      document.addEventListener("mousedown", onDoc);
    }, 400);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousedown", onDoc);
    };
  }, [openId, narrow]);

  const selected = HOTSPOTS.find((spot) => spot.id === openId) ?? null;

  const openFrom = (spot: Hotspot, el: HTMLElement) => {
    ignoreCloseUntil.current = Date.now() + 500;
    setOpenId((id) => (id === spot.id ? null : spot.id));
    if (openId === spot.id) {
      setTip(null);
      return;
    }
    const rect = el.getBoundingClientRect();
    const width = Math.min(380, window.innerWidth - 24);
    let left = rect.left;
    if (left + width > window.innerWidth - 12) left = window.innerWidth - width - 12;
    if (left < 12) left = 12;
    let top = rect.bottom + 10;
    if (top + 240 > window.innerHeight) top = Math.max(12, rect.top - 250);
    setTip({ top, left, width });
  };

  return (
    <section className="w-full">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted">Tap a number</p>

      <div className="overflow-hidden rounded-xl border border-line bg-bg">
        <div className="relative aspect-[9/16] min-h-[32rem] w-full overflow-hidden bg-bg md:aspect-[16/9] md:min-h-[28rem]">
          <img
            src="/hero-dog-v4.jpg"
            alt=""
            className="pointer-events-none absolute inset-0 size-full object-cover object-[center_20%] md:hidden"
            draggable={false}
          />
          <img
            src="/hero-dog-v4.jpg"
            alt="Cane Corso in the rain, crimson rim light, spiked collar"
            className="pointer-events-none absolute inset-0 hidden size-full object-cover object-[82%_8%] md:block"
            draggable={false}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg/70 via-bg/20 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/50 via-transparent to-bg/15" />

          <div className="pointer-events-none absolute inset-x-0 top-0 px-5 pt-6 sm:px-8 sm:pt-8">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-accent">
              Infographic
            </p>
            <h2 className="font-display text-5xl leading-none tracking-wide text-fg sm:text-6xl">
              Odds 101
            </h2>
            <p className="mt-1 max-w-sm text-sm text-muted">How a long shot is priced. Tap a number.</p>
          </div>

          {HOTSPOTS.map((spot) => (
            <button
              key={spot.id}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openFrom(spot, e.currentTarget);
              }}
              className={`absolute z-10 flex items-center gap-2 ${
                spot.n % 2 === 0 ? "left-5 md:left-[46%]" : "left-5"
              }`}
              style={{ top: spot.top }}
              aria-expanded={openId === spot.id}
              data-hotspot=""
              aria-label={`${spot.n}. ${spot.label}`}
            >
              <span className="flex size-12 items-center justify-center rounded-full border-2 border-fg bg-accent font-display text-xl text-accent-fg shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-bg)_55%,transparent)]">
                {spot.n}
              </span>
              <span className="rounded-sm bg-bg/80 px-2 py-1 font-display text-lg tracking-wide text-fg">
                {spot.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {selected && narrow
        ? createPortal(
            <>
              <button
                type="button"
                className="fixed inset-0 z-40 bg-bg/60"
                aria-label="Dismiss lesson"
                onClick={close}
              />
              <div
                data-lesson-tip=""
                className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-elevated px-4 pt-4 shadow-xl pb-[max(1.25rem,env(safe-area-inset-bottom))]"
              >
                <div className="relative mx-auto max-w-lg pr-10">
                  <LessonBody spot={selected} />
                  <button
                    type="button"
                    className="absolute right-0 top-0 inline-flex size-11 items-center justify-center rounded-sm text-muted hover:text-fg"
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

      {selected && !narrow && tip
        ? createPortal(
            <div
              data-lesson-tip=""
              className="fixed z-50 rounded-lg border border-line bg-elevated p-4 shadow-xl"
              style={{ top: tip.top, left: tip.left, width: tip.width }}
            >
              <LessonBody spot={selected} />
              <button
                type="button"
                className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-sm text-muted hover:text-fg"
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

function LessonBody({ spot }: { spot: Hotspot }) {
  return (
    <div className="min-w-0 pr-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        {spot.n.toString().padStart(2, "0")} · {spot.kicker}
      </p>
      <h3 className="mt-1 font-display text-4xl leading-none tracking-wide text-fg">{spot.label}</h3>
      <p className="mt-2 text-lg font-medium leading-snug text-fg">{spot.title}</p>
      <p className="mt-2 text-base leading-relaxed text-muted sm:text-lg">{spot.body}</p>
    </div>
  );
}
