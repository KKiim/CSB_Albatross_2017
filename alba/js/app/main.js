define(['jquery', 'bootstrap', 'jquery-ui', 'd3', 'gui/weatherslider', 'misc/helper', 'misc/DrawWrapper','misc/areachart','misc/DrawHelper', 'misc/detailView', 'gui/init',   "datatables.net", "datatables.net.select","wrapper/birds", "wrapper/stations"], function($) {
    $(function() {

        var terrainProvider = new Cesium.CesiumTerrainProvider({
            url : '//assets.agi.com/stk-terrain/world'
        });

        var widgetdual = new Cesium.Viewer('secondView', {
            animation : false,
            timeline : false
        });
        var widget = new Cesium.Viewer('cesiumContainer', {
            animation : false,
            timeline : false
        });
        //widget.terrainProvider = terrainProvider;

        var birds = new Birds('#birds', widget);
        var birdsdual = new Birds('#birdsdual', widgetdual);



        //var stations = new Stations('#stations', widget);

       // var birds = new Birds('#birds', widget2);
        //var stations = new Stations('#stations', widget2);


        var dwrapperdual  = new DrawWrapper(birdsdual, widgetdual, 'dual');
        var dwrapper = new DrawWrapper(birds, widget,'');
        var gui1 = new GuiInit(birds, dwrapper, widget, '');
        gui1.initBasis();
        gui1.initListeners();


       var gui2 = new GuiInit(birdsdual, dwrapperdual, widgetdual, 'dual');
       gui2.initListeners();

        new Weatherslider(birds);
        new AreaChart('#areachart');
        new DetailView('#detailChart');
    });
});