var AreaChart = function(container){
    var public = this;
    var _maxcount;
    var _data;
    var y;
    var g;


    function _constructor(){
        _initGraphics();
        public.update();
        $(container).data('public', public);
    }

    function _requestData(cb){
        _maxcount = 11;
        _data = [];
        var q = $('#contextselection').val();


        $.post('/r/context/' + q, {}, function(res){
            if (res.data) cb(res.data);
        });
    }

    function _initGraphics(){
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
        g = svg.append('g').attr('transform', 'translate(0,30)');
    }

    public.update = function(){
        _requestData(function(data){
            var stepsize = parseFloat($('#contextselection option:selected').attr('steps'));
            var min = parseFloat($('#contextselection option:selected').attr('min'));
            var max = parseFloat($('#contextselection option:selected').attr('max'));
            var l = (max-min)/stepsize;
            var maxval = d3.max(data, function(d) { return +d.v;} );
            y = d3.scaleLog().base(10).domain([0.01,maxval]).range([30,1]);

            var join = g.selectAll('rect').data(data);
            join.exit().remove();
            join.enter().append('rect').attr('fill', 'steelblue');
            var w = $(container).width()/l;
            g.selectAll('rect').attr('x', function(d){
                return d.k/stepsize*w;
            }).attr('y', function(d){
                return -y(d.v);
            }).attr('height', function(d){
                return y(d.v)
            }).attr('width', w);
        });
    };


    _constructor();
    return public;
};
