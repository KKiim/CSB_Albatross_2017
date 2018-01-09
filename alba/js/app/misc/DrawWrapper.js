var DrawWrapper = function(birds, widget){
    var public = this;
    var geomcache= {circle:{}, polygon:{}};

    function constructor(){
        var scene = widget.scene;
        var drawer = new DrawHelper(widget, function(event){
            event.ts = new Date();
            geomcache.polygon[event.id] = event;
            _updateDataTable();
            $('#areaFilterState').prop('checked', true);
            var visibles = dwrapper.getVisibles();
            if (visibles.length > 0) birds.requestAreaFilter(visibles);

        });
        var toolbar = drawer.addToolbar(document.getElementById("drawer"), {
            buttons: ['polygon', 'circle']
        });

        toolbar.addListener('polygonCreated', function(event) {
            var polygon = new DrawHelper.PolygonPrimitive({
                positions: event.positions,
                material : Cesium.Material.fromType('Checkerboard')
            });
            scene.primitives.add(polygon);
            polygon.setEditable();
        });
        toolbar.addListener('circleCreated', function(event) {
            var circle = new DrawHelper.CirclePrimitive({
                center: event.center,
                radius: event.radius,
                material: Cesium.Material.fromType(Cesium.Material.RimLightingType)
            });
            scene.primitives.add(circle);
            circle.setEditable();
            circle.addListener('onConfirmed', function(event) {
                event.ts = new Date();
                geomcache.circle[event.id] = event;
                _updateDataTable();
                $('#areaFilterState').prop('checked', true);
                $('#areaFilterState').removeAttr("disabled");
                var visibles = public.getVisibles();
                if (visibles.length > 0) birds.requestAreaFilter(visibles);
            });
        });
    }

    function _updateDataTable(){
        var d = [];
        for (var k in geomcache){
            for (var k2 in geomcache[k]){
                d.push(geomcache[k][k2]);
            }
        }
        var tbl = $('#drawoverview').DataTable();
        tbl.clear();
        d.forEach(function (event) {
            tbl.row.add([null,  event.type+event.id,event.ts.getHours()+ ":" + event.ts.getMinutes(), 0, event.ts.getTime(), event.o.show]);
        });
        tbl.draw();
    }

    public.setVisibility = function(d, bool){
        var type = (d[1][0] == 'c') ? 'circle' : 'polygon';
        var event = geomcache[type][parseInt(d[1].substring(1))];
        event.o.show = bool;
    };

    public.getVisibles = function(){
        var res = [];
        for (var k in geomcache) {
            for (var k2 in geomcache[k]) {
                var that = geomcache[k][k2];
                if (that.o.show){
                    if (that.type == 'c'){
                        var tmp = {id:that.id, type:'c'};
                        var cartesian = new Cesium.Cartesian3(that.center.x, that.center.y, that.center.z);
                        var carto = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
                        tmp.longitude = Cesium.Math.toDegrees(carto.longitude);
                        tmp.latitude = Cesium.Math.toDegrees(carto.latitude);
                        tmp.radius = geomcache[k][k2].radius;
                        res.push(tmp);
                    } else if (that.type == 'p'){
                        var tmp = {id:that.id, type:'p', positions: []};
                        that.positions.forEach(function(pos){
                            var cartesian = new Cesium.Cartesian3(pos.x, pos.y, pos.z);
                            var carto = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
                            tmp.positions.push({longitude: Cesium.Math.toDegrees(carto.longitude), latitude:Cesium.Math.toDegrees(carto.latitude)});
                        });
                        res.push(tmp);
                    }
                };
            }
        }

        return res;
        };




    constructor();
    return public;
}
