var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
var file = "data.csv"
d3.csv(file).then(successHandle, errorHandle);

function errorHandle(error){
  throw err;
}

function successHandle(povertyData) {

  // Parse Data/Cast as numbers
   // ==============================
  povertyData.forEach(function(data) {
    data.poverty_percentage = +data.poverty;
    data.smokers_percentage = +data.smokes;
  });

  // Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(povertyData, d => d.poverty_percentage)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(povertyData, d => d.smokers_percentage)])
    .range([height, 0]);

  // Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append Axes to the chart
  // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

   // Create Circles
  // ==============================
  var circlesGroup = chartGroup.selectAll("circle")
  .data(povertyData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty_percentage))
  .attr("cy", d => yLinearScale(d.smokers_percentage))
  .attr("r", "15")
  .attr("fill", "lightblue")
  .attr("opacity", ".5");

    // Create state abbreviation labels
  // ==============================
  chartGroup.append("g").selectAll("text")
  .data(povertyData)
  .enter()
  .append("text")
  .text(function (d) {
  return d.abbr;
  })
.attr("dx", d => xLinearScale(d.poverty_percentage))
.attr("dy", d => yLinearScale(d.smokers_percentage)+5)
.attr("class","stateText");

  // Create axes labels
  // ==============================
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Smokers (%)")
    .attr("class", "active");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)")
    .attr("class", "active");
  
}

