// Define an async function named 'draw'
async function draw() {
    // Fetch CSV data from the 'data.csv' file
    let data //= await d3.csv("../../data/data.csv");
    try {
    const dat = await fetch('data.json').then(response => response.json());
      data = dat
    } catch (error) {
      console.error(error);
    }
    
    // Fetch JSON data from the 'world.json' file
    let world //= await d3.json("../../data/world.json");
    d3.json('data/world.json', function(error, data) {
      if (error) {
        console.error(error);
        return;
      }
      world = data;
    });
    // Iterate through the CSV data
    data.forEach((d) => {
      // Find the corresponding country in the JSON data based on 'GeoAreaName'
      let value = world.features.find(
        (v) => v.properties.name === d["GeoAreaName"]
      );
  
      // Assign the 'region_wb' property from the JSON data to the 'Region' property in the CSV data
      d.Region = value ? value.properties["region_wb"] : "None";
    });
  
    // Create a map using the 'map-holder' element, the processed CSV data, and the JSON data
    map("map-holder", data, world);
  
    // Create a bar chart using the 'bar-holder' element and the processed CSV data
    bar("bar-holder", data);
  }
  
  // Define a quantile scale for coloring based on the 'pts' value
  const range_scale = d3
    .scaleQuantize()
    .domain([0, 100])
    .range(d3.ticks(0, 100, 10));
  
  // Define a function 'highlight' to highlight data points based on their 'id' and 'pts' value
  function highlight(id, pts) {
    // Select all elements with the specified 'id' and 'pts' value range
    d3.selectAll(`#${id}${range_scale(pts)}`).attr("stroke-width", 3);
  }
  
  // Define a function 'unHighlight' to remove highlighting from data points
  function unHighlight(id, pts) {
    // Select all elements with the specified 'id' and 'pts' value range
    d3.selectAll(`#${id}${range_scale(pts)}`).attr("stroke-width", 0.1);
  }
  
  // Call the 'draw' function to execute the data processing and visualization tasks
  draw();
  