import { createServerFn } from "@tanstack/react-start";

const COOKIE = "ud_vid";
const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function newId() {
  return crypto.randomUUID();
}

function pickId(cookie: string | undefined, clientId: string) {
  if (cookie && UUID.test(cookie)) return cookie;
  if (clientId && UUID.test(clientId)) return clientId;
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
    setCookie(COOKIE, id, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      secure: true,
    });

    const inserted = await sql<{ id: string }>`
      insert into visitor_sessions (id, last_seen)
      values (${id}, now())
      on conflict (id) do nothing
      returning id
    `;

    if (inserted.length) {
      await sql`update visitor_counters set total = total + 1 where id = 'all'`;
    } else {
      await sql`update visitor_sessions set last_seen = now() where id = ${id}`;
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
      total: Number(countRow?.total ?? 0),
      online: Number(onlineRow?.n ?? 1),
    };
  });
