// Define the color scale outside the line function
const lineDimensions = ["ALLAREA", "URBAN", "RURAL"];
const color = d3.scaleOrdinal().range(d3.schemeBlues[3]); // Set up a color scale with a fixed range

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
    .attr("transform", `translate(${(innerW / 2) - 20},${innerH + 50})`)
    .text("Year");
  // y1 label
  ChartArea.selectAll(".y_label")
    .data([0])
    .join("text")
    .attr("class", "y_label")
    .attr("transform", ` translate(-35,240) rotate(-90)`)
    .text("% of Population w/ Safe Water");

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

  // Explicitly set y-axis domain to [0, 100]
  const y = d3
    .scaleLinear()
    .domain([0, 100])
    .range([innerH, 0]);

  // Render x and y axes
  AxisX.call(d3.axisBottom(x));
  AxisYLeft.call(d3.axisLeft(y));

  // Draw lines for each line_dimension
  chart_data.forEach((line) => {
    const linegenerator = d3
      .line()
      .x((d) => x(d[0]))
      .y((d) => {
        const yValue = Math.min(100, Math.max(0, d[1]));
        return y(yValue);
      });

    ChartArea.append("g")
      .append("path")
      .datum(line[1])
      .attr("d", linegenerator)
      .attr("fill", "none")
      .attr("stroke", color(line[0]));
  });

  // Extract unique line_dimension values if not done already
  if (lineDimensions.length === 0) {
    lineDimensions.push(...new Set(data.map((d) => d[line_dimension])));
    color.domain(lineDimensions); // Set the domain of the color scale once with unique line dimensions
  }

  /// Create a legend
  const legend = svg
  .append("g")
  .attr("transform", `translate(${innerW + margin.right - 80}, 0)`);

  // Add legend entries
  const legendEntries = legend
  .selectAll("legend-entry")
  .data(lineDimensions)
  .enter()
  .append("g")
  .attr("class", "legend-entry")
  .attr("transform", (d, i) => `translate(0, ${i * 20})`);

  // Append rectangles for legend entries
  legendEntries
  .append("rect")
  .attr("width", 18)
  .attr("height", 18)
  .attr("fill", (d) => color(d));

  // Append text for legend entries
  legendEntries
  .append("text")
  .attr("x", 24)
  .attr("y", 9)
  .attr("dy", "0.35em")
  .text((d) => d);

  // Add a title
  svg.append("text")
    .attr("class", "chart-title")
    .attr("x", innerW / 2)
    .attr("y", margin.top - 30)
    .attr("text-anchor", "middle")
    .style("font-size", "120%")
    .style("font-weight", "bold")
    .text("Line Chart: Safe Water Per Year");

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
  // d3.select("#line-holder").style("display", "none");
  d3.select("#line-holder").html("");
}
