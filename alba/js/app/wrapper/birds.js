var Birds = function(container, widget){
    var public = this;
    var promise_lookup = [];
    var filter_lookup = [];

    function _constructor(){
        for (var i = 0; i < 28; i++) {
            var d = new Cesium.KmlDataSource();
            promise_lookup.push(d.load('d/albatross/' + (i+1) + '/line.kml'));
            filter_lookup.push({id: i, weather:true, spatial:true }); //bird i shown because of weather and spatial filter
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

    public.updateAreaFilter = function(includedbirds){
        if (!includedbirds) includedbirds = [];
        filter_lookup.forEach(function(f){
                f.spatial = (includedbirds.indexOf(f.id) > -1);
        });
        _finalizeFilterUpdate();
    };

    function _finalizeFilterUpdate() {
        promise_lookup.forEach(function (p,i) {
            p.then(function (ds) {
                ds.entities.values.forEach(function (e) {
                    if (Cesium.defined(e.polyline)) {
                        var a = $('#areaFilterState').prop('checked') ? filter_lookup[i].spatial : true;
                        e.polyline.show =  a  ;
                    }
                });
            });
        });
    }



    _constructor();
    return public;
};
