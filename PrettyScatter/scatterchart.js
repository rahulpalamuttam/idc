/**
 * Created by rpalamut on 11/23/15.
 */


var numDisplayed = 55
var margin = {top: 50, right: 300, bottom: 50, left: 50},
    outerWidth = 1050,
    outerHeight = 500,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;
/**
 * PNG reader
 */
var BrowserCache = []

for(var i = 0; i < 10000; i++){
    BrowserCache.push([Math.floor(Math.random() * 400), Math.floor(Math.random() * 400)])
}
var data = BrowserCache.slice(0, numDisplayed)
var x = d3.scale.linear()
    .range([0, width]).nice();

var y = d3.scale.linear()
    .range([height, 0]).nice();

var xCat = "Calories",
    yCat = "Potassium"


var xMax = d3.max(data, function (d) { return d[0];}) * 1.05,
    xMin = d3.min(data, function (d) { return d[0];}),
    xMin = xMin > 0 ? 0 : xMin,
    yMax = d3.max(data, function (d) { return d[1]; }) * 1.05,
    yMin = d3.min(data, function (d) { return d[1]; }),
    yMin = yMin > 0 ? 0 : yMin;

x.domain([xMin, xMax]);
y.domain([yMin, yMax]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(-height);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickSize(-width);

var color = d3.interpolateRgb(0,255);

var tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(function (d) {
        return xCat + ": " + d[0] + "<br>" + yCat + ": " + d[1];
    });

var zoomBeh = d3.behavior.zoom()
    .x(x)
    .y(y)
    .scaleExtent([0, 500])
    .on("zoom", zoom);

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", outerWidth)
    .attr("height", outerHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoomBeh);

svg.call(tip);

svg.append("rect")
    .attr("width", width)
    .attr("height", height);

svg.append("g")
    .classed("x axis", true)
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .classed("label", true)
    .attr("x", width)
    .attr("y", margin.bottom - 10)
    .style("text-anchor", "end")
    .text(xCat);

svg.append("g")
    .classed("y axis", true)
    .call(yAxis)
    .append("text")
    .classed("label", true)
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text(yCat);

var objects = svg.append("svg")
    .classed("objects", true)
    .attr("width", width)
    .attr("height", height);

objects.append("svg:line")
    .classed("axisLine hAxisLine", true)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", width)
    .attr("y2", 0)
    .attr("transform", "translate(0," + height + ")");

objects.append("svg:line")
    .classed("axisLine vAxisLine", true)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", height);

var dataElement = objects.selectAll(".rect")
    .data(data, function(d){
        //console.log(d)
        return [d[0], d[1]]
    });

dataElement.enter().append("circle")
    .classed("dot", true)
    .attr("r", function (d) {
        return 4 * Math.sqrt(5 / Math.PI);
    })
    .attr("transform", transform)
    .style("fill", function (d) {
        d3.rgb(0,0,199)
        //console.log(k)
    })
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide);

var legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
    .classed("legend", true)
    .attr("transform", function (d, i) {
        return "translate(0," + i * 20 + ")";
    });

legend.append("square")
    .attr("r", 3.5)
    .attr("cx", width + 20)
    .attr("fill", color);

legend.append("text")
    .attr("x", width + 26)
    .attr("dy", ".35em")
    .text(function (d) {
        return d;
    });

d3.select("input").on("click", change);

function change() {
    xCat = "Carbs";
    xMax = d3.max(data, function (d) { return d[0]; });
    xMin = d3.min(data, function (d) { return d[0]; });

    zoomBeh.x(x.domain([xMin, xMax])).y(y.domain([yMin, yMax]));

    var svg = d3.select("#scatter").transition();

    svg.select(".x.axis").duration(750).call(xAxis).select(".label").text(xCat);

    objects.selectAll(".dot").transition().duration(1000).attr("transform", transform);
}

function zoom() {

    /**
     * Update the axis on the zoom
     */
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);

    svg.selectAll(".dot")
        .attr("transform", transform);

    /**
     * Print the new values of the axis ranges
     */
    var xRange = x.domain();
    var yRange = y.domain();
    console.log(xRange, yRange)

    /**
     * Query all points that fit in the xRange and yRange.
     * We always want numDisplayed number of points. Check how many points
     * are needed to satisfy the amount.
     *
     * If extra points are needed, query the BrowserCache ensuring that
     * repeated points are not included.
     * @type {Array.<*>}
     */
    var filtered = data.filter(function(d) {return d[0] >= xRange[0] && d[0] <= xRange[1] && d[1] > yRange[0] && d[1] < yRange[1]})
    var takeExtra = numDisplayed - filtered.length
    console.log(takeExtra)
    var sample = []
    if(takeExtra > 0){
        sample = BrowserCache.filter(function(d) {return d[0] >= xRange[0] && d[0] <= xRange[1] && d[1] > yRange[0] && d[1] < yRange[1] && data.indexOf(d) == -1}).slice(0, takeExtra)
        console.log("Extra Sampling Array :");
        console.log(sample)
    }
    console.log("Filtered Array :");
    console.log(filtered)

    /**
     * Update the data array
     * If the data array still doesn't have enough points, then we need to query the RDD
     * through a restful WebService
     * @type {Array.<T>}
     */
    data = sample.concat(filtered)
    if(data.length < numDisplayed){
        var needToFetch = numDisplayed - data.length
        console.log("Still need to do something about the data - fetch from RDD : " + needToFetch)
    }
    updatePoints(data);
}

function transform(d) {
    return "translate(" + x(d[0]) + "," + y(d[1]) + ")";
}

function updatePoints(filtered) {
    objects.selectAll(".rect").remove()
    objects.selectAll(".rect")
        .data(filtered)
        .enter().append("circle")
        .classed("dot", true)
        .attr("r", function (d) {
            return 4 * Math.sqrt(5 / Math.PI);
        })
        .attr("transform", transform)
        .style("fill", function (d) {
            d3.rgb(0,0,199)
        })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);
}
