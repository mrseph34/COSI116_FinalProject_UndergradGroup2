// Temporary data
const data = [
  { category: 'A', value: 20 },
  { category: 'B', value: 50 },
  { category: 'C', value: 30 },
  { category: 'D', value: 45 },
];

// Define a categorical color scale
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Set up the SVG container
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 500 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;

const svg = d3.select('.bar-holder')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// Set up scales
const xScale = d3.scaleBand()
  .domain(data.map(d => d.category))
  .range([0, width])
  .padding(0.1);

const yScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.value)])
  .range([height, 0]);

// Draw bars with different colors
svg.selectAll('rect')
  .data(data)
  .enter().append('rect')
  .attr('x', d => xScale(d.category))
  .attr('y', d => yScale(d.value))
  .attr('width', xScale.bandwidth())
  .attr('height', d => height - yScale(d.value))
  .attr('fill', (d, i) => colorScale(i));

// Add title
svg.append('text')
  .attr('x', line_width / 2)
  .attr('y', -2)
  .attr('text-anchor', 'middle')
  .style('font-size', '16px')
  .text('Bar Graph Test');

// Draw x-axis
svg.append('g')
  .attr('transform', 'translate(0,' + height + ')')
  .call(d3.axisBottom(xScale));

// Draw y-axis
svg.append('g')
  .call(d3.axisLeft(yScale));

// Add legend outside of the graph
const legend = d3.select('.bar-holder')
  .append('svg')
  .attr('width', 100)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + (width + margin.left + margin.right) + ',' + margin.top + ')');

legend.selectAll('rect')
  .data(data)
  .enter().append('rect')
  .attr('x', 0)
  .attr('y', (d, i) => i * 20)
  .attr('width', 10)
  .attr('height', 10)
  .attr('fill', (d, i) => colorScale(i));

legend.selectAll('text')
  .data(data)
  .enter().append('text')
  .attr('x', 15)
  .attr('y', (d, i) => i * 20 + 9)
  .text(d => d.category)
  .style('font-size', '12px')
  .style('fill', '#333'); // color for text




