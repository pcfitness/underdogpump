import { useEffect, useState } from "react";
import { pingVisitor } from "@/lib/visitors";

const SEG = {
  "0": "abcdef",
  "1": "bc",
  "2": "abged",
  "3": "abgcd",
  "4": "fgbc",
  "5": "afgcd",
  "6": "afgedc",
  "7": "abc",
  "8": "abcdefg",
  "9": "abfgcd",
} as const;

function LedDigit({ value }: { value: string }) {
  const on = SEG[value as keyof typeof SEG] ?? "";
  return (
    <span className="led-digit" aria-hidden="true">
      {(["a", "b", "c", "d", "e", "f", "g"] as const).map((seg) => (
        <i
          key={seg}
          className={on.includes(seg) ? `led-seg led-seg-${seg} is-on` : `led-seg led-seg-${seg}`}
        />
      ))}
    </span>
  );
}

function pad(n: number) {
  const safe = Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  return String(safe).padStart(6, "0").slice(-8);
}

export function VisitorClock() {
  const [total, setTotal] = useState(0);
  const [online, setOnline] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    let timer: number | undefined;

    const key = "ud_vid";
    let clientId = "";
    try {
      clientId = localStorage.getItem(key) ?? "";
      if (!clientId) {
        clientId = crypto.randomUUID();
        localStorage.setItem(key, clientId);
      }
    } catch {
      clientId = crypto.randomUUID();
    }

    const beat = async () => {
      try {
        const next = await pingVisitor({ data: { clientId } });
        if (!alive) return;
        setTotal(next.total);
        setOnline(next.online);
        setReady(true);
      } catch {
        if (alive) setReady(true);
      }
    };

    const loop = () => {
      void beat();
      timer = window.setTimeout(loop, document.hidden ? 20000 : 4000);
    };

    void beat();
    timer = window.setTimeout(loop, 4000);
    const onVis = () => {
      if (!document.hidden) void beat();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      alive = false;
      if (timer) window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const digits = pad(total).split("");

  return (
    <div className="visitor-clock-wrap">
      <div className="visitor-clock" aria-live="polite">
        <p className="visitor-clock-label">Visitors</p>
        <p className="sr-only">
          {ready ? `${total} visitors. ${online} online now.` : "Loading visitor count."}
        </p>
        <div className="visitor-clock-face">
          {digits.map((d, i) => (
            <LedDigit key={`${i}-${d}`} value={d} />
          ))}
        </div>
        <p className="visitor-clock-online">
          {ready ? `${online} online` : "live"}
        </p>
      </div>
    </div>
  );
}
