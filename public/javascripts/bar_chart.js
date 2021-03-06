/**
 * Created by edwardwalther on 2/13/16.
 */
(function(){


    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);
    var y = d3.scale.linear()
        .range([height, 0]);
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(15, "");
    var svg = d3.select("#bar_chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    d3.json("/media/grab_json",function(data){


        var count = {};

        for (var obj in data) {
            if (count[data[obj].genre] === undefined && data[obj].genre !== undefined) {
                count[data[obj].genre] = {};
                count[data[obj].genre].genre = data[obj].genre
                count[data[obj].genre].frequency = 1;

                //count[data[obj].genre].genre = data[obj].genre
            }
            else
                count[data[obj].genre].frequency++;
        }


        for (var obj in data) {
            for (var key in count) {
                if (data[obj].genre == key)data[obj].frequency = count[key].frequency;
            }

        }

        var graph_array = [];

        for (var key in count) {
            graph_array.push(count[key]);
        }


        x.domain(data.map(function (d) {
            return d.genre;
        }));
        y.domain([0, d3.max(data, function (d) {
            return d.frequency;
        })]);

        data = graph_array;

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("x", 910)
            .attr("dx", "-.71em")
            .attr("y", "-.5em")
            .style("text-anchor", "end")
            .text("genre");
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("How Many");
        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("fill", "red")
            .attr("x", function (d) {
                return x(d.genre) + 70;
            })
            .attr("width", x.rangeBand() / 2)
            .attr("y", function (d) {
                return y(d.frequency);
            })
            .attr("height", function (d) {
                return height - y(d.frequency);
            });
    });
})()