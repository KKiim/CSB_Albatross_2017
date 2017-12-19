var Birds = function(container, widget){
    var public = this;
    var promise_lookup = [];

    function _constructor(){
        for (var i = 0; i < 28; i++) {
            var d = new Cesium.KmlDataSource();
            promise_lookup.push(d.load('d/albatross/' + (i+1) + '/line.kml'));
        }
        public.styleAll();
        $(container).data('public', public);
    }

    public.styleAll = function(){
        promise_lookup.forEach(function(p,i){public.styleSingle(i)});
    };

    public.styleSingle= function(i) {
        var p = promise_lookup[i];
        var lineColor = Cesium.Color.fromCssColorString($('#colorselection').val());

            p.then(function(ds) {
                if (!widget.dataSources.contains(ds)) widget.dataSources.add(ds);
                 ds.entities.values.forEach(function(e){
                     if (Cesium.defined(e.polyline)) {
                         e.polyline.material = lineColor.withAlpha($('#transselection').val()/100);
                         e.polyline.width = $('#widthselection').val();
                     }
                 });
            });
    };

    _constructor();
    return public;
};
