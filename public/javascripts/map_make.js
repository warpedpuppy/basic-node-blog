/**
 * Created by edwardwalther on 2/13/16.
 */
(function(){
    d3.json("/media/get_map_data", function(json) {
    var width = 900;
    var height = 600;


    var projection = d3.geo.mercator();//albers();<-- this is just america//


    var svg = d3.select("#map_div").append("svg")
        .attr("width", width)
        .attr("height", height);

    var path = d3.geo.path().projection(projection);
    var geoPath = d3.geo.path().projection(projection);

    var g = svg.append("g");
    var neighborhoods = svg.append( "g" );

    d3.json("/javascripts/world-110m2.json", function(error, topology) {
        g.selectAll("path")
            .data(topojson.object(topology, topology.objects.countries).geometries)
            .enter()
            .append("path")
            .attr("d", path)


    });


        //rendering logic here
        //console.log(json)

        var geom = [];
        for(var key in json){
            //console.log(json[key]['longitude']);

            var lat_value = json[key]['latitude'];
            var lon_value = json[key]['longitude'];
            var city = json[key]['city'];

            var obj = {
                city: city,
                location:{
                    latitude:lat_value,
                    longitude:lon_value
                }
            }


            geom.push(obj);
        }
        //console.log(geom)

        svg.selectAll(".pin")
            .data(geom)
            .enter().append("circle", ".pin")
            .attr("r", 5)
            .attr( "fill", "#FF0000" )
            .attr( "stroke", "#FFFF00" )
            .attr("transform", function(d) {
                return "translate(" + projection([
                        d.location.longitude,
                        d.location.latitude
                    ]) + ")";

            });





    });




})()