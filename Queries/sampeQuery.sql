# delay summary all airports
select f.origin, f.dest as destination, count(*) as count,
	sum(arrdelay) as total_arrival_delay_minutes,
    d.number_of_delays,
    (d.number_of_delays * 100)/count(*) as delayPercentage
from ontime f,
	(select origin,
		dest,
        count(arrdelay) as number_of_delays
     from ontime
     where arrdelay > 15
     and year=2008
     group by origin, dest) d
where f.origin = d.origin and f.dest = d.dest and year=2008
group by f.origin, f.dest, d.number_of_delays;

# delay summary daily breakdown query sample
select to_char(to_timestamp (month::text, 'MM'), 'TMmonth') as flightMonth,
		(dayofmonth -1) as dayfrom,
        dayofmonth as dayto, -- the day the data is for
        count(arrdelay) as number_of_delays,
        to_date((year || '-' || month  || '-' || dayofmonth), 'YYYY-MM-DD') as flightdate
     from ontime
     where arrdelay > 15
     and year=2008
     group by flightdate, month, dayofmonth
     order by flightdate asc;

# early flights airports
select origin, dest as destination, count(*) as count from ontime
where year=2008
group by origin, dest
order by origin, dest


# airport export with breakdowns

select a.iata as iata,
		a.airport as name, a.state,
        a.country, lat as latitude,
        long as longitude,
        o.count as totalflights,
        o.number_of_delays as numberofdelays,
        o.delayPercentage as delayPercentage

from airports a left outer join

(select f.origin, count(*) as count,
	sum(arrdelay) as total_arrival_delay_minutes,
    d.number_of_delays,
    (d.number_of_delays * 100)/count(*) as delayPercentage
from ontime f,
	(select origin,
        count(arrdelay) as number_of_delays
     from ontime
     where arrdelay > 15
     and year=2008
     group by origin) d
where f.origin = d.origin and year=2008
group by f.origin, d.number_of_delays) o

on a.iata = o.origin;
	


# index samples

create index flightorigin on ontime (origin);
create index flightdest on ontime (dest);
create index flightarrdelay on ontime (arrdelay);
create index flightroutes on ontime (origin,dest);
create index flightroutesdelays on ontime (origin,dest,arrdelay);
