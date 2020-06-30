// Load csv data.
function makeplot() {
  Plotly.d3.csv("data/semester_01.csv", function(data){ processData(data) } );
};

// Processes .csv data.
function processData(allRows) {

  // Sets arrays.
  let dur = [], project = [], sdate = [], edate = [], stime = [], etime = [];

  for (let i=0; i<allRows.length; i++) {

    // Everything gets savd as an array with string values.
    row = allRows[i];
    dur.push( row['Duration (decimal)'] );
    project.push( row['Project'] );
    sdate.push( row['Start Date'] );
    edate.push( row['End Date'] );

    // Maybe for later...
    // stime.push( new Date("2020-01-01T" + row['Start Time']).getHours()); // Extract only hours (e.g. 17 for 17:08:45)
    // etime.push(new Date("2020-01-01T" + row['End Time']).getHours() );

    // Rounds number.
    dur = dur.map(x => parseFloat(x).toFixed(1)); // Why does toFixed() return a string?

  }

  // Calls functions to print out charts.
  gesamtBar(dur, project);
  gesamtPie(dur, project);
  timeWeekly(sdate, dur);

  variousCalc(dur);

}

// Svg download settings.
let svgDownload = {
  format: 'svg', 
  filename: 'studystat_simon-mettler',
  height: 500,
  width: 700,
  scale: 1
}

// Calculates total time, average, ...
function variousCalc(dur) {

  // Days from first to last week of learning
  let days = 140;

  // Reduces array to one floatnumber.
  const arrAdd = (a, b) => parseFloat(a) + parseFloat(b); // Inefficient AF...
  total = dur.reduce(arrAdd);

  // Gets average from array
  const arrAvg = (a, b) => (parseFloat(a) + parseFloat(b));
  average = dur.reduce(arrAvg) / dur.length;

  // Prints total (and sets to one decimal point).
  document.getElementById("info_total").innerHTML = "<b>Aufwand total:</b> " + total.toFixed(1) + " h";
  document.getElementById("info_schnitt").innerHTML = "<b>Arith. Mittel Session:</b> " + (60 * average).toFixed(0) + " min";
  document.getElementById("info_tag").innerHTML = "<b>Arith. Mittel Tag:</b> " + (60 * total / days).toFixed(0) + " min";

}

// Creates bar chart.
function gesamtBar(dur, project) {

  let data = [{
    type: 'bar',
    x: project,
    y: dur,
    transforms: [{
      type: 'aggregate',
      groups: project,
      aggregations: [{
        target: 'y', 
        func: 'sum', 
        enabled: true
      }]
    }]
  }]

  let layout = {
    hovermode: 'closest',
    yaxis: { ticksuffix: " h" }
  }

  let config = {
    responsive: true, 
    displayModeBar: true, 
    displaylogo: false,
    toImageButtonOptions: svgDownload,
    modeBarButtonsToRemove: [
      'select2d', 
      'lasso2d', 
      'zoomIn2d', 
      'zoomOut2d', 
      'hoverCompareCartesian', 
      'toggleSpikelines', 
      'hoverClosestCartesian', 
      'autoScale2d'
    ]
  }

  Plotly.newPlot( 'gesamt_bar', data, layout, config );

}

// Creates pie chart.
function gesamtPie(dur, project) {

  let data = [{
    type: 'pie',
    labels: project,
    values: dur,
    textinfo: "percent",
    textposition: "inside",
    insidetextfont: {color: "white"},
    hovertemplate: "%{label}:<br> %{value} h <br>(%{percent}) <extra></extra>",
    
    transforms: [{
      type: 'aggregate',
      groups: project,
      aggregations: [
        {target: 'values', func: 'sum', enabled: true}, // what is enabled: true for?
      ]
    }]
  }]

  let layout = { 
  }

  let config = {
    responsive: true, 
    displayModeBar: true, 
    displaylogo: false, 
    modeBarButtonsToRemove: ['hoverClosestPie'],
    toImageButtonOptions: svgDownload
  }

  Plotly.newPlot( 'gesamt_pie', data, layout, config );

}

// Creates weekly time chart.
function timeWeekly(sdate, dur) {

  let data = [{
    type: 'histogram',
    x: sdate,
    y: dur,
    histfunc: "sum",
    xbins: {
      start: '2019-09-09',
      size: '604800000', // one week
      end: '2020-02-02'
    },
    marker: {
      line: {
        color:  "white", 
        width: 1
      }
    }
  }]

  let layout = {
    hovermode: 'closest',
    yaxis: { ticksuffix: " h" }
}

  let config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,       
    toImageButtonOptions: svgDownload,
    modeBarButtonsToRemove: [
      'select2d',
      'lasso2d',
      'zoomIn2d',
      'zoomOut2d',
      'hoverCompareCartesian',
      'toggleSpikelines',
      'hoverClosestCartesian',
      'autoScale2d'
    ]
  }

  Plotly.newPlot( 'timeWeekly', data, layout, config );

}

makeplot();
