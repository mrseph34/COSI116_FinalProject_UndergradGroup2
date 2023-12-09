// Function to create a bar chart
function bar(id, data) {
  // Define x and y dimensions
  let x_dimension = "Region";
  // let x_dimension = "Time_Detail";
  let y_dimension = "Value";

  // Select the container div using the provided id
  const div = d3.select(`#${id}`);
  // Clear any existing elements within the container
  div.selectAll("*").remove();

  // Set up chart dimensions
  const width = div.node().getBoundingClientRect().width * 1;
  const height = div.node().getBoundingClientRect().height * 0.9;
  const margin = { left: 50, right: 50, top: 50, bottom: 50 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;
  const svg = div.append("svg").attr("width", width).attr("height", height);

  // Create the main area to draw the chart
  const ChartArea = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create y-axis and x-axis groups
  const AxisYLeft = ChartArea.append("g");
  const AxisX = ChartArea.append("g").attr("transform", `translate(0,${innerH})`);

  // Add labels for x and y axes
  ChartArea.selectAll(".x_label")
    .data([0])
    .join("text")
    .attr("class", "x_label")
    .attr("transform", `translate(${innerW / 2},${innerH + 40})`)
    .text(x_dimension);
  // y1 label
  ChartArea.selectAll(".y_label")
    .data([0])
    .join("text")
    .attr("class", "y_label")
    .attr("transform", ` translate(-30,250) rotate(-90)`)
    .text("Proportion");

  // Aggregate and sort data
  let chart_data = d3.rollups(
    data,
    (d) => d3.mean(d, (v) => +v[y_dimension]),
    (d) => concatenateNames(d[x_dimension])
  );
  chart_data.sort((a, b) => (a[1] > b[1] ? -1 : 1));

  // Set up x and y scales
  const x_values = chart_data.map((d) => d[0]);
  const x = d3.scaleBand().domain(x_values).range([0, innerW]).padding(0.3);
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(chart_data, (d) => d[1])])
    .range([innerH, 0]);

  // Render x and y axes
  AxisX.call(d3.axisBottom(x))
  .selectAll("text")
  .style("font-size", width/110+"px");
  AxisYLeft.call(d3.axisLeft(y));

  // Create and style the bars
  let rects = ChartArea.selectAll("rect")
    .data(chart_data)
    .join("rect")
    .attr("class", (d) => d[0]) // Set a class for later use
    .attr("x", (d) => x(d[0]))
    .attr("y", (d) => y(d[1]))
    .attr("id", (d) => "bar-holder" + range_scale(d[1]))
    .attr("width", x.bandwidth())
    .attr("height", (d) => innerH - y(d[1]))
    .attr("stroke", "black")
    .attr("stroke-width", "1")
    .attr("fill", (d, i) => d3.schemeAccent[i]);

  // Add interactions to the bars
  rects
    .on("mouseenter", (e, d) => {
      // Display information on hover
      let html = ` <p> ${d[0]} :${d[1]}  </p>`;
      highlight("bar-holder", d[1]);
      highlight("map-holder", d[1]);
      highlight("legend", d[1]);
      // Filter and show additional data on hover
      let filter_data = data.filter((v) => v["Region"] === d[0]);
      show_line("line-holder", filter_data, e);
    })
    .on("mouseout", (e, d) => {
      // Hide information on mouseout
      unHighlight("bar-holder", d[1]);
      unHighlight("map-holder", d[1]);
      unHighlight("legend", d[1]);
      hide_line();
    });

    // Custom function to concatenate names
    function concatenateNames(name) {
      if (name === "None") {
        return "Other";
      }
      // name = name.replace("North", "N.");
      // name = name.replace("South", "S.");
      // name = name.replace("East", "E.");
      // name = name.replace("West", "W.");
      return name;
    }
    
}

function regionChange(value) {
  // Iterate over each rect element
  d3.selectAll("rect").each(function () {
    const rect = d3.select(this);
    // Check if the rect has the specified value and stroke-width
    if (rect.attr("stroke-width") === "3") {
      const barName = rect.attr("class");
      if (barName != null) {
        globalRegion = barName;
      // console.log(globalRegion);
      }
    }
  });
}