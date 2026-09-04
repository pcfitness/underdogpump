import { useEffect, useState } from "react";
import { pingVisitor } from "@/lib/visitors";

const SEG: Record<string, string> = {
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
};

function Digit({ value }: { value: string }) {
  const on = SEG[value] ?? "";
  return (
    <span className="led-digit" aria-hidden="true">
      {["a", "b", "c", "d", "e", "f", "g"].map((seg) => (
        <i key={seg} className={on.includes(seg) ? `led-seg led-seg-${seg} is-on` : `led-seg led-seg-${seg}`} />
      ))}
    </span>
  );
}

function pad(n: number) {
  return String(Number.isFinite(n) && n > 0 ? Math.floor(n) : 0)
    .padStart(6, "0")
    .slice(-8);
}

function visitorId() {
  const key = "ud_vid";
  try {
    let id = localStorage.getItem(key) ?? "";
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export function VisitorClock() {
  const [total, setTotal] = useState(0);
  const [online, setOnline] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    let timer: number;
    const id = visitorId();

    const ping = async () => {
      try {
        const n = await pingVisitor({ data: { clientId: id } });
        if (!alive) return;
        setTotal(n.total);
        setOnline(n.online);
        setReady(true);
      } catch {
        /* keep retrying; don't lock the face on 0 */
      }
    };

    const loop = () => {
      void ping();
      timer = window.setTimeout(loop, document.hidden ? 20_000 : 4_000);
    };
    void ping();
    timer = window.setTimeout(loop, 4_000);
    const onVis = () => {
      if (!document.hidden) void ping();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      alive = false;
      window.clearTimeout(timer);
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
            <Digit key={`${i}-${d}`} value={d} />
          ))}
        </div>
        <p className="visitor-clock-online">{ready ? `${online} online` : "live"}</p>
      </div>
    </div>
  );
}
