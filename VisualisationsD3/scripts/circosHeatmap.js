
function drawCircos(error, containerid, months, flightDelays) {
    width = 600;
    var circosHeatmap = new Circos({
          container: containerid,
          width: width,
          height: width
      });
  
      flightDelays = flightDelays.map(function(d) {
        return {
          block_id: d.flightmonth,
          start: parseInt(d.dayfrom),
          end: parseInt(d.dayto),
          value: parseInt(d.number_of_delays)
        };
      })
      circosHeatmap
        .layout(
          months,
          {
            innerRadius: width / 2 - 80,
            outerRadius: width / 2 - 30,
            ticks: {display: false},
            labels: {
              position: 'center',
              display: true,
              size: 14,
              color: '#000',
              radialOffset: 15
            }
          }
        )
        .heatmap('flightDelays', flightDelays, {
          innerRadius: 0.8,
          outerRadius: 0.98,
          logScale: false,
          min: 3000,
          max:8000,
          color: 'YlOrRd' //'-RdYlGn'
        })
        .render();
  }
  
  d3.queue()
  .defer(function(callback) { callback(null, "#chart1999"); })
  .defer(d3.json, './data/months.json')
  .defer(d3.csv, './data/heatmapExport1999.csv')
  .await(drawCircos);

  d3.queue()
    .defer(function(callback) { callback(null, "#chart2000"); })
    .defer(d3.json, './data/months.json')
    .defer(d3.csv, './data/heatmapExport2000.csv')
    .await(drawCircos);

  d3.queue()
    .defer(function(callback) { callback(null, "#chart2001"); })
    .defer(d3.json, './data/months.json')
    .defer(d3.csv, './data/heatmapExport2001.csv')
    .await(drawCircos);

    d3.queue()
    .defer(function(callback) { callback(null, "#chart2002"); })
    .defer(d3.json, './data/months.json')
    .defer(d3.csv, './data/heatmapExport2002.csv')
    .await(drawCircos);

    d3.queue()
    .defer(function(callback) { callback(null, "#chart2003"); })
    .defer(d3.json, './data/months.json')
    .defer(d3.csv, './data/heatmapExport2003.csv')
    .await(drawCircos);

    d3.queue()
    .defer(function(callback) { callback(null, "#chart2004"); })
    .defer(d3.json, './data/months.json')
    .defer(d3.csv, './data/heatmapExport2004.csv')
    .await(drawCircos);

    d3.queue()
    .defer(function(callback) { callback(null, "#chart2005"); })
    .defer(d3.json, './data/months.json')
    .defer(d3.csv, './data/heatmapExport2005.csv')
    .await(drawCircos); 

    d3.queue()
    .defer(function(callback) { callback(null, "#chart2006"); })
    .defer(d3.json, './data/months.json')
    .defer(d3.csv, './data/heatmapExport2006.csv')
    .await(drawCircos);

    d3.queue()
    .defer(function(callback) { callback(null, "#chart2007"); })
    .defer(d3.json, './data/months.json')
    .defer(d3.csv, './data/heatmapExport2007.csv')
    .await(drawCircos);

    d3.queue()
    .defer(function(callback) { callback(null, "#chart2008"); })
    .defer(d3.json, './data/months.json')
    .defer(d3.csv, './data/heatmapExport2008.csv')
    .await(drawCircos);
