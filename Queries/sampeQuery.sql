select "Origin", "Dest", count(*) as number_of_flights, 
	sum("ArrDelay") as total_arrival_delay_minutes,
    sum("DepDelay") as total_dep_delay_minutes,
    count("ArrDelay") as number_of_delays
from flightdetails 
group by "Origin", "Dest";