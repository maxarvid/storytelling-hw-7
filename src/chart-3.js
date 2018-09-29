import * as d3 from 'd3'

// Create your margins and height/width
var margin = { top: 30, left: 50, right: 30, bottom: 30 }

var height = 240 - margin.top - margin.bottom
var width = 180 - margin.left - margin.right

// I'll give you this part!
var container = d3.select('#chart-3')

// Create your scales
var xPositionScale = d3
  .scaleLinear()
  .domain([1980, 2010])
  .range([0, width])
var yPositionScale = d3
  .scaleLinear()
  .domain([0, 20000])
  .range([height, 0])

// Create your line generator
var line = d3
  .line()
  .x(d => xPositionScale(d.year))
  .y(d => yPositionScale(d.income))

// Read in your data
Promise.all([
  d3.csv(require('./middle-class-income.csv')),
  d3.csv(require('./middle-class-income-usa.csv'))
])
  .then(ready)
  .catch(err => {
    console.log(err)
  })

// Create your ready function
function ready(datapoints) {
  // console.log('raw data is', datapoints)

  // splitting up the data
  var datapointsUSA = datapoints[1]
  // console.log(datapointsUSA)
  var datapointsOther = datapoints[0]
  // console.log(datapointsOther)

  var nested = d3
    .nest()
    .key(function(d) {
      return d.country
    })
    .entries(datapointsOther)

  container
    .selectAll('.income-graph')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', 'income-graph')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .each(function(d) {
      var svg = d3.select(this)

      var datapoints = d.values
      // Add income line
      svg
        .append('path')
        .datum(datapoints)
        .attr('d', line)
        .attr('stroke-width', 2)
        .attr('stroke', '#95526d')
        .attr('fill', 'none')

      // Add Country label
      svg
        .append('text')
        .text(d.key)
        .attr('x', width / 2)
        .attr('y', 0)
        .attr('fill', '#95526d')
        .attr('font-size', 10)
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .attr('dy', -10)

      // Add USA line
      svg
        .append('path')
        .datum(datapointsUSA)
        .attr('d', line)
        .attr('stroke-width', 2)
        .attr('stroke', '#808080')
        .attr('fill', 'none')

      // USA line label
      svg
        .append('text')
        .text('USA')
        .attr('x', xPositionScale(1985))
        .attr('y', yPositionScale(16000))
        .attr('fill', '#808080')
        .attr('font-size', 10)
        .attr('text-anchor', 'middle')
        .attr('dy', -10)

      // add x and y axis on each SVG.
      var xAxis = d3
        .axisBottom(xPositionScale)
        .ticks(4)
        .tickFormat(d3.format(''))
        .tickSize(-height)

      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis)

      var yAxis = d3
        .axisLeft(yPositionScale)
        .ticks(4)
        .tickSize(-width)
        .tickFormat(d => {
          return '$' + d3.format(',')(d)
        })

      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)

      svg.selectAll('.axis text').attr('font-size', 8)
      svg.selectAll('.axis line').attr('stroke-dasharray', '1 3')
      svg.selectAll('.axis path').remove()
      svg.select('.y-axis g').remove()
    })
}
