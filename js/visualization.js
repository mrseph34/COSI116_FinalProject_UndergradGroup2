// Define a debounce function to limit the rate at which the draw function is called
function debounce(func, wait) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Define an async function named 'draw'
async function draw() {
  // Check if github pages to use non local fetch or not
  const isGitHubPages = window.location.href.includes('github.io');
  // console.log(window.location.href)
  let data
  let world
  let final_src // final image source
  let vid_src // video source
  if (isGitHubPages) {
    // Fetch CSV data from the 'data.csv' file
    data = await d3.csv("data/data.csv");
    // Fetch JSON data from the 'world.json' file
    world = await d3.json("data/world.json");
    final_src= "images/final prject img.png";
    vid_src = "COSI116-Video-Demo.mp4";
  } else {
    // Local Fetchs
    data = await d3.csv("../../data/data.csv");
    world = await d3.json("../../data/world.json");
    final_src= "../../images/final prject img.png";
    vid_src = "../../COSI116-Video-Demo.mp4";
  }

  //make img show up on html for final pic same for vid
  d3.select("#finalimg").attr("src", final_src);
  d3.select("#vidshiz").attr("src", vid_src);

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

var globalRegion = null

// Define a function 'highlight' to highlight data points based on their 'id' and 'pts' value
function highlight(id, pts) {
// Select all elements with the specified 'id' and 'pts' value range
d3.selectAll(`#${id}${range_scale(pts)}`).attr("stroke-width", 3);
d3.selectAll(`#${id}${range_scale(pts)}`).attr("stroke", "red");
regionChange();
txt = "Matches: "+"Other"
if (globalRegion) txt = "Matches: "+globalRegion;
d3.select("#region-name").text((txt));
}

// Define a function 'unHighlight' to remove highlighting from data points
function unHighlight(id, pts) {
// Select all elements with the specified 'id' and 'pts' value range
d3.selectAll(`#${id}${range_scale(pts)}`).attr("stroke-width", 1);
d3.selectAll(`#${id}${range_scale(pts)}`).attr("stroke", "black");
globalRegion = null;
d3.select("#region-name").text("NO REGION MATCHES");
}

// Define a function to handle window resize and redraw the maps
const handleResize = debounce(async () => {
  // Clear existing maps
  d3.select("#map-holder").selectAll("*").remove();
  d3.select("#bar-holder").selectAll("*").remove();
  // Redraw the maps
  await draw();
}, 10); 

// Add an event listener for window resize
window.addEventListener("resize", handleResize);

// Call the 'draw' function to execute the initial data processing and visualization tasks
draw();