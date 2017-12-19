var Glyphs = function(_map, filter) {

    var public = this;

    function createGlyph (id, mass, year, fall, superClass) {

        var w = 50;
        var h = 50;

        var svg = d3.select("body")
            .append("svg")
                .attr("id", id)
                .attr("width", w)
                .attr("height", h);

        if (mass === 0 || mass === null) {
            // use average for empty values
            mass = 13278;
        }

        var mScale = d3.scaleLog()
            .domain([0.01, 60000000])
            .range([1, 2 / 3 * h]);
        mass = mScale(mass);

        // Use megaclasses
        var cScale = d3.scaleOrdinal()
            .domain(["Chondrite", "Achondrite", "Stony-Iron", "Iron", "Other"])
            .range(["#339966", "#3399ff", "#ff0000", "#ff9900", "#999999"]);

        // Use superclasses
        var chondriteScale = d3.scaleOrdinal()
            .domain(["Carbonaceous Chondrite", "Ordinary Chondrite", "Enstatite Chondrite", "Other Chondrite"])
            .range(["#85e085", "#33cc33", "#1f7a1f", "#145214"]);

        var achondriteScale = d3.scaleOrdinal()
            .domain(["Primitive Achondrite", "Asteroidal Achondrite", "Lunar Meteorite", "Martian Meteorite"])
            .range(["#99d6ff", "#4db8ff", "#0099ff", "#005c99"]);

        var stonyironScale = d3.scaleOrdinal()
            .domain(["Pallasite", "Mesosiderite"])
            .range(["#ff6666", "#990000"]);

        var ironScale = d3.scaleOrdinal()
            .domain(["Magmatic Iron", "Non-Magmatic Iron", "Ungrouped Iron"])
            .range(["#ffcc80", "#cc7a00", "#804d00"]);


        var megaClass = getMegaClass(superClass);
        var mappedClass;

        var megaClassColor = cScale(megaClass);


        if (megaClass === "Chondrite") {
            mappedClass = chondriteScale(superClass);
        } else if (megaClass === "Achondrite") {
            mappedClass = achondriteScale(superClass);
        } else if (megaClass === "Stony-Iron") {
            mappedClass = stonyironScale(superClass);
        } else if (megaClass === "Iron") {
            mappedClass = ironScale(superClass);
        } else {
            mappedClass = d3.rgb("#999999");
        }



        if (year === 0 || year === null) {
            year = 2000; // temp
        } else {
            var yScale = d3.scaleLog()
                .domain([800, 2013])
                .range([-80, 260]);
            year = yScale(year);
        }

        if (fall) {

            var lineGenerator = d3.line()
                .curve(d3.curveBasis);

            var tail1Points = [
                [w / 2, h / 2 - mass / 2],
                [w / 2 + 4 / 5 * mass, h / 2 - mass / 2],
                [w / 2 + 4 / 5 * mass, h / 2 - mass]
            ];

            var tail2Points = [
                [w / 2, h / 2 + mass / 2],
                [w / 2 + 4 / 5 * mass, h / 2 + mass / 2],
                [w / 2 + 4 / 5 * mass, h / 2 - mass]
            ];

            var pathData1 = lineGenerator(tail1Points);
            var pathData2 = lineGenerator(tail2Points);

            svg.append("path")
                .attr('d', pathData1)
                .attr("stroke", "white")
                .attr("stroke-width", "2")
                .attr("stroke-opacity", "0.3")
                .attr("fill", "none");

            svg.append("path")
                .attr('d', pathData2)
                .attr("stroke", "white")
                .attr("stroke-width", "2")
                .attr("stroke-opacity", "0.3")
                .attr("fill", "none");

        }

        var circle = svg.append("circle")
            .attr("cx", w / 2)
            .attr("cy", h / 2)
            .attr("r", mass / 2)
            .attr("fill", mappedClass)
            .attr("fill-opacity", 0.65)
            .attr("fillSuper", mappedClass)
            .attr("fillMega", megaClassColor);

        var rad = year * (Math.PI / 180.0);

        svg.append("line")
            .attr("x1", w / 2)
            .attr("y1", h / 2)
            .attr("x2", w / 2 + Math.cos(rad) * mass / 2)
            .attr("y2", h / 2 + Math.sin(rad) * mass / 2)
            .attr("stroke", "black")
            .attr("stroke-width", mass / 10)
            .attr("stroke-opacity", 0.6);


    }

    function getMegaClass(superClass) {

        var megaClass = "";

        if (superClass === null) {
            megaClass = "Other";
        }
        else if (superClass.includes("Chondrite")) {
            megaClass = "Chondrite";
        } else if (superClass.includes("Achondrite") || superClass.includes("Lunar") || superClass.includes("Martian")) {
            megaClass = "Achondrite";
        } else if (superClass === "Pallasite" || superClass === "Mesosiderite") {
            megaClass = "Stony-Iron"
        } else if (superClass.includes("Iron")) {
            megaClass = "Iron";
        } else {
            megaClass = "Other";
        }


        return megaClass;
    }

    var projection;

    public.createGlyphOverlay = function(data, useMegaClasses) {

        var overlay = new google.maps.OverlayView();
        var layer;

        overlay.onAdd = function () {

            layer = d3.select(this.getPanes().overlayMouseTarget)
                .append("div")
                .attr("class", "divGlyphContainer");

            overlay.draw = function () {

                var markerOverlay = this;
                projection = markerOverlay.getProjection();

                var dataEntries = d3.entries(data);
                var det;
                var de;
                var lat;
                var lon;

                // initial position of glyph
                var marker = layer.selectAll("svg")
                    .data(dataEntries)
                    .enter()
                    .append("svg")
                    .attr("class", "svgGlyphContainer")
                    .each(function (d) {
                        lat = 0;
                        lon = 0;
                        if (d.value.coords !== null) {
                            lat = d.value.coords.split(' ')[0];
                            lon = d.value.coords.split(' ')[1];
                        }
                        det = new google.maps.LatLng(lat, lon);
                        de = projection.fromLatLngToDivPixel(det);
                        return d3.select(this)
                            .attr("display", function() {
                                
                            createGlyph("glyphX" + d.value.id, d.value.mass, d.value.year , d.value.fall, d.value.superclass);
                            this.appendChild(document.getElementById("glyphX" + d.value.id));

                            d3.select("#glyphX"+d.value.id)
                                .attr("pointer-events","auto")
                                .on("mouseover",function() {
                                    $(this).attr("cursor","pointer");
                                })
                                .on("click",function() {
                                    $('#detailDialog').dialog('open');
                                    public.setDetails(d.value.name, d.value.id, d.value.superclass,d.value.recclass,d.value.year,d.value.mass,d.value.fall,d.value.nametype);
                                });

                                return "none";

                            })
                            .attr("lat",lat)
                            .attr("lon",lon)
                            .attr("id",d.value.id)
                            .attr("year",d.value.year)
                            .attr("mass",d.value.mass)
                            .attr("fall",d.value.fall)
                            .attr("nametype",d.value.nametype)
                            .attr("superclass",d.value.superclass)
                            .attr("inbounds", "true")
                            .style("left", (de.x - 25) + "px")
                            .style("top", (de.y - 25) + "px")
                    });

                // update position of glyph
                /*
                layer.selectAll(".svgContainer")
                    .data(dataEntries)
                    .each(function (d) {
                        var lat = 0;
                        var lon = 0;
                        if (d.value.coords !== null) {
                            lat = d.value.coords.split(' ')[0];
                            lon = d.value.coords.split(' ')[1];
                        }
                        det = new google.maps.LatLng(lat, lon);
                        de = projection.fromLatLngToDivPixel(det);
                        return d3.select(this)
                            .style("left", (de.x - 25) + "px")
                            .style("top", (de.y - 25) + "px")
                    });
                 */


            };

        };

        overlay.onRemove = function () {
            this.div_.parentNode.removeChild(this.div_);
        };

        overlay.setMap(_map);

    };

    /*
    public.hideAll = function(dat) {

        $("[id^=glyphX]").each(function() {
            $(this).parent().attr("display","none");

        });

    };
    */

    public.setGlyphVisibility = function() {

        $("[id^=glyphX]").each(function() {

            var svgContainer = $(this).parent();
            var id = svgContainer.attr("id");

            var fall;
            if (svgContainer.attr("fall") === "true") {
                fall = true;
            }
            else {
                fall = false;
            }

            if (svgContainer.attr("superclass") in window) {
                svgContainer.attr("superclass","Other");
            }


            var det = new google.maps.LatLng(svgContainer.attr("lat"), svgContainer.attr("lon"));
            var de = projection.fromLatLngToDivPixel(det);

             if (_map.getBounds().contains(det)) {

                 svgContainer.attr("inbounds","true");

                 if (filter.checkGlyph(svgContainer.attr("year"),svgContainer.attr("mass"),fall,svgContainer.attr("nametype"),svgContainer.attr("superclass"))) {
                     svgContainer.attr("display","inline");
                     svgContainer.css("left",(de.x - 25) + "px");
                     svgContainer.css("top",(de.y - 25) + "px");
                 }

                 else {
                     svgContainer.attr("display","none");
                 }

             }

             else {
                 svgContainer.attr("inbounds","false");
                 svgContainer.attr("display","none");
             }

        });

    };

    public.setDetails = function(name, id, superclass,exactclass, year, mass, fall, nametype) {

        var ema = "<b>";
        var emb = "</b>";

        $( "#detailDialog" ).dialog({title: name + " " + "(" + id + ")"});
        superclass = superclass ? superclass : "Other";
        $("#detailSuperclass").html("Superclass: " + ema + superclass + emb);
        $("#detailClass").html("Exact classification: " + ema + exactclass + emb);
        $("#detailYear").html("Found in " + ema + year + emb);
        mass = mass ? roundMass(mass) : "unknown";
        $("#detailMass").html("Weight: " + ema + mass + emb);
        fall = fall ? "observed" : "not observed";
        $("#detailFall").html("The fall of the meterorite was " + ema +  fall + emb );
        $("#detailNametype").html("Nametype: " + ema + nametype + emb);

    };

    function roundMass(mass) {

        var newMass;

        if (mass >= 1000000) {
            newMass = (mass / 1000000) + " tons";
        }
        else if (mass >= 1000) {
            newMass = (mass / 1000) + " kg";
        }
        else {
            newMass = mass + " g";
        }

        return newMass;

    }

};


