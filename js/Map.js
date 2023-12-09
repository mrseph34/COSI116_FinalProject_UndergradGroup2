// Function to create a choropleth map
function map(id, data, world) {
    // Select the container div using the provided id
    const div = d3.select(`#${id}`);
    // Clear any existing elements within the container
    div.selectAll("*").remove();
    let value_field = "GeoAreaName";
  
    // Set up chart dimensions
    const width = div.node().getBoundingClientRect().width * 0.9;
    const height = div.node().getBoundingClientRect().height * 0.9;
    const margin = { left: 20, right: 20, top: 20, bottom: 20 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;
    const svg = div.append("svg").attr("width", width).attr("height", height);
  
    // Add a tooltip for showing information on hover
    d3.select("body")
      .append("div")
      .style("display", "none")
      .attr("position", "absolute")
      .attr("class", "d3-tip");
  
    // Handle data - filter out the "World" data
    data = data.filter((d) => d.GeoAreaName !== "World");
  
    // Aggregate data by GeoAreaName
    let group_data = d3.rollups(
      data,
      (d) => d3.mean(d, (v) => v["Value"]),
      (d) => d[value_field]
    );
  
    // Assign values to corresponding features in the world data
    world.features.forEach((d) => {
      let value = group_data.find((v) => v[0] === d.properties.name);
      d.value = value ? value[1] : 0;
    });
  
    // Set up color scale for the map
    const color_scale = d3.scaleSequential(d3.interpolateBlues).domain([0, 100]);
  
    // Set up map projection
    const projection = d3
      .geoMercator()
      .fitSize([innerW, innerH], world)
      .clipExtent([
        [0, margin.left],
        [innerW, innerH],
      ])
      .translate([innerW / 2, innerH / 2]);
  
    const path = d3.geoPath().projection(projection);
  
    // Create the map group
    const map = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    // Draw map paths
    let mapPath = map
      .selectAll("path")
      .data(world.features)
      .join("path")
      .attr("d", path);
  
    // Style map paths with fill color, stroke, and class/id attributes
    mapPath
      .attr("fill", (d) => color_scale(+d.value))
      .attr("stroke", "black")
      .attr("stroke-width", "1")
      .attr("class", (d) => d.properties.name)
      .attr("id", (d) => "map-holder" + range_scale(d.value));
  
    // Add interactions to map paths
    mapPath
      .on("mouseenter", (e, d) => {
        let html = ` <p> ${d.properties.name} :${d3.format(".2f")(d.value)}%  </p>`;
        highlight("map-holder", d.value);
        highlight("bar-holder", d.value);
        highlight("legend", d.value);
        let filter_data = data.filter((v) => v["GeoAreaName"] === d.properties.name);
        show_line("line-holder", filter_data, e);
      })
      .on("mouseout", (e, d) => {
        unHighlight("map-holder", d.value);
        unHighlight("bar-holder", d.value);
        unHighlight("legend", d.value);
        hide_line();
      });
  
    // Create a legend for the color scale
    const legend = map
      .append("g")
      .attr("transform", `translate(${20},${innerH - 100})`);
  
    let color_domain = d3.ticks(0, 1, 10);
    let bar_width = document.getElementById("map-holder").offsetWidth/15;
  
    // Draw rectangles for the legend
    let lgd_rects = legend
      .selectAll("rect")
      .data(color_domain)
      .join("rect")
      .attr("stroke", "black")
      .attr("width", bar_width)
      .attr("height", 10)
      .attr("y", 20)
      .attr("x", (d, i) => i * bar_width)
      .attr("id", (d) => "legend" + range_scale(d * 100))
      .attr("fill", (d) => color_scale(d * 100));
  
    // Add text labels to the legend
    legend
      .selectAll("mytext")
      .data(color_domain)
      .join("text")
      .attr("y", 45)
      .attr("x", (d, i) => i * bar_width)
      .text((d) => d3.format(".0%")(d))
      .attr("font-size", width/50)
      .attr("fill", "gray");
  
    // Add a title
    svg.append("text")
    .attr("class", "chart-title")
    .attr("x", innerW / 1.8)
    .attr("y", margin.top + 20)
    .attr("text-anchor", "middle")
    .style("font-size", innerW/15)
    .style("font-weight", "bold")
    .text("Region Map");

    // Add a name 4 region
    svg.append("text")
    .attr("id", "region-name")
    .attr("x", innerW / 1.8)
    .attr("y", innerH + 5)
    .attr("text-anchor", "middle")
    .style("font-size", innerW/20)
    .style("font-weight", "bold")
    .text("NO REGION MATCHES");

    // Add interactions to legend rectangles
    lgd_rects
      .on("mouseenter", (e, d) => {
        highlight("legend", d * 100);
        highlight("bar-holder", d * 100);
        highlight("map-holder", d * 100);
      })
      .on("mouseout", (e, d) => {
        unHighlight("legend", d * 100);
        unHighlight("bar-holder", d * 100);
        unHighlight("map-holder", d * 100);
      });

  }
  