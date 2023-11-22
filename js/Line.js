// Sample data for three lines with unique x and y values
const line_data = [
  { date: "2023-01-01", line_value1: 10, line_value2: 20, line_value3: 15 },
  { date: "2023-01-02", line_value1: 15, line_value2: 25, line_value3: 20 },
  { date: "2023-01-03", line_value1: 20, line_value2: 15, line_value3: 25 },
];

// Set up dimensions for the graph
const line_width = 500;
const line_height = 300;
const line_margin = { top: 20, right: 20, bottom: 30, left: 50 };

// Create an SVG container within the "line-holder" div
const line_svg = d3.select('.line-holder').append('svg')
  .attr('width', line_width + line_margin.left + line_margin.right)
  .attr('height', line_height + line_margin.top + line_margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + line_margin.left + ',' + line_margin.top + ')');

// Set up scales for x and y axes
const line_xScale = d3.scaleBand()
  .domain(line_data.map(d => d.date))
  .range([0, line_width])
  .padding(0.1);

const line_yScale = d3.scaleLinear()
  .domain([0, d3.max(line_data, d => Math.max(d.line_value1, d.line_value2, d.line_value3))])
  .range([line_height, 0]);

// Define line functions for each line
const line_line1 = d3.line()
  .x(d => line_xScale(d.date))
  .y(d => line_yScale(d.line_value1));

const line_line2 = d3.line()
  .x(d => line_xScale(d.date))
  .y(d => line_yScale(d.line_value2));

const line_line3 = d3.line()
  .x(d => line_xScale(d.date))
  .y(d => line_yScale(d.line_value3));

// Append lines to the SVG
line_svg.append('path')
  .data([line_data])
  .attr('fill', 'none')
  .attr('stroke', 'blue')
  .attr('stroke-width', 2)
  .attr('d', line_line1);

line_svg.append('path')
  .data([line_data])
  .attr('fill', 'none')
  .attr('stroke', 'green')
  .attr('stroke-width', 2)
  .attr('d', line_line2);

line_svg.append('path')
  .data([line_data])
  .attr('fill', 'none')
  .attr('stroke', 'red')
  .attr('stroke-width', 2)
  .attr('d', line_line3);

// Add X axis
line_svg.append('g')
  .attr('transform', 'translate(0,' + line_height + ')')
  .call(d3.axisBottom(line_xScale));

// Add Y axis
line_svg.append('g')
  .call(d3.axisLeft(line_yScale));

// Add legend
const line_legend = line_svg.append('g')
  .attr('transform', 'translate(' + (line_width - 10) + ', 10)');

line_legend.append('rect')
  .attr('width', 10)
  .attr('height', 10)
  .attr('fill', 'blue');

// Add title
line_svg.append('text')
  .attr('x', line_width / 2)
  .attr('y', 0)
  .attr('text-anchor', 'middle')
  .style('font-size', '16px')
  .text('Line Graph Test');

line_legend.append('text')
  .attr('x', 15)
  .attr('y', 5)
  .attr('dy', '0.75em')
  .text('1');

line_legend.append('rect')
  .attr('width', 10)
  .attr('height', 10)
  .attr('y', 20)
  .attr('fill', 'green');

line_legend.append('text')
  .attr('x', 15)
  .attr('y', 25)
  .attr('dy', '0.75em')
  .text('2');

line_legend.append('rect')
  .attr('width', 10)
  .attr('height', 10)
  .attr('y', 40)
  .attr('fill', 'red');

line_legend.append('text')
  .attr('x', 15)
  .attr('y', 45)
  .attr('dy', '0.75em')
  .text('3');
