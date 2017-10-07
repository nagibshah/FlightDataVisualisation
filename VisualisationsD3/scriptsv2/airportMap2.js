// change events 
var data = ["2008", "2007", "2006","2005","2004","2003","2002","2001","2000","1999","1998","1997","1996","1995","1994","1993","1992","1991","1990","1989","1988","1987"];
var svgScale = 700;

var select = d3.select('ul.dropdown-menu');
        
var options = select
    .selectAll('li.dropdownitem')
        .data(data).enter()
        .append("li")
            .attr("class", "dropdownitem")
            .append("a")
                .attr("class", "yearselection")
                .text(function(d) { return d; });

d3.selectAll("a.yearselection").on('click', onclick);

function onclick(selectValue) {
    //d3.select(".show").text('Showing the data for ' + selectValue + ' year');
    d3.select("#dropdownMenu1").text(selectValue)
        .append("span")
            .attr("class","caret");
    showYear(selectValue);
}

var svg = d3.select("svg.interactiveMap"),
width = +svg.attr("width"),
height = +svg.attr("height");

// to handle non us cities
var projectionNonUS = d3.geoAlbers()
.translate([width / 3, height / 3])
.scale(svgScale);

// contains alaska
var projection = d3.geoAlbersUsa()
.translate([width / 3, height / 3])
.scale(svgScale);

var radius = d3.scaleSqrt()
.domain([0, 100])
.range([0, 10]);

var path = d3.geoPath()
.projection(projection);
//.pointRadius(2.5);

var voronoi = d3.voronoi()
.extent([[-1, -1], [width + 1, height + 1]]);

function showYear(year) {
    svg.selectAll("*").remove();

    svg = d3.select("svg.interactiveMap"),
    width = +svg.attr("width"),
    height = +svg.attr("height");
    
    // to handle non us cities
    projectionNonUS = d3.geoAlbers()
    .translate([width / 2, height / 2])
    .scale(svgScale);
    
    // contains alaska
    projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2])
    .scale(svgScale);
    
    radius = d3.scaleSqrt()
    .domain([0, 100])
    .range([0, 10]);
    
    path = d3.geoPath()
    .projection(projection);
    //.pointRadius(2.5);
    
    voronoi = d3.voronoi()
    .extent([[-1, -1], [width + 1, height + 1]]);

    // show the map 
    d3.queue()
    .defer(d3.json, "data/us-10m.json")
    .defer(d3.csv, "data/airports" + year + ".csv", typeAirport)
    .defer(d3.csv, "data/flightdata" + year + ".csv", typeFlight)
    .await(drawMap);
    
}

function drawMap(error, us, airports, flights) {
    
    if (error) throw error;
    var airportFlights = [], airportDelayPercentages = [];
    var usAirports = [], nonUSAirports = [];
    var airportByIata = d3.map(airports, function(d) { return d.iata; });
    var airportByUSA = d3.map(airports, function(d) { return d.country; });

    flights.forEach(function(flight) {
        var source = airportByIata.get(flight.origin),
            target = airportByIata.get(flight.destination);
        source.arcs.coordinates.push([source, target]);
        target.arcs.coordinates.push([target, source]);
        var flight = {from: source, to: target, numberOfFlights: flight.count, delayPercent: flight.delaypercentage}
        source.flights.push(flight);
    });

    airports.forEach(function(airport) {
        airportFlights.push(airport.arcs.coordinates.length)
    });

    var min = Math.min.apply(Math, airportFlights);
    var max = Math.max.apply(Math, airportFlights);

    var colors = d3.scaleSequential(d3.interpolateYlOrRd) // d3.interpolateRdYlGn
        .domain([10, 35]);    
    
    var radius = d3.scaleSqrt()
        .domain([min, max])
        .range([1.5, 12]);

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
    .transition()
    .attr("r", function(d) { return radius(d.arcs.coordinates.length); })
    .attr("fill", function(d) {
        return colors(d.delaypercentage);
    })
    .attr("stroke","black")
    .attr("opacity", 0.8)
    .duration(1000)
    .ease(d3.easeLinear)
    .delay(300);

    var airport = svg.selectAll(".airport")
    .data(usAirports)
    .enter().append("g")
    .attr("class", "airport")
    .attr("r", function(d) { 
        return d.arcs.coordinates.length; 
    })
    .on("mouseover", function(d, i) { 
        d3.select("h5 span").text(d.name); 
        d3.select("p span").text(d.arcs.coordinates.length); 
    });

    airport.append("title")
    .text(function(d) { return d.iata + "\n" + d.name + "\n" + d.arcs.coordinates.length + " flights"; });

    airport.append("g")
    .attr("class", "airport-flights")
    .selectAll("g")
    .data(function(d) { 
        return d.flights; 
    })
    .enter().append("path")
    .attr("class", function(d) { 
        rootStyle = "airport-arc";
        if (d.delayPercent > 35) 
            return rootStyle + " red" 
        else return rootStyle + " green";
    })
    .attr("d", function(d) { 
        return path({type: "LineString", coordinates: [d.from, d.to]}); 
    });

    airport.append("path")
    .data(voronoi.polygons(usAirports.map(projection)))
    .attr("class", "airport-cell")
    .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; });
}

function typeAirport(d) {
    d[0] = +d.longitude;
    d[1] = +d.latitude;
    d.arcs = {type: "MultiLineString", coordinates: []};
    d.flights = [];
    return d;
}

function typeFlight(d) {
    d.count = +d.count;
    d.originCordinates =  [];
    d.destinationCordinates = [];
    return d;
}

showYear("2008");