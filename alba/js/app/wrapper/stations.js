var Stations = function(container, widget){
    var public = this;

    function _constructor(){
        var d = new Cesium.KmlDataSource();
        _styleStations(d.load('d/albatross/airports.kml'));
        $(container).data('public', public);
    }


    function _styleStations (stationPromise) {
        stationPromise.then(function (ds) {
            if (!widget.dataSources.contains(ds)) widget.dataSources.add(ds);
            var stationEntities = ds.entities.values;
            for (var i = 0; i < stationEntities.length; i++) {
                var entity = stationEntities[i];
                if (Cesium.defined(entity.billboard)) {
                    entity.billboard.image = 'd/W_wind.png';
                    entity.billboard.rotation = Cesium.Math.RADIANS_PER_DEGREE * ((i-1)*45 + 270);
                }
            }
        })
    }

    _constructor();
    return public;
};
