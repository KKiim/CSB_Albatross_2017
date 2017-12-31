define(['jquery', 'bootstrap', 'jquery-ui', 'd3', 'misc/helper', 'misc/DrawHelper', 'gui/init',   "datatables.net", "wrapper/birds", "wrapper/stations"], function($) {
    $(function() {
        $.post('/r/filter/spatial', { field1: "hello", field2 : "hello2"},
            function(returnedData){
                console.log(returnedData);
            });
        var widget = new Cesium.Viewer('cesiumContainer', {
            animation : false,
            timeline : false
        });

        var scene = widget.scene;
        var drawer = new DrawHelper(widget);
        var birds = new Birds('#birds', widget);
        var stations = new Stations('#stations', widget);
        new GuiInit(birds);

        var toolbar = drawer.addToolbar(document.getElementById("drawer"), {
            buttons: ['polygon', 'circle']
        });
        toolbar.addListener('markerCreated', function(event) {
            // create one common billboard collection for all billboards
            var b = new Cesium.BillboardCollection();
            scene.primitives.add(b);
            var billboard = b.add({
                show : true,
                position : event.position,
                pixelOffset : new Cesium.Cartesian2(0, 0),
                eyeOffset : new Cesium.Cartesian3(0.0, 0.0, 0.0),
                horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
                verticalOrigin : Cesium.VerticalOrigin.CENTER,
                scale : 1.0,
                image: './img/glyphicons_242_google_maps.png',
                color : new Cesium.Color(1.0, 1.0, 1.0, 1.0)
            });
            billboard.setEditable();
        });

        toolbar.addListener('polygonCreated', function(event) {
            var polygon = new DrawHelper.PolygonPrimitive({
                positions: event.positions,
                material : Cesium.Material.fromType('Checkerboard')
            });
            scene.primitives.add(polygon);
            polygon.setEditable();
            polygon.addListener('onEdited', function(event) {

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
            circle.addListener('onEdited', function(event) {

            });
        });


    });
});