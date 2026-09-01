import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { LESSONS } from "@/lib/site";

type Lesson = (typeof LESSONS)[number];

export function OddsBoard() {
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
    const timer = window.setTimeout(() => document.addEventListener("mousedown", onDown), 400);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousedown", onDown);
    };
  }, [openId, mobile]);

  const spot = LESSONS.find((l) => l.id === openId) ?? null;

  const onOpen = (lesson: Lesson, el: HTMLElement) => {
    lock.current = Date.now() + 500;
    setOpenId((id) => (id === lesson.id ? null : lesson.id));
    if (openId === lesson.id) {
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
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted">Tap a number</p>
      <div className="overflow-hidden rounded-xl border border-line bg-bg">
        <div className="relative h-[32rem] w-full overflow-hidden bg-bg md:h-auto md:min-h-[28rem] md:aspect-video">
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
            <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-accent">
              Infographic
            </p>
            <h2 className="font-display text-5xl leading-none tracking-wide text-fg sm:text-6xl">
              Odds 101
            </h2>
            <p className="mt-1 max-w-sm text-sm text-muted">How a long shot is priced. Tap a number.</p>
          </div>
          <div className="absolute inset-x-0 top-[7.25rem] bottom-3 z-10 flex flex-col justify-between px-4 md:hidden">
            {LESSONS.map((lesson) => (
              <Hotspot key={lesson.id} spot={lesson} open={openId === lesson.id} onOpen={onOpen} compact />
            ))}
          </div>
          <div className="hidden md:block">
            {LESSONS.map((lesson) => (
              <div
                key={lesson.id}
                className={`absolute z-10 ${lesson.n % 2 === 0 ? "left-[46%]" : "left-5"}`}
                style={{ top: lesson.top }}
              >
                <Hotspot spot={lesson} open={openId === lesson.id} onOpen={onOpen} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {spot && mobile
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
                  <LessonBody spot={spot} />
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
      {spot && !mobile && pos
        ? createPortal(
            <div
              data-lesson-tip=""
              className="fixed z-50 rounded-lg border border-line bg-elevated p-4 shadow-xl"
              style={{ top: pos.top, left: pos.left, width: pos.width }}
            >
              <LessonBody spot={spot} />
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

function LessonBody({ spot }: { spot: Lesson }) {
  return (
    <div className="min-w-0 pr-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">
        {spot.n.toString().padStart(2, "0")} · {spot.kicker}
      </p>
      <h3 className="mt-1 font-display text-4xl leading-none tracking-wide text-fg">{spot.label}</h3>
      <p className="mt-2 text-lg font-medium leading-snug text-fg">{spot.title}</p>
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
  onOpen: (spot: Lesson, el: HTMLElement) => void;
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
      <span className="rounded-sm bg-bg/85 px-2 py-1 font-display text-lg tracking-wide text-fg">
        {spot.label}
      </span>
    </button>
  );
}
