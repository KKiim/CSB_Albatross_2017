/*
 COPYRIGHT Philipp Meschenmoser, University of Konstanz. 2015.



 This file is part of Aquila.

 Aquila is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Aquila is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 */

/*
 This module creates the visual components of the draggable clock and handles its logic.
 However, most of the code belongs to the drag behavior's logic.
 With frontend/tests/clock2.js, it is possible to also drag the circle segment.

 */

var Clock = function (pContainer, pOptions) {
    var public = this;
    var helper = new Helper();
    var svg;
    var container;
    var options = {
        onChange: function (data) {}
    };
    var outerRad;
    var distance = 360 / 24;
    var earlyAngle = 0;
    var lateAngle = 360;
    var oldRot = -1;
    var oldRotEarly = 0;
    var oldRotLate = 0;
    var sector;
    var centerbox;

    var currentHandler = "";
    var labels = [];
    for (var i = 0; i < 24; i++) {
        labels.push({
            label: i,
            rotation: i * distance
        });
    }

    function constructor(pContainer, pOptions) {
        container = pContainer;
        for (var key in pOptions) {
            if (pOptions.hasOwnProperty((key)) && options.hasOwnProperty(key)) options[key] = pOptions[key];
        }
        svg = d3.select(container).append("svg");
        svg.attr("width", 245)
            .attr("height", 245);

        outerRad = 240 / 2 * 0.9;
        d3.select(container).attr('early', 0).attr('late', 24);
        initGraphics();
        $(container).data('obj', public);
    }


    function initGraphics() {
        if (svg) {
            svg.append("svg:rect").attr("width", "100%").attr("height", "100%").attr('fill', 'dark-blue');
            var grp = svg.append("svg:g");
            //center the group
            grp.attr("transform", "translate(" + parseInt(svg.style("width")) / 2 + "," + parseInt(svg.style("width")) / 2 + ")");

            var circles = grp.append("g");
            //outer circle
            circles.append("svg:circle").attr('r', outerRad).style('stroke', 'white');
            //inner circle
            circles.append("svg:circle").attr('r', outerRad * 0.8).style('stroke', 'white');

            var handlerDrag = d3.drag()
                .on("start", handlerDragStart)
                .on("drag", handlerDragWhile)
                .on("end", handlerDragEnd);
            /*
             Drag behavior.
             Append draggable circles with opacity 0 to the sliders.
             When the circles are being dragged, calculate the arctan wrt. the clock's origin and the
             dragged circle's position. Rotate the actual slider controls with the resulting angle.
             When dragging is finished, move the ghosts again to the actual positions.
             */

            sector = d3.arc().innerRadius(0).outerRadius(outerRad * 0.8).startAngle(earlyAngle / (180 / Math.PI)).endAngle(lateAngle / (180 / Math.PI));

            //add gradients and shadows to def
            var defs = svg.append('defs');
            var grads = defs.append("radialGradient")
                .attr("gradientUnits", "userSpaceOnUse")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", "80%")
                .attr("id", "gradient");
            addShadow(defs);

            grads.append("stop").attr("offset", "0%").style("stop-color", 'steelblue');
            grads.append("stop").attr("offset", "100%").style("stop-color", "blue");
            grp.append('path').attr('id', 'arc').attr('d', sector).attr("fill", "url(#gradient)").attr('opacity', 0.9);

            //add drag handlers
            grp.append("g").attr('id', 'controlHandlerEarly')
                .append("svg:circle").attr('r', 5).attr('transform', 'rotate(' + (-180 + earlyAngle) + '),translate(0,' + outerRad + ')').attr('fill', 'white');
            grp.append("svg:circle").attr('r', 5).attr('transform', 'rotate(' + (-180 + earlyAngle) + '),translate(0,' + outerRad + ')').attr('fill', 'red').attr('opacity', 0).attr('id', 'ghostItemEarly').call(handlerDrag);
            grp.append("g").attr('id', 'controlHandlerLate')
                .append("svg:circle").attr('r', 5).attr("fill", "white").attr('transform', 'rotate(' + (-180 + lateAngle) + '),translate(0,' + (outerRad) + ')');
            grp.append("svg:circle").attr('r', 5).attr('transform', 'rotate(' + (-180 + lateAngle) + '),translate(0,' + (outerRad) + ')').attr('fill', 'red').attr('opacity', 0).attr('id', 'ghostItemLate').call(handlerDrag);

            //add infobox in the middle
            centerbox = grp.append('g').attr('id', 'centerbox').style("filter", "url(#centerBoxShadow)");
            centerbox.append('rect').attr('width', 70).attr('height', 20).attr('transform', 'translate(-35,-10)').attr('fill', 'white');
            centerbox.append('text').text('0-24h').attr('transform', 'translate(0,5)');

            //add svg:rects as ticks and append text labels
            var tickLayer = grp.append("g");
            tickLayer.selectAll('.cticks', true).data(labels).enter().append("svg:rect").classed('cticks', true).attr('width', function (d, i) {
                if (i % 6 === 0) return 8;
                return 3;
            }).attr('height', function (d, i) {
                if (i % 6 === 0) return 8;
                return 3;
            }).attr('transform', function (d, i) {
                var trans = (i % 6 === 0) ? (-4) : (-1.5); //specific translations for each quarter tick
                return 'translate(' + trans + ',' + trans + '),rotate(' + d.rotation + '), translate(0,' + outerRad * 0.8 + '), rotate(-' + d.rotation + ')'
            });

            //append text labels
            tickLayer.selectAll("text").data(labels).enter().append("text").attr('transform', function (d, i) {
                var addRot = (i % 12 === 0) ? 180 : 0;
                return 'rotate(' + (d.rotation - 180) + '), translate(0,' + (outerRad * 0.9) + '),rotate(' + (d.rotation + addRot) + '),translate(-1,2)'
            }).text(function (d, i) {
                if (i % 6 == 0) return (d.label);
                return "";
            }).classed('clabels', true).attr('text-anchor', 'middle').attr("startOffset", "100%");
        }


        function addShadow(defs) {
            //http://bl.ocks.org/cpbotha/5200394


            var filter = defs.append("filter")
                .attr("id", "centerBoxShadow")
                .attr("height", "130%");

            // SourceAlpha refers to opacity of graphic that this filter will be applied to
            // convolve that with a Gaussian with standard deviation 3 and store result
            // in blur
            filter.append("feGaussianBlur")
                .attr("in", "SourceAlpha")
                .attr("stdDeviation", 5)
                .attr("result", "blur");

            // translate output of Gaussian blur to the right and downwards with 2px
            // store result in offsetBlur
            filter.append("feOffset")
                .attr("in", "blur")
                .attr("dx", 5)
                .attr("dy", 5)
                .attr("result", "offsetBlur");

            // overlay original SourceGraphic over translated blurred opacity by using
            // feMerge filter. Order of specifying inputs is important!
            var feMerge = filter.append("feMerge");

            feMerge.append("feMergeNode")
                .attr("in", "offsetBlur")
            feMerge.append("feMergeNode")
                .attr("in", "SourceGraphic");
        }


        function handlerDragStart() {
            currHandler = this.id.split("Item")[1];
            //currHandler's angle may not collide with the remaining handler's angle
            oldRot = (currHandler === "Early") ? oldRotLate : oldRotEarly;
        }

        function handlerDragWhile() {
            var x = d3.event.x; //positions of the transparent circle
            var y = d3.event.y;
            var deg = Math.atan2(x, y); //angle to center

            deg *= (180 / Math.PI);
            deg = 180 - deg; //up is down

            deg -= deg % distance; //drag only possible to next tick

            if (oldRot % 360 != deg % 360) { //collision detection
                svg.select('#controlHandler' + currHandler).attr('transform', 'rotate(' + deg + ')');
                if (currHandler === 'Early') {
                    earlyAngle = deg;
                } else {
                    lateAngle = deg;
                    if (earlyAngle < 0) earlyAngle += 360;
                }
                earlyAngle -= (earlyAngle > lateAngle) ? 360 : 0;
                //apply angles to sector
                sector.startAngle(earlyAngle / (180 / Math.PI));
                sector.endAngle(lateAngle / (180 / Math.PI));
                //and update graphics
                svg.select('#arc').attr('d', sector);
                d3.select(this).attr("transform", "translate(" + x + "," + y + ")");

                //update centerbox
                centerbox.selectAll('text').text(getStringifiedInterval());

            }

        }

        function handlerDragEnd(d) {
            var rot = helper.getTransformation(svg.select('#controlHandler' + currHandler).attr('transform')).rotate;
            if (rot < 0) rot += 360;
            rot = Math.round(rot); //195.00000012005586 could result sometimes
            if (currHandler === "Early") {
                oldRotEarly = rot;
            } else {
                oldRotLate = rot;
            }
            svg.select("#ghostItem" + currHandler).attr('transform', "rotate(" + rot + "),translate(0," + ((-1) * outerRad) + ")");
            options.onChange(getInterval());
        }
    };

    function getInterval() {
        var early = 24 * (earlyAngle / 360);
        if (early < 0) early += 24;
        var late = 24 * (lateAngle / 360);
        if (late === 0) late += 24;
        return {
            early: early,
            late: late
        };
    }

    function getStringifiedInterval() {
        var early = 24 * (earlyAngle / 360);
        if (early < 0) early += 24;
        var late = 24 * (lateAngle / 360);
        if (late === 0) late += 24;
        return early + '-' + late + 'h'
    }


    function moveStep(direction) {
        //Dont move, if both handlers are on the same pos, or if an invalid direction (neither -1 nor 1 ) was passed as parameter
        if ((oldRotEarly === 0 && oldRotLate === 0) || (direction !== -1 && direction !== 1)) return;

        //calculate new angles
        earlyAngle += distance * direction;
        earlyAngle = earlyAngle % 360;
        lateAngle += distance * direction;
        lateAngle = lateAngle % 360;
        earlyAngle -= (earlyAngle > lateAngle) ? 360 : 0;

        //for prev dir
        if (direction === -1 && earlyAngle < 0 && lateAngle === 0) {
            earlyAngle += 360;
            lateAngle = 360;
        }

        //move drag handlers and ghosts
        svg.select('#controlHandlerEarly').attr('transform', 'rotate(' + earlyAngle + ')');
        svg.select('#ghostItemEarly').attr('transform', 'rotate(' + earlyAngle + '), translate(0,' + (-1 * outerRad) + ')');
        svg.select('#controlHandlerLate').attr('transform', 'rotate(' + lateAngle + ')');
        svg.select('#ghostItemLate').attr('transform', 'rotate(' + lateAngle + '), translate(0,' + (-1 * outerRad) + ')');

        //update sector
        sector.startAngle(earlyAngle / (180 / Math.PI));
        sector.endAngle(lateAngle / (180 / Math.PI));
        svg.select('#arc').attr('d', sector); //transition does not look nice

        //and old angles
        oldRotEarly = earlyAngle;
        if (oldRotEarly < 0) oldRotEarly += 360;
        oldRotLate = lateAngle;
        if (oldRotLate < 0) oldRotLate += 360;


        //update centerbox
        centerbox.selectAll('text').text(getStringifiedInterval());

        options.onChange(getInterval());
    }

    public.next = function () {
        moveStep(1);
    };


    public.prev = function () {
        moveStep(-1);
    };

    public.getSingleHours = function () {
        var tmp = getInterval();
        var res = [];
        if (tmp.early < tmp.late) {
            //dont push last hour, 'oriented with regard to beginning hours'
            for (var i = tmp.early; i < tmp.late; i++) {
                res.push(i);
            }
        } else { //crossing the tagesgrenze
            for (var i = tmp.early; i < 24; i++) res.push(i);
            for (var i = 0; i < tmp.late; i++) res.push(i);

        }
        return res;
    }

    constructor(pContainer, pOptions);
}
