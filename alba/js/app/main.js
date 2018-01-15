define(['jquery', 'bootstrap', 'jquery-ui', 'd3', 'gui/weatherslider', 'misc/helper', 'misc/clock', 'misc/DrawWrapper','misc/areachart','misc/DrawHelper', 'gui/init',   "datatables.net", "datatables.net.select","wrapper/birds", "wrapper/stations"], function($) {
    $(function() {
        var widget = new Cesium.Viewer('cesiumContainer', {
            animation : false,
            timeline : false
        });
        var terrainProvider = new Cesium.CesiumTerrainProvider({
            url : '//assets.agi.com/stk-terrain/world'
        });

        var widget2 = new Cesium.Viewer('secondView', {
            animation : false,
            timeline : false
        });
        //widget.terrainProvider = terrainProvider;

        var birds = new Birds('#birds', widget);
        var dwrapper = new DrawWrapper(birds, widget);

        var stations = new Stations('#stations', widget);

       // var birds = new Birds('#birds', widget2);
        //var stations = new Stations('#stations', widget2);
        new GuiInit(birds, dwrapper, widget);
        new Weatherslider(birds);
        new AreaChart('#areachart');
    });
});