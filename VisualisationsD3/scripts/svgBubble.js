var width = 1200,
height = 150,
padding = 1.5, // separation between nodes
maxRadius = 40;

var n = 118, // total number of nodes
m = 23; // number of distinct clusters

var min=0, max=0;

var colorsAirline= d3.scaleOrdinal(d3.schemeCategory20)
.domain(d3.range(m));

//var x = d3.scaleOrdinal()
//   .domain(d3.range(m))
//    .range([0, width]);

var x = d3.scaleBand()
.domain(d3.range(m))
.range([50, width]);

var svgBubble = d3.select("div.airlineComparison").append("svg")
.attr("class", "airlinePerformanceViz")
.attr("width", width)
.attr("height", height);

var divTooltip = d3.select("body").append("div")	
.attr("class", "tooltip")				
.style("opacity", 0);
divTooltip.append("span")
.attr("class", "carrierName");
divTooltip.append("span")
.attr("class", "airline_year");
divTooltip.append("span")
.attr("class", "airline_pdelay");

d3.queue()
.defer(d3.csv, "data/bubblechart.csv", processAirline)
.await(drawAirlinePerformance);

function drawAirlinePerformance(error, airlines) {

if (error) throw error;

var airlineDelays = []

airlines.forEach(function(airline) {
    airlineDelays.push(airline.delaypercentage)
});

min = Math.min.apply(Math, airlineDelays);
max = Math.max.apply(Math, airlineDelays);

// nest by color? 
d3.nest()
    .key(function(d) { return d.UniqueCarrier; })
    .entries(airlines)
    .forEach(force);

d3.nest()
    .key(function(d) { return d.UniqueCarrier; })
    .entries(airlines)
    .forEach(legend);

}

function processAirline(d)
{
    d.radius = 0;
    d.delaypercentage =  d.pdelay;
    d.color = colorsAirline(d.color);
    return d;
}

function legend(entry, i) {
    svgBubble.append("text")
        .attr("transform", "translate(" + x(i) + ",100)")
        .text(entry.key);
    // Add the Legend
    //svgBubble.append("text")
    //.attr("x", (legendSpace/2)+i*legendSpace) // spacing
    //.attr("y", height + (margin.bottom/2)+ 5)
    //.attr("class", "legend")    // style the legend
    //.style("fill", function() { // dynamic colours
    //    return d.color = color(d.key); })
    //.text(d.key);
}

// force algo 
function force(entry, i) {
    var nodes = entry.values;

    var radius = d3.scaleSqrt()
        .domain([min, max])
        .range([5, 15]);

    var circle = svgBubble.append("g")
    .attr("transform", "translate(" + x(i) + ",50)")
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
        .attr("r", function(d) { 
            return radius(d.delaypercentage); 
        })
        .style("fill", function(d) { return d.color; })
    .on("mouseover", function(d, i) { 
        d3.select(this).attr('stroke', 'black');
        divTooltip.transition()		
            .duration(200)		
            .style("opacity", .9);		
        divTooltip
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY) + "px");
        
        divTooltip.select("span.carrierName").text("Carrier Code: " + d.UniqueCarrier);
        d3.select("span.airline_year").text("Year: " + d.year);
        d3.select("span.airline_pdelay").text("Delay: " + d3.format(".2")(d.pdelay) + "%"); 
    })
    .on("mouseout", function (d, i) {
        d3.select(this).attr('stroke', 0);
        divTooltip.transition()		
        .duration(500)		
        .style("opacity", 0);	
        //d3.select(this).remove("div.carrieryear");
    });

    var simulation = d3.forceSimulation(nodes)
    .nodes(nodes)
    .velocityDecay(0.7)
    .force("collide", d3.forceCollide().radius(function(d) { 
        return radius(d.delaypercentage) + 0.5; 
    })
    .iterations(4))
    .on("tick", ticked);

    //simulation.stop();
    //simulation.force('center', d3.forceCenter(width, height / 2));
    for (var i = 0; i < 200; ++i) simulation.tick();

    function ticked() {
        circle.each(function (node) {})
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }

}