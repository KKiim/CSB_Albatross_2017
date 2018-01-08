var AreaChart = function(container){
    var public = this;
    var _maxcount;
    var areacountvis;
    var _data;
    var x;
    var y;
    var gcount;

    var areacount;


    function _constructor(){
        generateData();
        initGraphics();
        $(container).data('public', public);
    }

    function generateData(){
        _maxcount = 11;
        _data = [];
        for(var i= 0; i<1000; i++) {_data.push({key:i, count: Math.random()*10});}
        console.log(_data);
    }

    function initGraphics(){
        var svg = d3.select(container).append('svg').attr('width', '100%').attr('height', '100%');
        /*svg.on('mousemove', function(){
            var x =  d3.mouse(this)[0];
            var index = Math.round(xlon.invert(x))
            var d = _datalon[(index+180)/binstep];
            markerlon.attr('transform', 'translate('+x +',' + (ylon(d.count)-5)+')');
            tiplon.attr('transform', 'translate('+x +',10)').text(Math.round(d.count));
            markerlon.style('display','block');
        });*/


        svg.append('rect').attr('fill', 'black').attr('width', '100%').attr('height',30);
        gcount = svg.append('g');
        x = d3.scaleLinear().domain([0,1000]).range([0,$(container).width()]);
        y = d3.scaleLog().base(10).domain([0.01,_maxcount]).range([30,1]);
        areacount = d3.area()
            .x(function(d) { return x(d.key); })
            .y1(function(d) { return 30-y(d.count); }).y0(y(0.01));

        areacountvis = gcount.append("path")
            .datum(_data)
            .attr("fill", "steelblue")
            .attr("d", areacount);
    }

    public.update = function(){
        generateData();
        y = d3.scaleLog().base(10).domain([0.01,_maxcount]).range([60,1]);
        areacount = d3.area()
            .x(function(d) { return x(d.key); })
            .y1(function(d) { return y(d.count); }).y0(y(0.01));


        areacountvis.datum(_data)
            .transition()
            .duration(750)
            .attr("fill", "steelblue")
            .attr("d", areacount);

    };


    _constructor();
    return public;
};
