
(function() {

    var BubbleChart, root, BarChart,
        __bind = function (fn, me) {
            return function () {
                return fn.apply(me, arguments);
            };
        };

    BubbleChart = (function () {
        function BubbleChart(data) {
            this.hide_details = __bind(this.hide_details, this);
            this.show_details = __bind(this.show_details, this);
            this.hide_genres = __bind(this.hide_genres, this);
            this.display_genres = __bind(this.display_genres, this);
            this.move_towards_genre = __bind(this.move_towards_genre, this);
            this.display_by_genre = __bind(this.display_by_genre, this);
            this.move_towards_center = __bind(this.move_towards_center, this);
            this.display_group_all = __bind(this.display_group_all, this);
            this.start = __bind(this.start, this);
            this.create_vis = __bind(this.create_vis, this);
            this.create_nodes = __bind(this.create_nodes, this);
            var max_amount;
            this.data = data;
            this.width = 650;
            this.height = 400;
            this.tooltip = CustomTooltip("asdf", 240);
            this.genre_array = [];
            this.center = {
                x: this.width / 2,
                y: (this.height / 2)-70
            };
            this.genre_centers = {
                "book": {
                    x: (this.width *.2)+50,
                    y: this.height / 2
                },
                "television": {
                    x: this.width *.4,
                    y: this.height / 2
                },
                "movie": {
                    x: (this.width *.6)-15,
                    y: this.height / 2
                },
                "music": {
                    x: (this.width *.8)-15,
                    y: this.height / 2
                }
            };
            this.layout_gravity = -0.01;
            this.damper = 0.1;
            this.vis = null;
            this.nodes = [];
            this.force = null;
            this.circles = null;
            this.fill_color = d3.scale.ordinal().domain(["low", "medium", "high"]).range(["#d84b2a", "#beccae", "#7aa25c"]);
            max_amount = d3.max(this.data, function (d) {
                return parseInt(d.total_amount);
            });
            this.radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_amount]).range([2, 85]);
            this.create_nodes();
            this.create_vis();

        }

        BubbleChart.prototype.create_nodes = function () {

            this.data.forEach((function (_this) {
                return function (d) {

                    if (this.genre_array === undefined)this.genre_array = [];

                    if (this.genre_array.indexOf(d.genre) == -1) {
                        this.genre_array.push(d.genre);

                    }

                    var node;
                    node = {

                        radius: 25,//_this.radius_scale(parseInt(5000)),
                        value: 5000,
                        name: d.title,
                        org: d.genre,
                        group: d.genre,
                        genre: 2010,


                        id: d.id,
                        title: d.title,
                        genre: d.genre,
                        author: d.author,
                        x: Math.random() * this.width,
                        y: Math.random() * this.height
                    };

                    ;
                    return _this.nodes.push(node);
                };

            })(this));
            return this.nodes.sort(function (a, b) {
                return b.value - a.value;
            });
        };

        BubbleChart.prototype.create_vis = function () {
            var that;

            this.vis = d3.select("#chart_bubble_test").attr("width", this.width).attr("height", this.height).attr("id", "svg_vis")

            that = this;

            this.circles = this.vis.selectAll("circle").data(this.nodes, function (d) {




                return d.id;
            });


            var elemEnter = this.circles.enter();

            var circle = elemEnter.append("circle");

            circle.attr("r", 0);


            circle.attr("fill", function (d) {
                var fill;
                if (d.genre === "television")
                    fill = "#FF0000"
                else if (d.genre === "book")
                    fill = "#FFFFFF"
                else if (d.genre === "movie")
                    fill = "#666000";
                else
                    fill = "#FFFF00"

                return fill;

            });


            circle.attr("stroke-width", 2).attr("stroke", "black")

            circle.attr("id", function (d) {
                return "bubble_" + d.id;
            })

            circle.on("mouseover", function (d, i) {
                return that.show_details(d, i, this);
            })

            circle.on("mouseout", function (d, i) {
                return that.hide_details(d, i, this);
            });


            return this.circles.transition().duration(2000).attr("r", function (d) {
                return d.radius;
            });
        };

        BubbleChart.prototype.charge = function (d) {
            return -Math.pow(d.radius, 2.0) / 8;
        };

        BubbleChart.prototype.start = function () {
            return this.force = d3.layout.force().nodes(this.nodes).size([this.width, this.height]);
        };

        BubbleChart.prototype.display_group_all = function () {
            this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", (function (_this) {
                return function (e) {
                    return _this.circles.each(_this.move_towards_center(e.alpha)).attr("cx", function (d) {
                        return d.x;
                    }).attr("cy", function (d) {
                        return d.y;
                    });
                };
            })(this));
            this.force.start();
            return this.hide_genres();
        };

        BubbleChart.prototype.move_towards_center = function (alpha) {
            return (function (_this) {
                return function (d) {
                    d.x = d.x + (_this.center.x - d.x) * (_this.damper + 0.02) * alpha;
                    return d.y = d.y + (_this.center.y - d.y) * (_this.damper + 0.02) * alpha;
                };
            })(this);
        };

        BubbleChart.prototype.display_by_genre = function () {

            this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", (function (_this) {
                return function (e) {
                    return _this.circles.each(_this.move_towards_genre(e.alpha)).attr("cx", function (d) {
                        return d.x;
                    }).attr("cy", function (d) {
                        return d.y;
                    });
                };
            })(this));
            this.force.start();
            return this.display_genres();
        };

        BubbleChart.prototype.move_towards_genre = function (alpha) {
            return (function (_this) {
                return function (d) {
                    var target;

                    target = _this.genre_centers[d.genre];

                    d.x = d.x + (target.x - d.x) * (_this.damper + 0.02) * alpha * 1.1;
                    return d.y = d.y + (target.y - d.y) * (_this.damper + 0.02) * alpha * 1.1;
                };
            })(this);
        };

        BubbleChart.prototype.display_genres = function () {
            var genres, genres_data, genres_x;
            genres_x = {
                "books": this.width *.2,
                "television": this.width *.4,
                "movies": this.width *.6,
                "music":this.width *.8
            };
            genres_data = d3.keys(genres_x);
            genres = this.vis.selectAll(".genres").data(genres_data);
            return genres.enter().append("text").attr("class", "genres").attr("x", (function (_this) {
                return function (d) {
                    return genres_x[d];
                };
            })(this)).attr("y", 40).attr("text-anchor", "middle").text(function (d) {

                return d;
            });
        };

        BubbleChart.prototype.hide_genres = function () {
            var genres;
            return genres = this.vis.selectAll(".genres").remove();
        };

        BubbleChart.prototype.show_details = function (data, i, element) {
            var content;
            d3.select(element).attr("stroke", "black");
            content = "<span class=\"name\">Title:</span><span class=\"value\"> " + data.title + "</span><br/>";
            content += "<span class=\"name\">Genre:</span><span class=\"value\"> " + data.genre + "</span><br/>";
            content += "<span class=\"name\">Author:</span><span class=\"value\"> " + data.author + "</span>";

            return this.tooltip.showTooltip(content, d3.event);
        };

        BubbleChart.prototype.hide_details = function (data, i, element) {
            d3.select(element).attr("stroke", (function (_this) {
                return function (d) {
                    return d3.rgb(_this.fill_color(d.group)).darker();
                };
            })(this));
            return this.tooltip.hideTooltip();
        };

        return BubbleChart;

    })();

    root = typeof exports !== "undefined" && exports !== null ? exports : this;


    function type(d) {
        d.frequency = +d.frequency;
        return d;
    }


    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 650 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;
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



    BarChart = function(data){

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
                        .attr("x", 600)
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
                            return x(d.genre) + 35;
                        })
                        .attr("width", x.rangeBand() / 2)
                        .attr("y", function (d) {
                            return y(d.frequency);
                        })
                        .attr("height", function (d) {
                            return height - y(d.frequency);
                        });
    };




    $(function () {
        var chart, render_vis;
        chart = null;
        $("#show_media").click(function () {
            root.display_genre();
            $(this).parent().addClass("active");
            $("#centered_button").parent().removeClass("active");

        })

        $("#centered_button").click(function () {
            $(this).parent().addClass("active");
            $("#show_media").parent().removeClass("active");
            root.display_all();

        })

        render_vis = function (csv) {

            BarChart(csv);
            chart = new BubbleChart(csv);
            chart.start();
            return root.display_all();
        };
        root.display_all = (function (_this) {
            return function () {
                return chart.display_group_all();
            };
        })(this);
        root.display_genre = (function (_this) {
            return function () {
                return chart.display_by_genre();
            };
        })(this);
        root.toggle_view = (function (_this) {
            return function (view_type) {
                if (view_type === 'genre') {
                    return root.display_genre();
                } else {
                    return root.display_all();
                }
            };
        })(this);

        return d3.json("/media/grab_json", render_vis);
    });







}).call(this);