var width = 1200,
height = 200,
padding = 1.5, // separation between nodes
maxRadius = 20;

var n = 118, // total number of nodes
m = 20; // number of distinct clusters

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
    .key(function(d) { return d.color; })
    .entries(airlines)
    .forEach(force);
}

function processAirline(d)
{
d.radius = 0;
d.delaypercentage =  d.pdelay;
d.color = colorsAirline(d.color);
return d;
}

// force algo 
function force(entry, i) {
var nodes = entry.values;

var radius = d3.scaleSqrt()
    .domain([min, max])
    .range([5, 20]);

var circle = svgBubble.append("g")
  .attr("transform", "translate(" + x(i) + ",100)")
.selectAll("circle")
  .data(nodes)
.enter().append("circle")
  .attr("r", function(d) { 
      return radius(d.delaypercentage); 
    })
  .style("fill", function(d) { return d.color; })
  .attr("stroke","black")
  ;//.call(force.drag);


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