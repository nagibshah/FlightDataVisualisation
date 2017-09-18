# delay summary all airports
select f."Origin", f."Dest", count(*) as number_of_flights,
	sum("ArrDelay") as total_arrival_delay_minutes,
    sum("DepDelay") as total_dep_delay_minutes,
    d.number_of_delays
from flightdata2000 f,
	(select count("ArrDelay") as number_of_delays, "Origin", "Dest"
     from flightdata2000
     where "ArrDelay" > 15
     group by "Origin", "Dest") d
where f."Origin" = d."Origin" and f."Dest" = d."Dest"
group by f."Origin", f."Dest",d.number_of_delays;

# delay summary daily breakdown query sample 
select trim(lower(to_char("FlightDate", 'Month'))) as flightMonth, 
		EXTRACT(day from "FlightDate") as dayfrom,
        EXTRACT(day from ("FlightDate" + 1)) as dayto, 
        count("ArrDelay") as number_of_delays,
        "FlightDate" as flightDate
     from flightdata2005
     where "ArrDelay" > 15
     group by flightDate
     order by flightDate asc;
     
     
# index samples


create index origin1999 on flightdata1999 ("Origin");
create index dest1999 on flightdata1999 ("Dest");

create index origin2000 on flightdata2000 ("Origin");
create index origin2001 on flightdata2001 ("Origin");
create index origin2002 on flightdata2002 ("Origin");
create index origin2003 on flightdata2003 ("Origin");
create index origin2004 on flightdata2004 ("Origin");
create index origin2005 on flightdata2005 ("Origin");
create index origin2006 on flightdata2006 ("Origin");
create index origin2007 on flightdata2007 ("Origin");
create index origin2008 on flightdata2008 ("Origin");

create index dest2000 on flightdata2000 ("Dest");
create index dest2001 on flightdata2001 ("Dest");
create index dest2002 on flightdata2002 ("Dest");
create index dest2003 on flightdata2003 ("Dest");
create index dest2004 on flightdata2004 ("Dest");
create index dest2005 on flightdata2005 ("Dest");
create index dest2006 on flightdata2006 ("Dest");
create index dest2007 on flightdata2007 ("Dest");
create index dest2008 on flightdata2008 ("Dest");

create index arrdelay1999 on flightdata1999 ("ArrDelay");
create index flightroutes1999 on flightdata1999 ("Origin","Dest");
create index flightroutesdelays1999 on flightdata1999 ("Origin","Dest","ArrDelay");

create index arrdelay2000 on flightdata2000 ("ArrDelay");
create index flightroutes2000 on flightdata2000 ("Origin","Dest");
create index flightroutesdelays2000 on flightdata2000 ("Origin","Dest","ArrDelay");

create index arrdelay2001 on flightdata2001 ("ArrDelay");
create index flightroutes2001 on flightdata2001 ("Origin","Dest");
create index flightroutesdelays2001 on flightdata2001 ("Origin","Dest","ArrDelay");

create index arrdelay2002 on flightdata2002 ("ArrDelay");
create index flightroutes2002 on flightdata2002 ("Origin","Dest");
create index flightroutesdelays2002 on flightdata2002 ("Origin","Dest","ArrDelay");

create index arrdelay2003 on flightdata2003 ("ArrDelay");
create index flightroutes2003 on flightdata2003 ("Origin","Dest");
create index flightroutesdelays2003 on flightdata2003 ("Origin","Dest","ArrDelay");

create index arrdelay2004 on flightdata2004 ("ArrDelay");
create index flightroutes2004 on flightdata2004 ("Origin","Dest");
create index flightroutesdelays2004 on flightdata2004 ("Origin","Dest","ArrDelay");

create index arrdelay2005 on flightdata2005 ("ArrDelay");
create index flightroutes2005 on flightdata2005 ("Origin","Dest");
create index flightroutesdelays2005 on flightdata2005 ("Origin","Dest","ArrDelay");

create index arrdelay2006 on flightdata2006 ("ArrDelay");
create index flightroutes2006 on flightdata2006 ("Origin","Dest");
create index flightroutesdelays2006 on flightdata2006 ("Origin","Dest","ArrDelay");

create index arrdelay2007 on flightdata2007 ("ArrDelay");
create index flightroutes2007 on flightdata2007 ("Origin","Dest");
create index flightroutesdelays2007 on flightdata2007 ("Origin","Dest","ArrDelay");

create index arrdelay2008 on flightdata2008 ("ArrDelay");
create index flightroutes2008 on flightdata2008 ("Origin","Dest");
create index flightroutesdelays2008 on flightdata2008 ("Origin","Dest","ArrDelay");
