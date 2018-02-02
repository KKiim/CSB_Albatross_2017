define(['jquery', 'bootstrap', 'jquery-ui', 'd3', 'gui/weatherslider', 'misc/helper', 'misc/DrawWrapper','misc/areachart','misc/DrawHelper', 'misc/detailView', 'gui/init',   "datatables.net", "datatables.net.select","wrapper/birds", "wrapper/stations"], function($) {
    $(function() {
        var widget = new Cesium.Viewer('cesiumContainer', {
            animation : false,
            timeline : false
        });
        var terrainProvider = new Cesium.CesiumTerrainProvider({
            url : '//assets.agi.com/stk-terrain/world'
        });

        var widgetdual = new Cesium.Viewer('secondView', {
            animation : false,
            timeline : false
        });
        //widget.terrainProvider = terrainProvider;

        var birds = new Birds('#birds', widget);
        var birds = new Birds('#birdsdual', widgetdual);
        var dwrapper = new DrawWrapper(birds, widget);

        var stations = new Stations('#stations', widget);

       // var birds = new Birds('#birds', widget2);
        //var stations = new Stations('#stations', widget2);
        new GuiInit(birds, dwrapper, widget);
        new Weatherslider(birds);
        new AreaChart('#areachart');
        new DetailView('#detailChart');
    });
});