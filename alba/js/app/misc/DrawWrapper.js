var DrawWrapper = function(widget){
    var public = this;

    function constructor(){
        var scene = widget.scene;
        var drawer = new DrawHelper(widget, function(d){
            console.log(d);
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
                console.log("bla");
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
                console.log(event);
            });
        });
    }

    constructor();
    return public;
}
