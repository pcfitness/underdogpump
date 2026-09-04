update visitor_counters
set total = greatest(total, 378)
where id = 'all';
