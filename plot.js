// Load csv data.
function makeplot() {
  Plotly.d3.csv("data-semester_01.csv", function(data){ processData(data) } );
};

// Processes .csv data.
function processData(allRows) {

  console.log(allRows);

  // Sets arrays.
  let dur = [], project = [], sdate = [], edate = [], stime = [], etime = [];

  for (let i=0; i<allRows.length; i++) {

    // Everything gets savd as an array with string values.
    row = allRows[i];
    dur.push( row['Duration (decimal)'] );
    project.push( row['Project'] );
    sdate.push( row['Start Date'] );
    edate.push( row['End Date'] );
    stime.push( new Date("2020-01-01T" + row['Start Time']).getHours()); // Extract only hours (e.g. 17 for 17:08:45)
    etime.push(new Date("2020-01-01T" + row['End Time']).getHours() );


  }





  // Calls functions to print out charts.
  gesamtBar(dur, project);
  gesamtPie(dur, project);
  timeWeekly(sdate, dur);
  dayTime(stime);

  gesamtNum(dur);

}



// Calculates total time spent.
function gesamtNum(dur) {

  // Reduces array to one floatnumber.
  const arrAdd = (a, b) => parseFloat(a) + parseFloat(b);
  reduced = dur.reduce(arrAdd);

  const arrAvg = (a, b) => (parseFloat(a) + parseFloat(b));
  average = dur.reduce(arrAvg) / dur.length;


  // Prints total (and sets to one decimal point).
  document.getElementById("info_total").innerHTML = "<b>Aufwand total:</b> " + reduced.toFixed(1) + "h";
  document.getElementById("info_schnitt").innerHTML = "<b>&empty; pro Session:</b> " + (60 * average).toFixed(0) + "min";

  // 140
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
      aggregations: [
        {target: 'y', func: 'sum', enabled: true},
      ]
    }]
  }]

  let layout = {
    hovermode: 'closest'
  }

  Plotly.newPlot(
    'gesamt_bar', data, layout, 
    { 
      responsive: true, 
      displayModeBar: true, 
      displaylogo: false,
      toImageButtonOptions: {
        format: 'svg', // one of png, svg, jpeg, webp
        filename: 'studystat_simon-mettler',
        height: 500,
        width: 700,
        scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
      },
      modeBarButtonsToRemove: ['select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'hoverCompareCartesian', 'toggleSpikelines', 'hoverClosestCartesian', 'autoScale2d']
    }
  );

}

// Creates pie chart.
function gesamtPie(dur, project) {

  let data = [{
    type: 'pie',
    labels: project,
    values: dur,
    textinfo: "percent",
    textposition: "inside",
    transforms: [{
      type: 'aggregate',
      groups: project,
      aggregations: [
        {target: 'values', func: 'sum', enabled: true}, // what is enabled: true for?
      ]
    }]
  }]

  var layout = {
  }

  Plotly.newPlot('gesamt_pie', data, layout, {responsive: true, displayModeBar: true, displaylogo: false, modeBarButtonsToRemove: ['hoverClosestPie'] });
}

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

  var layout = {

  }

  Plotly.newPlot('timeWeekly', data, layout, {responsive: true, displayModeBar: true,      displaylogo: false,
       
    toImageButtonOptions: {
    format: 'svg', 
    filename: 'studystat_simon-mettler',
    height: 500,
    width: 700,
    scale: 1
  },
  modeBarButtonsToRemove: ['select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'hoverCompareCartesian', 'toggleSpikelines', 'hoverClosestCartesian', 'autoScale2d']});

  console.log(sdate);

}

function dayTime(stime) {

  let bar = [{
    type: 'bar',
    x: stime,
    y: stime,
    transforms: [{
      type: 'aggregate',
      groups: stime,
      aggregations: [
        {target: 'y', func: 'count', enabled: true}, // what is enabled: true for?
      ]
    }]

  }]

  // stime.push(5, 22);

let line = [{

  x: stime,
  y: stime,

  type: 'scatter',
  line: {shape: 'spline',     dash: 'dot'},
  fill: 'tozeroy',

  transforms: [{
    type: 'aggregate',
    groups: stime,
    aggregations: [
      {target: 'y', func: 'count', enabled: true}, // what is enabled: true for?
    ]
  },{
    type: 'sort',
    target: 'x',
    order: 'ascending'
  }]

}]

let data = line;


  let layout = {
    xaxis: {
      ticksuffix: " Uhr",
      zeroline: false,
      range: [1, 23],


    },
    yaxis: {


      domain: [0.5,1],


    }
  }

  let config = {

  }

  Plotly.newPlot( 'daytime', data, layout, config )

}

makeplot();