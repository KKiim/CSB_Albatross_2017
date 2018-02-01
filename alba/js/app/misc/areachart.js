var AreaChart = function(container){
    var public = this;
    var _data;
    var y;
    var g;


    function _constructor(){
        _initGraphics();
        public.update();
        $(container).data('public', public);
    }

    function _requestData(cb){
        _data = [];
        var q = $('#contextselection').val();


        $.post('/r/context/' + q, {}, function(res){
            if (res.data) cb(res.data);
        });
    }

    function _initGraphics(){
        var svg = d3.select(container).append('svg').attr('width', '100%').attr('height', '100%');


        svg.append('rect').attr('fill', 'black').attr('width', '100%').attr('height',120);
        g = svg.append('g').attr('transform', 'translate(20,108)');
    }

    public.update = function(){
        _requestData(function(data){
            var stepsize = parseFloat($('#contextselection option:selected').attr('steps'));
            var min = parseFloat($('#contextselection option:selected').attr('min'));
            var max = parseFloat($('#contextselection option:selected').attr('max'));
            var l = (max-min)/stepsize;
            var maxval = d3.max(data, function(d) { return +d.v;} );
            y = d3.scaleLinear().domain([0,maxval]).range([108,1]);


            var join = g.selectAll('rect').data(data);
            join.exit().remove();
            join.enter().append('rect').attr('fill', 'steelblue');
            var w = ($(container).width()-10-17.5)/l;
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
