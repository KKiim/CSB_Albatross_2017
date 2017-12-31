define(['jquery', 'bootstrap', 'jquery-ui', 'd3', 'misc/helper', 'misc/clock', 'misc/DrawWrapper','misc/DrawHelper', 'gui/init',   "datatables.net", "wrapper/birds", "wrapper/stations"], function($) {
    $(function() {
        $.post('/r/filter/spatial', { field1: "hello", field2 : "hello2"},
            function(d){ console.log(d) });
        var widget = new Cesium.Viewer('cesiumContainer', {
            animation : false,
            timeline : false
        });
        var terrainProvider = new Cesium.CesiumTerrainProvider({
            url : '//assets.agi.com/stk-terrain/world'
        });
        //widget.terrainProvider = terrainProvider;

        new DrawWrapper(widget);
        var birds = new Birds('#birds', widget);
        var stations = new Stations('#stations', widget);
        new GuiInit(birds);
    });
});