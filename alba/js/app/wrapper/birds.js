var Birds = function(container, widget, addendum){
    var public = this;
    var promise_lookup = [];
    var filter_lookup = [];
    var entityID = [];
    var originalID = ["4264-84830852","4266-84831108","1103-1103","4262-84830876","4267-84830990","4265-8483009431","4261-2228","2131-2131","1163-1163","3275-30662","2368-2368","3655-27659","3272-3272","3606-30668","2382-2382","1094-1094","4269-4831216","4268-8582220031","4270-84831217","4271-84831889","4272-84831758","4263-1135473","unbanded-151","unbanded-153","unbanded-154","unbanded-156","unbanded-159","unbanded-160"];
    var visbirds = [];

    function _constructor(){
        for (var i = 0; i < 28; i++) {
            var d = new Cesium.KmlDataSource();
            promise_lookup.push(d.load('d/albatross/' + (i+1) + '/line.kml'));
            filter_lookup.push({id: i, weather:true, spatial:true }); //bird i shown because of weather and spatial filter
            visbirds.push(i);
        }
        public.styleAll();
        $(container).data('public', public);
    }

    public.styleAll = function(){
        promise_lookup.forEach(function(p,i){public.styleSingle(i)});
    };

    public.styleSingle= function(i) {
        var p = promise_lookup[i];
        var lineColor = Cesium.Color.fromCssColorString($('#colorselection').val());

            p.then(function(ds) {
                if (!widget.dataSources.contains(ds)) widget.dataSources.add(ds);
                 ds.entities.values.forEach(function(e){
                     if (Cesium.defined(e.polyline)) {
                         e.polyline.material = lineColor.withAlpha($('#transselection').val()/100);
                         e.polyline.width = $('#widthselection').val();

                         entityID[i] = e.id;
                         e.name = 'Albatross '+ i.toString();

                     }
                 });
            });
    };

    public.getIdByEntityId = function(eID){
        for (var id = 0;id < entityID.length; id++)
            if (eID == entityID[id]) return id;
    };


    public.requestAreaFilter = function(visiblegeoms){
        $.post('/r/filter/spatial', {visibles:visiblegeoms},
            function(d){
                if (d.data.length > 0){
                    public.updateAreaFilter(d.data[0].includedbirds);
                    visbirds = [];
                    for (var i= 0; i<28; i++){
                        var a = $('#areaFilterState'+addendum).prop('checked') ? filter_lookup[i].spatial : true;
                        var b = $('#weatherFilterState'+addendum).prop('checked') ? filter_lookup[i].weather : true;
                        if (a && b) visbirds.push(i);
                    }
                    $('#areachart').data('public').update(visbirds);
                }
            });
    };

    public.requestWeatherFilter = function(conditions){
        $.post('/r/filter/weather', {conditions:conditions},
            function(d){
                if (d.data.length > 0){
                    public.updateWeatherFilter(d.data[0].includedbirds);
                     visbirds = [];
                    for (var i= 0; i<28; i++){
                        var a = $('#areaFilterState'+addendum).prop('checked') ? filter_lookup[i].spatial : true;
                        var b = $('#weatherFilterState'+addendum).prop('checked') ? filter_lookup[i].weather : true;
                        if (a && b) visbirds.push(i);
                    }
                    $('#areachart').data('public').update(visbirds);
                }
            });
    };
	
	public.requestBothFilter = function(conditions, geoms){
		console.log("conditions", conditions); 
		console.log("geoms", geoms); 
		/*
		 $.post('/r/filter/both', {conditions:conditions, geoms:geom},
			function(d){
				console.log(d); 
			}); */
	}

    public.updateAreaFilter = function(includedbirds){
        if (!includedbirds) includedbirds = [];
        filter_lookup.forEach(function(f){
            f.spatial = (includedbirds.indexOf(f.id) > -1);
        });
        public.finalizeFilterUpdate();
    };

    public.updateWeatherFilter = function(includedbirds){
        if (!includedbirds) includedbirds = [];
        filter_lookup.forEach(function(f){
            f.weather = (includedbirds.indexOf(f.id) > -1);
        });
        public.finalizeFilterUpdate();
    };

    public.finalizeFilterUpdate = function() {
        promise_lookup.forEach(function (p,i) {
            p.then(function (ds) {
                ds.entities.values.forEach(function (e) {
                    if (Cesium.defined(e.polyline)) {
                        var a = $('#areaFilterState'+addendum).prop('checked') ? filter_lookup[i].spatial : true;
                        var b = $('#weatherFilterState'+addendum).prop('checked') ? filter_lookup[i].weather : true;
                        e.polyline.show =  a && b  ;
                    }
                });
            });
        });
    };

    public.getVisibleBirds = function(){
        visbirds = [];
        for (var i= 0; i<28; i++){
            var a = $('#areaFilterState'+addendum).prop('checked') ? filter_lookup[i].spatial : true;
            var b = $('#weatherFilterState'+addendum).prop('checked') ? filter_lookup[i].weather : true;
            if (a && b) visbirds.push(i);
        }
        return visbirds;
    };

    public.getOriginalID = function(birdID){
        return originalID[birdID];
    };



    _constructor();
    return public;
};
