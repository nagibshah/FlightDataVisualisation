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
	

# daily heatmap of delays  1987 - 2008 
select f.year, f.month, f.dayofmonth, count(*) as totalflights,
    (d.number_of_delays * 100)/count(*) as delayPercentage
from ontime f,
	(select year, month, dayofmonth,
        count(arrdelay) as number_of_delays
     from ontime
     where arrdelay > 15
     group by year,month,dayofmonth) d
where f.year = d.year and 
	f.month = d.month and 
    f.dayofmonth = d.dayofmonth
group by f.year, f.month, f.dayofmonth, d.number_of_delays;


# correlation query 
select to_date((year || '-' || month  || '-' || dayofmonth), 'YYYY-MM-DD') as flightdate,
		month, dayofmonth,
		sum(arrdelay) as arrdelay, sum(depdelay) as depdelay, sum(distance) as distance, sum(taxiin) as taxiin,
        sum(taxiout) as taxiout, 
		sum(carrierdelay) as carrierdelay, sum(weatherdelay) as weatherdelay, sum(nasdelay) as nasdelay, 
        sum(securitydelay) as securitydelay,sum(lateaircraftdelay) as lateaircraftdelay
from ontime
where year > 2006 and
arrdelay is not null and depdelay is not null and taxiin is not null and taxiout is not null 
and carrierdelay is not null and weatherdelay is not null 
and nasdelay is not null and securitydelay is not null and lateaircraftdelay is not null
group by flightdate, month, dayofmonth
order by flightdate desc;


# airline comparsion 

select f.uniquecarrier,c."Description" as airline,c.index as serialno, f.year, totalflights,
    d.number_of_delays,
    (d.number_of_delays * 100)/totalflights as delayPercentage
    
from (select distinct(uniquecarrier), year,
        count(arrdelay) as totalflights
     from ontime
     group by uniquecarrier, year) f 
     
     inner join

	(select distinct(uniquecarrier), year,
        count(arrdelay) as number_of_delays
     from ontime
     where arrdelay > 15
     group by uniquecarrier, year) d
     
on f.uniquecarrier = d.uniquecarrier and f.year = d.year

inner join carriers c on f.uniquecarrier = c."Code"

group by f.uniquecarrier, f.year, totalflights, d.number_of_delays, airline,serialno
order by totalflights desc, delayPercentage asc;


# airline network summary 

select a.iata as iata,
		a.airport as name, 
        lat as latitude,
        long as longitude,
        o.count as totalflights,
        o.number_of_delays as numberofdelays,
        o.delayPercentage as delayPercentage,
        o.carrierdelay, o.weatherdelay, o.nasdelay, o.securitydelay, o.lateaircraftdelay

from airports a left outer join

(select f.origin, count(*) as count,
	sum(arrdelay) as total_arrival_delay_minutes,
    d.number_of_delays,
    (d.number_of_delays * 100)/count(*) as delayPercentage,
 	d.carrierdelay, d.weatherdelay, d.nasdelay, d.securitydelay, d.lateaircraftdelay
from ontime f,
	(select origin,
        count(arrdelay) as number_of_delays,
     	sum(carrierdelay) as carrierdelay,
     	sum(weatherdelay) as weatherdelay,
     	sum(nasdelay) as nasdelay,
     	sum(securitydelay) as securitydelay,
     	sum(lateaircraftdelay) as lateaircraftdelay
     from ontime
     where arrdelay > 15
     and year=2008
     group by origin) d
where f.origin = d.origin and year=2008
group by f.origin, d.number_of_delays, d.carrierdelay, d.weatherdelay, 
 	d.nasdelay, d.securitydelay, d.lateaircraftdelay) o

on a.iata = o.origin;


# index samples

create index year on ontime(year);
create index date on ontime(year, month, dayofmonth);
create index flightorigin on ontime (origin);
create index flightdest on ontime (dest);
create index flightarrdelay on ontime (arrdelay);
create index flightroutes on ontime (origin,dest);
create index flightroutesdelays on ontime (origin,dest,arrdelay);
