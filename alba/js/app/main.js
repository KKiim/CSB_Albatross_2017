define(['jquery', 'bootstrap', 'jquery-ui', 'd3', 'misc/helper', 'gui/init',   "datatables.net", "wrapper/birds", "wrapper/stations"], function($) {
    $(function() {

        var widget = new Cesium.Viewer('cesiumContainer', {
            animation : false,
            timeline : false
        });
        var birds = new Birds('#birds', widget);
        var stations = new Stations('#stations', widget);
        new GuiInit(birds);

    });
});