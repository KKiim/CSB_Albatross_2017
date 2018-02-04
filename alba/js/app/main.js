define(['jquery', 'bootstrap', 'jquery-ui', 'd3', 'gui/weatherslider', 'misc/helper', 'misc/DrawWrapper','misc/areachart','misc/DrawHelper', 'rangeslider',  'misc/detailView', 'gui/init',   "datatables.net", "datatables.net.select","wrapper/birds", "wrapper/stations"], function($) {
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

        var sceneproviders = {left: function(){
            return widget.scene;
        }, right:function(){
            return widgetdual.scene;
        }, getActive: function(){
            var curr = 'left';
            if ($('#btn_dualviewsel').text() === 'L' && $('#btn_dualview').text() === 'Mono'){
                return widgetdual.scene
            } else {
                return widget.scene;
            }
        }};
        $('#sceneproviders').data('f', sceneproviders);


        var birds = new Birds('#birds', widget, '');
        var birdsdual = new Birds('#birdsdual', widgetdual, 'dual');

        var dwrapperdual  = new DrawWrapper(birdsdual, widgetdual, 'dual');
        var dwrapper = new DrawWrapper(birds, widget,'');

        var gui1 = new GuiInit(birds, dwrapper, widget, '');
        gui1.initBasis();
        gui1.initListeners();


       var gui2 = new GuiInit(birdsdual, dwrapperdual, widgetdual, 'dual');
       gui2.initListeners();

        new Weatherslider(birds, '');
        new Weatherslider(birdsdual, 'dual');
        new AreaChart('#areachart');
        new DetailView('#detailsWrapper');
    });
});