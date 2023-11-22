// Set up dimensions for the map
const map_width = 500;
const map_height = 300;
const map_margin = { top: 20, right: 20, bottom: 30, left: 50 };

// Create an SVG container within the body
const map_svg = d3.select('.map-holder').append('svg')
  .attr('width', map_width + map_margin.left + map_margin.right)
  .attr('height', map_height + map_margin.top + map_margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + map_margin.left + ',' + map_margin.top + ')');

// Map and projection
var map_projection = d3.geoMercator()
    .scale(map_width / 2 / Math.PI)
    .translate([map_width / 2, map_height / 2]);

// Load external data and draw the map
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", function(data){
    // Draw the map
    const countries = map_svg.append("g")
        .selectAll("path")
        .data(data.features)
        .enter().append("path")
            .attr("fill", (d, i) => d3.schemeCategory10[i % 10]) // Assign different colors based on index
            .attr("d", d3.geoPath()
                .projection(map_projection)
            )
            .style("stroke", "#fff")
            .on("click", clicked);

    function clicked(d) {
        // If the clicked country is already selected, reset all to normal
        if (d3.select(this).classed("selected")) {
            countries.classed("selected", false).attr("fill", (d, i) => d3.schemeCategory10[i % 10]);
        } else {
            // Reset all countries to gray and remove "selected" class
            countries.classed("selected", false).attr("fill", "#d3d3d3");

            // Highlight the clicked country, add "selected" class, and set color
            d3.select(this)
                .classed("selected", true)
                .attr("fill", "orange");
        }
    }
});

// Add title
map_svg.append('text')
  .attr('x', line_width / 2)
  .attr('y', 260)
  .attr('text-anchor', 'middle')
  .style('font-size', '16px')
  .text('Map Graph Test (click area to filter)');
