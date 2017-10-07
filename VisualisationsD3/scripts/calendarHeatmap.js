var width = 300,
height = 42,
cellSize = 4.3;

var formatPercent = d3.format(".1%");
var formatDate = d3.timeFormat("%Y-%m-%d");

var color = d3.scaleSequential(d3.interpolateYlOrRd) // d3.interpolateRdYlGn
.domain([10, 35]); 
//var color = d3.scaleQuantize()
//.domain([0, 40])
//.range(["#b4c8fa", "#a2baf0", "#90ace6", "#7e9edc", "#6c90d2", "#5a82cb", "#4874be", "#3666b4", "#2488aa", "#124aa0", "#003c96"]);

//var svgCalendarContainer = d3.select("div.calendarHeatmap");
//width = +svgCalendar.attr("width"),
//height = +svgCalendar.attr("height");

var t = d3.transition()
.duration(750)
.ease(d3.easeLinear);

var svgCalendarContainer = d3.select(".calendarHeatmap")
.selectAll("svg.calendarSVG")
.data(d3.range(1987, 2009))
.enter().append("svg")
  .attr("class", "calendarSVG")
  .attr("width", width)
  .attr("height", height)
.append("g")
  .attr("transform", "translate(" + ((width - cellSize * 50) / 2) + "," + (height - cellSize * 7 - 1) + ")");

/* svgCalendarContainer
.data(d3.range(1987, 2009))
.enter().append("svg.calendarSVG")
  .attr("width", width)
  .attr("height", height)
.append("g")
  .attr("transform", "translate(" + ((width - cellSize * 53) / 2+80) + "," + (height - cellSize * 7 - 1) + ")");*/

svgCalendarContainer.append("text")
.attr("transform", "translate(-15," + cellSize * 3.5 + ")")
.attr("font-family", "sans-serif")
.attr("font-size", 10)
.attr("text-anchor", "middle")
.attr("opacity",0)
.text(function(d) { return d; });

var rect = svgCalendarContainer.append("g")
.attr("fill", "none")
.attr("stroke", "#ccc")
.selectAll("rect")
.data(function(d) { 
  var temp = d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1))
  return temp; 
})
//.datum(d3.timeFormat("%Y-%m-%d"))
.enter().append("rect")
//.transition()
.attr("width", cellSize)
.attr("height", cellSize)
.attr("x", function(d) { return d3.timeWeek.count(d3.timeYear(d), d) * cellSize; })
.attr("y", function(d) { return d.getDay() * cellSize; })
//.duration(500)
//.delay(300)
.style("opacity",0)
.datum(d3.timeFormat("%Y-%m-%d"));

svgCalendarContainer.append("g")
.attr("fill", "none")
.attr("stroke", "#000")
.selectAll("path")
.data(function(d) { return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
.enter().append("path")
.style("opacity",0)
.attr("d", pathMonth);

d3.csv("data/calendar_delay_alldata.csv", function(error, csv) {
if (error){alert(1); alert(error);throw error;}

var data = d3.nest()
  .key(function(d) {
    var dat=(new Date(parseInt(d.year),parseInt(d.month)-1,parseInt(d.dayofmonth))).Format("yyyy-MM-dd");
    //var dat = d;
    return dat; 
  })
  .rollup(function(d) {
    return d[0].delaypercentage;
  })
  .object(csv);

rect.filter(function(d) { 
    return d in data; 
  })
  //.transition().duration(1000)
  .attr("fill", function(d) {
    return color(data[d]); 
  })
.append("title")
  .text(function(d) { return d + ": " + formatPercent(data[d]); });
});

svgCalendarContainer.selectAll("text")
.transition()
.style("opacity",1)
.duration(1000)
.ease(d3.easeLinear)
.delay(300);

svgCalendarContainer.selectAll("path")
.transition()
.style("opacity",1)
.duration(1000)
.ease(d3.easeLinear)
.delay(300);

svgCalendarContainer.selectAll("rect")
.transition()
.style("opacity",1)
.duration(1500)
.ease(d3.easeLinear)
.delay(300);


Date.prototype.Format = function(fmt)   
{ //author: meizz   
var o = {   
"M+" : this.getMonth()+1,                 //月份   
"d+" : this.getDate(),                    //日   
"h+" : this.getHours(),                   //小时   
"m+" : this.getMinutes(),                 //分   
"s+" : this.getSeconds(),                 //秒   
"q+" : Math.floor((this.getMonth()+3)/3), //季度   
"S"  : this.getMilliseconds()             //毫秒   
};   
if(/(y+)/.test(fmt))   
fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
for(var k in o)   
if(new RegExp("("+ k +")").test(fmt))   
fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
return fmt;   
}  
function pathMonth(t0) {
var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
  d0 = t0.getDay(), w0 = d3.timeWeek.count(d3.timeYear(t0), t0),
  d1 = t1.getDay(), w1 = d3.timeWeek.count(d3.timeYear(t1), t1);
return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
  + "H" + w0 * cellSize + "V" + 7 * cellSize
  + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
  + "H" + (w1 + 1) * cellSize + "V" + 0
  + "H" + (w0 + 1) * cellSize + "Z";
}