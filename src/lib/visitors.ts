import { createServerFn } from "@tanstack/react-start";

const COOKIE = "ud_vid";
const BASELINE = 378;

function newId() {
  return crypto.randomUUID();
}

function isVid(value: string | undefined): value is string {
  return typeof value === "string" && value.length >= 8 && value.length <= 80;
}

function pickId(cookie: string | undefined, clientId: string) {
  if (isVid(cookie)) return cookie;
  if (isVid(clientId)) return clientId;
  return newId();
}

export const pingVisitor = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const raw =
      input && typeof input === "object" && "clientId" in input
        ? (input as { clientId?: unknown }).clientId
        : "";
    return {
      clientId: typeof raw === "string" ? raw.slice(0, 80) : "",
    };
  })
  .handler(async ({ data }) => {
    const { getCookie, setCookie } = await import("@tanstack/react-start/server");
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();

    const id = pickId(getCookie(COOKIE), data.clientId);
    try {
      setCookie(COOKIE, id, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
        secure: true,
      });
    } catch {
      /* clientId in localStorage still identifies the browser */
    }

    await sql`
      insert into visitor_counters (id, total)
      values ('all', ${BASELINE})
      on conflict (id) do nothing
    `;

    const inserted = await sql<{ id: string }>`
      insert into visitor_sessions (id, last_seen)
      values (${id}, now())
      on conflict (id) do nothing
      returning id
    `;

    if (!inserted.length) {
      await sql`update visitor_sessions set last_seen = now() where id = ${id}`;
    }

    const [current] = await sql<{ total: number }>`
      select total from visitor_counters where id = 'all'
    `;
    const n = Number(current?.total ?? 0);
    if (n < BASELINE) {
      await sql`
        update visitor_counters
        set total = ${BASELINE}
        where id = 'all' and total < ${BASELINE}
      `;
    } else if (inserted.length) {
      await sql`
        update visitor_counters
        set total = total + 1
        where id = 'all'
      `;
    }

    const [countRow] = await sql<{ total: number }>`
      select total from visitor_counters where id = 'all'
    `;
    const [onlineRow] = await sql<{ n: number }>`
      select count(*)::int as n
      from visitor_sessions
      where last_seen > now() - interval '90 seconds'
    `;

    return {
      total: Number(countRow?.total ?? BASELINE),
      online: Math.max(Number(onlineRow?.n ?? 0), 1),
    };
  });
