var svg = d3.select("svg"),
width = +svg.attr("width"),
height = +svg.attr("height");

// to handle non us cities
var projectionNonUS = d3.geoAlbers()
.translate([width / 2, height / 2])
.scale(1280);

// contains alaska
var projection = d3.geoAlbersUsa()
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
.defer(d3.json, "data/us-10m.json")
.defer(d3.csv, "data/airports.csv", typeAirport)
.defer(d3.csv, "data/flights-airport3.csv", typeFlight)
.await(ready);

function ready(error, us, airports, flights) {

    if (error) throw error;
    var airportFlights = [];
    var usAirports = [], nonUSAirports = [];
    var airportByIata = d3.map(airports, function(d) { return d.iata; });
    var airportByUSA = d3.map(airports, function(d) { return d.country; });

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
    .attr("class", "airport-circle")
    .attr("cx", function (d) { 
        returnVal = null;
        if (projection(d) != null) {
            usAirports.push(d);
            returnVal = projection(d)[0];
        } else {
            nonUSAirports.push(d);
            returnVal = projectionNonUS(d)[0];
        }
        return returnVal;
    }) 
    .attr("cy", function (d) { 
        returnVal = null;
        if (projection(d) != null) {
            //usAirports.push(d);
            returnVal = projection(d)[1];
        } else {
            //nonUSAirports.push(d);
            returnVal = projectionNonUS(d)[1];
        }
        return returnVal; 
    })
    .attr("r", function(d) { return radius(d.arcs.coordinates.length); })
    .attr("fill", "steelblue")
    .attr("stroke","white")
    .attr("opacity", 0.5);

    var airport = svg.selectAll(".airport")
    .data(usAirports)
    .enter().append("g")
    .attr("class", "airport")
    .attr("r", function(d) { return d.arcs.coordinates.length; })
    .on("mouseover", function(d, i) { 
        d3.select("h2 span").text(d.name); 
        d3.select("p span").text(d.arcs.coordinates.length); 
    });

    airport.append("title")
    .text(function(d) { return d.iata + "\n" + d.name + "\n" + d.arcs.coordinates.length + " flights"; });

    airport.append("path")
    .attr("class", "airport-arc")
    .attr("d", function(d) { return path(d.arcs); });

    airport.append("path")
    .data(voronoi.polygons(usAirports.map(projection)))
    .attr("class", "airport-cell")
    .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; });

    //airport.append("path")
    //.data(voronoi.polygons(nonUSAirports.map(projectionNonUS)))
    //.attr("class", "airport-cell")
    //.attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; });

}

function typeAirport(d) {
d[0] = +d.longitude;
d[1] = +d.latitude;
d.arcs = {type: "MultiLineString", coordinates: []};
return d;
}

function typeFlight(d) {
d.count = +d.count;
d.originCordinates =  [];
d.destinationCordinates = [];
return d;
}