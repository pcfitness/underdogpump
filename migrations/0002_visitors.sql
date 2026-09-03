create table if not exists visitor_counters (
  id text primary key,
  total bigint not null default 0
);

insert into visitor_counters (id, total)
values ('all', 0)
on conflict (id) do nothing;

create table if not exists visitor_sessions (
  id text primary key,
  last_seen timestamptz not null default now()
);

create index if not exists visitor_sessions_last_seen_idx
  on visitor_sessions (last_seen);
