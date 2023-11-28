// Function to create a line chart
async function line(id, data) {
  // Define x, y, and line dimensions
  let x_dimension = "Time_Detail";
  let y_dimension = "Value";
  let line_dimension = "Location";

  // Select the container div using the provided id
  const div = d3.select(`#${id}`);
  // Clear any existing elements within the container
  div.selectAll("*").remove();

  // Set up chart dimensions
  const width = div.node().getBoundingClientRect().width * 0.9;
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
  const AxisX = ChartArea.append("g").attr(
    "transform",
    `translate(0,${innerH})`
  );

  // Add labels for x and y axes
  ChartArea.selectAll(".x_label")
    .data([0])
    .join("text")
    .attr("class", "x_label")
    .attr("transform", `translate(${innerW / 2},${innerH + 30})`)
    .text(x_dimension);
  // y1 label
  ChartArea.selectAll(".y_label")
    .data([0])
    .join("text")
    .attr("class", "y_label")
    .attr("transform", ` translate(10,0) rotate(90)`)
    .text("Number");

  // Handle data - aggregate by line_dimension and x_dimension
  let chart_data = d3.rollups(
    data,
    (d) => d3.mean(d, (v) => +v[y_dimension]),
    (d) => d[line_dimension],
    (d) => new Date(d[x_dimension])
  );

  // Set up x, y, and color scales
  const x_values = d3.extent(data, (d) => new Date(d[x_dimension]));
  const x = d3.scaleUtc().domain(x_values).range([0, innerW]);
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(chart_data, (d) => d3.max(d[1], (v) => v[1]))])
    .range([innerH, 0]);
  let color_domain = [...new Set(data.map((d) => d[line_dimension]))];
  const color = d3.scaleOrdinal().domain(color_domain).range(d3.schemeAccent);

  // Render x and y axes
  AxisX.call(d3.axisBottom(x));
  AxisYLeft.call(d3.axisLeft(y));

  // Draw lines for each line_dimension
  chart_data.forEach((line) => {
    const linegenerator = d3
      .line()
      .x((d) => x(d[0]))
      .y((d) => y(d[1]));

    ChartArea.append("g")
      .append("path")
      .datum(line[1])
      .attr("d", linegenerator)
      .attr("fill", "none")
      .attr("stroke", color(line[0]));
  });
}

// Function to show line chart on hover
function show_line(id, data, e) {
  d3.select("#line-holder")
    .style("display", "block")
    .style("position", "absolute")
    .style("backgroud-color", "white");

  line("line-holder", data);
}

// Function to hide line chart
function hide_line() {
  d3.select("#line-holder").style("display", "none");
}
