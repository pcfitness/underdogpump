import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const seen = new Map<string, number>();
const ONLINE_MS = 20_000;

export const pingVisitors = createServerFn({ method: "POST" })
  .validator(z.object({ clientId: z.string().min(8).max(80) }))
  .handler(async ({ data }) => {
    const now = Date.now();
    const id = data.clientId.slice(0, 80);
    seen.set(id, now);
    for (const [key, at] of seen) {
      if (now - at > 7 * 24 * 60 * 60 * 1000) seen.delete(key);
    }
    const online = [...seen.values()].filter((at) => now - at < ONLINE_MS).length;
    return { total: seen.size, online };
  });
