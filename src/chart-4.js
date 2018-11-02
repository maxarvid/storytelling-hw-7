import * as d3 from 'd3'

// I'll give you margins/height/width
var margin = { top: 100, left: 10, right: 10, bottom: 30 }
var height = 500 - margin.top - margin.bottom
var width = 400 - margin.left - margin.right

// And grabbing your container
var container = d3.select('#chart-4')

// Create your scales
var xPositionScale = d3
  .scaleOrdinal()
  .domain([-6, 6])
  .range([0, width])

var yPositionScale = d3.scaleLinear().range([height, 0])

// Create your area generator

// Read in your data, then call ready