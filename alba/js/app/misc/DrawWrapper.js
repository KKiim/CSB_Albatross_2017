var DrawWrapper = function(widget){
    var public = this;
    var geomcache= {circle:{}, polygon:{}};

    function constructor(){
        var scene = widget.scene;
        var drawer = new DrawHelper(widget, function(event){
            event.ts = new Date();
            event.visible = true;
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
                event.visible = true;
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
        d.forEach(function (event) {
            tbl.row.add([null,  event.type+event.id,event.ts.getHours()+ ":" + event.ts.getMinutes(), 0, event.ts.getTime(), event.o.show]);
        });
        tbl.draw();
    }

    public.setVisibility = function(d, bool){
        var type = (d[1][0] == 'c') ? 'circle' : 'polygon';
        var event = geomcache[type][parseInt(d[1].substring(1))];
        event.o.show = bool;
    }


    constructor();
    return public;
}
