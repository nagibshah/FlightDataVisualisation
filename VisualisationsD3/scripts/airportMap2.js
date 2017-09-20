var svg = d3.select("svg"),
width = +svg.attr("width"),
height = +svg.attr("height");

var projection = d3.geoAlbers()
.translate([width / 2, height / 2])
.scale(1280);

var radius = d3.scaleSqrt()
.domain([0, 100])
.range([0, 14]);

var path = d3.geoPath()
.projection(projection);
//.pointRadius(2.5);

var voronoi = d3.voronoi()
.extent([[-1, -1], [width + 1, height + 1]]);

d3.queue()
.defer(d3.json, "data/us.json")
.defer(d3.csv, "data/airports.csv", typeAirport)
.defer(d3.csv, "data/flights-airport3.csv", typeFlight)
.await(ready);

function ready(error, us, airports, flights) {

    if (error) throw error;
    var airportFlights = [];
    var airportByIata = d3.map(airports, function(d) { return d.iata; });

    flights.forEach(function(flight) {
        var source = airportByIata.get(flight.origin),
            target = airportByIata.get(flight.destination);
        source.arcs.coordinates.push([source, target]);
        target.arcs.coordinates.push([target, source]);
    });

    airports.forEach(function(airport) {
        airportFlights.push(airport.arcs.coordinates.length)
    });

    var min = Math.min.apply(Math, airportFlights);
    var max = Math.max.apply(Math, airportFlights);
    
    var radius = d3.scaleSqrt()
      .domain([min, max])
      .range([2.5, 20]);

    airports = airports
    .filter(function(d) { return d.arcs.coordinates.length; });

    svg.append("path")
    .datum(topojson.feature(us, us.objects.land))
    .attr("class", "land")
    .attr("d", path);

    svg.append("path")
    .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
    .attr("class", "state-borders")
    .attr("d", path);

    svg.selectAll("path")
    .data(airports)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return projection(d)[0]; })
    .attr("cy", function (d) { return projection(d)[1]; })
    .attr("r", function(d) { return radius(d.arcs.coordinates.length); })
    .attr("fill", "blue")
    .attr("opacity", 0.5)

    var airport = svg.selectAll(".airport")
    .data(airports)
    .enter().append("g")
    .attr("class", "airport")
    .attr("r", function(d) { return d.arcs.coordinates.length; });

    airport.append("title")
    .text(function(d) { return d.iata + "\n" + d.arcs.coordinates.length + " flights"; });

    airport.append("path")
    .attr("class", "airport-arc")
    .attr("d", function(d) { return path(d.arcs); });

    airport.append("path")
    .data(voronoi.polygons(airports.map(projection)))
    .attr("class", "airport-cell")
    .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; });

}

function typeAirport(d) {
d[0] = +d.longitude;
d[1] = +d.latitude;
d.arcs = {type: "MultiLineString", coordinates: []};
return d;
}

function typeFlight(d) {
d.count = +d.count;
return d;
}