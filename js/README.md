# JavaScript Codebase
This repository contains the JavaScript code for the COSI116 Final Project - Undergrad Group 2. The code implements interactive visualizations, including a choropleth map, bar chart, and line chart, depicting the percentage of safe drinking water in different regions over time.

1. Debounce Function
The debounce function is used to limit the rate at which the draw function is called. It prevents rapid and unnecessary calls, optimizing performance.

2. Draw Function
The draw function is the main entry point for initializing the visualizations. It fetches data, processes it, and calls functions to create the choropleth map and bar chart.

3. Map Function
The map function generates a choropleth map using D3.js. It visualizes the percentage of safe drinking water in different regions. Interactions such as hover effects and legends are implemented for user engagement.

4. Bar Chart Function
The bar function creates a bar chart representing the proportion of safe drinking water in various regions. Hovering over bars triggers interactions with the map and line chart, providing additional information.

5. Line Chart Function
The line function produces a line chart illustrating the percentage of safe drinking water over time. Each line corresponds to a specific region, and a legend is included for clarity.

6. Region Change Function
The regionChange function is triggered when there is a change in region selection. It identifies the highlighted region based on stroke width and updates the global variable globalRegion.

Usage
Clone the repository to your local machine.
Open the HTML file in a web browser to view the interactive visualizations.
Dependencies
D3.js

* Acknowledgments
This project acknowledges and utilizes various resources, including Geo JSON data, animated U.S. border maps, clean water accessibility data, and tutorials on creating line charts and bar charts.

