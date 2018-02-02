var AreaChart = function(container){
    var public = this;
    var _data;
    var y;
    var g;
    var xlabels;
    var ylabels;
    var transition;


    function _constructor(){
        _initGraphics();
        var visbirds = [];
        for (var i=0; i<28; i++) visbirds.push(i);

        public.update(visbirds);
        $(container).data('public', public);
    }

    function _requestData(visbirds, cb){
        _data = [];
        var q = $('#contextselection').val();
        $.post('/r/context/' + q, {visibleBirds:visbirds}, function(res){
            if (res.data) cb(res.data);
        });
    }

    function _initGraphics(){
        var svg = d3.select(container).append('svg').attr('width', '100%').attr('height', '100%');


        svg.append('rect').attr('fill', 'black').attr('width', '100%').attr('height',120);
        g = svg.append('g').attr('transform', 'translate(20,108)');
        xlabels = svg.append('g').attr('transform', 'translate(20,117)');
        ylabels = svg.append('g').attr('transform', 'translate(10,110)');
        transition = d3.transition().duration(750).ease(d3.easeLinear);
    }

    public.update = function(visbirds){
        _requestData(visbirds, function(data) {
            var stepsize = parseFloat($('#contextselection option:selected').attr('steps'));
            var min = parseFloat($('#contextselection option:selected').attr('min'));
            var max = parseFloat($('#contextselection option:selected').attr('max'));
            var l = (max - min) / stepsize;

            var maxval = d3.max(data, function (d) {
                return +d.v;
            });
            if (['speedcount', 'altcount'].indexOf($('#contextselection').val()) > -1) {
                y = d3.scaleLog().base(10).domain([0.01, maxval]).range([1, 108]);
            } else {
                y = d3.scaleLinear().domain([0, maxval]).range([1, 108]);
            }

            var join = g.selectAll('rect').data(data);
            join.exit().remove();
            join.enter().append('rect').attr('fill', 'steelblue').on('mouseover', function (d) {
                console.log(d);
            });
            var w = ($(container).width() - 10 - 17.5) / l;
            g.selectAll('rect').attr('x', function (d) {
                return (d.k / stepsize) * w;
            }).attr('width', w);

            g.selectAll('rect').transition(transition).attr('height', function (d) {
                return Math.max(0,y(d.v))}).attr('y', function (d) {

                return -y(d.v);
            })

            var tx = xlabels.selectAll('text').data([$('#contextselection option:selected').attr('xlabel'), max / 2, max]);
            tx.exit().remove();
            tx.enter().append('text').attr('transform', function (_, i) {
                return 'translate(' + (i * 85) + ',0)';
            }).attr('fill', 'white').attr('font-size',10);
            xlabels.selectAll('text').text(function (d) {
                return d;
            }).attr('text-anchor', function(_,i){
                if (i>0) return 'middle';
                return 'start';
            });

            var ty = ylabels.selectAll('text').data([$('#contextselection option:selected').attr('ylabel'), max / 2, max]);
            ty.exit().remove();
            ty.enter().append('text').attr('transform', function (_, i) {
                return 'translate(0,' + (i * 50*-1) + '),rotate(90)';
            }).attr('fill', 'white').attr('font-size',10);
            ylabels.selectAll('text').text(function (d) {
                return d;
            }).attr('text-anchor', function(_,i){
                if (i>0) return 'middle';
                return 'end';
            })
        });
        };


    _constructor();
    return public;
};
