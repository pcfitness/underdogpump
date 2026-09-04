import { createServerFn } from "@tanstack/react-start";

const COOKIE = "ud_vid";
const BASELINE = 378;
const FILE = "/tmp/ud-visitors.json";

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

type Counts = { total: number; online: number };

type FileStore = {
  total: number;
  sessions: Record<string, number>;
};

async function pingDb(id: string): Promise<Counts> {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();

  await sql`
    create table if not exists visitor_counters (
      id text primary key,
      total bigint not null default 0
    )
  `;
  await sql`
    create table if not exists visitor_sessions (
      id text primary key,
      last_seen timestamptz not null default now()
    )
  `;
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
}

async function pingFile(id: string): Promise<Counts> {
  const fs = await import("node:fs");
  let data: FileStore = { total: BASELINE, sessions: {} };
  try {
    const parsed = JSON.parse(fs.readFileSync(FILE, "utf8")) as FileStore;
    if (Number.isFinite(parsed.total)) data.total = parsed.total;
    if (parsed.sessions && typeof parsed.sessions === "object") data.sessions = parsed.sessions;
  } catch {
    /* first write */
  }

  const now = Date.now();
  const isNew = !data.sessions[id];
  if (data.total < BASELINE) data.total = BASELINE;
  if (isNew) data.total += 1;
  data.sessions[id] = now;

  for (const [key, seen] of Object.entries(data.sessions)) {
    if (now - seen > 86_400_000) delete data.sessions[key];
  }

  try {
    fs.writeFileSync(FILE, JSON.stringify(data));
  } catch {
    /* /tmp can be missing on some runtimes; still return the in-memory result */
  }

  const online = Object.values(data.sessions).filter((seen) => now - seen < 90_000).length;
  return { total: data.total, online: Math.max(online, 1) };
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

    try {
      return await pingDb(id);
    } catch {
      return pingFile(id);
    }
  });
