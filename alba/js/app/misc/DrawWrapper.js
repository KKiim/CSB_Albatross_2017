var DrawWrapper = function(birds, widget, addendum){
    var public = this;
    var geomcache= {circle:{}, polygon:{}};

    function constructor(){
        var scene = widget.scene;

        var drawer = new DrawHelper(widget, function(event){
            event.ts = new Date();
            event.heights = '0-170';
            event.checked = true;
            geomcache.polygon[event.id] = event;
            _updateDataTable();
            $('#areaFilterState'+addendum).prop('checked', true);
            var visibles = public.getVisibles();
            if (visibles.length > 0) birds.requestAreaFilter(visibles);
        });
        if (addendum.length > 0) return;
        var toolbar = drawer.addToolbar(document.getElementById("drawer"+addendum), {
            buttons: ['polygon', 'circle']
        });

        function _onStartedEdit(event){
            $('#drawoverview'+addendum+' tbody > tr' ).not($(this).parent()).removeClass('highlightedrow');
            var tbl = $('#drawoverview'+addendum).DataTable();
            console.log(event.id);
            var indexes = tbl.rows().eq(0).filter(function (rowid) {
                return tbl.cell( rowid, 1 ).data() === event.id;
            } );
            tbl.rows(indexes).nodes().to$().addClass('highlightedrow');
            $('#altcontainer'+addendum).show();
        }

        toolbar.addListener('polygonCreated', function(event) {
            var polygon = new DrawHelper.PolygonPrimitive({
                positions: event.positions,
                material : Cesium.Material.fromType(Cesium.Material.RimLightingType)
            });
            scene.primitives.add(polygon);
            polygon.setEditable();
            polygon.addListener('startedEdit', _onStartedEdit);


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
                console.log("onconfirmed");
                event.ts = new Date();
                event.heights = '0-170';
                event.checked = true;
                geomcache.circle[event.id] = event;
                _updateDataTable();
                $('#areaFilterState'+addendum).prop('checked', true);
                $('#areaFilterState'+addendum).removeAttr("disabled");
                $('#altcontainer'+addendum).hide();
                var visibles = public.getVisibles();
                if (visibles.length > 0) birds.requestAreaFilter(visibles);
            });
            circle.addListener('startedEdit', _onStartedEdit);

        });
    }

    function _getAddendum(){
        if ($('#btn_dualviewsel').text()=== 'L' && $('#btn_dualview').text()=== 'Mono' ) return 'dual';
        return '';
    }

    function _updateDataTable(){
        var d = [];
        for (var k in geomcache){
            for (var k2 in geomcache[k]){
                d.push(geomcache[k][k2]);
            }
        }
        var tbl = $('#drawoverview'+addendum).DataTable();
        tbl.clear();
        d.forEach(function (event) {
            tbl.row.add([event.checked,  event.type+event.id,event.ts.getHours()+ ":" + event.ts.getMinutes(), event.heights, event.ts.getTime()]);
        });
        tbl.draw();
    }

    public.setVisibility = function(d, bool){
        var type = (d[1][0] == 'c') ? 'circle' : 'polygon';
        var event = geomcache[type][parseInt(d[1].substring(1))];
        event.checked = bool;
        event.o.show = bool;
    };
    public.setHeights = function(d, val){
        var type = (d[1][0] == 'c') ? 'circle' : 'polygon';
        var event = geomcache[type][parseInt(d[1].substring(1))];
        event.heights = val;
        d[3] = val;
        var tbl = $('#drawoverview'+addendum).DataTable();
        tbl.row($('.highlightedrow')).data(d).draw();
    };

    public.highlightBounds = function(d){
        public.unhighlightBounds();
        var type = (d[1][0] == 'c') ? 'circle' : 'polygon';
        var event = geomcache[type][parseInt(d[1].substring(1))];
        event.o.setStrokeStyle(Cesium.Color.fromCssColorString('white'), 4);
    };

    public.unhighlightBounds = function(){
        for (var k1 in geomcache){
            for (var k2 in geomcache[k1]){
                geomcache[k1][k2].o.setStrokeStyle(Cesium.Color.fromCssColorString('red'), 0);
            }
        }
    };

    public.hideAll = function(){
        for (var k in geomcache) {
            for (var k2 in geomcache[k]) {
                geomcache[k][k2].o.show = false;
            }
        }
    }

    public.showAllChecked = function(){
        for (var k in geomcache) {
            for (var k2 in geomcache[k]) {
                if (geomcache[k][k2].checked) geomcache[k][k2].o.show = true;
            }
        }
    };

    public.remove = function(d){
        var type = (d[1][0] == 'c') ? 'circle' : 'polygon';
        var event = geomcache[type][parseInt(d[1].substring(1))];
        console.log(widget.entities);
        widget.entities.remove(event.o);
    }

    public.getVisibles = function(){
        var res = [];
        for (var k in geomcache) {
            for (var k2 in geomcache[k]) {
                var that = geomcache[k][k2];
                if (that.checked){
                    if (that.type == 'c'){
                        var tmp = {id:that.id, type:'c'};
                        var cartesian = new Cesium.Cartesian3(that.center.x, that.center.y, that.center.z);
                        var carto = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
                        tmp.longitude = Cesium.Math.toDegrees(carto.longitude);
                        tmp.latitude = Cesium.Math.toDegrees(carto.latitude);
                        tmp.radius = that.radius;
                        tmp.alts = that.heights.split("-");
                        res.push(tmp);
                    } else if (that.type == 'p'){
                        var tmp = {id:that.id, type:'p', positions: []};
                        that.positions.forEach(function(pos){
                            var cartesian = new Cesium.Cartesian3(pos.x, pos.y, pos.z);
                            var carto = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
                            tmp.positions.push({longitude: Cesium.Math.toDegrees(carto.longitude), latitude:Cesium.Math.toDegrees(carto.latitude)});
                        });
                        tmp.alts = that.heights.split("-");
                        res.push(tmp);
                    }
                };
            }
        }

        return res;
        };




    constructor();
    return public;
};
