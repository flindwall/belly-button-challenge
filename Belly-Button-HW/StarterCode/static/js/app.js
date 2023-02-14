const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//get data
function buildMetadata(sample) {
    d3.json(url).then((data) => {
      let metadata = data.metadata;
      let result = metadata.find(sampleObj => sampleObj.id == sample);
  
      d3.select("#sample-metadata").html("");
  
      Object.entries(result).forEach(([key, value]) => {
        d3.select("#sample-metadata")
          .append("h5")
          .text(`${key}: ${value}`);
      });
    });
  }

// function that builds out the charts
function buildCharts(sample) {
	d3.json(url).then((data) => {
		let samples = data.samples;
		let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
		let result = resultArray[0];
		
		let otu_ids = result.otu_ids;
		let otu_labels = result.otu_labels;
		let sample_values = result.sample_values;
		
	// bubble chart
    let bubbleChart = {
      y: sample_values,
      x: otu_ids,
      text: otu_labels,
      mode: "markers",
      marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
    }
  };

     // Set up the layout
        var layout = {
        hovermode: "closest",
        xaxis: {title: "OTU ID "},
        
  };

    // plot the bubble chart with plotly
    Plotly.newPlot("bubble", [bubbleChart], layout);
		
		
		
	// Build bar graph
    let yvalues = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse()
    let xvalues = sample_values.slice(0,10).reverse()
    let labelValues = otu_labels.slice(0,10).reverse()

    let barChart = {
        y: yvalues,
        x: xvalues,
        text: labelValues,
        type: "bar",
        orientation: "h"
    };

    // Layout 
        var layout = {
        title: "Top 10 Belly Button Bacteria"
  };

    // use plotly to plot
        Plotly.newPlot("bar", [barChart], layout)
  })
};

    // Build a gauge chart
        function buildGaugeChart(sample) {
        d3.json(url).then((data) => {
        let metadata = data.metadata;

        // Filter the data for the object with the desired sample number
        let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        let result = resultArray[0];


        // Create variable and turn into float 
        var frequency = parseFloat(result.wfreq);

        var gaugeData = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: frequency,
            title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
            axis: { range: [null, 9] },
            bar: { color: "blue" },
            steps: [
            { range: [0, 1], color: 'rgb(255, 255, 255)' },
                        { range: [1, 2], color: 'rgb(255, 255, 204)' },
                        { range: [2, 3], color: 'rgb(229, 255, 204)' },
                        {range: [3, 4], color: 'rgb(204, 255, 204)' },
                        { range: [4, 5], color: 'rgb(204, 255, 153)' },
                        { range: [5, 6], color: 'rgb(102, 255, 102)' },
                        {range: [6, 7], color: 'rgb(102, 204, 0)' },
                        { range: [7, 8], color: 'rgb(76, 153, 0)' },
                        { range: [8, 9], color: 'rgb(51, 102, 0)' },
          ],
        }
      }
    ];

        // Create layout
        var gaugeLayout = {
        width: 500,
        height: 500,
        font: { color: "darklavender", family: "Tahoma" }
    };

        // plot using plotly
        Plotly.newPlot("gauge", gaugeData, gaugeLayout);
});
};



// Create a function to initialize dashboard
function init() {
  // Grab a reference to the dropdown select element
  let selector = d3.select("#selDataset");

  // use d3 to initialize select options
  d3.json(url).then((data) => {
    let sampleNames = data.names;

	// Use a for each loop to append selector
    sampleNames.forEach(function(sampleName) {
        selector.append("option")
          .text(sampleName)
          .property("value", sampleName);
      });

    // Use the first sample from the list to build the initial plots
    let initialSample = sampleNames[0];
    buildCharts(initialSample);
    buildMetadata(initialSample);
    buildGaugeChart(initialSample);
  });
};


function optionChanged(newSample) {
  // grab new data for new sample
  buildCharts(newSample);
  buildMetadata(newSample);
  buildGaugeChart(newSample);
};

// Initialize the dashboard
init();


