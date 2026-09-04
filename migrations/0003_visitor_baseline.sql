insert into visitor_counters (id, total)
values ('all', 378)
on conflict (id) do update
set total = greatest(visitor_counters.total, 378);
