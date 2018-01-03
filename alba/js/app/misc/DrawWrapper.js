var DrawWrapper = function(widget){
    var public = this;
    var geomcache= {circle:{}, polygon:{}};

    function constructor(){
        var scene = widget.scene;
        var drawer = new DrawHelper(widget, function(event){
            event.ts = new Date();
            geomcache.polygon[event.id] = event;
            _updateDataTable();
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
            polygon.addListener('onConfirmed', function(event) {
                console.log("test");

            });
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
        d.forEach(function (o) {
            tbl.row.add([null,  o.type+o.id,o.ts.getHours()+ ":" + o.ts.getMinutes(), 0, o.ts.getTime()]);
        });

        tbl.draw();
    }

    constructor();
    return public;
}
