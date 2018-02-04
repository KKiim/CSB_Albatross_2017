var AreaChart = function(container){
    var public = this;
    var _data;
    var y;
    var g;
    var histos =[];
    var xlabels;
    var ylabels;
    var transition;
    var tooltip;


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
        histos.push(svg.append('g').attr('transform', 'translate(20,108)'));
        histos.push(svg.append('g').attr('transform', 'translate(20,108)'));
        histos.forEach(function(h,i){
            h.on('contextmenu', function(){
                d3.event.preventDefault();
                histos[1-i].each(function(){
                    this.parentNode.appendChild(this);
                });
            });
        });

        xlabels = svg.append('g').attr('transform', 'translate(20,117)');
        ylabels = svg.append('g').attr('transform', 'translate(10,110)');
        tooltip = svg.append('text').attr('transform', 'translate(220, 10)').text('').attr('font-size',10).attr('fill', 'white').attr('text-anchor', 'end');
        svg.append('text').attr('transform', 'translate(100, 10)').text('L').attr('font-size',10).attr('fill', 'steelblue').attr('text-anchor', 'end');
        svg.append('text').attr('transform', 'translate(110, 10)').text('R').attr('font-size',10).attr('fill', 'orange').attr('text-anchor', 'end');
        transition = d3.transition().duration(750).ease(d3.easeLinear);
    }

    public.update = function(visbirds, view){
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
            var g;
            if (view){
                g = (view === 'left') ? histos[0] : histos[1];
            } else {
                g = $('#accordion').is(':visible') ? histos[0] : histos[1];
            }

            var join = g.selectAll('rect').data(data);
            join.exit().remove();
            var fillval = $('#accordion').is(':visible') ? 'steelblue' : 'orange';
            var transval = $('#accordion').is(':visible') ? 1 : 1;
            join.enter().append('rect').attr('fill', fillval).attr('oldfill', fillval).on('mouseover', function (d) {
				d3.select(this).attr('fill', 'white'); 
                var xunit = $('#contextselection option:selected').attr('xunit');
                var yunit = $('#contextselection option:selected').attr('yunit');
                tooltip.text(d.k +' ' +xunit+':' + d.v + ' ' + yunit);
            }).on('mouseleave', function(){
				var oldfill = d3.select(this).attr('oldfill'); 
				d3.select(this).attr('fill', oldfill); 
                tooltip.text('');
            });
            var w = ($(container).width() - 10 - 20.5) / l;
            g.selectAll('rect').attr('x', function (d) {
                return (d.k / stepsize) * w;
            }).attr('width', w).attr('opacity', transval);

            g.selectAll('rect').transition(transition).attr('height', function (d) {
                return Math.max(0,y(d.v))}).attr('y', function (d) {return -y(d.v);})

            var tx = xlabels.selectAll('text').data([$('#contextselection option:selected').attr('xlabel'), max / 2, max]);
            tx.exit().remove();
            tx.enter().append('text').attr('transform', function (_, i) {
				if (i > 0)  return 'translate('+((i/2) * w*l)+',0)';
                return 'translate(0,0)';
            }).attr('fill', 'white').attr('font-size',10);
            xlabels.selectAll('text').text(function (d) {
                return d;
            }).attr('text-anchor', function(_,i){
                if (i>0) return 'end';
                return 'start';
            });
            var mid = y.invert(y.range()[1]/2);
            mid = Math.round(mid*10)/10;
			var midtext = mid ? mid : ''; 
			var maxtext = maxval ? Math.round(maxval*10)/10 : ''

            var ty = ylabels.selectAll('text').data([$('#contextselection option:selected').attr('ylabel'), midtext,maxtext ]);
            ty.exit().remove();
            ty.enter().append('text').attr('transform', function (_, i) {
                var addendum = 0;
                if (i== 2) addendum = 10;
                if (i == 1) addendum = -3;
                return 'translate(0,' + ((i/2) * y.range()[1]*-1 +addendum) + '),rotate(90)';
            }).attr('fill', 'white').attr('font-size',10);
            ylabels.selectAll('text').text(function (d) {
                return d;
            }).attr('text-anchor', function(_,i){
                if (i>0) return 'middle';
                return 'end';
            })
        });
        };

    public.hideSecond = function(){
        histos[1].attr('display', 'none');
    };

    public.showSecond = function(){
        histos[1].attr('display', 'block');
    };
    _constructor();
    return public;
};
