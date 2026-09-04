import { useState } from "react";
import { SITE } from "@/lib/site";

function shortCa(ca: string) {
  if (ca.length < 16) return ca;
  return `${ca.slice(0, 6)}…${ca.slice(-6)}`;
}

export function CopyCa({ variant = "chip" }: { variant?: "chip" | "meta" }) {
  const ca = SITE.contract.trim();
  const [copied, setCopied] = useState(false);

  if (!ca) {
    return variant === "chip" ? (
      <span className="rounded-sm border border-line bg-bg/70 px-2.5 py-1 font-mono text-[0.7rem] tracking-widest text-fg uppercase">
        Contract TBA
      </span>
    ) : (
      <>To be announced</>
    );
  }

  function copy() {
    void navigator.clipboard.writeText(ca);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  if (variant === "meta") {
    return (
      <button
        type="button"
        onClick={copy}
        title="Copy contract"
        className="max-w-full truncate font-mono text-sm text-fg hover:text-accent"
      >
        {copied ? "Copied" : shortCa(ca)}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={copy}
      title="Copy contract"
      className="rounded-sm border border-line bg-bg/70 px-2.5 py-1 font-mono text-[0.7rem] tracking-wide text-fg hover:border-accent hover:text-accent"
    >
      {copied ? "Copied" : shortCa(ca)}
    </button>
  );
}
