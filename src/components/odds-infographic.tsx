import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LESSONS, type Lesson } from "@/lib/site";

function Tip({ spot }: { spot: Lesson }) {
  return (
    <div className="min-w-0 pr-8">
      <p className="text-xs font-semibold tracking-widest text-accent uppercase">
        {spot.n.toString().padStart(2, "0")} · {spot.kicker}
      </p>
      <h3 className="mt-1 font-display text-4xl leading-none tracking-wide text-fg">{spot.label}</h3>
      <p className="mt-2 text-lg leading-snug font-medium text-fg">{spot.title}</p>
      <p className="mt-2 text-base leading-relaxed text-muted sm:text-lg">{spot.body}</p>
    </div>
  );
}

function Hotspot({
  spot,
  open,
  onOpen,
  compact = false,
}: {
  spot: Lesson;
  open: boolean;
  onOpen: (spot: Lesson, el: HTMLButtonElement) => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onOpen(spot, event.currentTarget);
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
      <span className="rounded-sm bg-bg/85 px-2 py-1 font-display text-lg tracking-wide text-fg">
        {spot.label}
      </span>
    </button>
  );
}

export function OddsInfographic() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const [mobile, setMobile] = useState(true);
  const lockUntil = useRef(0);
  const widthRef = useRef(0);

  const close = () => {
    if (Date.now() < lockUntil.current) return;
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
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
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
    const onDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.closest("[data-lesson-tip]") || target.closest("[data-hotspot]"))) {
        return;
      }
      close();
    };
    const timer = window.setTimeout(() => document.addEventListener("mousedown", onDown), 400);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousedown", onDown);
    };
  }, [openId, mobile]);

  const openSpot = LESSONS.find((item) => item.id === openId) ?? null;

  const onOpen = (spot: Lesson, el: HTMLButtonElement) => {
    lockUntil.current = Date.now() + 500;
    setOpenId((current) => (current === spot.id ? null : spot.id));
    if (openId === spot.id) {
      setPos(null);
      return;
    }
    const box = el.getBoundingClientRect();
    const width = Math.min(380, window.innerWidth - 24);
    let left = box.left;
    if (left + width > window.innerWidth - 12) left = window.innerWidth - width - 12;
    if (left < 12) left = 12;
    let top = box.bottom + 10;
    if (top + 240 > window.innerHeight) top = Math.max(12, box.top - 250);
    setPos({ top, left, width });
  };

  return (
    <section className="w-full">
      <p className="mb-3 text-xs font-medium tracking-widest text-muted uppercase">Tap a number</p>
      <div className="overflow-hidden rounded-xl border border-line bg-bg">
        <div className="relative h-[32rem] w-full overflow-hidden bg-bg md:aspect-video md:h-auto md:min-h-[28rem]">
          <img
            src="/hero-mobile.jpg"
            alt=""
            className="pointer-events-none absolute inset-0 size-full object-cover object-[center_12%] md:hidden"
            draggable={false}
          />
          <img
            src="/hero-dog-v4.jpg"
            alt="Cane Corso in the rain, crimson rim light, spiked collar"
            className="pointer-events-none absolute inset-0 hidden size-full object-cover object-[82%_8%] md:block"
            draggable={false}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg/80 via-bg/25 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/50 via-transparent to-bg/20" />
          <div className="pointer-events-none absolute inset-x-0 top-0 px-4 pt-5 sm:px-8 sm:pt-8">
            <p className="text-[0.65rem] font-semibold tracking-widest text-accent uppercase">
              Infographic
            </p>
            <h2 className="font-display text-5xl leading-none tracking-wide text-fg sm:text-6xl">
              Odds 101
            </h2>
            <p className="mt-1 max-w-sm text-sm text-muted">How a long shot is priced. Tap a number.</p>
          </div>
          <div className="absolute inset-x-0 top-[7.25rem] bottom-3 z-10 flex flex-col justify-between px-4 md:hidden">
            {LESSONS.map((spot) => (
              <Hotspot
                key={spot.id}
                spot={spot}
                open={openId === spot.id}
                onOpen={onOpen}
                compact
              />
            ))}
          </div>
          <div className="hidden md:block">
            {LESSONS.map((spot) => (
              <div
                key={spot.id}
                className={`absolute z-10 ${spot.n % 2 === 0 ? "left-[46%]" : "left-5"}`}
                style={{ top: spot.top }}
              >
                <Hotspot spot={spot} open={openId === spot.id} onOpen={onOpen} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {openSpot && mobile && typeof document !== "undefined"
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
                className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-elevated px-4 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-xl"
              >
                <div className="relative mx-auto max-w-lg pr-10">
                  <Tip spot={openSpot} />
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
      {openSpot && !mobile && pos && typeof document !== "undefined"
        ? createPortal(
            <div
              data-lesson-tip=""
              className="fixed z-50 rounded-lg border border-line bg-elevated p-4 shadow-xl"
              style={{ top: pos.top, left: pos.left, width: pos.width }}
            >
              <Tip spot={openSpot} />
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
