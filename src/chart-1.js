import * as d3 from 'd3'

// Set up margin/height/width
var margin = { top: 50, left: 50, right: 100, bottom: 30 }

var height = 700 - margin.top - margin.bottom
var width = 600 - margin.left - margin.right
// Add your svg
var svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)

// Create a time parser (see hints)
let parseTime = d3.timeParse('%B-%y')

// Create your scales
let xPositionScale = d3.scaleLinear().range([0, width])

let yPositionScale = d3.scaleLinear().range([height, 0])

var colorScale = d3
  .scaleOrdinal()
  .range([
    '#a6cee3',
    '#1f78b4',
    '#b2df8a',
    '#33a02c',
    '#fb9a99',
    '#e31a1c',
    '#fdbf6f',
    '#ff7f00',
    '#cab2d6',
    '#6a3d9a'
  ])

// Create a d3.line function that uses your scales
var line = d3
  .line()
  .x(d => xPositionScale(d.datetime))
  .y(d => yPositionScale(+d.price))

// Read in your housing price data
d3.csv(require('./housing-prices.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

// Write your ready function
function ready(datapoints) {
  // Convert your months to dates
  // console.log('Data is', datapoints)
  datapoints.forEach(d => {
    d.datetime = parseTime(d.month)
  })

  // Get a list of dates and a list of prices
  var datesList = datapoints.map(d => d.datetime)
  var priceList = datapoints.map(d => +d.price)

  xPositionScale.domain(d3.extent(datesList))
  yPositionScale.domain(d3.extent(priceList))

  // Group your data together
  var nested = d3
    .nest()
    .key(d => d.region)
    .entries(datapoints)

  svg
    .selectAll('.price-data')
    .data(nested)
    .enter()
    .append('g')
    .attr('class', 'price-data')
    .each(function(d) {
      var g = d3.select(this)
      console.log(d)

      var datapoints = d.values
      console.log(datapoints)

      g.selectAll('.price-line')
        .data(datapoints)
        .enter()
        .append('path')
        .attr('class', 'price-line')
        .attr('d', d => line(datapoints))
        .attr('fill', 'none')
        .attr('stroke', d => colorScale(d.region))
        .attr('stroke-width', 2)
    })

  // Draw your lines
  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('fill', 'none')
    .attr('d', d => line(d.values[0]))
    .attr('stroke-width', 2)

  let maxDate = d3.max(datapoints, d => d.datetime)

  svg
    .selectAll('circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('cx', xPositionScale(maxDate))
    .attr('cy', d => yPositionScale(d.values[0].price))
    .attr('r', 5)
    .attr('fill', d => colorScale(d.key))

  // Add your text on the right-hand side
  svg
    .append('text')
    .data(nested)
    .text(d => d.key)
    .attr('x', xPositionScale(maxDate))
    .attr('y', d => yPositionScale(d.values[0].price))
    .attr('font-size', 10)
    .attr('alignment-baseline', 'middle')
    .attr('dx', 8)

  // Add your title
  svg
    .append('text')
    .attr('x', width / 2)
    .attr('y', -20)
    .text('U.S. housing prices fall in winter')
    .attr('font-size', 24)
    .attr('text-anchor', 'middle')
  // Add the shaded rectangle
  svg
    .append('rect')
    .attr('x', xPositionScale(parseTime('December-16')))
    .attr('y', 0)
    .attr('width', xPositionScale(parseTime('April-16')))
    .attr('height', yPositionScale(d3.min(priceList)))
    .attr('fill', '#d3d3d3')
    .lower()

  // Add your axes
  // console.log(datesList)
  var xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.timeFormat('%b %y'))

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis)

  var yAxis = d3.axisLeft(yPositionScale)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}
